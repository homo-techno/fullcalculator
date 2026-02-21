import type { CalculatorDefinition } from "./types";

const NOTES = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];
const NOTE_VALUES: Record<string, number> = {
  C: 0, "C#/Db": 1, D: 2, "D#/Eb": 3, E: 4, F: 5, "F#/Gb": 6, G: 7, "G#/Ab": 8, A: 9, "A#/Bb": 10, B: 11,
};

export const keyTransposeCalculator: CalculatorDefinition = {
  slug: "key-transpose-calculator",
  title: "Key Transpose Calculator",
  description:
    "Free key transposition calculator. Transpose any musical key or chord up or down by semitones. Perfect for musicians changing keys.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "key transpose",
    "transpose calculator",
    "music transposition",
    "change key",
    "semitone calculator",
    "capo chart",
  ],
  variants: [
    {
      id: "transpose-key",
      name: "Transpose by Semitones",
      description: "Transpose a note or key up/down by a number of semitones",
      fields: [
        {
          name: "originalKey",
          label: "Original Key / Note",
          type: "select",
          options: NOTES.map((n) => ({ label: n, value: n })),
          defaultValue: "C",
        },
        {
          name: "semitones",
          label: "Semitones to Transpose",
          type: "number",
          placeholder: "e.g. 5 (negative to go down)",
          min: -12,
          max: 12,
        },
        {
          name: "quality",
          label: "Key Quality",
          type: "select",
          options: [
            { label: "Major", value: "major" },
            { label: "Minor", value: "minor" },
          ],
          defaultValue: "major",
        },
      ],
      calculate: (inputs) => {
        const originalKey = inputs.originalKey as string;
        const semitones = inputs.semitones as number;
        const quality = inputs.quality as string;
        if (semitones === undefined || semitones === null) return null;

        const originalIndex = NOTE_VALUES[originalKey];
        if (originalIndex === undefined) return null;

        const newIndex = ((originalIndex + semitones) % 12 + 12) % 12;
        const newKey = NOTES[newIndex];

        // Build scale degrees for both keys
        const majorIntervals = [0, 2, 4, 5, 7, 9, 11];
        const minorIntervals = [0, 2, 3, 5, 7, 8, 10];
        const intervals = quality === "minor" ? minorIntervals : majorIntervals;

        const originalScale = intervals.map((i) => NOTES[(originalIndex + i) % 12]);
        const newScale = intervals.map((i) => NOTES[(newIndex + i) % 12]);

        const details: { label: string; value: string }[] = [
          { label: "Original Key", value: `${originalKey} ${quality}` },
          { label: "Transposed Key", value: `${newKey} ${quality}` },
          { label: "Semitones Moved", value: `${semitones > 0 ? "+" : ""}${semitones}` },
          { label: "Original Scale", value: originalScale.join(" - ") },
          { label: "Transposed Scale", value: newScale.join(" - ") },
        ];

        // Capo equivalent for guitar
        if (semitones < 0) {
          const capoFret = (((-semitones) % 12) + 12) % 12;
          if (capoFret > 0 && capoFret <= 12) {
            details.push({ label: "Guitar Capo Equivalent", value: `Capo on fret ${capoFret} (play in ${newKey})` });
          }
        } else if (semitones > 0) {
          const capoFret = semitones % 12;
          if (capoFret > 0 && capoFret <= 12) {
            details.push({ label: "Guitar Capo Equivalent", value: `Capo on fret ${capoFret} (play shapes from ${originalKey})` });
          }
        }

        return {
          primary: { label: "Transposed Key", value: `${newKey} ${quality}` },
          details,
        };
      },
    },
    {
      id: "between-keys",
      name: "Interval Between Keys",
      description: "Find the number of semitones between two keys",
      fields: [
        {
          name: "fromKey",
          label: "From Key",
          type: "select",
          options: NOTES.map((n) => ({ label: n, value: n })),
          defaultValue: "C",
        },
        {
          name: "toKey",
          label: "To Key",
          type: "select",
          options: NOTES.map((n) => ({ label: n, value: n })),
          defaultValue: "G",
        },
      ],
      calculate: (inputs) => {
        const fromKey = inputs.fromKey as string;
        const toKey = inputs.toKey as string;
        const fromIndex = NOTE_VALUES[fromKey];
        const toIndex = NOTE_VALUES[toKey];
        if (fromIndex === undefined || toIndex === undefined) return null;

        const semitonesUp = ((toIndex - fromIndex) % 12 + 12) % 12;
        const semitonesDown = semitonesUp === 0 ? 0 : 12 - semitonesUp;

        return {
          primary: { label: "Semitones Apart", value: `${semitonesUp}` },
          details: [
            { label: "Up from " + fromKey, value: `+${semitonesUp} semitones` },
            { label: "Down from " + fromKey, value: `-${semitonesDown} semitones` },
            { label: "Capo Fret (to play " + fromKey + " shapes in " + toKey + ")", value: `Fret ${semitonesUp}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["chord-calculator", "karaoke-key-calculator", "interval-calculator"],
  faq: [
    {
      question: "What does it mean to transpose a key?",
      answer:
        "Transposing means shifting all the notes of a song up or down by the same interval (number of semitones). The melody and harmony stay the same, but the pitch changes. This is commonly done to match a singer's vocal range.",
    },
    {
      question: "How many semitones are in an octave?",
      answer:
        "There are 12 semitones in an octave. A semitone (half step) is the smallest interval in Western music, like from C to C# or from E to F.",
    },
    {
      question: "How does a guitar capo relate to transposition?",
      answer:
        "A capo placed on fret N effectively transposes all open chord shapes up by N semitones. For example, playing C shapes with a capo on fret 2 produces the key of D.",
    },
  ],
  formula:
    "New Note Index = (Original Index + Semitones) mod 12 | Semitones Between Keys = (To - From + 12) mod 12",
};
