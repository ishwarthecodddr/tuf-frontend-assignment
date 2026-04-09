import type { ThemePalette } from "@/components/calendar/types";

export function parseRgb(value: string): [number, number, number] {
  const matches = value.match(/\d+/g);
  if (!matches || matches.length < 3) {
    return [39, 98, 255];
  }

  return [
    Number.parseInt(matches[0], 10),
    Number.parseInt(matches[1], 10),
    Number.parseInt(matches[2], 10),
  ];
}

function getRelativeLuminance(r: number, g: number, b: number): number {
  const channels = [r, g, b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function readableTextOn(rgb: [number, number, number]): string {
  const lum = getRelativeLuminance(rgb[0], rgb[1], rgb[2]);
  return lum > 0.5 ? "#0f172a" : "#f8fafc";
}

export function buildPalette(rgb: [number, number, number]): ThemePalette {
  const [r, g, b] = rgb;
  const accent = `rgb(${r} ${g} ${b})`;
  const accentSoft = `rgb(${r} ${g} ${b} / 0.2)`;
  const textOnAccent = readableTextOn(rgb);

  return { accent, accentSoft, textOnAccent };
}
