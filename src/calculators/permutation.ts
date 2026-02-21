import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

export const permutationCalculator: CalculatorDefinition = {
  slug: "permutation-calculator",
  title: "Permutation Calculator",
  description: "Free permutation calculator. Calculate nPr — the number of ways to arrange r items from n items where order matters.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["permutation calculator", "nPr calculator", "arrangement calculator", "order matters", "permutation formula"],
  variants: [
    {
      id: "npr",
      name: "Permutation (nPr)",
      description: "How many ways to arrange r items from n items (order matters)",
      fields: [
        { name: "n", label: "Total Items (n)", type: "number", placeholder: "e.g. 10", min: 0, max: 20 },
        { name: "r", label: "Items to Arrange (r)", type: "number", placeholder: "e.g. 3", min: 0, max: 20 },
      ],
      calculate: (inputs) => {
        const n = inputs.n as number;
        const r = inputs.r as number;
        if (n === undefined || r === undefined || r > n || n < 0 || r < 0) return null;
        const nPr = factorial(n) / factorial(n - r);
        const nCr = factorial(n) / (factorial(r) * factorial(n - r));
        return {
          primary: { label: `P(${n},${r})`, value: formatNumber(nPr, 0) },
          details: [
            { label: "Permutations (nPr)", value: formatNumber(nPr, 0) },
            { label: "Combinations (nCr)", value: formatNumber(nCr, 0) },
            { label: "Formula", value: `${n}! / ${n - r}!` },
            { label: "n!", value: formatNumber(factorial(n), 0) },
            { label: "(n-r)!", value: formatNumber(factorial(n - r), 0) },
            { label: "Ratio nPr/nCr", value: formatNumber(factorial(r), 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["probability-calculator", "factorial-calculator", "scientific-calculator"],
  faq: [
    { question: "What is a permutation?", answer: "A permutation is an ordered arrangement. P(n,r) = n!/(n-r)! counts how many ways to arrange r items from n. Example: How many 3-letter 'words' from ABCDE? P(5,3) = 60." },
    { question: "Permutation vs combination?", answer: "Permutation: order matters (ABC ≠ BAC). Combination: order doesn't matter (ABC = BAC). nPr = nCr × r!. Permutations are always ≥ combinations." },
  ],
  formula: "nPr = n! / (n-r)! | nCr = nPr / r!",
};
