import type { CalculatorDefinition } from "./types";

export const numberBaseConverter: CalculatorDefinition = {
  slug: "number-base-converter-calculator",
  title: "Number Base Converter",
  description: "Free number base converter. Convert numbers between any bases from 2 to 36 (binary, octal, decimal, hex, and custom).",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["number base converter", "base converter", "base 2 to base 10", "radix converter", "numeral system"],
  variants: [
    {
      id: "convert",
      name: "Convert Between Bases",
      fields: [
        { name: "num", label: "Number", type: "text" as "number", placeholder: "e.g. 1010110" },
        { name: "fromBase", label: "From Base (2-36)", type: "number", placeholder: "e.g. 2", min: 2, max: 36 },
        { name: "toBase", label: "To Base (2-36)", type: "number", placeholder: "e.g. 10", min: 2, max: 36 },
      ],
      calculate: (inputs) => {
        const num = String(inputs.num || "").trim();
        const fromBase = inputs.fromBase as number;
        const toBase = inputs.toBase as number;
        if (!num || !fromBase || !toBase || fromBase < 2 || fromBase > 36 || toBase < 2 || toBase > 36) return null;
        const decimal = parseInt(num, fromBase);
        if (isNaN(decimal)) return null;
        const result = decimal.toString(toBase).toUpperCase();
        return {
          primary: { label: `Base ${fromBase} → Base ${toBase}`, value: result },
          details: [
            { label: `Base ${fromBase}`, value: num },
            { label: "Decimal (base 10)", value: String(decimal) },
            { label: "Binary (base 2)", value: decimal.toString(2) },
            { label: "Octal (base 8)", value: decimal.toString(8) },
            { label: "Hex (base 16)", value: decimal.toString(16).toUpperCase() },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["binary-hex-calculator", "hex-to-decimal-calculator", "scientific-calculator"],
  faq: [{ question: "What are number bases?", answer: "A number base (radix) is how many unique digits are used. Base 2 (binary) uses 0-1, base 8 (octal) uses 0-7, base 10 (decimal) uses 0-9, base 16 (hex) uses 0-9 and A-F. Bases up to 36 use 0-9 and A-Z." }],
  formula: "Convert to decimal first, then to target base",
};
