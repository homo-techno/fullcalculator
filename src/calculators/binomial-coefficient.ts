import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const binomialCoefficientCalculator: CalculatorDefinition = {
  slug: "binomial-coefficient-calculator",
  title: "Binomial Coefficient Calculator",
  description:
    "Free binomial coefficient calculator. Calculate C(n, k) = n! / (k!(n-k)!) and explore Pascal's triangle.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "binomial coefficient",
    "combinations",
    "C(n,k)",
    "n choose k",
    "Pascal's triangle",
    "combinatorics",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate C(n, k)",
      fields: [
        { name: "n", label: "n (total items)", type: "number", placeholder: "e.g. 10" },
        { name: "k", label: "k (items chosen)", type: "number", placeholder: "e.g. 3" },
      ],
      calculate: (inputs) => {
        const n = inputs.n as number;
        const k = inputs.k as number;
        if (n === undefined || k === undefined) return null;
        if (n < 0 || k < 0 || k > n) return null;
        if (!Number.isInteger(n) || !Number.isInteger(k)) return null;

        // Calculate C(n, k) using multiplicative formula to avoid overflow
        let result = 1;
        const kUse = Math.min(k, n - k);
        for (let i = 0; i < kUse; i++) {
          result = (result * (n - i)) / (i + 1);
        }
        result = Math.round(result);

        // Pascal's triangle row for n
        const row: number[] = [1];
        for (let i = 1; i <= n; i++) {
          row.push(Math.round((row[i - 1] * (n - i + 1)) / i));
        }
        const pascalRow = row.length <= 12 ? row.join(", ") : row.slice(0, 12).join(", ") + "...";

        return {
          primary: { label: `C(${n}, ${k})`, value: formatNumber(result) },
          details: [
            { label: "n", value: String(n) },
            { label: "k", value: String(k) },
            { label: `Pascal's row ${n}`, value: pascalRow },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "polynomial-calculator",
    "sample-size-calculator",
    "summation-calculator",
  ],
  faq: [
    {
      question: "What is the binomial coefficient?",
      answer:
        'The binomial coefficient C(n, k), often read as "n choose k," counts the number of ways to choose k items from n items without regard to order. It equals n! / (k!(n-k)!).',
    },
  ],
  formula: "C(n, k) = n! / (k! × (n - k)!)",
};
