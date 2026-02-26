import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const permutationCalc: CalculatorDefinition = {
  slug: "permutation-calculator",
  title: "Permutation Calculator",
  description:
    "Free online permutation calculator (nPr). Calculate the number of permutations of n items taken r at a time.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "permutation calculator",
    "nPr calculator",
    "arrangements",
    "ordered combinations",
    "permutation formula",
  ],
  variants: [
    {
      id: "nPr",
      name: "Permutations (nPr)",
      description: "Calculate the number of permutations of n items taken r at a time",
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

        // Calculate n! / (n-r)!
        const factorial = (num: number): number => {
          if (num <= 1) return 1;
          let result = 1;
          for (let i = 2; i <= num; i++) {
            result *= i;
          }
          return result;
        };

        // More efficient: multiply from (n-r+1) to n
        let nPr = 1;
        for (let i = n - r + 1; i <= n; i++) {
          nPr *= i;
        }

        const nFactorial = factorial(n);
        const nMinusRFactorial = factorial(n - r);

        return {
          primary: {
            label: `P(${n}, ${r})`,
            value: formatNumber(nPr),
          },
          details: [
            { label: "Formula", value: `P(n, r) = n! / (n - r)!` },
            { label: "n!", value: formatNumber(nFactorial) },
            { label: "(n - r)!", value: formatNumber(nMinusRFactorial) },
            { label: "Calculation", value: `${formatNumber(n)}! / ${formatNumber(n - r)}! = ${formatNumber(nPr)}` },
          ],
        };
      },
    },
    {
      id: "factorial",
      name: "Factorial (n!)",
      description: "Calculate the factorial of a number",
      fields: [
        {
          name: "n",
          label: "Number (n)",
          type: "number",
          placeholder: "e.g. 10",
          min: 0,
          max: 170,
        },
      ],
      calculate: (inputs) => {
        const n = Math.floor(parseFloat(inputs.n as string) || 0);
        if (n < 0) return null;

        let result = 1;
        for (let i = 2; i <= n; i++) {
          result *= i;
        }

        return {
          primary: {
            label: `${n}!`,
            value: formatNumber(result),
          },
          details: [
            { label: "Expression", value: n <= 10 ? Array.from({ length: n }, (_, i) => n - i).join(" x ") : `${n} x ${n - 1} x ... x 2 x 1` },
            { label: "Number of digits", value: formatNumber(result.toString().length) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["combination-calculator", "percentage-calculator"],
  faq: [
    {
      question: "What is a permutation?",
      answer:
        "A permutation is an arrangement of items where order matters. P(n, r) gives the number of ways to arrange r items from a set of n distinct items. For example, P(5, 3) = 60.",
    },
    {
      question: "What is the difference between permutations and combinations?",
      answer:
        "In permutations, order matters (ABC is different from BCA). In combinations, order does not matter (ABC is the same as BCA). Permutations always give a larger or equal result than combinations.",
    },
  ],
  formula: "P(n, r) = n! / (n - r)!",
};
