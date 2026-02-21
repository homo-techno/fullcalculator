import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const scientificNotationCalculator: CalculatorDefinition = {
  slug: "scientific-notation-calculator",
  title: "Scientific Notation Calculator",
  description:
    "Free scientific notation calculator. Convert numbers to and from scientific notation. Express any number as a × 10^n.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "scientific notation",
    "scientific notation calculator",
    "standard form",
    "exponential notation",
    "powers of ten",
  ],
  variants: [
    {
      id: "to-scientific",
      name: "Number to Scientific Notation",
      fields: [
        {
          name: "number",
          label: "Number",
          type: "number",
          placeholder: "e.g. 123456.789",
        },
      ],
      calculate: (inputs) => {
        const num = inputs.number as number;
        if (num === undefined || num === null) return null;
        if (num === 0) {
          return {
            primary: { label: "Scientific Notation", value: "0 × 10^0" },
            details: [
              { label: "Coefficient (a)", value: "0" },
              { label: "Exponent (n)", value: "0" },
              { label: "E Notation", value: "0e+0" },
            ],
          };
        }
        const absNum = Math.abs(num);
        const exponent = Math.floor(Math.log10(absNum));
        const coefficient = num / Math.pow(10, exponent);
        const sign = num < 0 ? "-" : "";
        return {
          primary: {
            label: "Scientific Notation",
            value: `${formatNumber(coefficient, 6)} × 10^${exponent}`,
          },
          details: [
            { label: "Coefficient (a)", value: formatNumber(coefficient, 6) },
            { label: "Exponent (n)", value: String(exponent) },
            { label: "E Notation", value: `${formatNumber(coefficient, 6)}e${exponent >= 0 ? "+" : ""}${exponent}` },
            { label: "Original Number", value: String(num) },
          ],
        };
      },
    },
    {
      id: "from-scientific",
      name: "Scientific Notation to Number",
      fields: [
        {
          name: "coefficient",
          label: "Coefficient (a)",
          type: "number",
          placeholder: "e.g. 1.23",
        },
        {
          name: "exponent",
          label: "Exponent (n)",
          type: "number",
          placeholder: "e.g. 5",
        },
      ],
      calculate: (inputs) => {
        const a = inputs.coefficient as number;
        const n = inputs.exponent as number;
        if (a === undefined || a === null || n === undefined || n === null) return null;
        const result = a * Math.pow(10, n);
        return {
          primary: {
            label: `${formatNumber(a, 6)} × 10^${n}`,
            value: String(result),
          },
          details: [
            { label: "Decimal Number", value: String(result) },
            { label: "Formatted", value: formatNumber(result, 6) },
            { label: "E Notation", value: `${formatNumber(a, 6)}e${n >= 0 ? "+" : ""}${n}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["exponent-calculator", "logarithm-calculator", "significant-figures-calculator"],
  faq: [
    {
      question: "What is scientific notation?",
      answer:
        "Scientific notation expresses numbers as a × 10^n, where 1 ≤ |a| < 10 and n is an integer. For example, 123,000 = 1.23 × 10^5 and 0.0045 = 4.5 × 10^-3.",
    },
    {
      question: "How do I convert a number to scientific notation?",
      answer:
        "Move the decimal point until you have a number between 1 and 10. Count how many places you moved it; that is the exponent. Moving left gives a positive exponent, moving right gives a negative exponent.",
    },
  ],
  formula: "Scientific Notation: a × 10^n where 1 ≤ |a| < 10",
};
