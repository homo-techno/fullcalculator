import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const octalToDecimalConverter: CalculatorDefinition = {
  slug: "octal-to-decimal-converter",
  title: "Octal to Decimal Converter",
  description: "Free octal to decimal converter. Convert between octal (base 8) and decimal (base 10) numbers. Also shows binary and hexadecimal.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["octal to decimal", "base 8 to base 10", "octal converter", "oct to dec", "number system converter"],
  variants: [
    {
      id: "convert",
      name: "Convert Octal to Decimal",
      fields: [
        { name: "value", label: "Octal Number", type: "number", placeholder: "e.g. 377" },
        { name: "direction", label: "Direction", type: "select", options: [
          { label: "Octal to Decimal", value: "oct_to_dec" },
          { label: "Decimal to Octal", value: "dec_to_oct" },
        ], defaultValue: "oct_to_dec" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const direction = inputs.direction as string;
        if (value === undefined) return null;
        const valueStr = String(value);
        if (direction === "dec_to_oct") {
          const dec = Math.floor(Math.abs(value));
          const oct = dec.toString(8);
          const bin = dec.toString(2);
          const hex = dec.toString(16).toUpperCase();
          return {
            primary: { label: `Decimal ${formatNumber(dec, 0)}`, value: `Octal ${oct}` },
            details: [
              { label: "Octal (base 8)", value: oct },
              { label: "Binary (base 2)", value: bin },
              { label: "Hexadecimal (base 16)", value: hex },
              { label: "Unix Permission", value: oct.length <= 4 ? oct.padStart(3, "0") : "N/A" },
            ],
          };
        }
        if (!/^[0-7]+$/.test(valueStr)) {
          return {
            primary: { label: "Error", value: "Invalid octal number (use digits 0-7 only)" },
            details: [],
          };
        }
        const dec = parseInt(valueStr, 8);
        const bin = dec.toString(2);
        const hex = dec.toString(16).toUpperCase();
        return {
          primary: { label: `Octal ${valueStr}`, value: `Decimal ${formatNumber(dec, 0)}` },
          details: [
            { label: "Decimal (base 10)", value: formatNumber(dec, 0) },
            { label: "Binary (base 2)", value: bin },
            { label: "Hexadecimal (base 16)", value: hex },
            { label: "Unix Permission", value: valueStr.length <= 4 ? valueStr.padStart(3, "0") : "N/A" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["binary-to-decimal-converter", "decimal-to-binary-converter", "binary-hex-calculator"],
  faq: [
    { question: "How do I convert octal to decimal?", answer: "Multiply each octal digit by 8 raised to its position power (starting from 0 on the right), then sum. For 377: (3\u00d78\u00b2) + (7\u00d78\u00b9) + (7\u00d78\u2070) = 192 + 56 + 7 = 255." },
    { question: "Where is octal used?", answer: "Octal is primarily used in Unix/Linux file permissions (e.g., chmod 755). Each octal digit represents 3 binary bits, making it a convenient shorthand for permission sets (read=4, write=2, execute=1)." },
  ],
  formula: "Octal to Decimal: sum of (digit \u00d7 8^position) | 377\u2088 = 192+56+7 = 255\u2081\u2080 | Each octal digit = 3 binary bits",
};
