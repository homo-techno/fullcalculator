import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rodToMeterCalculator: CalculatorDefinition = {
  slug: "rod-to-meter-calculator",
  title: "Rod to Meter Calculator",
  description: "Free rod to meter calculator. Convert between rod and m instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["rod to meter calculator", "rod to m", "converter"],
  variants: [
    {
      id: "forward",
      name: "rod to m",
      description: "Convert rod to m",
      fields: [
        {
          name: "value",
          label: "Value in rod",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "rod",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 5.0292;
        return {
          primary: { label: "m", value: formatNumber(r) + " m" },
          details: [
            { label: "Input", value: formatNumber(v) + " rod" },
            { label: "Factor", value: "1 rod = 5.0292 m" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert rod to m?", answer: "Multiply by 5.0292. Example: 10 rod = 50.292 m." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "m = rod x 5.0292",
};
