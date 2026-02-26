import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const combinationCalc: CalculatorDefinition = {
  slug: "combination-calculator",
  title: "Combination Calculator",
  description:
    "Free online combination calculator (nCr). Calculate the number of combinations of n items taken r at a time.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "combination calculator",
    "nCr calculator",
    "binomial coefficient",
    "choose calculator",
    "n choose r",
  ],
  variants: [
    {
      id: "nCr",
      name: "Combinations (nCr)",
      description: "Calculate the number of combinations of n items taken r at a time",
      fields: [
        {
          name: "n",
          label: "Total items (n)",
          type: "number",
          placeholder: "e.g. 10",
          min: 0,
          max: 170,
        },
        {
          name: "r",
          label: "Items chosen (r)",
          type: "number",
          placeholder: "e.g. 3",
          min: 0,
          max: 170,
        },
      ],
      calculate: (inputs) => {
        const n = Math.floor(parseFloat(inputs.n as string) || 0);
        const r = Math.floor(parseFloat(inputs.r as string) || 0);
        if (n < 0 || r < 0 || r > n) return null;

        // Calculate nCr = n! / (r! * (n-r)!)
        // Optimized: multiply from (n-r+1) to n, divide by r!
        const rUse = Math.min(r, n - r); // Optimization
        let nCr = 1;
        for (let i = 0; i < rUse; i++) {
          nCr = (nCr * (n - i)) / (i + 1);
        }
        nCr = Math.round(nCr);

        // Permutations for comparison
        let nPr = 1;
        for (let i = n - r + 1; i <= n; i++) {
          nPr *= i;
        }

        const factorial = (num: number): number => {
          let result = 1;
          for (let i = 2; i <= num; i++) result *= i;
          return result;
        };

        return {
          primary: {
            label: `C(${n}, ${r})`,
            value: formatNumber(nCr),
          },
          details: [
            { label: "Formula", value: `C(n, r) = n! / (r! x (n - r)!)` },
            { label: "r!", value: formatNumber(factorial(r)) },
            { label: "(n - r)!", value: formatNumber(factorial(n - r)) },
            { label: "Permutations P(n, r)", value: formatNumber(nPr) },
            { label: "Calculation", value: `${formatNumber(n)}! / (${formatNumber(r)}! x ${formatNumber(n - r)}!) = ${formatNumber(nCr)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["permutation-calculator", "percentage-calculator"],
  faq: [
    {
      question: "What is a combination?",
      answer:
        "A combination is a selection of items where order does not matter. C(n, r) gives the number of ways to choose r items from a set of n items. For example, C(5, 3) = 10.",
    },
    {
      question: "What is a binomial coefficient?",
      answer:
        "The binomial coefficient C(n, r) (also written as 'n choose r') appears in the binomial theorem expansion. It equals n! / (r! x (n-r)!).",
    },
  ],
  formula: "C(n, r) = n! / (r! x (n - r)!)",
};
