import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stoneToKgCalculator: CalculatorDefinition = {
  slug: "stone-to-kg-calculator",
  title: "Stone to KG Calculator",
  description: "Free stone to kg calculator. Convert between stone and kg instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["stone to kg calculator", "stone to kg", "converter"],
  variants: [
    {
      id: "forward",
      name: "stone to kg",
      description: "Convert stone to kg",
      fields: [
        {
          name: "value",
          label: "Value in stone",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "stone",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 6.35029;
        return {
          primary: { label: "kg", value: formatNumber(r) + " kg" },
          details: [
            { label: "Input", value: formatNumber(v) + " stone" },
            { label: "Factor", value: "1 stone = 6.35029 kg" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert stone to kg?", answer: "Multiply by 6.35029. Example: 10 stone = 63.502900000000004 kg." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "kg = stone x 6.35029",
};
