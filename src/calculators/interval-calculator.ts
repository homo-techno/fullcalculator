import type { CalculatorDefinition } from "./types";

const NOTES = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];

const INTERVAL_MAP: { semitones: number; name: string; shortName: string }[] = [
  { semitones: 0, name: "Perfect Unison", shortName: "P1" },
  { semitones: 1, name: "Minor 2nd", shortName: "m2" },
  { semitones: 2, name: "Major 2nd", shortName: "M2" },
  { semitones: 3, name: "Minor 3rd", shortName: "m3" },
  { semitones: 4, name: "Major 3rd", shortName: "M3" },
  { semitones: 5, name: "Perfect 4th", shortName: "P4" },
  { semitones: 6, name: "Tritone (Augmented 4th / Diminished 5th)", shortName: "TT" },
  { semitones: 7, name: "Perfect 5th", shortName: "P5" },
  { semitones: 8, name: "Minor 6th", shortName: "m6" },
  { semitones: 9, name: "Major 6th", shortName: "M6" },
  { semitones: 10, name: "Minor 7th", shortName: "m7" },
  { semitones: 11, name: "Major 7th", shortName: "M7" },
  { semitones: 12, name: "Perfect Octave", shortName: "P8" },
];

const FREQUENCY_RATIO: Record<number, string> = {
  0: "1:1",
  1: "16:15",
  2: "9:8",
  3: "6:5",
  4: "5:4",
  5: "4:3",
  6: "45:32",
  7: "3:2",
  8: "8:5",
  9: "5:3",
  10: "9:5",
  11: "15:8",
  12: "2:1",
};

export const intervalCalculator: CalculatorDefinition = {
  slug: "interval-calculator",
  title: "Musical Interval Calculator",
  description:
    "Free musical interval calculator. Find the interval between any two notes, including semitones, interval name, and frequency ratio.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "interval calculator",
    "musical interval",
    "semitone calculator",
    "note interval",
    "music theory",
    "interval finder",
  ],
  variants: [
    {
      id: "between-notes",
      name: "Interval Between Two Notes",
      description: "Find the interval between two notes",
      fields: [
        {
          name: "noteFrom",
          label: "From Note",
          type: "select",
          options: NOTES.map((n) => ({ label: n, value: n })),
          defaultValue: "C",
        },
        {
          name: "noteTo",
          label: "To Note",
          type: "select",
          options: NOTES.map((n) => ({ label: n, value: n })),
          defaultValue: "G",
        },
      ],
      calculate: (inputs) => {
        const from = inputs.noteFrom as string;
        const to = inputs.noteTo as string;
        const fromIdx = NOTES.indexOf(from);
        const toIdx = NOTES.indexOf(to);
        if (fromIdx === -1 || toIdx === -1) return null;

        const ascending = ((toIdx - fromIdx) % 12 + 12) % 12;
        const descending = ascending === 0 ? 0 : 12 - ascending;

        const ascInterval = INTERVAL_MAP.find((i) => i.semitones === ascending);
        const descInterval = INTERVAL_MAP.find((i) => i.semitones === descending);
        const inversion = INTERVAL_MAP.find((i) => i.semitones === (12 - ascending) % 12);

        const consonance =
          [0, 3, 4, 5, 7, 8, 9, 12].includes(ascending) ? "Consonant" : "Dissonant";

        return {
          primary: {
            label: "Ascending Interval",
            value: ascInterval ? `${ascInterval.name} (${ascInterval.shortName})` : `${ascending} semitones`,
          },
          details: [
            { label: "Semitones (ascending)", value: `${ascending}` },
            { label: "Semitones (descending)", value: `${descending}` },
            {
              label: "Descending Interval",
              value: descInterval ? `${descInterval.name} (${descInterval.shortName})` : `${descending} semitones`,
            },
            {
              label: "Inversion",
              value: inversion ? `${inversion.name} (${inversion.shortName})` : "N/A",
            },
            {
              label: "Frequency Ratio (just intonation)",
              value: FREQUENCY_RATIO[ascending] || "N/A",
            },
            { label: "Quality", value: consonance },
          ],
        };
      },
    },
    {
      id: "from-semitones",
      name: "Interval from Semitones",
      description: "Look up an interval name from a number of semitones",
      fields: [
        {
          name: "semitones",
          label: "Number of Semitones",
          type: "number",
          placeholder: "e.g. 7",
          min: 0,
          max: 24,
        },
      ],
      calculate: (inputs) => {
        const semi = inputs.semitones as number;
        if (semi === undefined || semi === null || semi < 0) return null;

        const withinOctave = semi % 12;
        const octaves = Math.floor(semi / 12);
        const interval = INTERVAL_MAP.find((i) => i.semitones === withinOctave);
        const invSemi = (12 - withinOctave) % 12;
        const inversion = INTERVAL_MAP.find((i) => i.semitones === invSemi);

        const nameStr = interval
          ? octaves > 0
            ? `${interval.name} + ${octaves} octave(s)`
            : interval.name
          : `${semi} semitones`;

        return {
          primary: { label: "Interval", value: nameStr },
          details: [
            { label: "Semitones", value: `${semi}` },
            { label: "Within Octave", value: `${withinOctave} semitones` },
            { label: "Octaves", value: `${octaves}` },
            {
              label: "Inversion",
              value: inversion ? `${inversion.name} (${invSemi} semitones)` : "N/A",
            },
            {
              label: "Frequency Ratio",
              value: FREQUENCY_RATIO[withinOctave] || "N/A",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["chord-calculator", "key-transpose-calculator", "frequency-to-note-calculator"],
  faq: [
    {
      question: "What is a musical interval?",
      answer:
        "A musical interval is the distance in pitch between two notes, measured in semitones (half steps). Intervals have specific names like Perfect 5th (7 semitones), Major 3rd (4 semitones), etc.",
    },
    {
      question: "What is an interval inversion?",
      answer:
        "Inverting an interval means flipping which note is on top. The inversion of a Major 3rd (4 semitones) is a Minor 6th (8 semitones). Inversions always add up to 12 semitones (one octave).",
    },
    {
      question: "What is consonance vs dissonance?",
      answer:
        "Consonant intervals sound stable and pleasant together (unison, 3rds, 5ths, 6ths, octaves). Dissonant intervals create tension (2nds, 7ths, tritone). Both are essential in music for creating interest and resolution.",
    },
  ],
  formula:
    "Ascending Semitones = (Note2 - Note1 + 12) mod 12 | Descending = 12 - Ascending | Inversion = 12 - Interval",
};
