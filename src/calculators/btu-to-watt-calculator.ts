import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const btuToWattCalculator: CalculatorDefinition = {
  slug: "btu-to-watt-calculator",
  title: "BTU to Watt Calculator",
  description: "Free btu to watt calculator. Convert between BTU/h and W instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["btu to watt calculator", "BTU/h to W", "converter"],
  variants: [
    {
      id: "forward",
      name: "BTU/h to W",
      description: "Convert BTU/h to W",
      fields: [
        {
          name: "value",
          label: "Value in BTU/h",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "BTU/h",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 0.293071;
        return {
          primary: { label: "W", value: formatNumber(r) + " W" },
          details: [
            { label: "Input", value: formatNumber(v) + " BTU/h" },
            { label: "Factor", value: "1 BTU/h = 0.293071 W" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert BTU/h to W?", answer: "Multiply by 0.293071. Example: 10 BTU/h = 2.9307100000000004 W." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "W = BTU/h x 0.293071",
};
