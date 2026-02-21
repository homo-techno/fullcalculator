import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bpmCalculator: CalculatorDefinition = {
  slug: "bpm-calculator",
  title: "BPM Calculator",
  description:
    "Free BPM calculator. Tap to find the tempo of any song in beats per minute. Calculate BPM from tap intervals or time between beats.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "BPM calculator",
    "beats per minute",
    "tap tempo",
    "tap BPM",
    "find BPM of song",
    "tempo finder",
  ],
  variants: [
    {
      id: "from-interval",
      name: "BPM from Beat Interval",
      description: "Calculate BPM from the time between beats in milliseconds",
      fields: [
        {
          name: "intervalMs",
          label: "Beat Interval (ms)",
          type: "number",
          placeholder: "e.g. 500",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const interval = inputs.intervalMs as number;
        if (!interval || interval <= 0) return null;

        const bpm = 60000 / interval;
        const beatsPerSecond = bpm / 60;
        const barDuration4_4 = (interval * 4) / 1000;

        let classification = "";
        if (bpm < 40) classification = "Grave (very slow)";
        else if (bpm < 60) classification = "Largo (slow and broad)";
        else if (bpm < 70) classification = "Adagio (slow)";
        else if (bpm < 80) classification = "Andante (walking pace)";
        else if (bpm < 100) classification = "Moderato (moderate)";
        else if (bpm < 120) classification = "Allegretto (moderately fast)";
        else if (bpm < 156) classification = "Allegro (fast)";
        else if (bpm < 176) classification = "Vivace (lively)";
        else classification = "Presto (very fast)";

        return {
          primary: { label: "BPM", value: formatNumber(bpm, 1) },
          details: [
            { label: "Beats per Second", value: formatNumber(beatsPerSecond, 2) },
            { label: "Beat Interval", value: formatNumber(interval, 1) + " ms" },
            { label: "Bar Duration (4/4)", value: formatNumber(barDuration4_4, 2) + " sec" },
            { label: "Tempo Classification", value: classification },
          ],
        };
      },
    },
    {
      id: "from-beats-time",
      name: "BPM from Beats & Time",
      description: "Calculate BPM from a number of beats counted over a time period",
      fields: [
        {
          name: "beats",
          label: "Number of Beats Counted",
          type: "number",
          placeholder: "e.g. 30",
          min: 1,
        },
        {
          name: "seconds",
          label: "Time Period (seconds)",
          type: "number",
          placeholder: "e.g. 15",
          min: 0.1,
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const beats = inputs.beats as number;
        const seconds = inputs.seconds as number;
        if (!beats || !seconds || beats <= 0 || seconds <= 0) return null;

        const bpm = (beats / seconds) * 60;
        const intervalMs = 60000 / bpm;

        let classification = "";
        if (bpm < 40) classification = "Grave";
        else if (bpm < 60) classification = "Largo";
        else if (bpm < 70) classification = "Adagio";
        else if (bpm < 80) classification = "Andante";
        else if (bpm < 100) classification = "Moderato";
        else if (bpm < 120) classification = "Allegretto";
        else if (bpm < 156) classification = "Allegro";
        else if (bpm < 176) classification = "Vivace";
        else classification = "Presto";

        return {
          primary: { label: "BPM", value: formatNumber(bpm, 1) },
          details: [
            { label: "Beat Interval", value: formatNumber(intervalMs, 1) + " ms" },
            { label: "Beats per Second", value: formatNumber(bpm / 60, 2) },
            { label: "Tempo Classification", value: classification },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["metronome-calculator", "music-tempo-calculator"],
  faq: [
    {
      question: "How do I find the BPM of a song?",
      answer:
        "Count the number of beats you hear over a set time period (e.g., 15 seconds), then multiply by the factor to get beats per minute. Alternatively, tap along to the beat and measure the average interval between taps. BPM = 60000 / interval in ms.",
    },
    {
      question: "What BPM are common music genres?",
      answer:
        "Hip hop: 60-100 BPM. Pop: 100-130 BPM. House: 120-130 BPM. Techno: 120-150 BPM. Drum & Bass: 160-180 BPM. Dubstep: 130-150 BPM (half-time feel). Classical varies widely.",
    },
    {
      question: "What is the difference between BPM and tempo?",
      answer:
        "BPM is a precise numerical measurement of tempo. Tempo is the general speed of music and can also be described with Italian terms like Allegro (fast, 120-156 BPM) or Adagio (slow, 60-70 BPM).",
    },
  ],
  formula:
    "BPM = 60000 / Interval (ms) | BPM = (Beats Counted / Seconds) x 60 | Beat Interval (ms) = 60000 / BPM",
};
