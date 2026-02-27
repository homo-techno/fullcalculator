import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const teaspoonToMlCalculator: CalculatorDefinition = {
  slug: "teaspoon-to-ml-calculator",
  title: "Teaspoon To Ml Calculator",
  description: "Free teaspoon to ml calculator. Convert between teaspoon and ml instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["teaspoon to ml calculator", "teaspoon to ml", "converter"],
  variants: [
    {
      id: "forward",
      name: "teaspoon to ml",
      description: "Convert teaspoon to ml",
      fields: [
        {
          name: "value",
          label: "Value in teaspoon",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "teaspoon",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 1;
        return {
          primary: { label: "ml", value: formatNumber(r) + " ml" },
          details: [
            { label: "Input", value: formatNumber(v) + " teaspoon" },
            { label: "Factor", value: "1 teaspoon = 1 ml" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert teaspoon to ml?", answer: "Multiply by 1. Example: 10 teaspoon = 10 ml." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "ml = teaspoon x 1",
};
