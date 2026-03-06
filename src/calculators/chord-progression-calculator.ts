import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chordProgressionCalculator: CalculatorDefinition = {
  slug: "chord-progression-calculator",
  title: "Chord Progression Calculator",
  description: "Generate common chord progressions in any key with Roman numeral analysis for songwriting.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["chord progression","songwriting","chords","harmony","music theory"],
  variants: [{
    id: "standard",
    name: "Chord Progression",
    description: "Generate common chord progressions in any key with Roman numeral analysis for songwriting.",
    fields: [
      { name: "rootKey", label: "Root Key", type: "select", options: [{ value: "0", label: "C" }, { value: "2", label: "D" }, { value: "4", label: "E" }, { value: "5", label: "F" }, { value: "7", label: "G" }, { value: "9", label: "A" }, { value: "11", label: "B" }], defaultValue: "0" },
      { name: "progression", label: "Progression Type", type: "select", options: [{ value: "1", label: "I-IV-V-I (Classic)" }, { value: "2", label: "I-V-vi-IV (Pop)" }, { value: "3", label: "ii-V-I (Jazz)" }, { value: "4", label: "I-vi-IV-V (50s)" }, { value: "5", label: "vi-IV-I-V (Modern)" }], defaultValue: "2" },
      { name: "bpm", label: "Tempo (BPM)", type: "number", min: 40, max: 240, defaultValue: 120 },
    ],
    calculate: (inputs) => {
    const rootKey = inputs.rootKey as number;
    const progression = inputs.progression as number;
    const bpm = inputs.bpm as number;
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const majorScale = [0, 2, 4, 5, 7, 9, 11];
    const getNote = (degree) => notes[(rootKey + majorScale[degree]) % 12];
    let chords = [];
    let roman = "";
    if (progression === 1) { chords = [getNote(0), getNote(3), getNote(4), getNote(0)]; roman = "I - IV - V - I"; }
    else if (progression === 2) { chords = [getNote(0), getNote(4), getNote(5) + "m", getNote(3)]; roman = "I - V - vi - IV"; }
    else if (progression === 3) { chords = [getNote(1) + "m", getNote(4), getNote(0)]; roman = "ii - V - I"; }
    else if (progression === 4) { chords = [getNote(0), getNote(5) + "m", getNote(3), getNote(4)]; roman = "I - vi - IV - V"; }
    else { chords = [getNote(5) + "m", getNote(3), getNote(0), getNote(4)]; roman = "vi - IV - I - V"; }
    const chordsStr = chords.join(" - ");
    const beatsPerChord = 4;
    const secPerChord = (beatsPerChord * 60) / bpm;
    const loopDuration = secPerChord * chords.length;
    return {
      primary: { label: "Chord Progression", value: chordsStr },
      details: [
        { label: "Roman Numerals", value: roman },
        { label: "Key", value: notes[rootKey] + " Major" },
        { label: "Seconds Per Chord", value: formatNumber(secPerChord) + " sec" },
        { label: "Loop Duration", value: formatNumber(loopDuration) + " sec" }
      ]
    };
  },
  }],
  relatedSlugs: ["music-key-transposer-calculator","bpm-tempo-calculator","music-royalty-split-calculator"],
  faq: [
    { question: "What is the most popular chord progression?", answer: "The I-V-vi-IV progression is the most widely used in modern pop music, used in hundreds of hit songs." },
    { question: "What is a ii-V-I progression?", answer: "It is the most important chord progression in jazz, creating strong harmonic motion toward the tonic." },
    { question: "Do I need to know music theory to write songs?", answer: "While not required, understanding chord progressions can help you write more compelling and harmonically interesting music." },
  ],
  formula: "Chords derived from scale degrees of the selected key; Loop Duration = (Beats Per Chord x Chords) / BPM x 60",
};
