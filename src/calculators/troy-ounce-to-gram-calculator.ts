import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const troyOunceToGramCalculator: CalculatorDefinition = {
  slug: "troy-ounce-to-gram-calculator",
  title: "Troy Ounce to Gram Calculator",
  description: "Free troy ounce to gram calculator. Convert between troy oz and g instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["troy ounce to gram calculator", "troy oz to g", "converter"],
  variants: [
    {
      id: "forward",
      name: "troy oz to g",
      description: "Convert troy oz to g",
      fields: [
        {
          name: "value",
          label: "Value in troy oz",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "troy oz",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 31.1035;
        return {
          primary: { label: "g", value: formatNumber(r) + " g" },
          details: [
            { label: "Input", value: formatNumber(v) + " troy oz" },
            { label: "Factor", value: "1 troy oz = 31.1035 g" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert troy oz to g?", answer: "Multiply by 31.1035. Example: 10 troy oz = 311.035 g." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "g = troy oz x 31.1035",
};
