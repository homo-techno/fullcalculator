import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fractionToDecimalConverter: CalculatorDefinition = {
  slug: "fraction-to-decimal-converter",
  title: "Fraction to Decimal Converter",
  description:
    "Free online fraction to decimal converter. Convert any fraction to its decimal equivalent and percentage.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "fraction to decimal",
    "convert fraction",
    "fraction converter",
    "fraction to percent",
    "divide fractions",
  ],
  variants: [
    {
      id: "fraction-to-dec",
      name: "Fraction to Decimal",
      description: "Convert a fraction (numerator/denominator) to a decimal",
      fields: [
        {
          name: "numerator",
          label: "Numerator (top number)",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "denominator",
          label: "Denominator (bottom number)",
          type: "number",
          placeholder: "e.g. 8",
        },
      ],
      calculate: (inputs) => {
        const num = parseFloat(inputs.numerator as string);
        const den = parseFloat(inputs.denominator as string);
        if (isNaN(num) || isNaN(den) || den === 0) return null;

        const decimal = num / den;
        const percentage = decimal * 100;

        // Simplify fraction
        const gcd = (a: number, b: number): number => {
          a = Math.abs(Math.round(a));
          b = Math.abs(Math.round(b));
          return b === 0 ? a : gcd(b, a % b);
        };

        const intNum = Math.round(num);
        const intDen = Math.round(den);
        const g = gcd(intNum, intDen);
        const simpNum = intNum / g;
        const simpDen = intDen / g;

        // Mixed number
        let mixedStr = "";
        if (Math.abs(intNum) >= Math.abs(intDen) && intDen !== 0) {
          const whole = Math.trunc(intNum / intDen);
          const remNum = Math.abs(intNum % intDen);
          if (remNum === 0) {
            mixedStr = `${whole}`;
          } else {
            mixedStr = `${whole} and ${remNum}/${Math.abs(intDen)}`;
          }
        }

        return {
          primary: {
            label: "Decimal",
            value: formatNumber(decimal, 8),
          },
          details: [
            { label: "Fraction", value: `${formatNumber(intNum)}/${formatNumber(intDen)}` },
            { label: "Simplified", value: `${formatNumber(simpNum)}/${formatNumber(simpDen)}` },
            { label: "Percentage", value: `${formatNumber(percentage, 4)}%` },
            ...(mixedStr ? [{ label: "Mixed number", value: mixedStr }] : []),
          ],
        };
      },
    },
  ],
  relatedSlugs: ["decimal-to-fraction-converter", "mixed-number-calculator"],
  faq: [
    {
      question: "How do I convert a fraction to a decimal?",
      answer:
        "Divide the numerator (top number) by the denominator (bottom number). For example, 3/4 = 3 divided by 4 = 0.75.",
    },
    {
      question: "How do I convert a fraction to a percentage?",
      answer:
        "First convert the fraction to a decimal, then multiply by 100. For example, 3/4 = 0.75 = 75%.",
    },
  ],
  formula: "Decimal = Numerator / Denominator",
};
