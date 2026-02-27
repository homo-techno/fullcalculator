import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weberToMaxwellCalculator: CalculatorDefinition = {
  slug: "weber-to-maxwell-calculator",
  title: "Weber to Maxwell Calculator",
  description: "Free weber to maxwell calculator. Convert between Wb and Mx instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["weber to maxwell calculator", "Wb to Mx", "converter"],
  variants: [
    {
      id: "forward",
      name: "Wb to Mx",
      description: "Convert Wb to Mx",
      fields: [
        {
          name: "value",
          label: "Value in Wb",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "Wb",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 100000000;
        return {
          primary: { label: "Mx", value: formatNumber(r) + " Mx" },
          details: [
            { label: "Input", value: formatNumber(v) + " Wb" },
            { label: "Factor", value: "1 Wb = 100000000 Mx" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert Wb to Mx?", answer: "Multiply by 100000000. Example: 10 Wb = 1000000000 Mx." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "Mx = Wb x 100000000",
};
