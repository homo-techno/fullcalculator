import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const combinationPermutationCalculator: CalculatorDefinition = {
  slug: "combination-permutation-calculator",
  title: "Combination and Permutation Calculator",
  description: "Calculate combinations (nCr) and permutations (nPr) for a given n and r.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["combination calculator", "permutation calculator", "nCr nPr calculator"],
  variants: [{
    id: "standard",
    name: "Combination and Permutation",
    description: "Calculate combinations (nCr) and permutations (nPr) for a given n and r",
    fields: [
      { name: "n", label: "Total Items (n)", type: "number", suffix: "", min: 0, max: 170, defaultValue: 10 },
      { name: "r", label: "Items Chosen (r)", type: "number", suffix: "", min: 0, max: 170, defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const n = inputs.n as number;
      const r = inputs.r as number;
      if (n === undefined || r === undefined || n < 0 || r < 0 || r > n) return null;
      const factorial = (x: number): number => { let f = 1; for (let i = 2; i <= x; i++) f *= i; return f; };
      const perm = factorial(n) / factorial(n - r);
      const comb = perm / factorial(r);
      const nFact = factorial(n);
      return {
        primary: { label: "Combinations C(" + n + "," + r + ")", value: formatNumber(comb) },
        details: [
          { label: "Permutations P(" + n + "," + r + ")", value: formatNumber(perm) },
          { label: "n!", value: formatNumber(nFact) },
          { label: "Ratio C/P", value: formatNumber(Math.round(comb / (perm || 1) * 10000) / 10000) },
        ],
      };
    },
  }],
  relatedSlugs: ["prime-factorization-calculator", "fibonacci-calculator"],
  faq: [
    { question: "What is the difference between combinations and permutations?", answer: "Permutations count ordered arrangements (order matters), while combinations count unordered selections (order does not matter). P(n,r) = n!/(n-r)! and C(n,r) = n!/(r!(n-r)!)." },
    { question: "When do I use combinations versus permutations?", answer: "Use permutations when the order of selection matters (like rankings or codes). Use combinations when order does not matter (like choosing team members or lottery numbers)." },
  ],
  formula: "C(n,r) = n! / (r! x (n-r)!); P(n,r) = n! / (n-r)!",
};
