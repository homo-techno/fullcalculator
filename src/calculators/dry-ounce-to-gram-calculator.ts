import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dryOunceToGramCalculator: CalculatorDefinition = {
  slug: "dry-ounce-to-gram-calculator",
  title: "Dry Ounce To Gram Calculator",
  description: "Free dry ounce to gram calculator. Convert between dry-ounce and gram instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["dry ounce to gram calculator", "dry-ounce to gram", "converter"],
  variants: [
    {
      id: "forward",
      name: "dry-ounce to gram",
      description: "Convert dry-ounce to gram",
      fields: [
        {
          name: "value",
          label: "Value in dry-ounce",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "dry-ounce",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 1;
        return {
          primary: { label: "gram", value: formatNumber(r) + " gram" },
          details: [
            { label: "Input", value: formatNumber(v) + " dry-ounce" },
            { label: "Factor", value: "1 dry-ounce = 1 gram" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert dry-ounce to gram?", answer: "Multiply by 1. Example: 10 dry-ounce = 10 gram." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "gram = dry-ounce x 1",
};
