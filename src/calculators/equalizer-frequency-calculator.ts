import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const equalizerFrequencyCalculator: CalculatorDefinition = {
  slug: "equalizer-frequency-calculator",
  title: "Equalizer Frequency Calculator",
  description: "Find the right EQ frequencies to boost or cut for common instruments and vocals.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["EQ","equalizer","frequency","mixing","audio production"],
  variants: [{
    id: "standard",
    name: "Equalizer Frequency",
    description: "Find the right EQ frequencies to boost or cut for common instruments and vocals.",
    fields: [
      { name: "source", label: "Audio Source", type: "select", options: [{ value: "1", label: "Vocals" }, { value: "2", label: "Kick Drum" }, { value: "3", label: "Snare Drum" }, { value: "4", label: "Electric Guitar" }, { value: "5", label: "Bass Guitar" }, { value: "6", label: "Acoustic Guitar" }], defaultValue: "1" },
      { name: "problem", label: "Sound Problem", type: "select", options: [{ value: "1", label: "Too Muddy" }, { value: "2", label: "Too Harsh" }, { value: "3", label: "Lacks Presence" }, { value: "4", label: "Too Thin" }, { value: "5", label: "Too Boomy" }], defaultValue: "1" },
      { name: "cutAmount", label: "Cut/Boost Amount (dB)", type: "number", min: 1, max: 12, defaultValue: 3 },
    ],
    calculate: (inputs) => {
    const source = inputs.source as number;
    const problem = inputs.problem as number;
    const cutAmount = inputs.cutAmount as number;
    const freqMap = {
      "1_1": { freq: "200-400 Hz", action: "Cut", desc: "Reduce muddiness in vocals" },
      "1_2": { freq: "2-4 kHz", action: "Cut", desc: "Tame harsh sibilance" },
      "1_3": { freq: "3-5 kHz", action: "Boost", desc: "Add vocal presence and clarity" },
      "1_4": { freq: "100-200 Hz", action: "Boost", desc: "Add warmth and body" },
      "1_5": { freq: "80-150 Hz", action: "Cut", desc: "Reduce proximity boom" },
      "2_1": { freq: "300-500 Hz", action: "Cut", desc: "Clean up kick mud" },
      "2_2": { freq: "3-5 kHz", action: "Cut", desc: "Reduce beater harshness" },
      "2_3": { freq: "2-4 kHz", action: "Boost", desc: "Add click and attack" },
      "2_4": { freq: "60-80 Hz", action: "Boost", desc: "Add low-end thump" },
      "2_5": { freq: "200-400 Hz", action: "Cut", desc: "Reduce boominess" },
      "3_1": { freq: "300-600 Hz", action: "Cut", desc: "Remove snare mud" },
      "3_2": { freq: "1-2 kHz", action: "Cut", desc: "Reduce harshness" },
      "3_3": { freq: "3-5 kHz", action: "Boost", desc: "Add snare crack" },
      "3_4": { freq: "150-250 Hz", action: "Boost", desc: "Add body to snare" },
      "3_5": { freq: "200-400 Hz", action: "Cut", desc: "Tighten snare tone" },
      "4_1": { freq: "300-500 Hz", action: "Cut", desc: "Clean guitar mud" },
      "4_2": { freq: "2-4 kHz", action: "Cut", desc: "Reduce guitar bite" },
      "4_3": { freq: "3-6 kHz", action: "Boost", desc: "Add presence" },
      "4_4": { freq: "200-400 Hz", action: "Boost", desc: "Add warmth" },
      "4_5": { freq: "100-250 Hz", action: "Cut", desc: "Reduce low boom" },
      "5_1": { freq: "200-400 Hz", action: "Cut", desc: "Clean bass mud" },
      "5_2": { freq: "800-1.5k Hz", action: "Cut", desc: "Reduce clank" },
      "5_3": { freq: "700-1k Hz", action: "Boost", desc: "Add growl and presence" },
      "5_4": { freq: "60-100 Hz", action: "Boost", desc: "Add deep low end" },
      "5_5": { freq: "80-200 Hz", action: "Cut", desc: "Tighten bass" },
      "6_1": { freq: "200-400 Hz", action: "Cut", desc: "Remove body mud" },
      "6_2": { freq: "2-5 kHz", action: "Cut", desc: "Reduce string harshness" },
      "6_3": { freq: "5-8 kHz", action: "Boost", desc: "Add shimmer" },
      "6_4": { freq: "100-200 Hz", action: "Boost", desc: "Add body warmth" },
      "6_5": { freq: "100-200 Hz", action: "Cut", desc: "Reduce boom" }
    };
    const key = source + "_" + problem;
    const result = freqMap[key] || { freq: "1 kHz", action: "Cut", desc: "General adjustment" };
    return {
      primary: { label: "Target Frequency", value: result.freq },
      details: [
        { label: "Action", value: result.action + " " + formatNumber(cutAmount) + " dB" },
        { label: "Description", value: result.desc },
        { label: "Q Width", value: result.action === "Cut" ? "Narrow (High Q)" : "Moderate (Medium Q)" },
        { label: "Tip", value: "Always cut before boosting" }
      ]
    };
  },
  }],
  relatedSlugs: ["microphone-sensitivity-calculator","drum-tuning-frequency-calculator","bpm-tempo-calculator"],
  faq: [
    { question: "What is EQ in music production?", answer: "EQ (equalization) adjusts the balance of frequency components in audio, allowing you to shape tone by boosting or cutting specific frequencies." },
    { question: "Should I boost or cut frequencies?", answer: "Cutting is generally preferred over boosting. Subtractive EQ sounds more natural and avoids introducing noise or distortion." },
    { question: "What frequencies are muddy?", answer: "Muddiness typically lives in the 200-500 Hz range. Cutting here can dramatically clean up a mix." },
  ],
  formula: "EQ adjustments based on source instrument and identified problem frequency range",
};
