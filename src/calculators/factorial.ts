import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const factorialCalculator: CalculatorDefinition = {
  slug: "factorial-calculator",
  title: "Factorial Calculator",
  description: "Free factorial calculator. Calculate n! (n factorial), double factorial, and subfactorial for any positive integer.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["factorial calculator", "n factorial", "factorial of a number", "permutation factorial", "factorial formula"],
  variants: [
    {
      id: "factorial",
      name: "Factorial (n!)",
      description: "Calculate n! = n × (n-1) × ... × 2 × 1",
      fields: [
        { name: "n", label: "Number (n)", type: "number", placeholder: "e.g. 10", min: 0, max: 170 },
      ],
      calculate: (inputs) => {
        const n = inputs.n as number;
        if (n === undefined || n < 0 || n > 170) return null;
        const ni = Math.floor(n);
        let result = 1;
        for (let i = 2; i <= ni; i++) result *= i;
        const digits = ni <= 1 ? 1 : Math.ceil(ni * Math.log10(ni) - ni * Math.log10(Math.E) + 0.5 * Math.log10(2 * Math.PI * ni));
        return {
          primary: { label: `${ni}!`, value: ni <= 20 ? formatNumber(result, 0) : result.toExponential(6) },
          details: [
            { label: "Number of digits", value: `${digits}` },
            { label: "Scientific notation", value: result.toExponential(6) },
            ...(ni <= 12 ? [{ label: "Expansion", value: Array.from({ length: ni }, (_, i) => ni - i).join(" × ") || "1" }] : []),
          ],
        };
      },
    },
  ],
  relatedSlugs: ["probability-calculator", "scientific-calculator", "lcm-gcd-calculator"],
  faq: [
    { question: "What is a factorial?", answer: "n! (n factorial) is the product of all positive integers up to n. 5! = 5×4×3×2×1 = 120. By convention, 0! = 1." },
    { question: "Where are factorials used?", answer: "Factorials appear in permutations (nPr = n!/(n-r)!), combinations (nCr = n!/(r!(n-r)!)), probability, Taylor series, and many areas of mathematics." },
  ],
  formula: "n! = n × (n-1) × (n-2) × ... × 2 × 1 | 0! = 1",
};
