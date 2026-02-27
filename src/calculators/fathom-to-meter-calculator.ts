import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fathomToMeterCalculator: CalculatorDefinition = {
  slug: "fathom-to-meter-calculator",
  title: "Fathom to Meter Calculator",
  description: "Free fathom to meter calculator. Convert between fathom and m instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["fathom to meter calculator", "fathom to m", "converter"],
  variants: [
    {
      id: "forward",
      name: "fathom to m",
      description: "Convert fathom to m",
      fields: [
        {
          name: "value",
          label: "Value in fathom",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "fathom",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 1.8288;
        return {
          primary: { label: "m", value: formatNumber(r) + " m" },
          details: [
            { label: "Input", value: formatNumber(v) + " fathom" },
            { label: "Factor", value: "1 fathom = 1.8288 m" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert fathom to m?", answer: "Multiply by 1.8288. Example: 10 fathom = 18.288 m." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "m = fathom x 1.8288",
};
