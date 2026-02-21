import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function combination(n: number, r: number): number {
  if (r > n) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

export const probabilityCalculator: CalculatorDefinition = {
  slug: "probability-calculator",
  title: "Probability Calculator",
  description: "Free probability calculator. Calculate probability of events, combinations, permutations, and coin flip odds.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["probability calculator", "odds calculator", "combination calculator", "permutation calculator", "coin flip probability"],
  variants: [
    {
      id: "single",
      name: "Event Probability",
      description: "Calculate probability from favorable and total outcomes",
      fields: [
        { name: "favorable", label: "Favorable Outcomes", type: "number", placeholder: "e.g. 3" },
        { name: "total", label: "Total Outcomes", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const f = inputs.favorable as number;
        const t = inputs.total as number;
        if (!f || !t || f > t) return null;
        const p = f / t;
        const odds = f / (t - f);
        return {
          primary: { label: "Probability", value: formatNumber(p * 100), suffix: "%" },
          details: [
            { label: "As fraction", value: `${f}/${t}` },
            { label: "As decimal", value: formatNumber(p, 4) },
            { label: "Odds (for:against)", value: `${f}:${t - f}` },
          ],
        };
      },
    },
    {
      id: "combinations",
      name: "Combinations (nCr)",
      description: "How many ways to choose r items from n items (order doesn't matter)",
      fields: [
        { name: "n", label: "Total Items (n)", type: "number", placeholder: "e.g. 10", min: 0, max: 20 },
        { name: "r", label: "Items to Choose (r)", type: "number", placeholder: "e.g. 3", min: 0, max: 20 },
      ],
      calculate: (inputs) => {
        const n = inputs.n as number;
        const r = inputs.r as number;
        if (n === undefined || r === undefined || r > n) return null;
        const result = combination(n, r);
        const permutations = factorial(n) / factorial(n - r);
        return {
          primary: { label: "Combinations", value: formatNumber(result, 0) },
          details: [
            { label: "Permutations (nPr)", value: formatNumber(permutations, 0) },
            { label: "Formula", value: `${n}! / (${r}! x ${n - r}!)` },
          ],
        };
      },
    },
    {
      id: "coins",
      name: "Coin Flip Probability",
      description: "Probability of getting exactly X heads in N coin flips",
      fields: [
        { name: "flips", label: "Number of Flips", type: "number", placeholder: "e.g. 10", min: 1, max: 20 },
        { name: "heads", label: "Desired Heads", type: "number", placeholder: "e.g. 7", min: 0, max: 20 },
      ],
      calculate: (inputs) => {
        const n = inputs.flips as number;
        const k = inputs.heads as number;
        if (!n || k === undefined || k > n) return null;
        const p = combination(n, k) * Math.pow(0.5, n);
        let pAtLeast = 0;
        for (let i = k; i <= n; i++) pAtLeast += combination(n, i) * Math.pow(0.5, n);
        return {
          primary: { label: `Exactly ${k} heads in ${n} flips`, value: formatNumber(p * 100, 2), suffix: "%" },
          details: [
            { label: `At least ${k} heads`, value: `${formatNumber(pAtLeast * 100, 2)}%` },
            { label: `Less than ${k} heads`, value: `${formatNumber((1 - pAtLeast) * 100, 2)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "random-number-generator", "standard-deviation-calculator"],
  faq: [
    { question: "How do I calculate probability?", answer: "Probability = Favorable outcomes / Total outcomes. For example, rolling a 6 on a die: 1 favorable / 6 total = 16.67%." },
    { question: "What is the difference between combinations and permutations?", answer: "Combinations: order doesn't matter (choosing a committee). Permutations: order matters (ranking contestants). nPr >= nCr." },
  ],
  formula: "P = Favorable / Total | nCr = n! / (r!(n-r)!) | nPr = n! / (n-r)!",
};
