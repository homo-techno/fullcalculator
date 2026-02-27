import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const radianToGradianCalculator: CalculatorDefinition = {
  slug: "radian-to-gradian-calculator",
  title: "Radian to Gradian Calculator",
  description: "Free radian to gradian calculator. Convert between rad and grad instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["radian to gradian calculator", "rad to grad", "converter"],
  variants: [
    {
      id: "forward",
      name: "rad to grad",
      description: "Convert rad to grad",
      fields: [
        {
          name: "value",
          label: "Value in rad",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "rad",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 63.662;
        return {
          primary: { label: "grad", value: formatNumber(r) + " grad" },
          details: [
            { label: "Input", value: formatNumber(v) + " rad" },
            { label: "Factor", value: "1 rad = 63.662 grad" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert rad to grad?", answer: "Multiply by 63.662. Example: 10 rad = 636.62 grad." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "grad = rad x 63.662",
};
