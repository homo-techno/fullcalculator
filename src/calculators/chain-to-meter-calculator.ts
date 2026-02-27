import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chainToMeterCalculator: CalculatorDefinition = {
  slug: "chain-to-meter-calculator",
  title: "Chain to Meter Calculator",
  description: "Free chain to meter calculator. Convert between chain and m instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["chain to meter calculator", "chain to m", "converter"],
  variants: [
    {
      id: "forward",
      name: "chain to m",
      description: "Convert chain to m",
      fields: [
        {
          name: "value",
          label: "Value in chain",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "chain",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 20.1168;
        return {
          primary: { label: "m", value: formatNumber(r) + " m" },
          details: [
            { label: "Input", value: formatNumber(v) + " chain" },
            { label: "Factor", value: "1 chain = 20.1168 m" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert chain to m?", answer: "Multiply by 20.1168. Example: 10 chain = 201.168 m." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "m = chain x 20.1168",
};
