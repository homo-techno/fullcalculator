import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const percentageOfNumberCalculator: CalculatorDefinition = {
  slug: "what-percent-of-calculator",
  title: "What Percent Of Calculator",
  description: "Free percentage calculator. What is X% of Y? What percent of Y is X? Solve any percentage problem quickly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["what percent of", "x percent of y", "percentage of a number", "percent of calculator", "calculate percentage"],
  variants: [
    {
      id: "xOfY",
      name: "What is X% of Y?",
      fields: [
        { name: "percent", label: "X (percentage)", type: "number", placeholder: "e.g. 15", suffix: "%" },
        { name: "number", label: "Y (number)", type: "number", placeholder: "e.g. 200" },
      ],
      calculate: (inputs) => {
        const pct = inputs.percent as number;
        const num = inputs.number as number;
        if (pct === undefined || num === undefined) return null;
        const result = num * (pct / 100);
        return {
          primary: { label: `${pct}% of ${num}`, value: formatNumber(result, 4) },
          details: [
            { label: "Calculation", value: `${num} × ${pct}/100 = ${formatNumber(result, 4)}` },
            { label: "Remaining", value: formatNumber(num - result, 4) },
          ],
        };
      },
    },
    {
      id: "whatPercent",
      name: "X is what % of Y?",
      fields: [
        { name: "x", label: "X (part)", type: "number", placeholder: "e.g. 30" },
        { name: "y", label: "Y (whole)", type: "number", placeholder: "e.g. 200" },
      ],
      calculate: (inputs) => {
        const x = inputs.x as number;
        const y = inputs.y as number;
        if (x === undefined || !y) return null;
        const pct = (x / y) * 100;
        return {
          primary: { label: `${x} is what % of ${y}?`, value: `${formatNumber(pct, 4)}%` },
          details: [
            { label: "Fraction", value: `${x}/${y}` },
            { label: "Decimal", value: formatNumber(x / y, 6) },
          ],
        };
      },
    },
    {
      id: "percentOf",
      name: "X is Y% of what?",
      fields: [
        { name: "x", label: "X (result)", type: "number", placeholder: "e.g. 30" },
        { name: "percent", label: "Y (percentage)", type: "number", placeholder: "e.g. 15", suffix: "%" },
      ],
      calculate: (inputs) => {
        const x = inputs.x as number;
        const pct = inputs.percent as number;
        if (x === undefined || !pct) return null;
        const whole = x / (pct / 100);
        return {
          primary: { label: `${x} is ${pct}% of what?`, value: formatNumber(whole, 4) },
          details: [
            { label: "The whole", value: formatNumber(whole, 4) },
            { label: "Verify", value: `${pct}% of ${formatNumber(whole, 4)} = ${formatNumber(whole * pct / 100, 4)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "percentage-change-calculator", "discount-calculator"],
  faq: [
    { question: "How do I find a percentage of a number?", answer: "Multiply the number by the percentage divided by 100. What is 15% of 200? → 200 × (15/100) = 200 × 0.15 = 30." },
  ],
  formula: "X% of Y = Y × X/100 | X is (X/Y × 100)% of Y",
};
