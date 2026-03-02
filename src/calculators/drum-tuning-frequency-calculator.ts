import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const drumTuningFrequencyCalculator: CalculatorDefinition = {
  slug: "drum-tuning-frequency-calculator",
  title: "Drum Tuning Frequency Calculator",
  description: "Calculate the fundamental frequency and interval for drum tuning across your kit.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["drum tuning","frequency","drum pitch","percussion","drum head"],
  variants: [{
    id: "standard",
    name: "Drum Tuning Frequency",
    description: "Calculate the fundamental frequency and interval for drum tuning across your kit.",
    fields: [
      { name: "drumDiameter", label: "Drum Diameter (inches)", type: "number", min: 6, max: 26, defaultValue: 14 },
      { name: "drumType", label: "Drum Type", type: "select", options: [{ value: "1", label: "Snare" }, { value: "2", label: "Rack Tom" }, { value: "3", label: "Floor Tom" }, { value: "4", label: "Bass Drum" }], defaultValue: "1" },
      { name: "tuningStyle", label: "Tuning Style", type: "select", options: [{ value: "1", label: "Jazz (Higher)" }, { value: "2", label: "Rock (Medium)" }, { value: "3", label: "Metal (Lower)" }], defaultValue: "2" },
      { name: "headType", label: "Head Type", type: "select", options: [{ value: "1", label: "Single Ply (Brighter)" }, { value: "2", label: "Double Ply (Warmer)" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const diameter = inputs.drumDiameter as number;
    const drumType = inputs.drumType as number;
    const tuningStyle = inputs.tuningStyle as number;
    const headType = inputs.headType as number;
    const baseFreqs = { 1: 200, 2: 170, 3: 100, 4: 60 };
    const tuningMult = { 1: 1.2, 2: 1.0, 3: 0.8 };
    const headMult = { 1: 1.05, 2: 0.95 };
    const sizeRef = { 1: 14, 2: 12, 3: 16, 4: 22 };
    const refDiam = sizeRef[drumType];
    const freq = baseFreqs[drumType] * (refDiam / diameter) * tuningMult[tuningStyle] * headMult[headType];
    const drumLabels = { 1: "Snare", 2: "Rack Tom", 3: "Floor Tom", 4: "Bass Drum" };
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const midiNote = 12 * Math.log2(freq / 440) + 69;
    const nearestNote = noteNames[Math.round(midiNote) % 12];
    const octave = Math.floor(Math.round(midiNote) / 12) - 1;
    return {
      primary: { label: "Target Frequency", value: formatNumber(freq) + " Hz" },
      details: [
        { label: "Nearest Note", value: nearestNote + octave },
        { label: "Drum Type", value: drumLabels[drumType] },
        { label: "Diameter", value: formatNumber(diameter) + " inches" },
        { label: "MIDI Note", value: formatNumber(Math.round(midiNote)) }
      ]
    };
  },
  }],
  relatedSlugs: ["guitar-string-gauge-calculator","bpm-tempo-calculator","equalizer-frequency-calculator"],
  faq: [
    { question: "What frequency should I tune my snare to?", answer: "A 14-inch snare is typically tuned between 180-250 Hz depending on the style. Jazz players tune higher, metal drummers lower." },
    { question: "How do I tune drums by ear?", answer: "Tap near each lug and adjust until each point produces the same pitch, then adjust overall tension for desired pitch." },
    { question: "Should toms be tuned to specific notes?", answer: "Many drummers tune toms in musical intervals such as thirds or fourths for a melodic sound across the kit." },
  ],
  formula: "Frequency = Base Freq x (Ref Diameter / Actual Diameter) x Tuning x Head Factor",
};
