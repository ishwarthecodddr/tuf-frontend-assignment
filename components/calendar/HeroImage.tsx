"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type HeroImageProps = {
  imageSrc: string;
  onImageLoad: (img: HTMLImageElement) => void;
  onImageChange: (url: string) => void;
  monthName: string;
  year: string;
};

const PRESET_IMAGES = ["/heroes/sunrise.svg", "/heroes/lake.svg", "/heroes/forest.svg"];

export function HeroImage({
  imageSrc,
  onImageLoad,
  onImageChange,
  monthName,
  year,
}: HeroImageProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <section className="overflow-hidden border border-b-0 border-slate-200/90 bg-white">
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-slate-100 rounded-sm">
        <Image
          src={imageSrc}
          alt="Calendar hero"
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover transition duration-500 hover:scale-105"
          unoptimized
          crossOrigin="anonymous"
          onLoad={(event) => onImageLoad(event.currentTarget)}
        />

        <div className="absolute bottom-0 w-full">
          <div className="h-[110px] bg-white [clip-path:polygon(0_45%,100%_25%,100%_100%,0_100%)]" />
          <div
            className="absolute bottom-0 h-[110px] w-full"
            style={{
              background: "var(--accent)",
              clipPath: "polygon(0 65%, 100% 35%, 100% 100%, 0 100%)",
            }}
          />
        </div>

        <div className="absolute bottom-6 right-5 text-right">
          <p className="text-xs tracking-[0.2em]" style={{ color: "var(--text-on-accent)" }}>
            {year}
          </p>
          <p
            className="text-xl font-bold uppercase tracking-[0.2em]"
            style={{ color: "var(--text-on-accent)" }}
          >
            {monthName}
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="mt-0 flex min-h-10 flex-wrap items-center gap-1.5 border-t border-slate-200 px-2 py-1.5 sm:px-3"
      >
        {PRESET_IMAGES.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onImageChange(preset)}
            className="h-7 whitespace-nowrap border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-slate-700 transition hover:border-slate-300"
          >
            {preset.split("/").pop()?.replace(".svg", "")}
          </button>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="h-7 whitespace-nowrap px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] transition"
          style={{
            backgroundColor: "var(--accent)",
            color: "var(--text-on-accent)",
          }}
        >
          Upload image
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) {
              return;
            }
            const url = URL.createObjectURL(file);
            onImageChange(url);
          }}
        />
      </motion.div>
    </section>
  );
}
