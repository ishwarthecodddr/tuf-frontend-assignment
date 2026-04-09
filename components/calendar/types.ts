export type DateRange = {
  start: Date | null;
  end: Date | null;
};

export type NoteEntry = {
  id: string;
  startISO: string;
  endISO: string;
  text: string;
  createdAtISO: string;
};

export type ThemePalette = {
  accent: string;
  accentSoft: string;
  textOnAccent: string;
};
