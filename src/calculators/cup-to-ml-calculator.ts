import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cupToMlCalculator: CalculatorDefinition = {
  slug: "cup-to-ml-calculator",
  title: "Cup To Ml Calculator",
  description: "Free cup to ml calculator. Convert between cup and ml instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["cup to ml calculator", "cup to ml", "converter"],
  variants: [
    {
      id: "forward",
      name: "cup to ml",
      description: "Convert cup to ml",
      fields: [
        {
          name: "value",
          label: "Value in cup",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "cup",
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
            { label: "Input", value: formatNumber(v) + " cup" },
            { label: "Factor", value: "1 cup = 1 ml" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert cup to ml?", answer: "Multiply by 1. Example: 10 cup = 10 ml." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "ml = cup x 1",
};
