import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const grainToGramCalculator: CalculatorDefinition = {
  slug: "grain-to-gram-calculator",
  title: "Grain to Gram Calculator",
  description: "Free grain to gram calculator. Convert between grain and g instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["grain to gram calculator", "grain to g", "converter"],
  variants: [
    {
      id: "forward",
      name: "grain to g",
      description: "Convert grain to g",
      fields: [
        {
          name: "value",
          label: "Value in grain",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "grain",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 0.0648;
        return {
          primary: { label: "g", value: formatNumber(r) + " g" },
          details: [
            { label: "Input", value: formatNumber(v) + " grain" },
            { label: "Factor", value: "1 grain = 0.0648 g" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert grain to g?", answer: "Multiply by 0.0648. Example: 10 grain = 0.6479999999999999 g." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "g = grain x 0.0648",
};
