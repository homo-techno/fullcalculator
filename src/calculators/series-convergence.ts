import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const seriesConvergenceCalculator: CalculatorDefinition = {
  slug: "series-convergence-calculator",
  title: "Series Calculator",
  description:
    "Free series calculator. Compute partial sums of geometric series and determine convergence.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "series calculator",
    "geometric series",
    "convergence",
    "partial sum",
    "infinite series",
  ],
  variants: [
    {
      id: "geometric",
      name: "Geometric Series",
      fields: [
        {
          name: "a",
          label: "First term (a)",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "r",
          label: "Common ratio (r)",
          type: "number",
          placeholder: "e.g. 0.5",
        },
        {
          name: "n",
          label: "Number of terms (n)",
          type: "number",
          placeholder: "e.g. 10",
        },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const r = inputs.r as number;
        const n = inputs.n as number;
        if (a === undefined || r === undefined || !n) return null;
        if (!Number.isInteger(n) || n <= 0) return null;

        // Partial sum: S_n = a(1-r^n)/(1-r) when r≠1, else S_n = a*n
        let partialSum: number;
        if (r === 1) {
          partialSum = a * n;
        } else {
          partialSum = a * (1 - Math.pow(r, n)) / (1 - r);
        }

        const converges = Math.abs(r) < 1;
        const infiniteSum = converges ? a / (1 - r) : NaN;

        const details = [
          { label: "First term (a)", value: formatNumber(a) },
          { label: "Ratio (r)", value: formatNumber(r) },
          { label: "Terms (n)", value: String(n) },
          { label: "Converges", value: converges ? "Yes (|r| < 1)" : "No (|r| ≥ 1)" },
        ];

        if (converges) {
          details.push({
            label: "Infinite sum S∞",
            value: formatNumber(infiniteSum, 6),
          });
        }

        return {
          primary: {
            label: `Partial Sum S${n}`,
            value: formatNumber(partialSum, 6),
          },
          details,
        };
      },
    },
  ],
  relatedSlugs: [
    "summation-calculator",
    "interpolation-calculator",
    "geometric-mean-calculator",
  ],
  faq: [
    {
      question: "When does a geometric series converge?",
      answer:
        "A geometric series converges if and only if the absolute value of the common ratio is less than 1 (|r| < 1). When it converges, the infinite sum equals a/(1-r), where a is the first term and r is the common ratio.",
    },
  ],
  formula: "Sₙ = a(1 - rⁿ)/(1 - r); S∞ = a/(1 - r) if |r| < 1",
};
