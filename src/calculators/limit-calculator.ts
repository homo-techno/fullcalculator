import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const limitCalculator: CalculatorDefinition = {
  slug: "limit-calculator",
  title: "Limit Calculator",
  description: "Free limit calculator. Evaluate limits of functions as x approaches a value, including one-sided limits and limits at infinity.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["limit calculator", "calculus limit", "limit of function", "limit as x approaches", "one-sided limit"],
  variants: [
    {
      id: "polynomial-limit",
      name: "Polynomial Limit (ax² + bx + c)",
      description: "Evaluate the limit of a polynomial as x approaches a value",
      fields: [
        { name: "a", label: "a (x² coefficient)", type: "number", placeholder: "e.g. 1" },
        { name: "b", label: "b (x coefficient)", type: "number", placeholder: "e.g. -3" },
        { name: "c", label: "c (constant)", type: "number", placeholder: "e.g. 2" },
        { name: "approach", label: "x approaches", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const c = inputs.c as number;
        const x0 = inputs.approach as number;
        if (a === undefined || b === undefined || c === undefined || x0 === undefined) return null;

        const result = a * x0 * x0 + b * x0 + c;

        return {
          primary: { label: `lim(x→${x0}) [${a}x² + ${b}x + ${c}]`, value: formatNumber(result, 8) },
          details: [
            { label: "Method", value: "Direct substitution (polynomial is continuous)" },
            { label: "f(x₀)", value: `${a}(${x0})² + ${b}(${x0}) + ${c} = ${formatNumber(result, 8)}` },
            { label: "Note", value: "Polynomials are continuous everywhere, so lim = f(x₀)" },
          ],
        };
      },
    },
    {
      id: "rational-limit",
      name: "Rational Limit (ax + b)/(cx + d)",
      description: "Evaluate the limit of a rational function",
      fields: [
        { name: "a", label: "Numerator a (ax + b)", type: "number", placeholder: "e.g. 2" },
        { name: "b", label: "Numerator b", type: "number", placeholder: "e.g. 1" },
        { name: "c", label: "Denominator c (cx + d)", type: "number", placeholder: "e.g. 1" },
        { name: "d", label: "Denominator d", type: "number", placeholder: "e.g. -3" },
        { name: "approach", label: "x approaches", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const c = inputs.c as number;
        const d = inputs.d as number;
        const x0 = inputs.approach as number;
        if (a === undefined || b === undefined || c === undefined || d === undefined || x0 === undefined) return null;

        const num = a * x0 + b;
        const den = c * x0 + d;

        if (den === 0 && num !== 0) {
          return {
            primary: { label: `lim(x→${x0})`, value: num > 0 ? "+∞ or -∞" : "-∞ or +∞" },
            details: [
              { label: "Numerator at x₀", value: formatNumber(num) },
              { label: "Denominator at x₀", value: "0" },
              { label: "Result", value: "Limit does not exist (vertical asymptote)" },
              { label: "Note", value: "Check one-sided limits to determine +∞ or -∞" },
            ],
          };
        }

        if (den === 0 && num === 0) {
          return {
            primary: { label: `lim(x→${x0})`, value: c !== 0 ? formatNumber(a / c, 8) : "Indeterminate" },
            details: [
              { label: "Form", value: "0/0 (indeterminate)" },
              { label: "Method", value: "Factor and cancel or use L'Hôpital's Rule" },
              { label: "Simplified", value: c !== 0 ? `a/c = ${formatNumber(a / c, 8)}` : "Further analysis needed" },
            ],
          };
        }

        const result = num / den;
        return {
          primary: { label: `lim(x→${x0}) [(${a}x+${b})/(${c}x+${d})]`, value: formatNumber(result, 8) },
          details: [
            { label: "Numerator", value: formatNumber(num) },
            { label: "Denominator", value: formatNumber(den) },
            { label: "Method", value: "Direct substitution" },
          ],
        };
      },
    },
    {
      id: "limit-infinity",
      name: "Limit at Infinity (ax² + bx)/(cx² + dx)",
      description: "Evaluate the limit as x approaches infinity",
      fields: [
        { name: "a", label: "Numerator leading coeff (ax²)", type: "number", placeholder: "e.g. 3" },
        { name: "b", label: "Numerator second coeff (bx)", type: "number", placeholder: "e.g. 1" },
        { name: "c", label: "Denominator leading coeff (cx²)", type: "number", placeholder: "e.g. 2" },
        { name: "d", label: "Denominator second coeff (dx)", type: "number", placeholder: "e.g. -5" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const c = inputs.c as number;
        const d = inputs.d as number;
        if (a === undefined || b === undefined || c === undefined || d === undefined) return null;

        let result: string;
        let explanation: string;

        if (c === 0 && a !== 0) {
          result = a > 0 ? "+∞" : "-∞";
          explanation = "Numerator degree > denominator degree → ±∞";
        } else if (a === 0 && c !== 0) {
          result = "0";
          explanation = "Numerator degree < denominator degree → 0";
        } else if (a === 0 && c === 0) {
          if (d === 0) {
            result = b > 0 ? "+∞" : b < 0 ? "-∞" : "0";
            explanation = "Simplified form";
          } else {
            result = formatNumber(b / d, 8);
            explanation = "Same degree: ratio of leading coefficients b/d";
          }
        } else {
          result = formatNumber(a / c, 8);
          explanation = "Same degree: ratio of leading coefficients a/c";
        }

        return {
          primary: { label: "lim(x→∞)", value: result },
          details: [
            { label: "Rule", value: explanation },
            { label: "Numerator", value: `${a}x² + ${b}x` },
            { label: "Denominator", value: `${c}x² + ${d}x` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["derivative-calculator", "integral-calculator", "taylor-series-calculator"],
  faq: [
    { question: "What is a limit in calculus?", answer: "A limit describes what value a function approaches as the input approaches some value. lim(x→a) f(x) = L means f(x) gets arbitrarily close to L as x gets close to a." },
    { question: "What is L'Hôpital's Rule?", answer: "When a limit gives an indeterminate form (0/0 or ∞/∞), L'Hôpital's Rule states: lim f(x)/g(x) = lim f'(x)/g'(x), provided the latter limit exists." },
    { question: "What are one-sided limits?", answer: "A one-sided limit approaches a value from only one direction. lim(x→a⁺) approaches from the right, lim(x→a⁻) from the left. The two-sided limit exists only if both one-sided limits are equal." },
  ],
  formula: "lim(x→a) f(x) = L | L'Hôpital: lim f/g = lim f'/g' (for 0/0 or ∞/∞)",
};
