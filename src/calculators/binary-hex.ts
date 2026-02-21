import type { CalculatorDefinition } from "./types";

export const binaryHexConverter: CalculatorDefinition = {
  slug: "binary-hex-converter",
  title: "Binary / Hex / Decimal Converter",
  description: "Free number base converter. Convert between binary, decimal, hexadecimal, and octal number systems instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["binary converter", "hex converter", "decimal to binary", "binary to decimal", "hexadecimal converter", "base converter"],
  variants: [
    {
      id: "decimal",
      name: "From Decimal",
      description: "Convert a decimal number to binary, hex, and octal",
      fields: [
        { name: "decimal", label: "Decimal Number", type: "number", placeholder: "e.g. 255", min: 0, max: 2147483647 },
      ],
      calculate: (inputs) => {
        const dec = inputs.decimal as number;
        if (dec === undefined || dec < 0) return null;
        const n = Math.floor(dec);
        return {
          primary: { label: `Decimal ${n}`, value: `Binary: ${n.toString(2)}` },
          details: [
            { label: "Hexadecimal", value: `0x${n.toString(16).toUpperCase()}` },
            { label: "Octal", value: `0o${n.toString(8)}` },
            { label: "Binary", value: n.toString(2) },
            { label: "Bit length", value: `${n.toString(2).length} bits` },
          ],
        };
      },
    },
    {
      id: "bits",
      name: "Binary to Decimal",
      description: "Enter binary digits to convert to decimal, hex, and octal",
      fields: [
        { name: "binary", label: "Binary Number (as decimal digits)", type: "number", placeholder: "e.g. 11111111" },
      ],
      calculate: (inputs) => {
        const binInput = inputs.binary as number;
        if (binInput === undefined) return null;
        const binStr = String(Math.floor(binInput));
        if (!/^[01]+$/.test(binStr)) return {
          primary: { label: "Error", value: "Enter only 0s and 1s" },
          details: [],
        };
        const dec = parseInt(binStr, 2);
        return {
          primary: { label: `Binary ${binStr}`, value: `Decimal: ${dec}` },
          details: [
            { label: "Decimal", value: `${dec}` },
            { label: "Hexadecimal", value: `0x${dec.toString(16).toUpperCase()}` },
            { label: "Octal", value: `0o${dec.toString(8)}` },
            { label: "Bit length", value: `${binStr.length} bits` },
          ],
        };
      },
    },
    {
      id: "ascii",
      name: "ASCII Value",
      description: "Find the ASCII/Unicode value of a character (enter character code)",
      fields: [
        { name: "code", label: "Character Code (0-127)", type: "number", placeholder: "e.g. 65", min: 0, max: 127 },
      ],
      calculate: (inputs) => {
        const code = inputs.code as number;
        if (code === undefined || code < 0 || code > 127) return null;
        const n = Math.floor(code);
        const char = n >= 32 && n <= 126 ? String.fromCharCode(n) : "(non-printable)";
        return {
          primary: { label: `ASCII ${n}`, value: `Character: ${char}` },
          details: [
            { label: "Decimal", value: `${n}` },
            { label: "Hexadecimal", value: `0x${n.toString(16).toUpperCase()}` },
            { label: "Binary", value: n.toString(2).padStart(8, "0") },
            { label: "Octal", value: `0o${n.toString(8)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["scientific-calculator", "unit-converter"],
  faq: [
    { question: "How do I convert decimal to binary?", answer: "Divide the number by 2 repeatedly and record the remainders. Read the remainders bottom-to-top. Example: 13 ÷ 2 = 6r1, 6÷2=3r0, 3÷2=1r1, 1÷2=0r1 → 1101." },
    { question: "What is hexadecimal?", answer: "Hexadecimal (base 16) uses digits 0-9 and letters A-F (A=10, B=11... F=15). It's commonly used in programming for colors (#FF0000 = red), memory addresses, and compact binary representation." },
  ],
  formula: "Decimal to Base N: repeatedly divide by N, collect remainders | Base N to Decimal: Σ(digit × N^position)",
};
