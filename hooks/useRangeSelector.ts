"use client";

import { useMemo, useState } from "react";
import type { DateRange } from "@/components/calendar/types";
import { isBeforeDay, isSameDay, startOfDay } from "@/lib/date";

export function useRangeSelector() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });

  const orderedRange = useMemo(() => {
    if (!range.start || !range.end) {
      return range;
    }

    return isBeforeDay(range.end, range.start)
      ? { start: range.end, end: range.start }
      : range;
  }, [range]);

  const selectDay = (day: Date) => {
    const picked = startOfDay(day);

    if (!range.start && !range.end) {
      setRange({ start: picked, end: null });
      return;
    }

    if (range.start && !range.end) {
      if (isSameDay(range.start, picked)) {
        setRange({ start: null, end: null });
        return;
      }

      if (isBeforeDay(picked, range.start)) {
        setRange({ start: picked, end: range.start });
        return;
      }

      setRange({ start: range.start, end: picked });
      return;
    }

    if (range.start && range.end) {
      if (isSameDay(range.start, picked) || isSameDay(range.end, picked)) {
        setRange({ start: null, end: null });
        return;
      }

      setRange({ start: picked, end: null });
    }
  };

  const resetRange = () => setRange({ start: null, end: null });

  return {
    range: orderedRange,
    selectDay,
    resetRange,
    setRange,
  };
}
