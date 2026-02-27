import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pintToMlCalculator: CalculatorDefinition = {
  slug: "pint-to-ml-calculator",
  title: "Pint To Ml Calculator",
  description: "Free pint to ml calculator. Convert between pint and ml instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["pint to ml calculator", "pint to ml", "converter"],
  variants: [
    {
      id: "forward",
      name: "pint to ml",
      description: "Convert pint to ml",
      fields: [
        {
          name: "value",
          label: "Value in pint",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "pint",
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
            { label: "Input", value: formatNumber(v) + " pint" },
            { label: "Factor", value: "1 pint = 1 ml" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert pint to ml?", answer: "Multiply by 1. Example: 10 pint = 10 ml." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "ml = pint x 1",
};
