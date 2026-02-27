import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gallonToLiterExactCalculator: CalculatorDefinition = {
  slug: "gallon-to-liter-exact-calculator",
  title: "Gallon To Liter Exact Calculator",
  description: "Free gallon to liter exact calculator. Convert between gallon and liter-exact instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["gallon to liter exact calculator", "gallon to liter-exact", "converter"],
  variants: [
    {
      id: "forward",
      name: "gallon to liter-exact",
      description: "Convert gallon to liter-exact",
      fields: [
        {
          name: "value",
          label: "Value in gallon",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "gallon",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 1;
        return {
          primary: { label: "liter-exact", value: formatNumber(r) + " liter-exact" },
          details: [
            { label: "Input", value: formatNumber(v) + " gallon" },
            { label: "Factor", value: "1 gallon = 1 liter-exact" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert gallon to liter-exact?", answer: "Multiply by 1. Example: 10 gallon = 10 liter-exact." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "liter-exact = gallon x 1",
};
