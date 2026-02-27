import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tablespoonToMlCalculator: CalculatorDefinition = {
  slug: "tablespoon-to-ml-calculator",
  title: "Tablespoon To Ml Calculator",
  description: "Free tablespoon to ml calculator. Convert between tablespoon and ml instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["tablespoon to ml calculator", "tablespoon to ml", "converter"],
  variants: [
    {
      id: "forward",
      name: "tablespoon to ml",
      description: "Convert tablespoon to ml",
      fields: [
        {
          name: "value",
          label: "Value in tablespoon",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "tablespoon",
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
            { label: "Input", value: formatNumber(v) + " tablespoon" },
            { label: "Factor", value: "1 tablespoon = 1 ml" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert tablespoon to ml?", answer: "Multiply by 1. Example: 10 tablespoon = 10 ml." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "ml = tablespoon x 1",
};
