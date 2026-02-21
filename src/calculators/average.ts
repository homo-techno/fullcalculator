import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const averageCalculator: CalculatorDefinition = {
  slug: "average-calculator",
  title: "Average Calculator",
  description: "Free average calculator. Calculate the mean, median, mode, and range of a set of numbers quickly and easily.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["average calculator", "mean calculator", "find average", "arithmetic mean", "average of numbers"],
  variants: [
    {
      id: "average",
      name: "Average (Mean)",
      description: "Enter up to 10 numbers to find their average, median, mode, and range",
      fields: [
        { name: "v1", label: "Value 1", type: "number", placeholder: "e.g. 85" },
        { name: "v2", label: "Value 2", type: "number", placeholder: "e.g. 90" },
        { name: "v3", label: "Value 3", type: "number", placeholder: "e.g. 78" },
        { name: "v4", label: "Value 4", type: "number", placeholder: "e.g. 92" },
        { name: "v5", label: "Value 5", type: "number", placeholder: "e.g. 88" },
        { name: "v6", label: "Value 6", type: "number", placeholder: "" },
        { name: "v7", label: "Value 7", type: "number", placeholder: "" },
        { name: "v8", label: "Value 8", type: "number", placeholder: "" },
      ],
      calculate: (inputs) => {
        const vals: number[] = [];
        for (let i = 1; i <= 8; i++) {
          const v = inputs[`v${i}`] as number;
          if (v !== undefined && v !== null && String(v) !== "") vals.push(v);
        }
        if (vals.length === 0) return null;
        const sum = vals.reduce((a, b) => a + b, 0);
        const mean = sum / vals.length;
        const sorted = [...vals].sort((a, b) => a - b);
        const median = sorted.length % 2 === 0
          ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
          : sorted[Math.floor(sorted.length / 2)];
        const freq: Record<number, number> = {};
        vals.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
        const maxFreq = Math.max(...Object.values(freq));
        const modes = Object.entries(freq).filter(([, f]) => f === maxFreq && f > 1).map(([v]) => v);
        return {
          primary: { label: "Average (Mean)", value: formatNumber(mean, 4) },
          details: [
            { label: "Sum", value: formatNumber(sum) },
            { label: "Count", value: `${vals.length}` },
            { label: "Median", value: formatNumber(median, 4) },
            { label: "Mode", value: modes.length > 0 ? modes.join(", ") : "No mode" },
            { label: "Range", value: formatNumber(sorted[sorted.length - 1] - sorted[0]) },
            { label: "Min", value: formatNumber(sorted[0]) },
            { label: "Max", value: formatNumber(sorted[sorted.length - 1]) },
          ],
        };
      },
    },
    {
      id: "weighted",
      name: "Weighted Average",
      description: "Calculate weighted average with up to 5 value-weight pairs",
      fields: [
        { name: "v1", label: "Value 1", type: "number", placeholder: "e.g. 90" },
        { name: "w1", label: "Weight 1", type: "number", placeholder: "e.g. 3" },
        { name: "v2", label: "Value 2", type: "number", placeholder: "e.g. 80" },
        { name: "w2", label: "Weight 2", type: "number", placeholder: "e.g. 2" },
        { name: "v3", label: "Value 3", type: "number", placeholder: "e.g. 70" },
        { name: "w3", label: "Weight 3", type: "number", placeholder: "e.g. 1" },
      ],
      calculate: (inputs) => {
        let weightedSum = 0, totalWeight = 0;
        for (let i = 1; i <= 3; i++) {
          const v = inputs[`v${i}`] as number;
          const w = inputs[`w${i}`] as number;
          if (v !== undefined && w !== undefined && w > 0) {
            weightedSum += v * w;
            totalWeight += w;
          }
        }
        if (totalWeight === 0) return null;
        return {
          primary: { label: "Weighted Average", value: formatNumber(weightedSum / totalWeight, 4) },
          details: [
            { label: "Weighted sum", value: formatNumber(weightedSum) },
            { label: "Total weight", value: formatNumber(totalWeight) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "standard-deviation-calculator", "grade-calculator"],
  faq: [
    { question: "What is the difference between mean, median, and mode?", answer: "Mean is the arithmetic average (sum ÷ count). Median is the middle value when sorted. Mode is the most frequent value. For {1,2,2,3,10}: mean=3.6, median=2, mode=2." },
  ],
  formula: "Mean = Σx / n | Weighted Mean = Σ(x×w) / Σw",
};
