import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const absoluteValueCalculator: CalculatorDefinition = {
  slug: "absolute-value-calculator",
  title: "Absolute Value Calculator",
  description: "Free absolute value calculator. Calculate the absolute value, distance between numbers, and solve absolute value equations.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["absolute value calculator", "absolute value", "distance between numbers", "modulus calculator"],
  variants: [
    {
      id: "abs",
      name: "Absolute Value",
      fields: [
        { name: "num", label: "Number", type: "number", placeholder: "e.g. -15.7" },
      ],
      calculate: (inputs) => {
        const n = inputs.num as number;
        if (n === undefined) return null;
        return {
          primary: { label: `|${n}|`, value: formatNumber(Math.abs(n), 8) },
          details: [
            { label: "Original value", value: formatNumber(n, 8) },
            { label: "Sign", value: n > 0 ? "Positive" : n < 0 ? "Negative" : "Zero" },
            { label: "Distance from zero", value: formatNumber(Math.abs(n), 8) },
          ],
        };
      },
    },
    {
      id: "distance",
      name: "Distance Between Two Numbers",
      fields: [
        { name: "a", label: "Number A", type: "number", placeholder: "e.g. -3" },
        { name: "b", label: "Number B", type: "number", placeholder: "e.g. 7" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number, b = inputs.b as number;
        if (a === undefined || b === undefined) return null;
        const dist = Math.abs(a - b);
        return {
          primary: { label: `|${a} − ${b}|`, value: formatNumber(dist, 8) },
          details: [
            { label: "Distance", value: formatNumber(dist, 8) },
            { label: "Midpoint", value: formatNumber((a + b) / 2, 8) },
            { label: "Sum", value: formatNumber(a + b, 8) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["scientific-calculator", "square-root-calculator", "midpoint-calculator"],
  faq: [{ question: "What is absolute value?", answer: "Absolute value |x| is the distance of a number from zero on the number line, always non-negative. |5| = 5, |-5| = 5, |0| = 0. The distance between two numbers a and b is |a - b|." }],
  formula: "|x| = x if x ≥ 0, |x| = -x if x < 0",
};
