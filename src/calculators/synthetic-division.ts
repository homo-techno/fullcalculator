import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const syntheticDivisionCalculator: CalculatorDefinition = {
  slug: "synthetic-division-calculator",
  title: "Synthetic Division Calculator",
  description: "Free synthetic division calculator. Divide polynomials using synthetic division with step-by-step breakdown, remainder, and quotient shown.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["synthetic division calculator", "polynomial division", "divide polynomials", "remainder theorem", "factor theorem"],
  variants: [
    {
      id: "cubic-div",
      name: "Divide Cubic by (x - c)",
      description: "Divide ax³ + bx² + cx + d by (x - r)",
      fields: [
        { name: "a", label: "a (x³ coefficient)", type: "number", placeholder: "e.g. 1" },
        { name: "b", label: "b (x² coefficient)", type: "number", placeholder: "e.g. -4" },
        { name: "c", label: "c (x coefficient)", type: "number", placeholder: "e.g. 5" },
        { name: "d", label: "d (constant)", type: "number", placeholder: "e.g. -2" },
        { name: "r", label: "r (dividing by x - r)", type: "number", placeholder: "e.g. 2" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const c = inputs.c as number;
        const d = inputs.d as number;
        const r = inputs.r as number;
        if (a === undefined || b === undefined || c === undefined || d === undefined || r === undefined) return null;

        // Synthetic division steps
        const row = [a];
        row.push(row[0] * r + b);
        row.push(row[1] * r + c);
        const remainder = row[2] * r + d;

        const q2 = row[0]; // x² coefficient
        const q1 = row[1]; // x coefficient
        const q0 = row[2]; // constant

        const quotientTerms: string[] = [];
        if (q2 !== 0) quotientTerms.push(`${q2 === 1 ? "" : q2 === -1 ? "-" : q2}x²`);
        if (q1 !== 0) quotientTerms.push(`${q1 >= 0 && quotientTerms.length > 0 ? "+" : ""}${q1}x`);
        if (q0 !== 0) quotientTerms.push(`${q0 >= 0 && quotientTerms.length > 0 ? "+" : ""}${q0}`);
        const quotientStr = quotientTerms.length > 0 ? quotientTerms.join(" ") : "0";

        return {
          primary: { label: "Quotient", value: quotientStr },
          details: [
            { label: "Dividend", value: `${a}x³ + ${b}x² + ${c}x + ${d}` },
            { label: "Divisor", value: `x - ${r}` },
            { label: "Quotient", value: quotientStr },
            { label: "Remainder", value: formatNumber(remainder) },
            { label: "f(r) = remainder", value: `f(${r}) = ${formatNumber(remainder)}` },
            { label: "Is (x-${r}) a factor?", value: remainder === 0 ? "Yes (remainder = 0)" : "No (remainder ≠ 0)" },
            { label: "Synthetic row", value: `${formatNumber(q2)} | ${formatNumber(q1)} | ${formatNumber(q0)} | R: ${formatNumber(remainder)}` },
          ],
        };
      },
    },
    {
      id: "quadratic-div",
      name: "Divide Quadratic by (x - c)",
      description: "Divide ax² + bx + c by (x - r)",
      fields: [
        { name: "a", label: "a (x² coefficient)", type: "number", placeholder: "e.g. 1" },
        { name: "b", label: "b (x coefficient)", type: "number", placeholder: "e.g. -5" },
        { name: "c", label: "c (constant)", type: "number", placeholder: "e.g. 6" },
        { name: "r", label: "r (dividing by x - r)", type: "number", placeholder: "e.g. 2" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const c = inputs.c as number;
        const r = inputs.r as number;
        if (a === undefined || b === undefined || c === undefined || r === undefined) return null;

        const q1 = a;
        const q0 = q1 * r + b;
        const remainder = q0 * r + c;

        const quotientStr = q1 === 1 ? `x + ${q0}` : q1 === -1 ? `-x + ${q0}` : `${q1}x + ${q0}`;

        return {
          primary: { label: "Quotient", value: `${quotientStr}, R = ${formatNumber(remainder)}` },
          details: [
            { label: "Dividend", value: `${a}x² + ${b}x + ${c}` },
            { label: "Divisor", value: `x - ${r}` },
            { label: "Linear quotient", value: quotientStr },
            { label: "Remainder", value: formatNumber(remainder) },
            { label: "Is (x-${r}) a factor?", value: remainder === 0 ? "Yes" : "No" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["polynomial-calculator", "cubic-equation-calculator", "quadratic-equation-calculator"],
  faq: [
    { question: "What is synthetic division?", answer: "Synthetic division is a shortcut method for dividing a polynomial by a linear factor (x - c). It uses only the coefficients and is much faster than long division. The last number in the bottom row is the remainder." },
    { question: "What is the Remainder Theorem?", answer: "The Remainder Theorem states that when polynomial f(x) is divided by (x - c), the remainder equals f(c). If f(c) = 0, then (x - c) is a factor of f(x) (Factor Theorem)." },
  ],
  formula: "f(x) = (x - r)·Q(x) + R | Remainder Theorem: R = f(r) | Factor Theorem: (x-r) is factor ↔ f(r) = 0",
};
