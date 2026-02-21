import type { CalculatorDefinition } from "./types";

const NOTES = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];

const CHORD_FORMULAS: Record<string, { intervals: number[]; label: string }> = {
  major: { intervals: [0, 4, 7], label: "Major" },
  minor: { intervals: [0, 3, 7], label: "Minor" },
  dim: { intervals: [0, 3, 6], label: "Diminished" },
  aug: { intervals: [0, 4, 8], label: "Augmented" },
  maj7: { intervals: [0, 4, 7, 11], label: "Major 7th" },
  min7: { intervals: [0, 3, 7, 10], label: "Minor 7th" },
  dom7: { intervals: [0, 4, 7, 10], label: "Dominant 7th" },
  dim7: { intervals: [0, 3, 6, 9], label: "Diminished 7th" },
  halfdim7: { intervals: [0, 3, 6, 10], label: "Half-Diminished 7th" },
  sus2: { intervals: [0, 2, 7], label: "Suspended 2nd" },
  sus4: { intervals: [0, 5, 7], label: "Suspended 4th" },
  add9: { intervals: [0, 4, 7, 14], label: "Add 9" },
  min9: { intervals: [0, 3, 7, 10, 14], label: "Minor 9th" },
  maj9: { intervals: [0, 4, 7, 11, 14], label: "Major 9th" },
  dom9: { intervals: [0, 4, 7, 10, 14], label: "Dominant 9th" },
  power: { intervals: [0, 7], label: "Power Chord (5th)" },
  "6": { intervals: [0, 4, 7, 9], label: "Major 6th" },
  min6: { intervals: [0, 3, 7, 9], label: "Minor 6th" },
};

const INTERVAL_NAMES: Record<number, string> = {
  0: "Root (1)",
  1: "Minor 2nd (b2)",
  2: "Major 2nd (2)",
  3: "Minor 3rd (b3)",
  4: "Major 3rd (3)",
  5: "Perfect 4th (4)",
  6: "Tritone (b5)",
  7: "Perfect 5th (5)",
  8: "Augmented 5th (#5)",
  9: "Major 6th (6)",
  10: "Minor 7th (b7)",
  11: "Major 7th (7)",
  12: "Octave (8)",
  14: "Major 9th (9)",
};

export const chordCalculator: CalculatorDefinition = {
  slug: "chord-calculator",
  title: "Chord Calculator",
  description:
    "Free chord calculator. Find the notes in any chord. Supports major, minor, 7th, diminished, augmented, suspended, and extended chords.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "chord calculator",
    "chord finder",
    "chord notes",
    "music chord",
    "piano chord",
    "guitar chord",
    "chord formula",
  ],
  variants: [
    {
      id: "build-chord",
      name: "Build a Chord",
      description: "Select a root note and chord type to see all the notes",
      fields: [
        {
          name: "root",
          label: "Root Note",
          type: "select",
          options: NOTES.map((n) => ({ label: n, value: n })),
          defaultValue: "C",
        },
        {
          name: "chordType",
          label: "Chord Type",
          type: "select",
          options: Object.entries(CHORD_FORMULAS).map(([key, val]) => ({
            label: val.label,
            value: key,
          })),
          defaultValue: "major",
        },
      ],
      calculate: (inputs) => {
        const root = inputs.root as string;
        const chordType = inputs.chordType as string;
        const formula = CHORD_FORMULAS[chordType];
        if (!formula) return null;

        const rootIndex = NOTES.indexOf(root);
        if (rootIndex === -1) return null;

        const chordNotes = formula.intervals.map((i) => NOTES[(rootIndex + i) % 12]);
        const intervalLabels = formula.intervals.map(
          (i) => INTERVAL_NAMES[i] || `Interval ${i}`
        );

        const chordName = `${root} ${formula.label}`;

        const details: { label: string; value: string }[] = [
          { label: "Chord Name", value: chordName },
          { label: "Notes", value: chordNotes.join(" - ") },
          { label: "Formula (semitones)", value: formula.intervals.join(" - ") },
        ];

        chordNotes.forEach((note, idx) => {
          details.push({ label: intervalLabels[idx], value: note });
        });

        return {
          primary: { label: chordName, value: chordNotes.join(" - ") },
          details,
        };
      },
    },
    {
      id: "diatonic-chords",
      name: "Diatonic Chords in Key",
      description: "Show all chords that naturally occur in a major or minor key",
      fields: [
        {
          name: "keyRoot",
          label: "Key Root",
          type: "select",
          options: NOTES.map((n) => ({ label: n, value: n })),
          defaultValue: "C",
        },
        {
          name: "keyQuality",
          label: "Key Quality",
          type: "select",
          options: [
            { label: "Major", value: "major" },
            { label: "Natural Minor", value: "minor" },
          ],
          defaultValue: "major",
        },
      ],
      calculate: (inputs) => {
        const keyRoot = inputs.keyRoot as string;
        const keyQuality = inputs.keyQuality as string;
        const rootIndex = NOTES.indexOf(keyRoot);
        if (rootIndex === -1) return null;

        const majorIntervals = [0, 2, 4, 5, 7, 9, 11];
        const minorIntervals = [0, 2, 3, 5, 7, 8, 10];
        const intervals = keyQuality === "minor" ? minorIntervals : majorIntervals;

        const majorQualities = ["Major", "Minor", "Minor", "Major", "Major", "Minor", "Diminished"];
        const minorQualities = ["Minor", "Diminished", "Major", "Minor", "Minor", "Major", "Major"];
        const qualities = keyQuality === "minor" ? minorQualities : majorQualities;

        const romanMajor = ["I", "ii", "iii", "IV", "V", "vi", "vii\u00B0"];
        const romanMinor = ["i", "ii\u00B0", "III", "iv", "v", "VI", "VII"];
        const numerals = keyQuality === "minor" ? romanMinor : romanMajor;

        const scaleNotes = intervals.map((i) => NOTES[(rootIndex + i) % 12]);
        const details: { label: string; value: string }[] = [
          { label: "Scale", value: scaleNotes.join(" - ") },
        ];

        scaleNotes.forEach((note, idx) => {
          details.push({
            label: `${numerals[idx]}`,
            value: `${note} ${qualities[idx]}`,
          });
        });

        return {
          primary: { label: `Chords in ${keyRoot} ${keyQuality}`, value: scaleNotes.join(" - ") },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["key-transpose-calculator", "interval-calculator", "song-key-calculator"],
  faq: [
    {
      question: "How are chords built?",
      answer:
        "Chords are built by stacking intervals (distances in semitones) above a root note. A major chord uses the formula Root + Major 3rd (4 semitones) + Perfect 5th (7 semitones). A minor chord uses Root + Minor 3rd (3) + Perfect 5th (7).",
    },
    {
      question: "What are diatonic chords?",
      answer:
        "Diatonic chords are the chords built using only the notes of a particular key. In C major, the diatonic chords are C, Dm, Em, F, G, Am, Bdim. These are the chords that naturally occur without any sharps or flats outside the key.",
    },
    {
      question: "What is a suspended chord?",
      answer:
        "A suspended (sus) chord replaces the 3rd with either the 2nd (sus2) or the 4th (sus4). This creates a more open, ambiguous sound that wants to resolve back to a major or minor chord.",
    },
  ],
  formula:
    "Major = R + 4 + 7 | Minor = R + 3 + 7 | Dim = R + 3 + 6 | Aug = R + 4 + 8 | Dom7 = R + 4 + 7 + 10 | Maj7 = R + 4 + 7 + 11 | Min7 = R + 3 + 7 + 10",
};
