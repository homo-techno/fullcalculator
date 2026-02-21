import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const metronomeCalculator: CalculatorDefinition = {
  slug: "metronome-calculator",
  title: "Metronome Calculator",
  description:
    "Free metronome calculator. Calculate beat intervals, note durations, and tempo markings for any BPM and time signature.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "metronome calculator",
    "metronome BPM",
    "tempo marking",
    "time signature calculator",
    "beat calculator",
    "note duration",
  ],
  variants: [
    {
      id: "tempo-details",
      name: "Tempo & Note Durations",
      description: "Calculate all note durations for a given BPM and time signature",
      fields: [
        {
          name: "bpm",
          label: "Tempo (BPM)",
          type: "number",
          placeholder: "e.g. 120",
          min: 1,
          max: 400,
        },
        {
          name: "timeSigTop",
          label: "Time Signature (top)",
          type: "number",
          placeholder: "e.g. 4",
          min: 1,
          max: 16,
          defaultValue: 4,
        },
        {
          name: "timeSigBottom",
          label: "Time Signature (bottom)",
          type: "select",
          options: [
            { label: "2 (half note)", value: "2" },
            { label: "4 (quarter note)", value: "4" },
            { label: "8 (eighth note)", value: "8" },
            { label: "16 (sixteenth note)", value: "16" },
          ],
          defaultValue: "4",
        },
      ],
      calculate: (inputs) => {
        const bpm = inputs.bpm as number;
        const top = inputs.timeSigTop as number;
        const bottom = parseInt(inputs.timeSigBottom as string) || 4;
        if (!bpm || bpm <= 0 || !top || top <= 0) return null;

        const quarterMs = 60000 / bpm;
        const beatMs = quarterMs * (4 / bottom);
        const measureMs = beatMs * top;

        const wholeMs = quarterMs * 4;
        const halfMs = quarterMs * 2;
        const eighthMs = quarterMs / 2;
        const sixteenthMs = quarterMs / 4;
        const thirtySecondMs = quarterMs / 8;
        const dottedQuarterMs = quarterMs * 1.5;
        const dottedEighthMs = eighthMs * 1.5;
        const tripletQuarterMs = quarterMs * (2 / 3);
        const tripletEighthMs = eighthMs * (2 / 3);

        return {
          primary: { label: "Beat Duration", value: formatNumber(beatMs, 1) + " ms" },
          details: [
            { label: "Measure Duration", value: formatNumber(measureMs / 1000, 3) + " sec" },
            { label: "Whole Note", value: formatNumber(wholeMs, 1) + " ms" },
            { label: "Half Note", value: formatNumber(halfMs, 1) + " ms" },
            { label: "Quarter Note", value: formatNumber(quarterMs, 1) + " ms" },
            { label: "Eighth Note", value: formatNumber(eighthMs, 1) + " ms" },
            { label: "Sixteenth Note", value: formatNumber(sixteenthMs, 1) + " ms" },
            { label: "Thirty-second Note", value: formatNumber(thirtySecondMs, 1) + " ms" },
            { label: "Dotted Quarter", value: formatNumber(dottedQuarterMs, 1) + " ms" },
            { label: "Dotted Eighth", value: formatNumber(dottedEighthMs, 1) + " ms" },
            { label: "Triplet Quarter", value: formatNumber(tripletQuarterMs, 1) + " ms" },
            { label: "Triplet Eighth", value: formatNumber(tripletEighthMs, 1) + " ms" },
          ],
        };
      },
    },
    {
      id: "practice-tempo",
      name: "Practice Tempo Ramp",
      description: "Calculate a graduated practice tempo schedule from start to target BPM",
      fields: [
        {
          name: "startBpm",
          label: "Starting BPM",
          type: "number",
          placeholder: "e.g. 60",
          min: 1,
        },
        {
          name: "targetBpm",
          label: "Target BPM",
          type: "number",
          placeholder: "e.g. 160",
          min: 1,
        },
        {
          name: "steps",
          label: "Number of Steps",
          type: "number",
          placeholder: "e.g. 5",
          min: 2,
          max: 20,
          defaultValue: 5,
        },
      ],
      calculate: (inputs) => {
        const start = inputs.startBpm as number;
        const target = inputs.targetBpm as number;
        const steps = inputs.steps as number;
        if (!start || !target || !steps || start <= 0 || target <= 0 || steps < 2) return null;

        const increment = (target - start) / (steps - 1);
        const details: { label: string; value: string }[] = [];
        for (let i = 0; i < steps; i++) {
          const tempo = Math.round(start + increment * i);
          details.push({ label: `Step ${i + 1}`, value: `${tempo} BPM` });
        }

        return {
          primary: { label: "BPM Increment per Step", value: formatNumber(Math.abs(increment), 1) },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["bpm-calculator", "music-tempo-calculator"],
  faq: [
    {
      question: "What is a metronome?",
      answer:
        "A metronome is a device that produces a steady pulse (click) at a set tempo (BPM) to help musicians maintain consistent timing while practicing or performing. Digital and physical metronomes are widely used.",
    },
    {
      question: "What is a time signature?",
      answer:
        "A time signature like 4/4 or 3/4 tells you how many beats are in each measure (top number) and which note value gets one beat (bottom number). 4/4 means 4 quarter-note beats per measure.",
    },
    {
      question: "How do I practice with a metronome effectively?",
      answer:
        "Start at a slow BPM where you can play perfectly, then gradually increase by 5-10 BPM increments. Use the practice tempo ramp to plan your progression from start to target speed.",
    },
  ],
  formula:
    "Quarter Note (ms) = 60000 / BPM | Beat (ms) = Quarter x (4 / bottom) | Measure (ms) = Beat x top | Dotted = Note x 1.5 | Triplet = Note x 2/3",
};
