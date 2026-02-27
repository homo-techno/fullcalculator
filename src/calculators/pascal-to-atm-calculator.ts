import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pascalToAtmCalculator: CalculatorDefinition = {
  slug: "pascal-to-atm-calculator",
  title: "Pascal to ATM Calculator",
  description: "Free pascal to atm calculator. Convert between Pa and atm instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["pascal to atm calculator", "Pa to atm", "converter"],
  variants: [
    {
      id: "forward",
      name: "Pa to atm",
      description: "Convert Pa to atm",
      fields: [
        {
          name: "value",
          label: "Value in Pa",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "Pa",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 0.00000986923;
        return {
          primary: { label: "atm", value: formatNumber(r) + " atm" },
          details: [
            { label: "Input", value: formatNumber(v) + " Pa" },
            { label: "Factor", value: "1 Pa = 0.00000986923 atm" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert Pa to atm?", answer: "Multiply by 0.00000986923. Example: 10 Pa = 0.0000986923 atm." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "atm = Pa x 0.00000986923",
};
