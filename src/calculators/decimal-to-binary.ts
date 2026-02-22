import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const decimalToBinaryConverter: CalculatorDefinition = {
  slug: "decimal-to-binary-converter",
  title: "Decimal to Binary Converter",
  description: "Free decimal to binary converter. Convert decimal numbers to binary, octal, and hexadecimal. Shows step-by-step conversion process.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["decimal to binary", "dec to bin", "base 10 to base 2", "number base converter", "decimal converter"],
  variants: [
    {
      id: "convert",
      name: "Convert Decimal to Binary",
      fields: [
        { name: "value", label: "Decimal Number", type: "number", placeholder: "e.g. 255" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const dec = Math.floor(Math.abs(value));
        const bin = dec.toString(2);
        const oct = dec.toString(8);
        const hex = dec.toString(16).toUpperCase();
        const paddedBin = bin.padStart(Math.ceil(bin.length / 8) * 8, "0");
        const bytes = paddedBin.match(/.{8}/g) || [paddedBin];
        return {
          primary: { label: `Decimal ${formatNumber(dec, 0)}`, value: `Binary ${bin}` },
          details: [
            { label: "Binary (base 2)", value: bin },
            { label: "Octal (base 8)", value: oct },
            { label: "Hexadecimal (base 16)", value: hex },
            { label: "Padded Binary (8-bit)", value: paddedBin },
            { label: "Byte Groups", value: bytes.join(" ") },
            { label: "Bit Count", value: String(bin.length) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["binary-to-decimal-converter", "octal-to-decimal-converter", "binary-hex-calculator"],
  faq: [
    { question: "How do I convert decimal to binary?", answer: "Repeatedly divide the decimal number by 2 and record the remainders. Read the remainders from bottom to top. For example, 13: 13/2=6 r1, 6/2=3 r0, 3/2=1 r1, 1/2=0 r1. Reading up: 1101." },
    { question: "What is the binary of 255?", answer: "255 in binary is 11111111 (eight 1s). This is the maximum value of a single byte (8 bits). Each bit is 1: 128+64+32+16+8+4+2+1 = 255." },
  ],
  formula: "Decimal to Binary: repeatedly divide by 2, collect remainders | 255 = 11111111\u2082 | 100 = 1100100\u2082",
};
