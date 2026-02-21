import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const squareRootCalculator: CalculatorDefinition = {
  slug: "square-root-calculator",
  title: "Square Root Calculator",
  description: "Free square root calculator. Find the square root of any number, check if it's a perfect square, and simplify radical expressions.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["square root calculator", "sqrt calculator", "radical calculator", "square root of", "perfect square"],
  variants: [
    {
      id: "sqrt",
      name: "Square Root",
      fields: [
        { name: "n", label: "Number", type: "number", placeholder: "e.g. 144" },
      ],
      calculate: (inputs) => {
        const n = inputs.n as number;
        if (n === undefined) return null;
        if (n < 0) return { primary: { label: `√${n}`, value: `${formatNumber(Math.sqrt(-n), 8)}i (imaginary)` }, details: [] };
        const sqrt = Math.sqrt(n);
        const isPerfect = Number.isInteger(sqrt);
        return {
          primary: { label: `√${n}`, value: formatNumber(sqrt, 10) },
          details: [
            { label: "Perfect square?", value: isPerfect ? `Yes (${Math.round(sqrt)}²)` : "No" },
            { label: "Cube root", value: formatNumber(Math.cbrt(n), 8) },
            { label: "n²", value: formatNumber(n * n) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["exponent-calculator", "scientific-calculator", "pythagorean-theorem-calculator"],
  faq: [
    { question: "What is a perfect square?", answer: "A perfect square is a number whose square root is a whole number. Examples: 1,4,9,16,25,36,49,64,81,100,121,144." },
  ],
  formula: "√n = n^(1/2) | If n = a², then √n = a",
};
