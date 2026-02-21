import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const varianceCalculator: CalculatorDefinition = {
  slug: "variance-calculator",
  title: "Variance Calculator",
  description:
    "Free variance calculator. Calculate both population variance (σ²) and sample variance (s²) for a data set.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "variance calculator",
    "population variance",
    "sample variance",
    "standard deviation",
    "statistics",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate Variance",
      fields: [
        {
          name: "data",
          label: "Data (comma-separated)",
          type: "text" as "number",
          placeholder: "e.g. 4, 8, 6, 5, 3",
        },
      ],
      calculate: (inputs) => {
        const values = (inputs.data as string || "")
          .split(",")
          .map((s) => parseFloat(s.trim()))
          .filter((n) => !isNaN(n));
        if (values.length === 0) return null;

        const n = values.length;
        const mean = values.reduce((a, b) => a + b, 0) / n;
        const sumSquaredDiff = values.reduce(
          (acc, v) => acc + (v - mean) ** 2,
          0
        );

        const popVariance = sumSquaredDiff / n;
        const sampleVariance = n > 1 ? sumSquaredDiff / (n - 1) : 0;
        const popStdDev = Math.sqrt(popVariance);
        const sampleStdDev = Math.sqrt(sampleVariance);

        return {
          primary: {
            label: "Population Variance (σ²)",
            value: formatNumber(popVariance, 6),
          },
          details: [
            {
              label: "Sample Variance (s²)",
              value: formatNumber(sampleVariance, 6),
            },
            { label: "Population Std Dev (σ)", value: formatNumber(popStdDev, 6) },
            { label: "Sample Std Dev (s)", value: formatNumber(sampleStdDev, 6) },
            { label: "Mean", value: formatNumber(mean, 6) },
            { label: "Count", value: String(n) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "z-score-calculator",
    "mean-median-mode-calculator",
    "covariance-calculator",
    "confidence-interval-calculator",
  ],
  faq: [
    {
      question: "What is the difference between population and sample variance?",
      answer:
        "Population variance (σ²) divides the sum of squared deviations by N (the entire population size). Sample variance (s²) divides by N-1 (Bessel's correction) to provide an unbiased estimate of the population variance from a sample.",
    },
  ],
  formula: "σ² = Σ(xᵢ - μ)² / N, s² = Σ(xᵢ - x̄)² / (n - 1)",
};
