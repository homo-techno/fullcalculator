import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const harmonicMeanCalculator: CalculatorDefinition = {
  slug: "harmonic-mean-calculator",
  title: "Harmonic Mean Calculator",
  description:
    "Free harmonic mean calculator. Calculate the harmonic mean of a set of positive numbers, useful for rates and ratios.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "harmonic mean",
    "average speed",
    "rates",
    "reciprocal mean",
    "statistics",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate Harmonic Mean",
      fields: [
        {
          name: "data",
          label: "Values (comma-separated)",
          type: "text" as "number",
          placeholder: "e.g. 40, 60",
        },
      ],
      calculate: (inputs) => {
        const values = (inputs.data as string || "")
          .split(",")
          .map((s) => parseFloat(s.trim()))
          .filter((n) => !isNaN(n));
        if (values.length === 0) return null;
        if (values.some((v) => v <= 0)) return null;

        const n = values.length;
        const sumReciprocals = values.reduce((acc, v) => acc + 1 / v, 0);
        const hm = n / sumReciprocals;

        // Arithmetic and geometric means for comparison
        const am = values.reduce((a, b) => a + b, 0) / n;
        const gm = Math.exp(
          values.reduce((acc, v) => acc + Math.log(v), 0) / n
        );

        return {
          primary: { label: "Harmonic Mean", value: formatNumber(hm, 6) },
          details: [
            { label: "Arithmetic Mean", value: formatNumber(am, 6) },
            { label: "Geometric Mean", value: formatNumber(gm, 6) },
            { label: "Count", value: String(n) },
            { label: "Sum of reciprocals", value: formatNumber(sumReciprocals, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "geometric-mean-calculator",
    "mean-median-mode-calculator",
    "weighted-average-calculator",
  ],
  faq: [
    {
      question: "When should I use the harmonic mean?",
      answer:
        "The harmonic mean is best for averaging rates or ratios. For example, if you drive 40 mph going and 60 mph returning over the same distance, your average speed is the harmonic mean: 2/(1/40 + 1/60) = 48 mph, not the arithmetic mean of 50.",
    },
  ],
  formula: "H = n / (1/x₁ + 1/x₂ + ... + 1/xₙ)",
};
