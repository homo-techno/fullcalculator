import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bushelToLiterCalculator: CalculatorDefinition = {
  slug: "bushel-to-liter-calculator",
  title: "Bushel to Liter Calculator",
  description: "Free bushel to liter calculator. Convert between bushel and L instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["bushel to liter calculator", "bushel to L", "converter"],
  variants: [
    {
      id: "forward",
      name: "bushel to L",
      description: "Convert bushel to L",
      fields: [
        {
          name: "value",
          label: "Value in bushel",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "bushel",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 35.2391;
        return {
          primary: { label: "L", value: formatNumber(r) + " L" },
          details: [
            { label: "Input", value: formatNumber(v) + " bushel" },
            { label: "Factor", value: "1 bushel = 35.2391 L" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert bushel to L?", answer: "Multiply by 35.2391. Example: 10 bushel = 352.391 L." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "L = bushel x 35.2391",
};
