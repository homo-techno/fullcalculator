import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rankineToKelvinCalculator: CalculatorDefinition = {
  slug: "rankine-to-kelvin-calculator",
  title: "Rankine to Kelvin Calculator",
  description: "Free rankine to kelvin calculator. Convert between R and K instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["rankine to kelvin calculator", "R to K", "converter"],
  variants: [
    {
      id: "forward",
      name: "R to K",
      description: "Convert R to K",
      fields: [
        {
          name: "value",
          label: "Value in R",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "R",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 0.555556;
        return {
          primary: { label: "K", value: formatNumber(r) + " K" },
          details: [
            { label: "Input", value: formatNumber(v) + " R" },
            { label: "Factor", value: "1 R = 0.555556 K" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert R to K?", answer: "Multiply by 0.555556. Example: 10 R = 5.555560000000001 K." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "K = R x 0.555556",
};
