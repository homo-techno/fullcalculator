import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tuningFrequencyCalculator: CalculatorDefinition = {
  slug: "tuning-frequency-calculator",
  title: "Tuning Frequency Calculator",
  description:
    "Free tuning frequency calculator. Find the exact frequency of any musical note using equal temperament tuning (A4 = 440 Hz).",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "tuning frequency",
    "musical note",
    "equal temperament",
    "A440",
    "pitch calculator",
    "Hz",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "note",
          label: "Note",
          type: "select",
          options: [
            { label: "C", value: "0" },
            { label: "C# / Db", value: "1" },
            { label: "D", value: "2" },
            { label: "D# / Eb", value: "3" },
            { label: "E", value: "4" },
            { label: "F", value: "5" },
            { label: "F# / Gb", value: "6" },
            { label: "G", value: "7" },
            { label: "G# / Ab", value: "8" },
            { label: "A", value: "9" },
            { label: "A# / Bb", value: "10" },
            { label: "B", value: "11" },
          ],
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
            { label: "4 (Middle C octave)", value: "4" },
            { label: "5", value: "5" },
            { label: "6", value: "6" },
            { label: "7", value: "7" },
            { label: "8", value: "8" },
          ],
        },
      ],
      calculate: (inputs) => {
        const noteIndex = parseInt(inputs.note as string);
        const octave = parseInt(inputs.octave as string);
        if (isNaN(noteIndex) || isNaN(octave)) return null;

        // Piano key number: A4 = key 49, C4 = key 40
        // Key number = (octave + 1) * 12 + noteIndex - 8
        // Or: semitones from A4 = (octave - 4) * 12 + (noteIndex - 9)
        const semitonesFromA4 = (octave - 4) * 12 + (noteIndex - 9);
        const frequency = 440 * Math.pow(2, semitonesFromA4 / 12);

        const noteNames = [
          "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
        ];
        const noteName = noteNames[noteIndex] + octave;

        const wavelengthM = 343 / frequency; // speed of sound in air ~343 m/s
        const pianoKey = (octave - 0) * 12 + noteIndex + 4 - 8; // approximate piano key

        // MIDI note number
        const midiNote = 12 * (octave + 1) + noteIndex;

        return {
          primary: {
            label: noteName + " Frequency",
            value: formatNumber(frequency, 2) + " Hz",
          },
          details: [
            {
              label: "Semitones from A4",
              value: String(semitonesFromA4),
            },
            {
              label: "Wavelength (in air)",
              value: formatNumber(wavelengthM, 3) + " m (" + formatNumber(wavelengthM * 100, 1) + " cm)",
            },
            { label: "MIDI Note Number", value: String(midiNote) },
            {
              label: "Period",
              value: formatNumber(1000 / frequency, 3) + " ms",
            },
            {
              label: "Reference",
              value: "A4 = 440.00 Hz (concert pitch)",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sound-speed-calculator", "music-tempo-calculator"],
  faq: [
    {
      question: "What is equal temperament tuning?",
      answer:
        "Equal temperament divides the octave into 12 equal semitones. Each semitone has a frequency ratio of 2^(1/12) or approximately 1.05946. This allows instruments to play in any key equally well.",
    },
    {
      question: "Why is A4 tuned to 440 Hz?",
      answer:
        "A4 = 440 Hz was adopted as the international standard (ISO 16) in 1955. Some orchestras tune slightly higher (441-443 Hz) for a brighter sound. Historical tuning varied widely from 415 to 466 Hz.",
    },
  ],
  formula:
    "f = 440 x 2^((n-49)/12) where n is the piano key number, or equivalently f = 440 x 2^(semitones_from_A4 / 12). Wavelength = speed of sound / frequency. MIDI note = 12 x (octave + 1) + note_index.",
};
