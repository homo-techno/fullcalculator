import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const geometricMeanCalculator: CalculatorDefinition = {
  slug: "geometric-mean-calculator",
  title: "Geometric Mean Calculator",
  description:
    "Free geometric mean calculator. Calculate the geometric mean of a set of positive numbers.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "geometric mean",
    "average",
    "growth rate",
    "multiplicative mean",
    "statistics",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate Geometric Mean",
      fields: [
        {
          name: "data",
          label: "Values (comma-separated)",
          type: "text" as "number",
          placeholder: "e.g. 2, 8, 4, 16",
        },
      ],
      calculate: (inputs) => {
        const values = (inputs.data as string || "")
          .split(",")
          .map((s) => parseFloat(s.trim()))
          .filter((n) => !isNaN(n));
        if (values.length === 0) return null;
        if (values.some((v) => v <= 0)) return null;

        // Use log method to avoid overflow: GM = exp((1/n) * Σln(xi))
        const n = values.length;
        const sumLog = values.reduce((acc, v) => acc + Math.log(v), 0);
        const gm = Math.exp(sumLog / n);

        // Arithmetic mean for comparison
        const am = values.reduce((a, b) => a + b, 0) / n;

        return {
          primary: { label: "Geometric Mean", value: formatNumber(gm, 6) },
          details: [
            { label: "Arithmetic Mean", value: formatNumber(am, 6) },
            { label: "Count", value: String(n) },
            { label: "Product", value: formatNumber(values.reduce((a, b) => a * b, 1), 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "harmonic-mean-calculator",
    "mean-median-mode-calculator",
    "weighted-average-calculator",
  ],
  faq: [
    {
      question: "When should I use the geometric mean?",
      answer:
        "The geometric mean is ideal for data that is multiplicative in nature, such as growth rates, interest rates, and ratios. It is always less than or equal to the arithmetic mean for positive numbers.",
    },
  ],
  formula: "GM = (x₁ × x₂ × ... × xₙ)^(1/n)",
};
