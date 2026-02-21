import type { CalculatorDefinition } from "./types";

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

export const fractionCalculator: CalculatorDefinition = {
  slug: "fraction-calculator",
  title: "Fraction Calculator",
  description:
    "Free fraction calculator. Add, subtract, multiply, and divide fractions. Simplify fractions and convert between fractions and decimals.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["fraction calculator", "fractions", "simplify fractions", "add fractions", "fraction to decimal"],
  variants: [
    {
      id: "arithmetic",
      name: "Fraction Arithmetic",
      description: "Add, subtract, multiply, or divide two fractions",
      fields: [
        { name: "num1", label: "Numerator 1", type: "number", placeholder: "e.g. 3" },
        { name: "den1", label: "Denominator 1", type: "number", placeholder: "e.g. 4" },
        { name: "op", label: "Operation", type: "select", options: [
          { label: "Add (+)", value: "add" },
          { label: "Subtract (-)", value: "sub" },
          { label: "Multiply (x)", value: "mul" },
          { label: "Divide (/)", value: "div" },
        ], defaultValue: "add" },
        { name: "num2", label: "Numerator 2", type: "number", placeholder: "e.g. 1" },
        { name: "den2", label: "Denominator 2", type: "number", placeholder: "e.g. 2" },
      ],
      calculate: (inputs) => {
        const n1 = inputs.num1 as number;
        const d1 = inputs.den1 as number;
        const n2 = inputs.num2 as number;
        const d2 = inputs.den2 as number;
        const op = inputs.op as string;
        if (n1 === undefined || !d1 || n2 === undefined || !d2) return null;

        let rn: number, rd: number;
        switch (op) {
          case "add": rn = n1 * d2 + n2 * d1; rd = d1 * d2; break;
          case "sub": rn = n1 * d2 - n2 * d1; rd = d1 * d2; break;
          case "mul": rn = n1 * n2; rd = d1 * d2; break;
          case "div": if (n2 === 0) return null; rn = n1 * d2; rd = d1 * n2; break;
          default: return null;
        }

        const g = gcd(rn, rd);
        const sn = rn / g * (rd < 0 ? -1 : 1);
        const sd = Math.abs(rd / g);
        const decimal = sn / sd;

        const opSymbol = { add: "+", sub: "-", mul: "x", div: "/" }[op] || "+";

        return {
          primary: { label: "Result", value: sd === 1 ? `${sn}` : `${sn}/${sd}` },
          details: [
            { label: "Calculation", value: `${n1}/${d1} ${opSymbol} ${n2}/${d2}` },
            { label: "Decimal", value: `${Math.round(decimal * 10000) / 10000}` },
          ],
        };
      },
    },
    {
      id: "simplify",
      name: "Simplify Fraction",
      description: "Reduce a fraction to its simplest form",
      fields: [
        { name: "num", label: "Numerator", type: "number", placeholder: "e.g. 12" },
        { name: "den", label: "Denominator", type: "number", placeholder: "e.g. 18" },
      ],
      calculate: (inputs) => {
        const n = inputs.num as number;
        const d = inputs.den as number;
        if (n === undefined || !d) return null;
        const g = gcd(n, d);
        const sn = n / g * (d < 0 ? -1 : 1);
        const sd = Math.abs(d / g);
        return {
          primary: { label: "Simplified", value: sd === 1 ? `${sn}` : `${sn}/${sd}` },
          details: [
            { label: "GCD", value: `${g}` },
            { label: "Decimal", value: `${Math.round((sn / sd) * 10000) / 10000}` },
          ],
        };
      },
    },
    {
      id: "to-decimal",
      name: "Fraction to Decimal",
      description: "Convert a fraction to a decimal number",
      fields: [
        { name: "num", label: "Numerator", type: "number", placeholder: "e.g. 7" },
        { name: "den", label: "Denominator", type: "number", placeholder: "e.g. 8" },
      ],
      calculate: (inputs) => {
        const n = inputs.num as number;
        const d = inputs.den as number;
        if (n === undefined || !d) return null;
        const decimal = n / d;
        const pct = decimal * 100;
        return {
          primary: { label: "Decimal", value: `${Math.round(decimal * 100000) / 100000}` },
          details: [
            { label: "Percentage", value: `${Math.round(pct * 100) / 100}%` },
            { label: "Fraction", value: `${n}/${d}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "gpa-calculator"],
  faq: [
    { question: "How do I add fractions?", answer: "Find a common denominator, convert both fractions, then add the numerators. Example: 1/3 + 1/4 = 4/12 + 3/12 = 7/12." },
    { question: "How do I simplify a fraction?", answer: "Divide both numerator and denominator by their GCD (Greatest Common Divisor). Example: 12/18 — GCD is 6 — simplified: 2/3." },
  ],
  formula: "a/b + c/d = (ad + bc) / bd | Simplify by dividing by GCD",
};
