import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const exponentCalculator: CalculatorDefinition = {
  slug: "exponent-calculator",
  title: "Exponent Calculator",
  description: "Free exponent calculator. Calculate powers (x^n), square roots, cube roots, and nth roots of any number.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["exponent calculator", "power calculator", "x to the power of y", "exponentiation", "raising to a power"],
  variants: [
    {
      id: "power",
      name: "Power (x^n)",
      description: "Calculate x raised to the power of n",
      fields: [
        { name: "base", label: "Base (x)", type: "number", placeholder: "e.g. 2" },
        { name: "exp", label: "Exponent (n)", type: "number", placeholder: "e.g. 8" },
      ],
      calculate: (inputs) => {
        const base = inputs.base as number;
        const exp = inputs.exp as number;
        if (base === undefined || exp === undefined) return null;
        const result = Math.pow(base, exp);
        if (!isFinite(result)) return { primary: { label: "Result", value: "Too large" }, details: [] };
        return {
          primary: { label: `${base}^${exp}`, value: Math.abs(result) > 1e15 ? result.toExponential(6) : formatNumber(result, 10) },
          details: [
            { label: `${base}^2`, value: formatNumber(base * base) },
            { label: `${base}^3`, value: formatNumber(base * base * base) },
            { label: `√${base}`, value: base >= 0 ? formatNumber(Math.sqrt(base), 8) : "N/A" },
          ],
        };
      },
    },
    {
      id: "root",
      name: "Nth Root",
      description: "Calculate the nth root of a number",
      fields: [
        { name: "value", label: "Number", type: "number", placeholder: "e.g. 27" },
        { name: "n", label: "Root (n)", type: "number", placeholder: "e.g. 3", defaultValue: 2 },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const n = (inputs.n as number) || 2;
        if (value === undefined || n === 0) return null;
        const result = Math.pow(value, 1 / n);
        return {
          primary: { label: n === 2 ? `√${value}` : n === 3 ? `∛${value}` : `${n}√${value}`, value: formatNumber(result, 10) },
          details: [
            { label: "Verification", value: `${formatNumber(result, 6)}^${n} = ${formatNumber(Math.pow(result, n), 6)}` },
            { label: "Square root", value: value >= 0 ? formatNumber(Math.sqrt(value), 8) : "N/A" },
            { label: "Cube root", value: formatNumber(Math.cbrt(value), 8) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["scientific-calculator", "square-root-calculator", "logarithm-calculator"],
  faq: [
    { question: "What are the rules of exponents?", answer: "Key rules: x^a × x^b = x^(a+b), x^a / x^b = x^(a-b), (x^a)^b = x^(a×b), x^0 = 1, x^(-n) = 1/x^n." },
  ],
  formula: "x^n = x × x × ... × x (n times) | nth root of x = x^(1/n)",
};
