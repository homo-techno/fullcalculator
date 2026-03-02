import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const samplingRateCalculator: CalculatorDefinition = {
  slug: "sampling-rate-calculator",
  title: "Sampling Rate Calculator",
  description: "Calculate the minimum Nyquist sampling rate.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["Nyquist rate","sampling frequency calculator"],
  variants: [{
    id: "standard",
    name: "Sampling Rate",
    description: "Calculate the minimum Nyquist sampling rate.",
    fields: [
      { name: "maxFrequency", label: "Max Signal Frequency (Hz)", type: "number", min: 1, max: 100000000000, defaultValue: 20000 },
      { name: "oversampling", label: "Oversampling Factor", type: "number", min: 1, max: 64, defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const fMax = inputs.maxFrequency as number;
      const over = inputs.oversampling as number;
      if (!fMax || !over) return null;
      const nyquist = 2 * fMax;
      const actual = nyquist * over;
      const period = Math.round(1 / actual * 1e12) / 1e6;
      return {
        primary: { label: "Minimum Sampling Rate", value: formatNumber(nyquist) + " Hz" },
        details: [
          { label: "With Oversampling", value: formatNumber(actual) + " Hz" },
          { label: "Sample Period", value: formatNumber(period) + " us" },
          { label: "Oversampling Factor", value: formatNumber(over) + "x" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is the Nyquist theorem?", answer: "It states the sampling rate must be at least twice the maximum frequency." },
    { question: "Why use oversampling?", answer: "Oversampling improves resolution and reduces aliasing artifacts." },
  ],
  formula: "Nyquist Rate = 2 x Maximum Frequency",
};
