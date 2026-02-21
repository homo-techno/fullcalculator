import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function toFraction(decimal: number): [number, number] {
  const tolerance = 1e-10;
  let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
  let b = decimal;
  do {
    const a = Math.floor(b);
    let aux = h1; h1 = a * h1 + h2; h2 = aux;
    aux = k1; k1 = a * k1 + k2; k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(decimal - h1 / k1) > decimal * tolerance && k1 < 1e10);
  return [h1, k1];
}

export const decimalFractionCalculator: CalculatorDefinition = {
  slug: "decimal-to-fraction-calculator",
  title: "Decimal to Fraction Calculator",
  description: "Free decimal to fraction converter. Convert any decimal number to a fraction or mixed number and simplify it.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["decimal to fraction", "fraction to decimal", "convert decimal", "decimal converter", "mixed number converter"],
  variants: [
    {
      id: "toFraction",
      name: "Decimal → Fraction",
      fields: [
        { name: "decimal", label: "Decimal Number", type: "number", placeholder: "e.g. 0.375", step: 0.001 },
      ],
      calculate: (inputs) => {
        const d = inputs.decimal as number;
        if (d === undefined) return null;
        const [num, den] = toFraction(Math.abs(d));
        const sign = d < 0 ? "-" : "";
        const whole = Math.floor(num / den);
        const remainder = num % den;
        const mixedStr = whole > 0 && remainder > 0 ? `${sign}${whole} ${remainder}/${den}` : `${sign}${num}/${den}`;
        return {
          primary: { label: `${d}`, value: `${sign}${num}/${den}` },
          details: [
            { label: "Fraction", value: `${sign}${num}/${den}` },
            ...(whole > 0 && remainder > 0 ? [{ label: "Mixed number", value: mixedStr }] : []),
            { label: "Percentage", value: `${formatNumber(d * 100, 6)}%` },
          ],
        };
      },
    },
    {
      id: "toDecimal",
      name: "Fraction → Decimal",
      fields: [
        { name: "num", label: "Numerator", type: "number", placeholder: "e.g. 3" },
        { name: "den", label: "Denominator", type: "number", placeholder: "e.g. 8" },
      ],
      calculate: (inputs) => {
        const num = inputs.num as number;
        const den = inputs.den as number;
        if (num === undefined || !den) return null;
        const decimal = num / den;
        const pct = decimal * 100;
        return {
          primary: { label: `${num}/${den}`, value: formatNumber(decimal, 10) },
          details: [
            { label: "Decimal", value: formatNumber(decimal, 10) },
            { label: "Percentage", value: `${formatNumber(pct, 6)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fraction-calculator", "percentage-calculator", "ratio-calculator"],
  faq: [
    { question: "How do I convert a decimal to a fraction?", answer: "Put the decimal over 1 and multiply top and bottom to remove the decimal point. 0.75 = 75/100. Then simplify by dividing by the GCD: 75/100 = 3/4." },
  ],
  formula: "Decimal = Numerator / Denominator | Simplify by dividing by GCD",
};
