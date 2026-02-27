import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const barToPsiCalculator: CalculatorDefinition = {
  slug: "bar-to-psi-calculator",
  title: "Bar to PSI Calculator",
  description: "Free bar to psi calculator. Convert between bar and psi instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["bar to psi calculator", "bar to psi", "converter"],
  variants: [
    {
      id: "forward",
      name: "bar to psi",
      description: "Convert bar to psi",
      fields: [
        {
          name: "value",
          label: "Value in bar",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "bar",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 14.5038;
        return {
          primary: { label: "psi", value: formatNumber(r) + " psi" },
          details: [
            { label: "Input", value: formatNumber(v) + " bar" },
            { label: "Factor", value: "1 bar = 14.5038 psi" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert bar to psi?", answer: "Multiply by 14.5038. Example: 10 bar = 145.038 psi." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "psi = bar x 14.5038",
};
