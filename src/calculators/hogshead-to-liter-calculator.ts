import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hogsheadToLiterCalculator: CalculatorDefinition = {
  slug: "hogshead-to-liter-calculator",
  title: "Hogshead to Liter Calculator",
  description: "Free hogshead to liter calculator. Convert between hogshead and L instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["hogshead to liter calculator", "hogshead to L", "converter"],
  variants: [
    {
      id: "forward",
      name: "hogshead to L",
      description: "Convert hogshead to L",
      fields: [
        {
          name: "value",
          label: "Value in hogshead",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "hogshead",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 238.481;
        return {
          primary: { label: "L", value: formatNumber(r) + " L" },
          details: [
            { label: "Input", value: formatNumber(v) + " hogshead" },
            { label: "Factor", value: "1 hogshead = 238.481 L" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert hogshead to L?", answer: "Multiply by 238.481. Example: 10 hogshead = 2384.81 L." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "L = hogshead x 238.481",
};
