import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function gcd(a: number, b: number): number { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; }

export const mixedNumberCalculator: CalculatorDefinition = {
  slug: "mixed-number-calculator",
  title: "Mixed Number Calculator",
  description: "Free mixed number calculator. Convert between improper fractions and mixed numbers. Add, subtract, multiply mixed numbers.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["mixed number calculator", "improper fraction to mixed number", "mixed number converter", "mixed fraction calculator"],
  variants: [
    {
      id: "toMixed",
      name: "Improper Fraction → Mixed Number",
      fields: [
        { name: "num", label: "Numerator", type: "number", placeholder: "e.g. 17" },
        { name: "den", label: "Denominator", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const n = inputs.num as number, d = inputs.den as number;
        if (n === undefined || !d) return null;
        const whole = Math.trunc(n / d);
        const rem = Math.abs(n % d);
        const g = gcd(Math.abs(n), Math.abs(d));
        const sNum = n / g, sDen = d / g;
        return {
          primary: { label: `${n}/${d}`, value: rem === 0 ? `${whole}` : `${whole} ${rem}/${Math.abs(d)}` },
          details: [
            { label: "Mixed number", value: rem === 0 ? `${whole}` : `${whole} ${rem}/${Math.abs(d)}` },
            { label: "Simplified fraction", value: `${sNum}/${sDen}` },
            { label: "Decimal", value: formatNumber(n / d, 8) },
          ],
        };
      },
    },
    {
      id: "toImproper",
      name: "Mixed Number → Improper Fraction",
      fields: [
        { name: "whole", label: "Whole Number", type: "number", placeholder: "e.g. 3" },
        { name: "num", label: "Numerator", type: "number", placeholder: "e.g. 2" },
        { name: "den", label: "Denominator", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const w = (inputs.whole as number) || 0, n = (inputs.num as number) || 0, d = inputs.den as number;
        if (!d) return null;
        const improper = w * d + n;
        const g = gcd(Math.abs(improper), Math.abs(d));
        return {
          primary: { label: `${w} ${n}/${d}`, value: `${improper}/${d}` },
          details: [
            { label: "Improper fraction", value: `${improper}/${d}` },
            { label: "Simplified", value: `${improper / g}/${d / g}` },
            { label: "Decimal", value: formatNumber(improper / d, 8) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fraction-calculator", "decimal-to-fraction-calculator", "percentage-calculator"],
  faq: [{ question: "How do I convert an improper fraction to a mixed number?", answer: "Divide numerator by denominator. The quotient is the whole number, the remainder is the new numerator. 17/5: 17÷5 = 3 remainder 2, so 17/5 = 3 2/5." }],
  formula: "Mixed → Improper: (whole × den + num) / den | Improper → Mixed: divide num by den",
};
