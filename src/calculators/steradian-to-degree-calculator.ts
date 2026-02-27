import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const steradianToDegreeCalculator: CalculatorDefinition = {
  slug: "steradian-to-degree-calculator",
  title: "Steradian to Square Degree Calculator",
  description: "Free steradian to square degree calculator. Convert between sr and deg2 instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["steradian to square degree calculator", "sr to deg2", "converter"],
  variants: [
    {
      id: "forward",
      name: "sr to deg2",
      description: "Convert sr to deg2",
      fields: [
        {
          name: "value",
          label: "Value in sr",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "sr",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 3282.81;
        return {
          primary: { label: "deg2", value: formatNumber(r) + " deg2" },
          details: [
            { label: "Input", value: formatNumber(v) + " sr" },
            { label: "Factor", value: "1 sr = 3282.81 deg2" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert sr to deg2?", answer: "Multiply by 3282.81. Example: 10 sr = 32828.1 deg2." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "deg2 = sr x 3282.81",
};
