import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const binaryToDecimalConverter: CalculatorDefinition = {
  slug: "binary-to-decimal-converter",
  title: "Binary to Decimal Converter",
  description: "Free binary to decimal converter. Convert binary numbers to decimal, hexadecimal, and octal. Supports up to 32-bit binary values.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["binary to decimal", "binary converter", "base 2 to base 10", "binary number converter", "bin to dec"],
  variants: [
    {
      id: "convert",
      name: "Convert Binary to Decimal",
      fields: [
        { name: "value", label: "Binary Number", type: "number", placeholder: "e.g. 11010110" },
        { name: "direction", label: "Direction", type: "select", options: [
          { label: "Binary to Decimal", value: "bin_to_dec" },
          { label: "Decimal to Binary", value: "dec_to_bin" },
        ], defaultValue: "bin_to_dec" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const direction = inputs.direction as string;
        if (value === undefined) return null;
        const valueStr = String(value);
        if (direction === "dec_to_bin") {
          const dec = Math.floor(Math.abs(value));
          const bin = dec.toString(2);
          const oct = dec.toString(8);
          const hex = dec.toString(16).toUpperCase();
          return {
            primary: { label: `Decimal ${dec}`, value: `Binary ${bin}` },
            details: [
              { label: "Binary (base 2)", value: bin },
              { label: "Octal (base 8)", value: oct },
              { label: "Hexadecimal (base 16)", value: hex },
              { label: "Bit Count", value: String(bin.length) },
              { label: "Byte Representation", value: bin.padStart(Math.ceil(bin.length / 8) * 8, "0") },
            ],
          };
        }
        if (!/^[01]+$/.test(valueStr)) {
          return {
            primary: { label: "Error", value: "Invalid binary number (use only 0 and 1)" },
            details: [],
          };
        }
        const dec = parseInt(valueStr, 2);
        const oct = dec.toString(8);
        const hex = dec.toString(16).toUpperCase();
        return {
          primary: { label: `Binary ${valueStr}`, value: `Decimal ${formatNumber(dec, 0)}` },
          details: [
            { label: "Decimal (base 10)", value: formatNumber(dec, 0) },
            { label: "Octal (base 8)", value: oct },
            { label: "Hexadecimal (base 16)", value: hex },
            { label: "Bit Count", value: String(valueStr.length) },
            { label: "Byte Representation", value: valueStr.padStart(Math.ceil(valueStr.length / 8) * 8, "0") },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["decimal-to-binary-converter", "octal-to-decimal-converter", "binary-hex-calculator"],
  faq: [
    { question: "How do I convert binary to decimal?", answer: "Multiply each binary digit by 2 raised to its position power (starting from 0 on the right), then sum all values. For 1101: (1\u00d72\u00b3) + (1\u00d72\u00b2) + (0\u00d72\u00b9) + (1\u00d72\u2070) = 8 + 4 + 0 + 1 = 13." },
    { question: "What is binary?", answer: "Binary is a base-2 number system using only digits 0 and 1. It is the fundamental language of computers. Each binary digit (bit) represents an on/off state. 8 bits = 1 byte, which can represent values 0-255." },
  ],
  formula: "Binary to Decimal: sum of (digit \u00d7 2^position) | 1101\u2082 = 8+4+0+1 = 13\u2081\u2080 | Decimal to Binary: divide by 2, track remainders",
};
