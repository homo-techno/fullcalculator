import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const numberBaseConverterCalculator: CalculatorDefinition = {
  slug: "number-base-converter",
  title: "Number Base Converter",
  description: "Convert numbers between binary, octal, decimal, and hexadecimal bases.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["number base converter", "binary converter", "hex converter"],
  variants: [{
    id: "standard",
    name: "Number Base",
    description: "Convert numbers between binary, octal, decimal, and hexadecimal bases",
    fields: [
      { name: "decimal", label: "Decimal Number", type: "number", min: 0, max: 999999999, defaultValue: 255 },
    ],
    calculate: (inputs) => {
      const num = inputs.decimal as number;
      if (num === undefined || num < 0 || !Number.isFinite(num)) return null;
      const n = Math.floor(num);
      return {
        primary: { label: "Decimal", value: formatNumber(n) },
        details: [
          { label: "Binary (Base 2)", value: n.toString(2) },
          { label: "Octal (Base 8)", value: n.toString(8) },
          { label: "Hexadecimal (Base 16)", value: n.toString(16).toUpperCase() },
          { label: "Binary digit count", value: formatNumber(n.toString(2).length) },
        ],
      };
    },
  }],
  relatedSlugs: ["hex-to-rgb-calculator", "ascii-converter"],
  faq: [
    { question: "What are number bases?", answer: "A number base (or radix) defines how many unique digits are used. Decimal uses 10 digits (0 to 9), binary uses 2 (0 and 1), octal uses 8, and hexadecimal uses 16 (0 to F)." },
    { question: "Why is hexadecimal used in computing?", answer: "Hexadecimal is a compact way to represent binary data. Each hex digit corresponds to exactly 4 binary digits, making it easier to read memory addresses and color codes." },
  ],
  formula: "Decimal = sum of (digit x base^position); then convert to target base by repeated division",
};
