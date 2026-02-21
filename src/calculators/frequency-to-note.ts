import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const frequencyToNoteCalculator: CalculatorDefinition = {
  slug: "frequency-to-note-calculator",
  title: "Frequency to Note Calculator",
  description:
    "Free frequency to note converter. Convert any frequency in Hz to its closest musical note, octave, and cents deviation.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "frequency to note",
    "Hz to note",
    "pitch frequency",
    "note frequency",
    "frequency converter music",
    "hertz to pitch",
  ],
  variants: [
    {
      id: "freq-to-note",
      name: "Frequency to Note",
      description: "Convert a frequency (Hz) to the nearest musical note",
      fields: [
        {
          name: "frequency",
          label: "Frequency (Hz)",
          type: "number",
          placeholder: "e.g. 440",
          min: 8,
          max: 20000,
          step: 0.01,
        },
        {
          name: "concertPitch",
          label: "Concert Pitch A4 (Hz)",
          type: "number",
          placeholder: "440",
          defaultValue: 440,
          min: 400,
          max: 480,
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const freq = inputs.frequency as number;
        const a4 = (inputs.concertPitch as number) || 440;
        if (!freq || freq <= 0) return null;

        // Number of semitones from A4
        const semitonesFromA4 = 12 * Math.log2(freq / a4);
        const nearestSemitone = Math.round(semitonesFromA4);
        const centsOff = (semitonesFromA4 - nearestSemitone) * 100;

        // Note index: A4 is MIDI 69
        const midiNote = 69 + nearestSemitone;
        const noteIndex = ((midiNote % 12) + 12) % 12;
        const octave = Math.floor(midiNote / 12) - 1;
        const noteName = NOTE_NAMES[noteIndex];
        const exactFreq = a4 * Math.pow(2, nearestSemitone / 12);

        // Adjacent notes
        const lowerFreq = a4 * Math.pow(2, (nearestSemitone - 1) / 12);
        const upperFreq = a4 * Math.pow(2, (nearestSemitone + 1) / 12);
        const lowerMidi = midiNote - 1;
        const upperMidi = midiNote + 1;
        const lowerNote = NOTE_NAMES[((lowerMidi % 12) + 12) % 12] + (Math.floor(lowerMidi / 12) - 1);
        const upperNote = NOTE_NAMES[((upperMidi % 12) + 12) % 12] + (Math.floor(upperMidi / 12) - 1);

        const tuningStatus = Math.abs(centsOff) < 2 ? "In tune" : centsOff > 0 ? "Sharp" : "Flat";

        return {
          primary: { label: "Nearest Note", value: `${noteName}${octave}` },
          details: [
            { label: "Exact Frequency of Note", value: formatNumber(exactFreq, 2) + " Hz" },
            { label: "Input Frequency", value: formatNumber(freq, 2) + " Hz" },
            { label: "Cents Deviation", value: `${centsOff >= 0 ? "+" : ""}${formatNumber(centsOff, 1)} cents` },
            { label: "Tuning Status", value: tuningStatus },
            { label: "MIDI Note Number", value: `${midiNote}` },
            { label: "Lower Neighbor", value: `${lowerNote} (${formatNumber(lowerFreq, 2)} Hz)` },
            { label: "Upper Neighbor", value: `${upperNote} (${formatNumber(upperFreq, 2)} Hz)` },
            { label: "Concert Pitch", value: `A4 = ${a4} Hz` },
          ],
        };
      },
    },
    {
      id: "note-to-freq",
      name: "Note to Frequency",
      description: "Find the exact frequency of a specific note and octave",
      fields: [
        {
          name: "note",
          label: "Note",
          type: "select",
          options: NOTE_NAMES.map((n) => ({ label: n, value: n })),
          defaultValue: "A",
        },
        {
          name: "octave",
          label: "Octave",
          type: "select",
          options: [
            { label: "0", value: "0" },
            { label: "1", value: "1" },
            { label: "2", value: "2" },
            { label: "3", value: "3" },
            { label: "4", value: "4" },
            { label: "5", value: "5" },
            { label: "6", value: "6" },
            { label: "7", value: "7" },
            { label: "8", value: "8" },
          ],
          defaultValue: "4",
        },
        {
          name: "concertPitch",
          label: "Concert Pitch A4 (Hz)",
          type: "number",
          placeholder: "440",
          defaultValue: 440,
          min: 400,
          max: 480,
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const note = inputs.note as string;
        const octave = parseInt(inputs.octave as string);
        const a4 = (inputs.concertPitch as number) || 440;
        const noteIdx = NOTE_NAMES.indexOf(note);
        if (noteIdx === -1 || isNaN(octave)) return null;

        const midiNote = (octave + 1) * 12 + noteIdx;
        const semitonesFromA4 = midiNote - 69;
        const freq = a4 * Math.pow(2, semitonesFromA4 / 12);
        const wavelengthM = 343 / freq; // speed of sound ~343 m/s

        return {
          primary: { label: `${note}${octave} Frequency`, value: formatNumber(freq, 2) + " Hz" },
          details: [
            { label: "MIDI Note Number", value: `${midiNote}` },
            { label: "Semitones from A4", value: `${semitonesFromA4}` },
            { label: "Wavelength (in air)", value: formatNumber(wavelengthM, 3) + " m" },
            { label: "Period", value: formatNumber(1000 / freq, 4) + " ms" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["tuning-frequency-calculator", "interval-calculator", "bpm-calculator"],
  faq: [
    {
      question: "What frequency is middle C?",
      answer:
        "Middle C (C4) is approximately 261.63 Hz at standard A4 = 440 Hz tuning. This is the C closest to the center of a piano keyboard.",
    },
    {
      question: "What are cents in music?",
      answer:
        "A cent is 1/100th of a semitone. There are 1200 cents in an octave. Cents are used to measure small pitch differences. Being within +/-5 cents is generally considered in tune for most instruments.",
    },
    {
      question: "Why would I change the concert pitch from 440 Hz?",
      answer:
        "Some orchestras tune to A = 442 or 443 Hz for a brighter sound. Baroque ensembles often use A = 415 Hz. Some musicians prefer A = 432 Hz. The calculator lets you use any reference pitch.",
    },
  ],
  formula:
    "Semitones from A4 = 12 x log2(f / A4) | Frequency = A4 x 2^(semitones/12) | Cents = (semitones - round(semitones)) x 100",
};
