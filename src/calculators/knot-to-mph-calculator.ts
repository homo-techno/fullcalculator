import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const knotToMphCalculator: CalculatorDefinition = {
  slug: "knot-to-mph-calculator",
  title: "Knot to MPH Calculator",
  description: "Free knot to mph calculator. Convert between knots and mph instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["knot to mph calculator", "knots to mph", "converter"],
  variants: [
    {
      id: "forward",
      name: "knots to mph",
      description: "Convert knots to mph",
      fields: [
        {
          name: "value",
          label: "Value in knots",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "knots",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 1.15078;
        return {
          primary: { label: "mph", value: formatNumber(r) + " mph" },
          details: [
            { label: "Input", value: formatNumber(v) + " knots" },
            { label: "Factor", value: "1 knots = 1.15078 mph" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert knots to mph?", answer: "Multiply by 1.15078. Example: 10 knots = 11.5078 mph." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "mph = knots x 1.15078",
};
