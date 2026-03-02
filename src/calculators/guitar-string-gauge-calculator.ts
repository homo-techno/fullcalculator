import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const guitarStringGaugeCalculator: CalculatorDefinition = {
  slug: "guitar-string-gauge-calculator",
  title: "Guitar String Gauge Calculator",
  description: "Find the right guitar string gauge and tension for your tuning and scale length.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["guitar","string gauge","tension","tuning","guitar strings"],
  variants: [{
    id: "standard",
    name: "Guitar String Gauge",
    description: "Find the right guitar string gauge and tension for your tuning and scale length.",
    fields: [
      { name: "scaleLength", label: "Scale Length (inches)", type: "number", min: 20, max: 30, defaultValue: 25.5 },
      { name: "tuning", label: "Tuning", type: "select", options: [{ value: "1", label: "Standard (E)" }, { value: "2", label: "Half Step Down (Eb)" }, { value: "3", label: "Drop D" }, { value: "4", label: "Full Step Down (D)" }, { value: "5", label: "Drop C" }], defaultValue: "1" },
      { name: "playStyle", label: "Playing Style", type: "select", options: [{ value: "1", label: "Light (9-42)" }, { value: "2", label: "Regular (10-46)" }, { value: "3", label: "Medium (11-49)" }, { value: "4", label: "Heavy (12-54)" }], defaultValue: "2" },
      { name: "stringCount", label: "Number of Strings", type: "select", options: [{ value: "6", label: "6 String" }, { value: "7", label: "7 String" }, { value: "8", label: "8 String" }], defaultValue: "6" },
    ],
    calculate: (inputs) => {
    const scaleLength = inputs.scaleLength as number;
    const tuning = inputs.tuning as number;
    const playStyle = inputs.playStyle as number;
    const stringCount = inputs.stringCount as number;
    const gauges = { 1: "9-42", 2: "10-46", 3: "11-49", 4: "12-54" };
    const tensionBase = { 1: 14.5, 2: 17.5, 3: 21, 4: 24.5 };
    const tuningFactor = { 1: 1, 2: 0.94, 3: 0.95, 4: 0.89, 5: 0.84 };
    const tuningLabels = { 1: "Standard E", 2: "Eb Standard", 3: "Drop D", 4: "D Standard", 5: "Drop C" };
    const tension = tensionBase[playStyle] * tuningFactor[tuning] * (scaleLength / 25.5);
    const totalTension = tension * stringCount;
    const gaugeSet = gauges[playStyle];
    const recommendation = tuning >= 4 && playStyle < 3 ? "Consider heavier gauge for lower tunings" : "Good match for this tuning";
    return {
      primary: { label: "Recommended Gauge Set", value: gaugeSet },
      details: [
        { label: "Avg String Tension", value: formatNumber(tension) + " lbs" },
        { label: "Total Neck Tension", value: formatNumber(totalTension) + " lbs" },
        { label: "Tuning", value: tuningLabels[tuning] },
        { label: "Recommendation", value: recommendation }
      ]
    };
  },
  }],
  relatedSlugs: ["drum-tuning-frequency-calculator","instrument-depreciation-calculator","music-key-transposer-calculator"],
  faq: [
    { question: "What guitar string gauge should I use?", answer: "Beginners and players who do lots of bending prefer lighter gauges (9-42). Rhythm players and lower tunings benefit from heavier gauges." },
    { question: "Does scale length affect string tension?", answer: "Yes, longer scale lengths produce higher tension for the same gauge. A 25.5 inch Fender has more tension than a 24.75 inch Gibson." },
    { question: "Should I use heavier strings for drop tuning?", answer: "Yes, heavier strings help maintain tension and prevent buzzing when tuning down." },
  ],
  formula: "String Tension = Base Tension x Tuning Factor x (Scale Length / 25.5)",
};
