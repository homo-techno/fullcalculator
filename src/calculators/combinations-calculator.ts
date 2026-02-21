import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function combination(n: number, r: number): number {
  if (r > n || r < 0) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

function permutation(n: number, r: number): number {
  if (r > n || r < 0) return 0;
  return factorial(n) / factorial(n - r);
}

export const combinationsCalculator: CalculatorDefinition = {
  slug: "combinations-calculator",
  title: "Combinations Calculator",
  description: "Free combinations (nCr) calculator. Calculate combinations, permutations, and compare the two with step-by-step factorial breakdowns.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["combinations calculator", "nCr calculator", "n choose r", "combination formula", "how many combinations"],
  variants: [
    {
      id: "ncr",
      name: "Combinations (nCr)",
      description: "How many ways to choose r items from n (order doesn't matter)",
      fields: [
        { name: "n", label: "Total items (n)", type: "number", placeholder: "e.g. 10", min: 0, max: 25 },
        { name: "r", label: "Items to choose (r)", type: "number", placeholder: "e.g. 3", min: 0, max: 25 },
      ],
      calculate: (inputs) => {
        const n = inputs.n as number;
        const r = inputs.r as number;
        if (n === undefined || r === undefined || r > n || n < 0 || r < 0) return null;

        const result = combination(n, r);
        const perm = permutation(n, r);

        return {
          primary: { label: `C(${n}, ${r})`, value: formatNumber(result, 0) },
          details: [
            { label: "Formula", value: `${n}! / (${r}! × ${n - r}!)` },
            { label: `${n}!`, value: formatNumber(factorial(n), 0) },
            { label: `${r}!`, value: formatNumber(factorial(r), 0) },
            { label: `${n - r}!`, value: formatNumber(factorial(n - r), 0) },
            { label: `Permutations P(${n},${r})`, value: formatNumber(perm, 0) },
            { label: "Combinations vs Permutations", value: `${formatNumber(result, 0)} vs ${formatNumber(perm, 0)}` },
          ],
        };
      },
    },
    {
      id: "npr",
      name: "Permutations (nPr)",
      description: "How many ways to arrange r items from n (order matters)",
      fields: [
        { name: "n", label: "Total items (n)", type: "number", placeholder: "e.g. 10", min: 0, max: 25 },
        { name: "r", label: "Items to arrange (r)", type: "number", placeholder: "e.g. 3", min: 0, max: 25 },
      ],
      calculate: (inputs) => {
        const n = inputs.n as number;
        const r = inputs.r as number;
        if (n === undefined || r === undefined || r > n || n < 0 || r < 0) return null;

        const result = permutation(n, r);
        const comb = combination(n, r);

        return {
          primary: { label: `P(${n}, ${r})`, value: formatNumber(result, 0) },
          details: [
            { label: "Formula", value: `${n}! / ${n - r}!` },
            { label: `${n}!`, value: formatNumber(factorial(n), 0) },
            { label: `${n - r}!`, value: formatNumber(factorial(n - r), 0) },
            { label: `Combinations C(${n},${r})`, value: formatNumber(comb, 0) },
            { label: "Ratio P/C", value: `${formatNumber(factorial(r), 0)} (= ${r}!)` },
          ],
        };
      },
    },
    {
      id: "multiset",
      name: "Combinations with Repetition",
      description: "Choose r items from n types with repetition allowed",
      fields: [
        { name: "n", label: "Types available (n)", type: "number", placeholder: "e.g. 5", min: 1, max: 20 },
        { name: "r", label: "Items to choose (r)", type: "number", placeholder: "e.g. 3", min: 0, max: 20 },
      ],
      calculate: (inputs) => {
        const n = inputs.n as number;
        const r = inputs.r as number;
        if (n === undefined || r === undefined || n < 1 || r < 0) return null;

        const result = combination(n + r - 1, r);

        return {
          primary: { label: `Multiset C(${n}+${r}-1, ${r})`, value: formatNumber(result, 0) },
          details: [
            { label: "Formula", value: `C(n+r-1, r) = C(${n + r - 1}, ${r})` },
            { label: "With repetition", value: formatNumber(result, 0) },
            { label: "Without repetition", value: r <= n ? formatNumber(combination(n, r), 0) : "N/A (r > n)" },
            { label: "Example", value: `Choosing ${r} items from ${n} types, repetition allowed` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["probability-calculator", "permutation-calculator", "binomial-coefficient-calculator"],
  faq: [
    { question: "What is the difference between combinations and permutations?", answer: "Combinations: order doesn't matter (choosing a committee of 3 from 10 people). Permutations: order matters (assigning 1st, 2nd, 3rd place). C(n,r) = n!/(r!(n-r)!) while P(n,r) = n!/(n-r)!. P(n,r) = C(n,r) × r!." },
    { question: "What does 'n choose r' mean?", answer: "'n choose r' or C(n,r) counts the number of ways to select r items from n distinct items without regard to order. For example, C(5,2) = 10 means there are 10 ways to choose 2 items from 5." },
  ],
  formula: "C(n,r) = n! / (r!(n-r)!) | P(n,r) = n! / (n-r)! | Multiset: C(n+r-1, r)",
};
