import type { CalculatorDefinition } from "./types";

export const hexDecimalConverter: CalculatorDefinition = {
  slug: "hex-to-decimal-calculator",
  title: "Hex to Decimal Calculator",
  description: "Free hex to decimal calculator. Convert between hexadecimal, decimal, octal, and binary number systems.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["hex to decimal", "hexadecimal converter", "decimal to hex", "octal converter", "number base converter"],
  variants: [
    {
      id: "hexToDec",
      name: "Hexadecimal → Decimal",
      fields: [
        { name: "hex", label: "Hexadecimal Value", type: "text" as "number", placeholder: "e.g. 1A3F" },
      ],
      calculate: (inputs) => {
        const hex = String(inputs.hex || "").trim().replace(/^0x/i, "");
        if (!hex || !/^[0-9a-fA-F]+$/.test(hex)) return null;
        const dec = parseInt(hex, 16);
        return {
          primary: { label: `0x${hex.toUpperCase()}`, value: String(dec) },
          details: [
            { label: "Decimal", value: String(dec) },
            { label: "Binary", value: dec.toString(2) },
            { label: "Octal", value: dec.toString(8) },
          ],
        };
      },
    },
    {
      id: "decToHex",
      name: "Decimal → Hexadecimal",
      fields: [
        { name: "dec", label: "Decimal Value", type: "number", placeholder: "e.g. 6719" },
      ],
      calculate: (inputs) => {
        const dec = inputs.dec as number;
        if (dec === undefined || dec < 0) return null;
        const n = Math.floor(dec);
        return {
          primary: { label: String(n), value: `0x${n.toString(16).toUpperCase()}` },
          details: [
            { label: "Hexadecimal", value: `0x${n.toString(16).toUpperCase()}` },
            { label: "Binary", value: n.toString(2) },
            { label: "Octal", value: `0${n.toString(8)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["binary-hex-calculator", "scientific-calculator", "number-base-converter-calculator"],
  faq: [{ question: "How do I convert hex to decimal?", answer: "Multiply each hex digit by 16 raised to its position power (right to left, starting at 0). Example: 1A3F = 1×16³ + 10×16² + 3×16¹ + 15×16⁰ = 4096 + 2560 + 48 + 15 = 6719." }],
  formula: "Hex digit × 16^position (right to left)",
};
