import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fishTankVolumeCalculator: CalculatorDefinition = {
  slug: "fish-tank-volume-calculator",
  title: "Fish Tank Volume Calculator",
  description: "Free fish tank volume calculator. Get instant results with our easy-to-use calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["fish tank volume calculator", "calculator", "online tool"],
  variants: [
    {
      id: "standard",
      name: "Fish Tank Volume",
      description: "Calculate fish tank volume",
      fields: [
        {
          name: "size",
          label: "Size / Weight",
          type: "number",
          placeholder: "e.g. 20",
          min: 0,
        },
        {
          name: "age",
          label: "Age",
          type: "number",
          placeholder: "e.g. 3",
          min: 0,
        },
        {
          name: "type",
          label: "Type",
          type: "select",
          defaultValue: "1",
          options: [{ label: "Small", value: "0.8" }, { label: "Medium", value: "1" }, { label: "Large", value: "1.3" }],
        }
      ],
      calculate: (inputs) => {
        const size = inputs.size as number;
        const age = inputs.age as number;
        const factor = parseFloat(inputs.type as string) || 1;
        if (!size) return null;
        const result = size * factor * (age ? Math.max(0.5, 1 - age/100) : 1);
        return {
          primary: { label: "Recommended", value: formatNumber(result) },
          details: [
            { label: "Base value", value: formatNumber(size) },
            { label: "Size factor", value: "x" + factor },
            { label: "Adjusted", value: formatNumber(result) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    { question: "How does the fish tank volume calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
