import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const quartToLiterCalculator: CalculatorDefinition = {
  slug: "quart-to-liter-calculator",
  title: "Quart To Liter Calculator",
  description: "Free quart to liter calculator. Convert between quart and liter instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["quart to liter calculator", "quart to liter", "converter"],
  variants: [
    {
      id: "forward",
      name: "quart to liter",
      description: "Convert quart to liter",
      fields: [
        {
          name: "value",
          label: "Value in quart",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "quart",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 1;
        return {
          primary: { label: "liter", value: formatNumber(r) + " liter" },
          details: [
            { label: "Input", value: formatNumber(v) + " quart" },
            { label: "Factor", value: "1 quart = 1 liter" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert quart to liter?", answer: "Multiply by 1. Example: 10 quart = 10 liter." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "liter = quart x 1",
};
