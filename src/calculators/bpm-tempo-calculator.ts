import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bpmTempoCalculator: CalculatorDefinition = {
  slug: "bpm-tempo-calculator",
  title: "BPM Tempo Calculator",
  description: "Calculate beats per minute, tempo markings, and timing intervals for music production and performance.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["bpm","tempo","beats per minute","music tempo","metronome"],
  variants: [{
    id: "standard",
    name: "BPM Tempo",
    description: "Calculate beats per minute, tempo markings, and timing intervals for music production and performance.",
    fields: [
      { name: "bpm", label: "Tempo (BPM)", type: "number", min: 20, max: 300, defaultValue: 120 },
      { name: "beatsPerMeasure", label: "Beats Per Measure", type: "select", options: [{ value: "3", label: "3/4 (Waltz)" }, { value: "4", label: "4/4 (Common)" }, { value: "6", label: "6/8 (Compound)" }, { value: "5", label: "5/4 (Odd)" }], defaultValue: "4" },
      { name: "measures", label: "Number of Measures", type: "number", min: 1, max: 500, defaultValue: 32 },
    ],
    calculate: (inputs) => {
    const bpm = inputs.bpm as number;
    const beatsPerMeasure = inputs.beatsPerMeasure as number;
    const measures = inputs.measures as number;
    const msPerBeat = 60000 / bpm;
    const secPerMeasure = (beatsPerMeasure * 60) / bpm;
    const totalBeats = measures * beatsPerMeasure;
    const totalSeconds = totalBeats * (60 / bpm);
    const totalMinutes = totalSeconds / 60;
    let tempoMarking = "Grave";
    if (bpm >= 40) tempoMarking = "Largo";
    if (bpm >= 55) tempoMarking = "Adagio";
    if (bpm >= 70) tempoMarking = "Andante";
    if (bpm >= 90) tempoMarking = "Moderato";
    if (bpm >= 110) tempoMarking = "Allegro";
    if (bpm >= 140) tempoMarking = "Vivace";
    if (bpm >= 170) tempoMarking = "Presto";
    if (bpm >= 200) tempoMarking = "Prestissimo";
    return {
      primary: { label: "Milliseconds Per Beat", value: formatNumber(msPerBeat) + " ms" },
      details: [
        { label: "Tempo Marking", value: tempoMarking },
        { label: "Seconds Per Measure", value: formatNumber(secPerMeasure) + " sec" },
        { label: "Total Duration", value: formatNumber(totalMinutes) + " min" },
        { label: "Total Beats", value: formatNumber(totalBeats) }
      ]
    };
  },
  }],
  relatedSlugs: ["music-key-transposer-calculator","dj-set-time-planner-calculator","chord-progression-calculator"],
  faq: [
    { question: "What is BPM in music?", answer: "BPM stands for beats per minute and measures the tempo or speed of a piece of music." },
    { question: "What BPM is standard pop music?", answer: "Most pop music falls between 100 and 130 BPM, with 120 BPM being very common." },
    { question: "How do I find the BPM of a song?", answer: "You can tap along with the beat using a metronome app or use audio analysis software to detect BPM automatically." },
  ],
  formula: "ms per beat = 60000 / BPM
Duration = (Measures x Beats Per Measure) / BPM x 60",
};
