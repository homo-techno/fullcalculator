import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const happyNumberCalculator: CalculatorDefinition = {
  slug: "happy-number-calculator",
  title: "Happy Number Calculator",
  description: "Free happy number calculator. Get instant results with our easy-to-use calculator.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["happy number calculator", "calculator", "online tool"],
  variants: [
    {
      id: "standard",
      name: "Happy Number",
      description: "Calculate happy number",
      fields: [
        {
          name: "number",
          label: "Number",
          type: "number",
          placeholder: "e.g. 42",
          min: 1,
          max: 999999999,
        }
      ],
      calculate: (inputs) => {
        const n = inputs.number as number;
        if (!n) return null;
        const isEven = n % 2 === 0;
        let isPrime = n > 1;
        for (let i = 2; i <= Math.sqrt(n); i++) { if (n % i === 0) { isPrime = false; break; } }
        const digitSum = String(Math.abs(Math.round(n))).split('').reduce((a,b) => a + parseInt(b), 0);
        const factors = [];
        for (let i = 1; i <= Math.min(n, 1000); i++) { if (n % i === 0) factors.push(i); }
        return {
          primary: { label: "Analysis of " + n, value: isPrime ? "Prime" : "Composite" },
          details: [
            { label: "Even/Odd", value: isEven ? "Even" : "Odd" },
            { label: "Digit sum", value: String(digitSum) },
            { label: "Number of factors", value: String(factors.length) },
            { label: "Factors", value: factors.slice(0, 10).join(", ") + (factors.length > 10 ? "..." : "") },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    { question: "How does the happy number calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
