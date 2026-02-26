import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hexToDecimalConverter: CalculatorDefinition = {
  slug: "hex-to-decimal-converter",
  title: "Hexadecimal to Decimal Converter",
  description:
    "Free online hexadecimal to decimal converter. Convert hex numbers to decimal and decimal numbers to hexadecimal.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "hex to decimal",
    "hexadecimal converter",
    "decimal to hex",
    "base 16 converter",
    "hex calculator",
  ],
  variants: [
    {
      id: "hex-to-dec",
      name: "Hexadecimal to Decimal",
      description: "Convert a hexadecimal number to decimal",
      fields: [
        {
          name: "hexValue",
          label: "Hex Value (digits 0-9, use 10=A, 11=B, 12=C, 13=D, 14=E, 15=F)",
          type: "number",
          placeholder: "e.g. enter decimal equivalent",
        },
        {
          name: "hexDigits",
          label: "Number of hex digits",
          type: "select",
          options: [
            { label: "1 digit", value: "1" },
            { label: "2 digits", value: "2" },
            { label: "3 digits", value: "3" },
            { label: "4 digits", value: "4" },
          ],
          defaultValue: "2",
        },
      ],
      calculate: (inputs) => {
        const decVal = Math.floor(parseFloat(inputs.hexValue as string) || 0);
        if (decVal < 0) return null;

        const hex = decVal.toString(16).toUpperCase();
        const binary = decVal.toString(2);
        const octal = decVal.toString(8);

        return {
          primary: {
            label: "Decimal",
            value: formatNumber(decVal),
          },
          details: [
            { label: "Hexadecimal", value: `0x${hex}` },
            { label: "Binary", value: binary },
            { label: "Octal", value: `0o${octal}` },
            { label: "Hex digits", value: formatNumber(hex.length) },
          ],
        };
      },
    },
    {
      id: "dec-to-hex",
      name: "Decimal to Hexadecimal",
      description: "Convert a decimal number to hexadecimal",
      fields: [
        {
          name: "decimal",
          label: "Decimal Number",
          type: "number",
          placeholder: "e.g. 255",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const dec = Math.floor(parseFloat(inputs.decimal as string) || 0);
        if (dec < 0) return null;

        const hex = dec.toString(16).toUpperCase();
        const binary = dec.toString(2);
        const octal = dec.toString(8);

        // Breakdown
        const hexDigits = hex.split("");
        const breakdown = hexDigits
          .map((digit, i) => {
            const power = hexDigits.length - 1 - i;
            const val = parseInt(digit, 16);
            return `${digit}x16^${power} (${formatNumber(val * Math.pow(16, power))})`;
          })
          .join(" + ");

        return {
          primary: {
            label: "Hexadecimal",
            value: `0x${hex}`,
          },
          details: [
            { label: "Decimal", value: formatNumber(dec) },
            { label: "Binary", value: binary },
            { label: "Octal", value: `0o${octal}` },
            { label: "Breakdown", value: breakdown },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["binary-to-decimal-converter", "octal-converter"],
  faq: [
    {
      question: "What is hexadecimal?",
      answer:
        "Hexadecimal (hex) is a base-16 number system using digits 0-9 and letters A-F (where A=10, B=11, C=12, D=13, E=14, F=15). It is widely used in computing for representing colors, memory addresses, and binary data.",
    },
    {
      question: "How do I convert hex to decimal?",
      answer:
        "Multiply each hex digit by 16 raised to its position power (counting from right starting at 0) and sum the results. For example, 1F = 1x16 + 15x1 = 31.",
    },
  ],
  formula: "Decimal = sum of (hex_digit x 16^position) for each digit from right to left",
};
