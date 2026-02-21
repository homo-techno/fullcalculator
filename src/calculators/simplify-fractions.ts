import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const simplifyFractionsCalculator: CalculatorDefinition = {
  slug: "simplify-fractions-calculator",
  title: "Simplify Fractions Calculator",
  description:
    "Free fraction simplifier. Enter a numerator and denominator to reduce the fraction to its simplest form. Also shows the decimal equivalent.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "simplify fractions",
    "reduce fractions",
    "fraction simplifier",
    "lowest terms",
    "greatest common divisor",
    "gcd",
  ],
  variants: [
    {
      id: "simplify",
      name: "Simplify a Fraction",
      fields: [
        {
          name: "numerator",
          label: "Numerator",
          type: "number",
          placeholder: "e.g. 24",
        },
        {
          name: "denominator",
          label: "Denominator",
          type: "number",
          placeholder: "e.g. 36",
        },
      ],
      calculate: (inputs) => {
        const num = inputs.numerator as number;
        const den = inputs.denominator as number;
        if (!num || !den) return null;
        if (den === 0) {
          return {
            primary: { label: "Error", value: "Denominator cannot be zero" },
            details: [],
          };
        }

        const gcd = (a: number, b: number): number => {
          a = Math.abs(Math.round(a));
          b = Math.abs(Math.round(b));
          while (b) {
            const t = b;
            b = a % b;
            a = t;
          }
          return a;
        };

        const roundedNum = Math.round(num);
        const roundedDen = Math.round(den);
        const divisor = gcd(roundedNum, roundedDen);
        const simplifiedNum = roundedNum / divisor;
        const simplifiedDen = roundedDen / divisor;
        const decimal = num / den;
        const sign = (roundedNum < 0) !== (roundedDen < 0) ? "-" : "";
        const absSimplifiedNum = Math.abs(simplifiedNum);
        const absSimplifiedDen = Math.abs(simplifiedDen);

        // Mixed number
        let mixedNumber = "";
        if (absSimplifiedNum > absSimplifiedDen) {
          const whole = Math.floor(absSimplifiedNum / absSimplifiedDen);
          const remainder = absSimplifiedNum % absSimplifiedDen;
          if (remainder === 0) {
            mixedNumber = `${sign}${whole}`;
          } else {
            mixedNumber = `${sign}${whole} ${remainder}/${absSimplifiedDen}`;
          }
        }

        return {
          primary: {
            label: `${roundedNum}/${roundedDen} simplified`,
            value: `${sign}${absSimplifiedNum}/${absSimplifiedDen}`,
          },
          details: [
            { label: "Simplified Fraction", value: `${sign}${absSimplifiedNum}/${absSimplifiedDen}` },
            { label: "GCD", value: String(divisor) },
            { label: "Decimal", value: formatNumber(decimal, 6) },
            { label: "Percentage", value: `${formatNumber(decimal * 100, 4)}%` },
            ...(mixedNumber ? [{ label: "Mixed Number", value: mixedNumber }] : []),
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fraction-calculator", "lcm-gcd-calculator", "decimal-fraction-converter"],
  faq: [
    {
      question: "How do I simplify a fraction?",
      answer:
        "Find the Greatest Common Divisor (GCD) of the numerator and denominator, then divide both by it. For example, 24/36: GCD(24,36) = 12, so 24/36 = 2/3.",
    },
    {
      question: "What is the GCD?",
      answer:
        "The Greatest Common Divisor (GCD) is the largest positive integer that divides both numbers without a remainder. It is also called the Greatest Common Factor (GCF).",
    },
  ],
  formula: "Simplified Fraction = (numerator / GCD) / (denominator / GCD)",
};
