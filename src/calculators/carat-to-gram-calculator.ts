import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const caratToGramCalculator: CalculatorDefinition = {
  slug: "carat-to-gram-calculator",
  title: "Carat to Gram Calculator",
  description: "Free carat to gram calculator. Convert between ct and g instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["carat to gram calculator", "ct to g", "converter"],
  variants: [
    {
      id: "forward",
      name: "ct to g",
      description: "Convert ct to g",
      fields: [
        {
          name: "value",
          label: "Value in ct",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "ct",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 0.2;
        return {
          primary: { label: "g", value: formatNumber(r) + " g" },
          details: [
            { label: "Input", value: formatNumber(v) + " ct" },
            { label: "Factor", value: "1 ct = 0.2 g" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert ct to g?", answer: "Multiply by 0.2. Example: 10 ct = 2 g." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "g = ct x 0.2",
};
