import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const standardDeviationCalculator: CalculatorDefinition = {
  slug: "standard-deviation-calculator",
  title: "Standard Deviation Calculator",
  description:
    "Free standard deviation calculator. Calculate mean, variance, and standard deviation for any dataset. Supports population and sample statistics.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["standard deviation calculator", "standard deviation", "variance calculator", "statistics calculator", "mean calculator"],
  variants: [
    {
      id: "dataset",
      name: "Standard Deviation",
      description: "Enter comma-separated numbers (e.g. 5, 10, 15, 20, 25)",
      fields: [
        { name: "data", label: "Data (comma-separated)", type: "number", placeholder: "Enter numbers one at a time" },
        { name: "d2", label: "Value 2", type: "number", placeholder: "optional" },
        { name: "d3", label: "Value 3", type: "number", placeholder: "optional" },
        { name: "d4", label: "Value 4", type: "number", placeholder: "optional" },
        { name: "d5", label: "Value 5", type: "number", placeholder: "optional" },
        { name: "d6", label: "Value 6", type: "number", placeholder: "optional" },
        { name: "d7", label: "Value 7", type: "number", placeholder: "optional" },
        { name: "d8", label: "Value 8", type: "number", placeholder: "optional" },
        { name: "d9", label: "Value 9", type: "number", placeholder: "optional" },
        { name: "d10", label: "Value 10", type: "number", placeholder: "optional" },
      ],
      calculate: (inputs) => {
        const values: number[] = [];
        const keys = ["data", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10"];
        for (const key of keys) {
          const v = inputs[key];
          if (v !== undefined && v !== "" && typeof v === "number") values.push(v);
        }
        if (values.length < 2) return null;

        const n = values.length;
        const mean = values.reduce((a, b) => a + b, 0) / n;
        const squaredDiffs = values.map((v) => (v - mean) ** 2);
        const populationVariance = squaredDiffs.reduce((a, b) => a + b, 0) / n;
        const sampleVariance = squaredDiffs.reduce((a, b) => a + b, 0) / (n - 1);
        const populationSD = Math.sqrt(populationVariance);
        const sampleSD = Math.sqrt(sampleVariance);
        const sorted = [...values].sort((a, b) => a - b);
        const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
        const range = sorted[n - 1] - sorted[0];

        return {
          primary: { label: "Sample Std Dev (s)", value: formatNumber(sampleSD, 4) },
          details: [
            { label: "Population Std Dev (σ)", value: formatNumber(populationSD, 4) },
            { label: "Mean (average)", value: formatNumber(mean, 4) },
            { label: "Median", value: formatNumber(median, 4) },
            { label: "Variance (sample)", value: formatNumber(sampleVariance, 4) },
            { label: "Range", value: formatNumber(range, 4) },
            { label: "Count (n)", value: `${n}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "fraction-calculator"],
  faq: [
    { question: "What is standard deviation?", answer: "Standard deviation measures how spread out numbers are from the mean. A low standard deviation means data points are close to the mean; a high standard deviation means they are spread out over a wider range." },
    { question: "What is the difference between population and sample standard deviation?", answer: "Population SD (σ) divides by N (total count). Sample SD (s) divides by N-1 (Bessel's correction) to account for estimating from a sample. Use sample SD when your data is a subset of a larger population." },
  ],
  formula: "σ = √(Σ(xi - μ)² / N) | s = √(Σ(xi - x̄)² / (n-1))",
};
