import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const decimalToFractionConverter: CalculatorDefinition = {
  slug: "decimal-to-fraction-converter",
  title: "Decimal to Fraction Converter",
  description:
    "Free online decimal to fraction converter. Convert any decimal number to a simplified fraction.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "decimal to fraction",
    "convert decimal",
    "decimal fraction converter",
    "simplify fraction",
    "decimal as fraction",
  ],
  variants: [
    {
      id: "dec-to-fraction",
      name: "Decimal to Fraction",
      description: "Convert a decimal number to a simplified fraction",
      fields: [
        {
          name: "decimal",
          label: "Decimal Number",
          type: "number",
          placeholder: "e.g. 0.625",
          step: 0.001,
        },
      ],
      calculate: (inputs) => {
        const dec = parseFloat(inputs.decimal as string);
        if (isNaN(dec)) return null;

        // Handle negative
        const sign = dec < 0 ? -1 : 1;
        const absDec = Math.abs(dec);

        // Convert to fraction using precision
        const decStr = absDec.toString();
        const decimalIndex = decStr.indexOf(".");

        let numerator: number;
        let denominator: number;

        if (decimalIndex === -1) {
          numerator = absDec;
          denominator = 1;
        } else {
          const decimalPlaces = decStr.length - decimalIndex - 1;
          denominator = Math.pow(10, decimalPlaces);
          numerator = Math.round(absDec * denominator);
        }

        // GCD to simplify
        const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
        const g = gcd(numerator, denominator);
        numerator = (numerator / g) * sign;
        denominator = denominator / g;

        // Mixed number
        let mixedStr = "";
        if (Math.abs(numerator) >= denominator && denominator > 1) {
          const whole = Math.trunc(numerator / denominator);
          const remNum = Math.abs(numerator % denominator);
          if (remNum === 0) {
            mixedStr = `${whole}`;
          } else {
            mixedStr = `${whole} and ${remNum}/${denominator}`;
          }
        }

        const percentage = dec * 100;

        return {
          primary: {
            label: "Fraction",
            value: `${formatNumber(numerator)}/${formatNumber(denominator)}`,
          },
          details: [
            { label: "Decimal", value: formatNumber(dec, 8) },
            { label: "Simplified fraction", value: `${formatNumber(numerator)}/${formatNumber(denominator)}` },
            ...(mixedStr ? [{ label: "Mixed number", value: mixedStr }] : []),
            { label: "Percentage", value: `${formatNumber(percentage, 4)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fraction-to-decimal-converter", "mixed-number-calculator"],
  faq: [
    {
      question: "How do I convert a decimal to a fraction?",
      answer:
        "Write the decimal over the appropriate power of 10 (e.g., 0.75 = 75/100), then simplify by dividing numerator and denominator by their GCF. 75/100 simplifies to 3/4.",
    },
    {
      question: "Can all decimals be converted to fractions?",
      answer:
        "All terminating decimals and repeating decimals can be converted to fractions. Non-repeating, non-terminating decimals (like pi) are irrational and cannot be expressed as exact fractions.",
    },
  ],
  formula: "Fraction = Decimal x (10^n) / (10^n), then simplify by GCF",
};
