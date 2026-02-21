import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const musicTempoCalculator: CalculatorDefinition = {
  slug: "music-tempo-calculator",
  title: "Music Tempo Calculator",
  description:
    "Free music tempo calculator. Calculate beat duration, bar length, delay times, and tempo classification from BPM.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "BPM",
    "tempo calculator",
    "beat duration",
    "delay time",
    "music production",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "bpm",
          label: "Beats Per Minute (BPM)",
          type: "number",
          placeholder: "e.g. 120",
        },
      ],
      calculate: (inputs) => {
        const bpm = inputs.bpm as number;
        if (!bpm || bpm <= 0) return null;

        const beatMs = 60000 / bpm;
        const barMs = beatMs * 4; // 4/4 time

        // Delay times for music production
        const quarter = beatMs;
        const eighth = beatMs / 2;
        const sixteenth = beatMs / 4;
        const dottedQuarter = beatMs * 1.5;
        const dottedEighth = eighth * 1.5;
        const tripletQuarter = beatMs * (2 / 3);
        const tripletEighth = eighth * (2 / 3);

        let classification = "";
        if (bpm < 40) classification = "Grave (very slow, solemn)";
        else if (bpm < 60) classification = "Largo (slow and broad)";
        else if (bpm < 70) classification = "Adagio (slow and expressive)";
        else if (bpm < 80) classification = "Andante (walking pace)";
        else if (bpm < 100) classification = "Moderato (moderate speed)";
        else if (bpm < 120) classification = "Allegretto (moderately fast)";
        else if (bpm < 156) classification = "Allegro (fast and bright)";
        else if (bpm < 176) classification = "Vivace (lively and fast)";
        else classification = "Presto (very fast)";

        return {
          primary: {
            label: "Beat Duration",
            value: formatNumber(beatMs, 1) + " ms",
          },
          details: [
            {
              label: "Bar Duration (4/4)",
              value: formatNumber(barMs, 1) + " ms (" + formatNumber(barMs / 1000, 2) + " sec)",
            },
            { label: "Tempo Classification", value: classification },
            {
              label: "Quarter Note Delay",
              value: formatNumber(quarter, 1) + " ms",
            },
            {
              label: "Eighth Note Delay",
              value: formatNumber(eighth, 1) + " ms",
            },
            {
              label: "Sixteenth Note Delay",
              value: formatNumber(sixteenth, 1) + " ms",
            },
            {
              label: "Dotted Quarter Delay",
              value: formatNumber(dottedQuarter, 1) + " ms",
            },
            {
              label: "Dotted Eighth Delay",
              value: formatNumber(dottedEighth, 1) + " ms",
            },
            {
              label: "Triplet Quarter Delay",
              value: formatNumber(tripletQuarter, 1) + " ms",
            },
            {
              label: "Triplet Eighth Delay",
              value: formatNumber(tripletEighth, 1) + " ms",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["tuning-frequency-calculator", "typing-speed-calculator"],
  faq: [
    {
      question: "What is BPM in music?",
      answer:
        "BPM stands for Beats Per Minute, which measures the tempo or speed of a piece of music. 60 BPM means one beat per second. Common dance music is 120-130 BPM.",
    },
    {
      question: "Why are delay times important in music production?",
      answer:
        "Syncing delay effects to the tempo of your song creates musical, rhythmic echoes instead of random repetitions. Using tempo-synced delay times (quarter, eighth, dotted, triplet) keeps effects in time with the beat.",
    },
  ],
  formula:
    "Beat Duration (ms) = 60000 / BPM. Bar Duration (4/4) = Beat x 4. Eighth = Beat / 2. Sixteenth = Beat / 4. Dotted = Beat x 1.5. Triplet = Beat x 2/3.",
};
