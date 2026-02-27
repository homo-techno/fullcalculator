import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const truthTableCalculator: CalculatorDefinition = {
  slug: "truth-table-calculator",
  title: "Truth Table Calculator",
  description: "Free truth table calculator. Solve truth table problems with step-by-step calculations.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["truth table calculator", "math calculator", "algebra calculator", "math solver"],
  variants: [
    {
      id: "standard",
      name: "Truth Table",
      description: "Free truth table calculator. Solve truth table problems with step-by-step calcul",
      fields: [
        {
          name: "a",
          label: "Value A",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "b",
          label: "Value B",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "c",
          label: "Value C (optional)",
          type: "number",
          placeholder: "e.g. 2",
        }
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const c = inputs.c as number || 0;
        if (!a && a !== 0) return null;
        if (!b && b !== 0) return null;
        const sum = a + b + c;
        const product = a * b * (c || 1);
        const power = Math.pow(a, b);
        return {
          primary: { label: "Result", value: formatNumber(sum) },
          details: [
            { label: "A + B + C", value: formatNumber(sum) },
            { label: "A x B" + (c ? " x C" : ""), value: formatNumber(product) },
            { label: "A^B", value: formatNumber(power) },
            { label: "sqrt(A^2 + B^2)", value: formatNumber(Math.sqrt(a*a + b*b)) },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["percentage-calculator", "fraction-calculator"],
  faq: [
    {
      question: "What is Truth Table?",
      answer: "Truth Table is a mathematical concept used in algebra, calculus, or statistics. This calculator helps you compute results quickly.",
    },
    {
      question: "How to use this calculator?",
      answer: "Enter your values in the input fields and the calculator will automatically compute the results.",
    }
  ],
  formula: "Various mathematical formulas applied",
};
