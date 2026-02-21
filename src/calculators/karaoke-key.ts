import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const NOTES = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];
const NOTE_VALUES: Record<string, number> = {};
NOTES.forEach((n, i) => { NOTE_VALUES[n] = i; });

export const karaokeKeyCalculator: CalculatorDefinition = {
  slug: "karaoke-key-calculator",
  title: "Karaoke Key Change Calculator",
  description:
    "Free karaoke key change calculator. Find the best key for your vocal range. Transpose songs up or down to match your voice.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "karaoke key change",
    "singing key calculator",
    "transpose for voice",
    "vocal range calculator",
    "key change calculator",
    "karaoke transpose",
    "sing in different key",
  ],
  variants: [
    {
      id: "key-change",
      name: "Song Key Change",
      description: "Transpose a song to a new key and see how it affects the vocal range",
      fields: [
        {
          name: "originalKey",
          label: "Original Song Key",
          type: "select",
          options: NOTES.map((n) => ({ label: n, value: n })),
          defaultValue: "G",
        },
        {
          name: "songLowest",
          label: "Song's Lowest Note",
          type: "select",
          options: NOTES.map((n) => ({ label: n, value: n })),
          defaultValue: "D",
        },
        {
          name: "songHighest",
          label: "Song's Highest Note",
          type: "select",
          options: NOTES.map((n) => ({ label: n, value: n })),
          defaultValue: "D",
        },
        {
          name: "semitones",
          label: "Semitones to Transpose (+ up, - down)",
          type: "number",
          placeholder: "e.g. -3",
          min: -12,
          max: 12,
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const originalKey = inputs.originalKey as string;
        const songLow = inputs.songLowest as string;
        const songHigh = inputs.songHighest as string;
        const semitones = (inputs.semitones as number) || 0;

        const origIdx = NOTE_VALUES[originalKey];
        const lowIdx = NOTE_VALUES[songLow];
        const highIdx = NOTE_VALUES[songHigh];
        if (origIdx === undefined || lowIdx === undefined || highIdx === undefined) return null;

        const newKeyIdx = ((origIdx + semitones) % 12 + 12) % 12;
        const newLowIdx = ((lowIdx + semitones) % 12 + 12) % 12;
        const newHighIdx = ((highIdx + semitones) % 12 + 12) % 12;

        const newKey = NOTES[newKeyIdx];
        const newLow = NOTES[newLowIdx];
        const newHigh = NOTES[newHighIdx];

        // Estimate range span in semitones
        const rangeSpan = ((highIdx - lowIdx) % 12 + 12) % 12;

        const direction = semitones > 0 ? "up" : semitones < 0 ? "down" : "no change";

        return {
          primary: { label: "New Key", value: newKey },
          details: [
            { label: "Original Key", value: originalKey },
            { label: "New Key", value: newKey },
            { label: "Transposition", value: `${semitones > 0 ? "+" : ""}${semitones} semitones (${direction})` },
            { label: "Original Low Note", value: songLow },
            { label: "New Low Note", value: newLow },
            { label: "Original High Note", value: songHigh },
            { label: "New High Note", value: newHigh },
            { label: "Vocal Range Span", value: `${rangeSpan} semitones (unchanged)` },
          ],
        };
      },
    },
    {
      id: "find-best-key",
      name: "Find Best Key for Your Range",
      description: "Find the optimal key based on your comfortable vocal range",
      fields: [
        {
          name: "yourLowest",
          label: "Your Comfortable Lowest Note",
          type: "select",
          options: NOTES.map((n) => ({ label: n, value: n })),
          defaultValue: "A",
        },
        {
          name: "yourHighest",
          label: "Your Comfortable Highest Note",
          type: "select",
          options: NOTES.map((n) => ({ label: n, value: n })),
          defaultValue: "E",
        },
        {
          name: "songKey",
          label: "Original Song Key",
          type: "select",
          options: NOTES.map((n) => ({ label: n, value: n })),
          defaultValue: "C",
        },
        {
          name: "songLowest",
          label: "Song's Lowest Note",
          type: "select",
          options: NOTES.map((n) => ({ label: n, value: n })),
          defaultValue: "C",
        },
        {
          name: "songHighest",
          label: "Song's Highest Note",
          type: "select",
          options: NOTES.map((n) => ({ label: n, value: n })),
          defaultValue: "G",
        },
      ],
      calculate: (inputs) => {
        const yourLow = NOTE_VALUES[inputs.yourLowest as string];
        const yourHigh = NOTE_VALUES[inputs.yourHighest as string];
        const songKey = NOTE_VALUES[inputs.songKey as string];
        const songLow = NOTE_VALUES[inputs.songLowest as string];
        const songHigh = NOTE_VALUES[inputs.songHighest as string];

        if ([yourLow, yourHigh, songKey, songLow, songHigh].some((v) => v === undefined)) return null;

        const songRange = ((songHigh - songLow) % 12 + 12) % 12;
        const yourRange = ((yourHigh - yourLow) % 12 + 12) % 12;

        // Try all 12 transpositions, find best fit
        let bestSemitones = 0;
        let bestScore = -Infinity;

        for (let shift = -6; shift <= 6; shift++) {
          const newLow = ((songLow + shift) % 12 + 12) % 12;
          const newHigh = ((songHigh + shift) % 12 + 12) % 12;

          // Check if new range fits within vocal range
          const lowDiff = ((newLow - yourLow) % 12 + 12) % 12;
          const highDiff = ((yourHigh - newHigh) % 12 + 12) % 12;

          // Score: prefer shifts that center the song in the singer's range
          // Penalize if notes go outside range
          let score = 0;
          if (lowDiff <= yourRange && highDiff <= 12) {
            score = 10 - Math.abs(shift); // prefer smaller shifts
            // Bonus for fitting within range
            if (lowDiff >= 0 && highDiff >= 0 && lowDiff <= yourRange) score += 5;
          } else {
            score = -Math.abs(shift);
          }

          if (score > bestScore) {
            bestScore = score;
            bestSemitones = shift;
          }
        }

        const newKeyIdx = ((songKey + bestSemitones) % 12 + 12) % 12;
        const newLowIdx = ((songLow + bestSemitones) % 12 + 12) % 12;
        const newHighIdx = ((songHigh + bestSemitones) % 12 + 12) % 12;

        return {
          primary: { label: "Recommended Key", value: NOTES[newKeyIdx] },
          details: [
            { label: "Original Key", value: NOTES[songKey] },
            { label: "Recommended Key", value: NOTES[newKeyIdx] },
            { label: "Transpose", value: `${bestSemitones > 0 ? "+" : ""}${bestSemitones} semitones` },
            { label: "Your Range", value: `${NOTES[yourLow]} to ${NOTES[yourHigh]}` },
            { label: "Song Range (original)", value: `${NOTES[songLow]} to ${NOTES[songHigh]}` },
            { label: "Song Range (transposed)", value: `${NOTES[newLowIdx]} to ${NOTES[newHighIdx]}` },
            { label: "Song Span", value: `${songRange} semitones` },
            { label: "Your Range Span", value: `${yourRange} semitones` },
          ],
          note: yourRange < songRange
            ? "Warning: The song's range is wider than your comfortable range. Some notes may still be challenging."
            : undefined,
        };
      },
    },
    {
      id: "voice-type",
      name: "Voice Type Reference",
      description: "Find your voice type based on your comfortable range",
      fields: [
        {
          name: "gender",
          label: "Voice Category",
          type: "select",
          options: [
            { label: "Female / High Voice", value: "female" },
            { label: "Male / Low Voice", value: "male" },
          ],
          defaultValue: "female",
        },
        {
          name: "lowestNote",
          label: "Your Lowest Comfortable Note",
          type: "select",
          options: NOTES.map((n) => ({ label: n, value: n })),
          defaultValue: "A",
        },
        {
          name: "highestNote",
          label: "Your Highest Comfortable Note",
          type: "select",
          options: NOTES.map((n) => ({ label: n, value: n })),
          defaultValue: "E",
        },
      ],
      calculate: (inputs) => {
        const gender = inputs.gender as string;
        const low = NOTE_VALUES[inputs.lowestNote as string];
        const high = NOTE_VALUES[inputs.highestNote as string];
        if (low === undefined || high === undefined) return null;

        const range = ((high - low) % 12 + 12) % 12;

        let voiceType = "";
        let typicalRange = "";

        if (gender === "female") {
          // Approximate based on lowest comfortable note
          if (low <= 2) { // C, C#, D
            voiceType = "Soprano";
            typicalRange = "C4 to C6 (Middle C to High C)";
          } else if (low <= 5) { // D#, E, F
            voiceType = "Mezzo-Soprano";
            typicalRange = "A3 to A5";
          } else {
            voiceType = "Alto (Contralto)";
            typicalRange = "F3 to F5";
          }
        } else {
          if (low <= 2) {
            voiceType = "Tenor";
            typicalRange = "C3 to C5";
          } else if (low <= 5) {
            voiceType = "Baritone";
            typicalRange = "A2 to A4";
          } else {
            voiceType = "Bass";
            typicalRange = "E2 to E4";
          }
        }

        return {
          primary: { label: "Estimated Voice Type", value: voiceType },
          details: [
            { label: "Your Range", value: `${NOTES[low]} to ${NOTES[high]} (${range} semitones)` },
            { label: "Voice Type", value: voiceType },
            { label: "Typical Range", value: typicalRange },
          ],
          note: "This is a rough estimate based on note names without octave information. For accurate voice typing, work with a vocal coach.",
        };
      },
    },
  ],
  relatedSlugs: ["key-transpose-calculator", "song-key-calculator", "bpm-calculator"],
  faq: [
    {
      question: "How do I find the right karaoke key for my voice?",
      answer:
        "First, identify your comfortable vocal range (lowest and highest notes you can sing well). Then compare it to the song's range. If the song goes too high, transpose down. If too low, transpose up. Most karaoke machines let you adjust by semitones with +/- buttons.",
    },
    {
      question: "How many semitones should I transpose?",
      answer:
        "Most singers transpose 1-4 semitones up or down. Going more than 5-6 semitones may make the song sound noticeably different. Try small adjustments first. Many karaoke apps let you preview the transposed key.",
    },
    {
      question: "What are common vocal ranges?",
      answer:
        "Soprano: C4-C6. Mezzo-soprano: A3-A5. Alto: F3-F5. Tenor: C3-C5. Baritone: A2-A4. Bass: E2-E4. Most pop songs are written for a range of about 1.5 octaves (18 semitones).",
    },
  ],
  formula:
    "New Key = (Original Key + Semitones) mod 12 | All notes in the song shift by the same number of semitones | Range span stays constant when transposing",
};
