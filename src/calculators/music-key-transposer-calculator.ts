import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const musicKeyTransposerCalculator: CalculatorDefinition = {
  slug: "music-key-transposer-calculator",
  title: "Music Key Transposer Calculator",
  description: "Transpose musical keys up or down by a given number of semitones for any instrument.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["transpose","key change","semitone","music key","transposition"],
  variants: [{
    id: "standard",
    name: "Music Key Transposer",
    description: "Transpose musical keys up or down by a given number of semitones for any instrument.",
    fields: [
      { name: "originalKey", label: "Original Key", type: "select", options: [{ value: "0", label: "C" }, { value: "1", label: "C#/Db" }, { value: "2", label: "D" }, { value: "3", label: "D#/Eb" }, { value: "4", label: "E" }, { value: "5", label: "F" }, { value: "6", label: "F#/Gb" }, { value: "7", label: "G" }, { value: "8", label: "G#/Ab" }, { value: "9", label: "A" }, { value: "10", label: "A#/Bb" }, { value: "11", label: "B" }], defaultValue: "0" },
      { name: "semitones", label: "Semitones to Transpose", type: "number", min: -12, max: 12, defaultValue: 5 },
      { name: "scaleType", label: "Scale Type", type: "select", options: [{ value: "1", label: "Major" }, { value: "2", label: "Minor" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const originalKey = inputs.originalKey as number;
    const semitones = inputs.semitones as number;
    const scaleType = inputs.scaleType as number;
    const notes = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];
    const newKeyIndex = ((originalKey + semitones) % 12 + 12) % 12;
    const originalNote = notes[originalKey];
    const newNote = notes[newKeyIndex];
    const scaleLabel = scaleType === 1 ? "Major" : "Minor";
    const relativeIndex = scaleType === 1 ? ((newKeyIndex + 9) % 12) : ((newKeyIndex + 3) % 12);
    const relativeKey = notes[relativeIndex];
    const relativeLabel = scaleType === 1 ? "Relative Minor" : "Relative Major";
    const direction = semitones > 0 ? "Up" : semitones < 0 ? "Down" : "None";
    const interval = Math.abs(semitones);
    return {
      primary: { label: "New Key", value: newNote + " " + scaleLabel },
      details: [
        { label: "Original Key", value: originalNote + " " + scaleLabel },
        { label: "Direction", value: direction + " " + formatNumber(interval) + " semitones" },
        { label: relativeLabel, value: relativeKey },
        { label: "Enharmonic Steps", value: formatNumber(interval) }
      ]
    };
  },
  }],
  relatedSlugs: ["bpm-tempo-calculator","chord-progression-calculator","guitar-string-gauge-calculator"],
  faq: [
    { question: "What does transposing a key mean?", answer: "Transposing shifts all notes in a piece of music up or down by the same interval, changing the key while preserving the melody." },
    { question: "How many semitones are in an octave?", answer: "There are 12 semitones in one octave on the chromatic scale." },
    { question: "Why would you transpose music?", answer: "Common reasons include matching a singer's vocal range, accommodating transposing instruments like Bb trumpet, or making a piece easier to play." },
  ],
  formula: "New Key Index = (Original Key + Semitones) mod 12",
};
