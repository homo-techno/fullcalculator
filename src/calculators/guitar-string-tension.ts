import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const guitarStringTensionCalculator: CalculatorDefinition = {
  slug: "guitar-string-tension-calculator",
  title: "Guitar String Tension Calculator",
  description: "Free online guitar string tension calculator. Calculate string tension in pounds based on scale length, tuning, and string gauge.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["guitar string tension calculator", "string tension calculator", "guitar gauge calculator", "string gauge tension", "guitar setup calculator"],
  variants: [
    {
      id: "single-string",
      name: "Single String Tension",
      description: "Calculate tension for a single guitar string",
      fields: [
        { name: "scaleLength", label: "Scale Length (inches)", type: "select", options: [
          { label: "24.75\" (Gibson)", value: "24.75" },
          { label: "25.5\" (Fender)", value: "25.5" },
          { label: "26.5\" (Baritone)", value: "26.5" },
          { label: "27\" (Baritone)", value: "27" },
          { label: "30\" (Bass short)", value: "30" },
          { label: "34\" (Bass standard)", value: "34" },
        ], defaultValue: "25.5" },
        { name: "gauge", label: "String Gauge (inches)", type: "number", placeholder: "e.g. 0.010" },
        { name: "frequency", label: "Target Frequency (Hz)", type: "number", placeholder: "e.g. 329.63" },
        { name: "unitWeight", label: "Unit Weight (lb/in)", type: "number", placeholder: "e.g. 0.00002215" },
      ],
      calculate: (inputs) => {
        const scaleLength = parseFloat(inputs.scaleLength as string) || 25.5;
        const gauge = parseFloat(inputs.gauge as string) || 0;
        const frequency = parseFloat(inputs.frequency as string) || 0;
        const unitWeight = parseFloat(inputs.unitWeight as string) || 0;
        if (!gauge || !frequency) return null;

        const uw = unitWeight > 0 ? unitWeight : gauge * gauge * Math.PI * 0.00001036;
        const tension = (uw * Math.pow(2 * scaleLength * frequency, 2)) / 386.4;

        return {
          primary: { label: "String Tension", value: `${formatNumber(tension, 2)} lbs` },
          details: [
            { label: "Tension (kg)", value: formatNumber(tension * 0.4536, 2) },
            { label: "Scale length", value: `${scaleLength}"` },
            { label: "String gauge", value: `${gauge}"` },
            { label: "Frequency", value: `${formatNumber(frequency, 2)} Hz` },
            { label: "Unit weight", value: formatNumber(uw, 8) },
          ],
          note: "Unit weight varies by string material (plain steel, nickel wound, phosphor bronze). Check manufacturer specs for exact values.",
        };
      },
    },
    {
      id: "set-tension",
      name: "Standard Set Tension",
      description: "Estimate total tension for common string gauge sets",
      fields: [
        { name: "scaleLength", label: "Scale Length (inches)", type: "select", options: [
          { label: "24.75\" (Gibson)", value: "24.75" },
          { label: "25.5\" (Fender)", value: "25.5" },
          { label: "26.5\" (Baritone)", value: "26.5" },
        ], defaultValue: "25.5" },
        { name: "stringSet", label: "String Set", type: "select", options: [
          { label: "Extra Light (09-42)", value: "9" },
          { label: "Light (10-46)", value: "10" },
          { label: "Medium (11-50)", value: "11" },
          { label: "Heavy (12-54)", value: "12" },
          { label: "Extra Heavy (13-56)", value: "13" },
        ], defaultValue: "10" },
      ],
      calculate: (inputs) => {
        const scaleLength = parseFloat(inputs.scaleLength as string) || 25.5;
        const setGauge = parseFloat(inputs.stringSet as string) || 10;

        const sets: Record<string, { gauges: number[]; freqs: number[] }> = {
          "9": { gauges: [0.009, 0.011, 0.016, 0.024, 0.032, 0.042], freqs: [329.63, 246.94, 196.00, 146.83, 110.00, 82.41] },
          "10": { gauges: [0.010, 0.013, 0.017, 0.026, 0.036, 0.046], freqs: [329.63, 246.94, 196.00, 146.83, 110.00, 82.41] },
          "11": { gauges: [0.011, 0.015, 0.018, 0.026, 0.036, 0.050], freqs: [329.63, 246.94, 196.00, 146.83, 110.00, 82.41] },
          "12": { gauges: [0.012, 0.016, 0.024, 0.032, 0.042, 0.054], freqs: [329.63, 246.94, 196.00, 146.83, 110.00, 82.41] },
          "13": { gauges: [0.013, 0.017, 0.026, 0.036, 0.046, 0.056], freqs: [329.63, 246.94, 196.00, 146.83, 110.00, 82.41] },
        };

        const set = sets[String(setGauge)];
        if (!set) return null;

        const tensions = set.gauges.map((g, i) => {
          const uw = g * g * Math.PI * 0.00001036;
          return (uw * Math.pow(2 * scaleLength * set.freqs[i], 2)) / 386.4;
        });
        const totalTension = tensions.reduce((a, b) => a + b, 0);
        const stringNames = ["E4 (1st)", "B3 (2nd)", "G3 (3rd)", "D3 (4th)", "A2 (5th)", "E2 (6th)"];

        return {
          primary: { label: "Total Set Tension", value: `${formatNumber(totalTension, 1)} lbs` },
          details: tensions.map((t, i) => ({
            label: `${stringNames[i]} (${set.gauges[i]}")`,
            value: `${formatNumber(t, 1)} lbs`,
          })),
          note: "Wound strings have different unit weights than plain steel. These estimates use plain steel values as approximation.",
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "force-calculator"],
  faq: [
    { question: "What string tension is ideal?", answer: "Most guitarists prefer total tension between 80-120 lbs for 6-string guitars. Lower tension (lighter gauges) is easier to bend and play, while higher tension gives more volume and sustain." },
    { question: "How does scale length affect tension?", answer: "Longer scale lengths increase string tension for the same gauge and tuning. A 25.5\" scale guitar has about 3% more tension than a 24.75\" scale at the same gauge and tuning." },
    { question: "What gauge should I use for drop tuning?", answer: "For drop D, go up one gauge set (e.g., 10s to 11s). For drop C or lower, consider 12-56 or heavier. Heavier gauges maintain playable tension at lower tunings." },
  ],
  formula: "Tension (lbs) = (UnitWeight × (2 × ScaleLength × Frequency)²) / 386.4",
};
