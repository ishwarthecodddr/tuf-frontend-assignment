"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getColor } from "colorthief";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { HeroImage } from "@/components/calendar/HeroImage";
import { useRangeNotes } from "@/hooks/useRangeNotes";
import { useRangeSelector } from "@/hooks/useRangeSelector";
import { buildPalette } from "@/lib/color";
import { getMonthMeta } from "@/lib/date";

const DEFAULT_HERO = "/heroes/sunrise.svg";

export function CalendarWall() {
  const [monthDate, setMonthDate] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [monthDirection, setMonthDirection] = useState<1 | -1>(1);
  const [heroImage, setHeroImage] = useState(DEFAULT_HERO);
  const lastBlobUrlRef = useRef<string | null>(null);
  const [accentRgb, setAccentRgb] = useState<[number, number, number]>([33, 132, 220]);
  const { range, selectDay } = useRangeSelector();
  const { addNote, removeNote, selectedRangeNotes, hasNoteOnDate } = useRangeNotes(range);

  const palette = useMemo(() => buildPalette(accentRgb), [accentRgb]);
  const { monthLabel } = getMonthMeta(monthDate);
  const [monthName, year] = monthLabel.split(" ");

  const extractColor = async (imageEl: HTMLImageElement) => {
    try {
      const picked = (await getColor(imageEl)) as unknown;
      if (!Array.isArray(picked) || picked.length < 3) {
        setAccentRgb([33, 132, 220]);
        return;
      }

      const [r, g, b] = picked as [number, number, number];
      setAccentRgb([r, g, b]);
    } catch {
      setAccentRgb([33, 132, 220]);
    }
  };

  useEffect(() => {
    return () => {
      if (lastBlobUrlRef.current) {
        URL.revokeObjectURL(lastBlobUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const [r, g, b] = accentRgb;
    const body = document.body;
    const dynamicBackground = [
      `radial-gradient(circle at 15% 18%, rgb(${r} ${g} ${b} / 0.35) 0%, transparent 36%)`,
      `radial-gradient(circle at 86% 12%, rgb(${r} ${g} ${b} / 0.22) 0%, transparent 34%)`,
      `linear-gradient(160deg, rgb(${r} ${g} ${b} / 0.22) 0%, #f4f1ea 44%, #e8edf5 100%)`,
    ].join(",");

    body.style.transition = "background 300ms ease";
    body.style.background = dynamicBackground;
  }, [accentRgb]);

  const handleImageChange = (url: string) => {
    if (lastBlobUrlRef.current) {
      URL.revokeObjectURL(lastBlobUrlRef.current);
      lastBlobUrlRef.current = null;
    }

    if (url.startsWith("blob:")) {
      lastBlobUrlRef.current = url;
    }

    setHeroImage(url);
  };

  const handlePrevMonth = () => {
    setMonthDirection(-1);
    setMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setMonthDirection(1);
    setMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div
      className="mx-auto w-full max-w-[760px] px-4 py-4 sm:py-8"
      style={
        {
          "--accent": palette.accent,
          "--accent-soft": palette.accentSoft,
          "--text-on-accent": palette.textOnAccent,
        } as CSSProperties
      }
    >
      <div className="grid items-start">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-[390px] bg-transparent px-3 pb-3 pt-8 shadow-[0_25px_45px_rgba(0,0,0,0.22)] ring-1 ring-black/10 sm:max-w-[430px] sm:p x-4 sm:pb-4"
        >
          <div className="absolute left-1/2 top-1 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-slate-500 bg-white" />
          <div className="mb-2 flex justify-center gap-1.5">
            {Array.from({ length: 24 }).map((_, index) => (
              <span
                key={`ring-${index}`}
                className="h-2.5 w-1.5 rounded-full border border-slate-500/80 bg-linear-to-b from-slate-100 to-slate-300"
                aria-hidden
              />
            ))}
          </div>

          <div className="perspective:[1400px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={monthDate.toISOString()}
                initial={{
                  opacity: 0,
                  rotateX: monthDirection > 0 ? -70 : 70,
                  y: monthDirection > 0 ? -16 : 16,
                }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                exit={{
                  opacity: 0,
                  rotateX: monthDirection > 0 ? 70 : -70,
                  y: monthDirection > 0 ? 16 : -16,
                }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                style={{ transformOrigin: "top center" }}
              >
                <HeroImage
                  imageSrc={heroImage}
                  onImageLoad={extractColor}
                  onImageChange={handleImageChange}
                  monthName={monthName ?? "Month"}
                  year={year ?? String(monthDate.getFullYear())}
                />
                <CalendarGrid
                  monthDate={monthDate}
                  range={range}
                  onSelectDay={selectDay}
                  onPrevMonth={handlePrevMonth}
                  onNextMonth={handleNextMonth}
                  hasNoteOnDate={hasNoteOnDate}
                  selectedRangeNotes={selectedRangeNotes}
                  onAddNote={addNote}
                  onDeleteNote={removeNote}
                  textOnAccent={palette.textOnAccent}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
