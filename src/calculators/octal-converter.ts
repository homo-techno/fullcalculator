import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const octalConverter: CalculatorDefinition = {
  slug: "octal-converter",
  title: "Octal Converter",
  description:
    "Free online octal number converter. Convert between octal (base 8) and decimal, binary, and hexadecimal number systems.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "octal converter",
    "octal to decimal",
    "decimal to octal",
    "base 8 converter",
    "octal number",
  ],
  variants: [
    {
      id: "octal-to-dec",
      name: "Octal to Decimal",
      description: "Convert an octal number to decimal, binary, and hex",
      fields: [
        {
          name: "octal",
          label: "Octal Number (digits 0-7)",
          type: "number",
          placeholder: "e.g. 755",
        },
      ],
      calculate: (inputs) => {
        const octStr = String(inputs.octal).trim();
        if (!octStr || octStr === "undefined") return null;

        // Validate octal (only digits 0-7)
        const cleaned = octStr.replace(/[^0-7]/g, "");
        if (cleaned.length === 0) return null;

        const decimal = parseInt(cleaned, 8);
        if (isNaN(decimal)) return null;

        const binary = decimal.toString(2);
        const hex = decimal.toString(16).toUpperCase();

        // Breakdown
        const digits = cleaned.split("");
        const breakdown = digits
          .map((d, i) => {
            const power = digits.length - 1 - i;
            const val = parseInt(d);
            return `${d}x8^${power} (${formatNumber(val * Math.pow(8, power))})`;
          })
          .join(" + ");

        return {
          primary: {
            label: "Decimal",
            value: formatNumber(decimal),
          },
          details: [
            { label: "Octal", value: `0o${cleaned}` },
            { label: "Binary", value: binary },
            { label: "Hexadecimal", value: `0x${hex}` },
            { label: "Breakdown", value: breakdown },
          ],
        };
      },
    },
    {
      id: "dec-to-octal",
      name: "Decimal to Octal",
      description: "Convert a decimal number to octal, binary, and hex",
      fields: [
        {
          name: "decimal",
          label: "Decimal Number",
          type: "number",
          placeholder: "e.g. 493",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const dec = Math.floor(parseFloat(inputs.decimal as string) || 0);
        if (dec < 0) return null;

        const octal = dec.toString(8);
        const binary = dec.toString(2);
        const hex = dec.toString(16).toUpperCase();

        return {
          primary: {
            label: "Octal",
            value: `0o${octal}`,
          },
          details: [
            { label: "Decimal", value: formatNumber(dec) },
            { label: "Binary", value: binary },
            { label: "Hexadecimal", value: `0x${hex}` },
            { label: "Octal digits", value: formatNumber(octal.length) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["binary-to-decimal-converter", "hex-to-decimal-converter"],
  faq: [
    {
      question: "What is octal?",
      answer:
        "Octal is a base-8 number system using digits 0 through 7. It was historically used in computing because each octal digit corresponds to exactly three binary digits.",
    },
    {
      question: "Where is octal used?",
      answer:
        "Octal is commonly used in Unix/Linux file permissions (e.g., 755, 644), and historically in some computing systems. It provides a compact way to represent binary data.",
    },
  ],
  formula: "Decimal = sum of (octal_digit x 8^position) for each digit from right to left",
};
