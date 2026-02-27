import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dramToGramCalculator: CalculatorDefinition = {
  slug: "dram-to-gram-calculator",
  title: "Dram to Gram Calculator",
  description: "Free dram to gram calculator. Convert between dram and g instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["dram to gram calculator", "dram to g", "converter"],
  variants: [
    {
      id: "forward",
      name: "dram to g",
      description: "Convert dram to g",
      fields: [
        {
          name: "value",
          label: "Value in dram",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "dram",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 1.7718;
        return {
          primary: { label: "g", value: formatNumber(r) + " g" },
          details: [
            { label: "Input", value: formatNumber(v) + " dram" },
            { label: "Factor", value: "1 dram = 1.7718 g" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert dram to g?", answer: "Multiply by 1.7718. Example: 10 dram = 17.718 g." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "g = dram x 1.7718",
};
