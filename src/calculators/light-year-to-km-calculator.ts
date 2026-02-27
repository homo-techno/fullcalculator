import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lightYearToKmCalculator: CalculatorDefinition = {
  slug: "light-year-to-km-calculator",
  title: "Light Year to KM Calculator",
  description: "Free light year to km calculator. Convert between ly and km instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["light year to km calculator", "ly to km", "converter"],
  variants: [
    {
      id: "forward",
      name: "ly to km",
      description: "Convert ly to km",
      fields: [
        {
          name: "value",
          label: "Value in ly",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "ly",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 9461000000000;
        return {
          primary: { label: "km", value: formatNumber(r) + " km" },
          details: [
            { label: "Input", value: formatNumber(v) + " ly" },
            { label: "Factor", value: "1 ly = 9461000000000 km" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert ly to km?", answer: "Multiply by 9461000000000. Example: 10 ly = 94610000000000 km." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "km = ly x 9461000000000",
};
