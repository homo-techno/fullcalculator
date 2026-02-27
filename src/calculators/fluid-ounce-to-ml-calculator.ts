import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fluidOunceToMlCalculator: CalculatorDefinition = {
  slug: "fluid-ounce-to-ml-calculator",
  title: "Fluid Ounce To Ml Calculator",
  description: "Free fluid ounce to ml calculator. Convert between fluid-ounce and ml instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["fluid ounce to ml calculator", "fluid-ounce to ml", "converter"],
  variants: [
    {
      id: "forward",
      name: "fluid-ounce to ml",
      description: "Convert fluid-ounce to ml",
      fields: [
        {
          name: "value",
          label: "Value in fluid-ounce",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "fluid-ounce",
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
            { label: "Input", value: formatNumber(v) + " fluid-ounce" },
            { label: "Factor", value: "1 fluid-ounce = 1 ml" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert fluid-ounce to ml?", answer: "Multiply by 1. Example: 10 fluid-ounce = 10 ml." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "ml = fluid-ounce x 1",
};
