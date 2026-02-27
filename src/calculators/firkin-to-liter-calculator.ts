import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const firkinToLiterCalculator: CalculatorDefinition = {
  slug: "firkin-to-liter-calculator",
  title: "Firkin to Liter Calculator",
  description: "Free firkin to liter calculator. Convert between firkin and L instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["firkin to liter calculator", "firkin to L", "converter"],
  variants: [
    {
      id: "forward",
      name: "firkin to L",
      description: "Convert firkin to L",
      fields: [
        {
          name: "value",
          label: "Value in firkin",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "firkin",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 40.9148;
        return {
          primary: { label: "L", value: formatNumber(r) + " L" },
          details: [
            { label: "Input", value: formatNumber(v) + " firkin" },
            { label: "Factor", value: "1 firkin = 40.9148 L" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert firkin to L?", answer: "Multiply by 40.9148. Example: 10 firkin = 409.148 L." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "L = firkin x 40.9148",
};
