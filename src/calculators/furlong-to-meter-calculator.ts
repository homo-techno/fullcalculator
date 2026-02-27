import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const furlongToMeterCalculator: CalculatorDefinition = {
  slug: "furlong-to-meter-calculator",
  title: "Furlong to Meter Calculator",
  description: "Free furlong to meter calculator. Convert between furlong and m instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["furlong to meter calculator", "furlong to m", "converter"],
  variants: [
    {
      id: "forward",
      name: "furlong to m",
      description: "Convert furlong to m",
      fields: [
        {
          name: "value",
          label: "Value in furlong",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "furlong",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 201.168;
        return {
          primary: { label: "m", value: formatNumber(r) + " m" },
          details: [
            { label: "Input", value: formatNumber(v) + " furlong" },
            { label: "Factor", value: "1 furlong = 201.168 m" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert furlong to m?", answer: "Multiply by 201.168. Example: 10 furlong = 2011.68 m." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "m = furlong x 201.168",
};
