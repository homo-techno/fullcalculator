import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const meanMedianModeCalculator: CalculatorDefinition = {
  slug: "mean-median-mode-calculator",
  title: "Mean Median Mode Calculator",
  description:
    "Free mean, median, and mode calculator. Enter a data set and instantly find the mean, median, mode, and range.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "mean calculator",
    "median calculator",
    "mode calculator",
    "average",
    "central tendency",
    "statistics",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate Mean, Median, Mode",
      fields: [
        {
          name: "data",
          label: "Data (comma-separated)",
          type: "text" as "number",
          placeholder: "e.g. 2, 4, 4, 7, 8, 10",
        },
      ],
      calculate: (inputs) => {
        const values = (inputs.data as string || "")
          .split(",")
          .map((s) => parseFloat(s.trim()))
          .filter((n) => !isNaN(n));
        if (values.length === 0) return null;

        // Mean
        const sum = values.reduce((a, b) => a + b, 0);
        const mean = sum / values.length;

        // Median
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        const median =
          sorted.length % 2 === 0
            ? (sorted[mid - 1] + sorted[mid]) / 2
            : sorted[mid];

        // Mode
        const freq: Record<number, number> = {};
        for (const v of values) {
          freq[v] = (freq[v] || 0) + 1;
        }
        const maxFreq = Math.max(...Object.values(freq));
        const modes = Object.keys(freq)
          .filter((k) => freq[Number(k)] === maxFreq)
          .map(Number);
        const modeStr =
          maxFreq === 1 ? "No mode" : modes.map((m) => formatNumber(m)).join(", ");

        // Range
        const range = sorted[sorted.length - 1] - sorted[0];

        return {
          primary: { label: "Mean", value: formatNumber(mean, 4) },
          details: [
            { label: "Median", value: formatNumber(median, 4) },
            { label: "Mode", value: modeStr },
            { label: "Range", value: formatNumber(range, 4) },
            { label: "Count", value: String(values.length) },
            { label: "Sum", value: formatNumber(sum, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "variance-calculator",
    "z-score-calculator",
    "geometric-mean-calculator",
    "harmonic-mean-calculator",
  ],
  faq: [
    {
      question: "What is the difference between mean, median, and mode?",
      answer:
        "The mean is the arithmetic average of a data set. The median is the middle value when the data is sorted. The mode is the value that appears most frequently. Each measure describes the center of a data set in a different way.",
    },
  ],
  formula: "Mean = Σxᵢ / n, Median = middle value, Mode = most frequent value",
};
