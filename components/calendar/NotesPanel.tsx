"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { DateRange, NoteEntry } from "@/components/calendar/types";

type NotesPanelProps = {
  range: DateRange;
  selectedRangeNotes: NoteEntry[];
  onAddNote: (value: string) => boolean;
  onDeleteNote: (id: string) => void;
  embedded?: boolean;
};

function formatRangeLabel(range: DateRange): string {
  if (!range.start || !range.end) {
    return "Choose a date range";
  }

  const start = range.start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const end = range.end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return `${start} - ${end}`;
}

export function NotesPanel({
  range,
  selectedRangeNotes,
  onAddNote,
  onDeleteNote,
  embedded = false,
}: NotesPanelProps) {
  const [draft, setDraft] = useState("");

  const disabled = !range.start || !range.end;
  const helperText = useMemo(() => formatRangeLabel(range), [range]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const added = onAddNote(draft);
    if (added) {
      setDraft("");
    }
  };

  return (
    <aside
      className={
        embedded
          ? "flex h-full flex-col border-r border-slate-200 bg-transparent pr-3"
          : "order-2 flex h-full flex-col rounded-[1.6rem] border border-slate-200 bg-[#fffefb] p-4 shadow-[0_18px_44px_rgba(15,23,42,0.15)] sm:p-5 lg:order-none"
      }
    >
      <h3 className="text-lg font-semibold uppercase tracking-[0.14em] text-slate-700">Notes</h3>
      <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">{helperText}</p>

      <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Write a note for this selected range..."
          className="min-h-28 w-full border border-slate-200 bg-[linear-gradient(to_bottom,transparent_31px,#e2e8f0_31px,#e2e8f0_32px)] bg-[length:100%_32px] px-3 py-2 text-sm leading-8 text-slate-800 outline-none transition focus:border-slate-400"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || !draft.trim()}
          className="w-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            backgroundColor: "var(--accent)",
            color: "var(--text-on-accent)",
          }}
        >
          Add note
        </button>
      </form>

      <div className="mt-4 max-h-52 space-y-3 overflow-auto pr-1 sm:max-h-64">
        {selectedRangeNotes.length === 0 && (
          <p className="border border-dashed border-slate-300 p-3 text-sm text-slate-500">
            No notes for this range yet.
          </p>
        )}

        {selectedRangeNotes.map((note) => (
          <motion.article
            key={note.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="border border-slate-200 bg-white p-3"
          >
            <p className="text-sm text-slate-700">{note.text}</p>
            <div className="mt-2 flex items-center justify-between">
              <time className="text-xs text-slate-500">
                {new Date(note.createdAtISO).toLocaleString()}
              </time>
              <button
                type="button"
                onClick={() => onDeleteNote(note.id)}
                className="text-xs font-medium text-slate-600 underline-offset-2 hover:underline"
              >
                Remove
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </aside>
  );
}
