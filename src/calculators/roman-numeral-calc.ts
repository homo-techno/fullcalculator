import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const romanNumeralCalc: CalculatorDefinition = {
  slug: "roman-numeral-converter",
  title: "Roman Numeral Converter",
  description:
    "Free online Roman numeral converter. Convert between Roman numerals and decimal numbers. Supports values from 1 to 3,999.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "roman numeral converter",
    "roman to decimal",
    "decimal to roman",
    "roman numerals",
    "numeral converter",
  ],
  variants: [
    {
      id: "decimal-to-roman",
      name: "Decimal to Roman Numeral",
      description: "Convert a decimal number to Roman numerals",
      fields: [
        {
          name: "number",
          label: "Decimal Number (1-3999)",
          type: "number",
          placeholder: "e.g. 2024",
          min: 1,
          max: 3999,
        },
      ],
      calculate: (inputs) => {
        const num = Math.floor(parseFloat(inputs.number as string) || 0);
        if (num < 1 || num > 3999) return null;

        const romanValues: [number, string][] = [
          [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
          [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
          [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
        ];

        let result = "";
        let remaining = num;
        const breakdown: string[] = [];

        for (const [value, symbol] of romanValues) {
          while (remaining >= value) {
            result += symbol;
            remaining -= value;
            breakdown.push(`${symbol} = ${formatNumber(value)}`);
          }
        }

        return {
          primary: {
            label: "Roman Numeral",
            value: result,
          },
          details: [
            { label: "Decimal value", value: formatNumber(num) },
            { label: "Breakdown", value: breakdown.join(", ") },
            { label: "Number of symbols", value: formatNumber(result.length) },
          ],
        };
      },
    },
    {
      id: "roman-to-decimal",
      name: "Roman Numeral to Decimal",
      description: "Convert a Roman numeral to a decimal number (enter as a number for each letter value)",
      fields: [
        {
          name: "thousands",
          label: "Thousands (M=1, MM=2, MMM=3)",
          type: "number",
          placeholder: "0-3",
          min: 0,
          max: 3,
        },
        {
          name: "hundreds",
          label: "Hundreds (1-9, 0 for none)",
          type: "number",
          placeholder: "0-9",
          min: 0,
          max: 9,
        },
        {
          name: "tens",
          label: "Tens (1-9, 0 for none)",
          type: "number",
          placeholder: "0-9",
          min: 0,
          max: 9,
        },
        {
          name: "ones",
          label: "Ones (1-9, 0 for none)",
          type: "number",
          placeholder: "0-9",
          min: 0,
          max: 9,
        },
      ],
      calculate: (inputs) => {
        const th = Math.floor(parseFloat(inputs.thousands as string) || 0);
        const hu = Math.floor(parseFloat(inputs.hundreds as string) || 0);
        const te = Math.floor(parseFloat(inputs.tens as string) || 0);
        const on = Math.floor(parseFloat(inputs.ones as string) || 0);

        const num = th * 1000 + hu * 100 + te * 10 + on;
        if (num < 1 || num > 3999) return null;

        const romanValues: [number, string][] = [
          [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
          [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
          [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
        ];

        let roman = "";
        let remaining = num;
        for (const [value, symbol] of romanValues) {
          while (remaining >= value) {
            roman += symbol;
            remaining -= value;
          }
        }

        return {
          primary: {
            label: "Decimal Number",
            value: formatNumber(num),
          },
          details: [
            { label: "Roman numeral", value: roman },
            { label: "Thousands", value: formatNumber(th) },
            { label: "Hundreds", value: formatNumber(hu) },
            { label: "Tens", value: formatNumber(te) },
            { label: "Ones", value: formatNumber(on) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["binary-to-decimal-converter", "hex-to-decimal-converter"],
  faq: [
    {
      question: "What are Roman numerals?",
      answer:
        "Roman numerals are a numeral system from ancient Rome using letters: I=1, V=5, X=10, L=50, C=100, D=500, M=1000. Subtractive notation is used (e.g., IV=4, IX=9).",
    },
    {
      question: "What is the largest Roman numeral?",
      answer:
        "Using standard Roman numerals (without vinculum/overlines), the largest representable number is 3,999 (MMMCMXCIX).",
    },
  ],
  formula: "Roman numerals: I=1, V=5, X=10, L=50, C=100, D=500, M=1000",
};
