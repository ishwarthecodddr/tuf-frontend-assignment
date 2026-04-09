"use client";

import { motion } from "framer-motion";
import { isSameDay } from "@/lib/date";

type DayCellProps = {
  date: Date;
  isToday: boolean;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  isInRange: boolean;
  hasNote: boolean;
  onSelect: (date: Date) => void;
  textOnAccent: string;
};

export function DayCell({
  date,
  isToday,
  rangeStart,
  rangeEnd,
  isInRange,
  hasNote,
  onSelect,
  textOnAccent,
}: DayCellProps) {
  const isStart = rangeStart ? isSameDay(date, rangeStart) : false;
  const isEnd = rangeEnd ? isSameDay(date, rangeEnd) : false;
  const isEdge = isStart || isEnd;

  return (
    <motion.button
      type="button"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(date)}
      className="relative h-10 cursor-pointer border border-slate-200 bg-white px-1.5 py-1 text-left text-xs text-slate-700 transition-colors duration-300 hover:border-slate-300 sm:h-11 sm:text-sm"
      style={{
        backgroundColor: isEdge
          ? "var(--accent)"
          : isInRange
            ? "var(--accent-soft)"
            : "white",
        color: isEdge ? textOnAccent : "#334155",
        borderColor: isEdge || isInRange ? "var(--accent)" : undefined,
        boxShadow: isEdge ? "inset 0 0 0 1px rgba(0,0,0,0.05)" : undefined,
      }}
      aria-label={`Select ${date.toDateString()}`}
    >
      <span className="font-medium">{date.getDate()}</span>
      {isToday && (
        <span className="absolute right-1.5 top-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
      )}
      {hasNote && (
        <span
          className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: isEdge ? textOnAccent : "var(--accent)" }}
          aria-hidden
        />
      )}
    </motion.button>
  );
}
