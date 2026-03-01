import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const asciiConverterCalculator: CalculatorDefinition = {
  slug: "ascii-converter",
  title: "ASCII Converter",
  description: "Convert ASCII code values to characters and explore the ASCII table.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["ascii converter", "text to ascii", "character code converter"],
  variants: [{
    id: "standard",
    name: "ASCII",
    description: "Convert ASCII code values to characters and explore the ASCII table",
    fields: [
      { name: "code", label: "ASCII Code (0-127)", type: "number", min: 0, max: 127, defaultValue: 65 },
    ],
    calculate: (inputs) => {
      const code = inputs.code as number;
      if (code === undefined || code < 0 || code > 127) return null;
      const char = code >= 32 && code <= 126 ? String.fromCharCode(code) : "(non-printable)";
      const binary = code.toString(2).padStart(8, "0");
      const hex = code.toString(16).toUpperCase().padStart(2, "0");
      const octal = code.toString(8);
      const category = code < 32 ? "Control character" : code === 32 ? "Space" : code <= 47 ? "Punctuation/Symbol" : code <= 57 ? "Digit" : code <= 64 ? "Symbol" : code <= 90 ? "Uppercase letter" : code <= 96 ? "Symbol" : code <= 122 ? "Lowercase letter" : code <= 126 ? "Symbol" : "DEL";
      return {
        primary: { label: "Character", value: char },
        details: [
          { label: "ASCII Code", value: formatNumber(code) },
          { label: "Binary", value: binary },
          { label: "Hexadecimal", value: "0x" + hex },
          { label: "Octal", value: octal },
          { label: "Category", value: category },
        ],
      };
    },
  }],
  relatedSlugs: ["hex-to-rgb-calculator", "number-base-converter"],
  faq: [
    { question: "What is ASCII?", answer: "ASCII (American Standard Code for Information Interchange) is a character encoding standard that assigns numeric values 0 to 127 to letters, digits, and symbols." },
    { question: "What is the ASCII value of A?", answer: "Uppercase A is 65, lowercase a is 97. The difference between uppercase and lowercase letters is always 32." },
  ],
  formula: "ASCII Code = character encoding value (0 to 127 for standard ASCII)",
};
