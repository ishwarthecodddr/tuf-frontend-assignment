"use client";

import { useEffect, useMemo, useState } from "react";
import type { DateRange, NoteEntry } from "@/components/calendar/types";
import { clampToRange, parseISODate } from "@/lib/date";

const STORAGE_KEY = "calendar-range-notes-v1";

export function useRangeNotes(range: DateRange) {
  const [notes, setNotes] = useState<NoteEntry[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return [];
    }

    try {
      return JSON.parse(saved) as NoteEntry[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = (text: string) => {
    if (!range.start || !range.end || !text.trim()) {
      return false;
    }

    const newEntry: NoteEntry = {
      id: crypto.randomUUID(),
      startISO: range.start.toISOString(),
      endISO: range.end.toISOString(),
      text: text.trim(),
      createdAtISO: new Date().toISOString(),
    };

    setNotes((prev) => [newEntry, ...prev]);
    return true;
  };

  const removeNote = (id: string) => {
    setNotes((prev) => prev.filter((entry) => entry.id !== id));
  };

  const selectedRangeNotes = useMemo(() => {
    if (!range.start || !range.end) {
      return [];
    }

    return notes.filter((entry) => {
      const entryStart = parseISODate(entry.startISO);
      const entryEnd = parseISODate(entry.endISO);

      return (
        range.start!.getTime() === entryStart.getTime() &&
        range.end!.getTime() === entryEnd.getTime()
      );
    });
  }, [notes, range.end, range.start]);

  const hasNoteOnDate = (date: Date): boolean => {
    return notes.some((entry) => {
      const start = parseISODate(entry.startISO);
      const end = parseISODate(entry.endISO);
      return clampToRange(date, start, end);
    });
  };

  return {
    notes,
    addNote,
    removeNote,
    selectedRangeNotes,
    hasNoteOnDate,
  };
}
