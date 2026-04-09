"use client";

import { motion } from "framer-motion";
import { DayCell } from "@/components/calendar/DayCell";
import { NotesPanel } from "@/components/calendar/NotesPanel";
import type { DateRange } from "@/components/calendar/types";
import { clampToRange, getMonthMeta, isSameDay, startOfDay } from "@/lib/date";

type CalendarGridProps = {
  monthDate: Date;
  range: DateRange;
  onSelectDay: (day: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  hasNoteOnDate: (date: Date) => boolean;
  selectedRangeNotes: import("@/components/calendar/types").NoteEntry[];
  onAddNote: (value: string) => boolean;
  onDeleteNote: (id: string) => void;
  textOnAccent: string;
};

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarGrid({
  monthDate,
  range,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
  hasNoteOnDate,
  selectedRangeNotes,
  onAddNote,
  onDeleteNote,
  textOnAccent,
}: CalendarGridProps) {
  const { monthLabel, monthStart, daysInMonth, firstWeekdayIndex } =
    getMonthMeta(monthDate);
  const today = startOfDay(new Date());

  return (
    <section className="mt-0 border border-t-0 border-slate-200 bg-white p-2.5 sm:p-3">
      <div className="mb-2 flex items-center justify-between border-b border-slate-200 pb-1.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevMonth}
            className="border border-slate-300 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-700 transition hover:bg-slate-50"
            aria-label="Go to previous month"
          >
            Prev
          </button>
          <h2 className="text-base font-semibold uppercase tracking-[0.16em] text-slate-700 sm:text-lg">
            {monthLabel}
          </h2>
          <button
            type="button"
            onClick={onNextMonth}
            className="border border-slate-300 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-700 transition hover:bg-slate-50"
            aria-label="Go to next month"
          >
            Next
          </button>
        </div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">tap any date</p>
      </div>

      <div className="grid gap-0 lg:grid-cols-[0.72fr_1.28fr]">
        <NotesPanel
          range={range}
          selectedRangeNotes={selectedRangeNotes}
          onAddNote={onAddNote}
          onDeleteNote={onDeleteNote}
          embedded
        />

        <div>
          <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500 sm:gap-1.5 sm:text-xs">
            {WEEK_DAYS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <motion.div
            layout
            className="grid grid-cols-7 gap-1 sm:gap-1.5"
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {Array.from({ length: firstWeekdayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-10 sm:h-11" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const date = new Date(
                monthStart.getFullYear(),
                monthStart.getMonth(),
                idx + 1,
              );
              const inRange =
                range.start && range.end
                  ? clampToRange(date, range.start, range.end)
                  : false;

              return (
                <DayCell
                  key={date.toISOString()}
                  date={date}
                  isToday={isSameDay(today, date)}
                  rangeStart={range.start}
                  rangeEnd={range.end}
                  isInRange={inRange}
                  hasNote={hasNoteOnDate(date)}
                  onSelect={onSelectDay}
                  textOnAccent={textOnAccent}
                />
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
