import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const newtonToPoundForceCalculator: CalculatorDefinition = {
  slug: "newton-to-pound-force-calculator",
  title: "Newton to Pound Force Calculator",
  description: "Free newton to pound force calculator. Convert between N and lbf instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["newton to pound force calculator", "N to lbf", "converter"],
  variants: [
    {
      id: "forward",
      name: "N to lbf",
      description: "Convert N to lbf",
      fields: [
        {
          name: "value",
          label: "Value in N",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "N",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 0.224809;
        return {
          primary: { label: "lbf", value: formatNumber(r) + " lbf" },
          details: [
            { label: "Input", value: formatNumber(v) + " N" },
            { label: "Factor", value: "1 N = 0.224809 lbf" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert N to lbf?", answer: "Multiply by 0.224809. Example: 10 N = 2.24809 lbf." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "lbf = N x 0.224809",
};
