import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const torrToPascalCalculator: CalculatorDefinition = {
  slug: "torr-to-pascal-calculator",
  title: "Torr to Pascal Calculator",
  description: "Free torr to pascal calculator. Convert between Torr and Pa instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["torr to pascal calculator", "Torr to Pa", "converter"],
  variants: [
    {
      id: "forward",
      name: "Torr to Pa",
      description: "Convert Torr to Pa",
      fields: [
        {
          name: "value",
          label: "Value in Torr",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "Torr",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 133.322;
        return {
          primary: { label: "Pa", value: formatNumber(r) + " Pa" },
          details: [
            { label: "Input", value: formatNumber(v) + " Torr" },
            { label: "Factor", value: "1 Torr = 133.322 Pa" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert Torr to Pa?", answer: "Multiply by 133.322. Example: 10 Torr = 1333.22 Pa." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "Pa = Torr x 133.322",
};
