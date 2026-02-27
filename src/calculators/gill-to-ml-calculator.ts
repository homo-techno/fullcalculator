import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gillToMlCalculator: CalculatorDefinition = {
  slug: "gill-to-ml-calculator",
  title: "Gill to ML Calculator",
  description: "Free gill to ml calculator. Convert between gill and mL instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["gill to ml calculator", "gill to mL", "converter"],
  variants: [
    {
      id: "forward",
      name: "gill to mL",
      description: "Convert gill to mL",
      fields: [
        {
          name: "value",
          label: "Value in gill",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "gill",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 118.294;
        return {
          primary: { label: "mL", value: formatNumber(r) + " mL" },
          details: [
            { label: "Input", value: formatNumber(v) + " gill" },
            { label: "Factor", value: "1 gill = 118.294 mL" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert gill to mL?", answer: "Multiply by 118.294. Example: 10 gill = 1182.94 mL." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "mL = gill x 118.294",
};
