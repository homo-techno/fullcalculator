import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const feetToCmConverter: CalculatorDefinition = {
  slug: "feet-to-cm-converter",
  title: "Feet to Centimeters Converter",
  description: "Free feet to centimeters converter. Convert feet to cm instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["feet to cm","ft to cm","feet centimeters converter","length conversion"],
  variants: [
    {
      id: "convert",
      name: "Feet to Centimeters Converter",
      fields: [
        { name: "value", label: "Feet (ft)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const cm = value * 30.48;
        return {
          primary: { label: `${formatNumber(value)} ft`, value: `${formatNumber(cm, 4)} cm` },
          details: [
            { label: "Centimeters", value: formatNumber(cm, 2) },
            { label: "Meters", value: formatNumber(cm / 100, 4) },
            { label: "Inches", value: formatNumber(value * 12, 2) },
            { label: "Formula", value: "ft x 30.48 = cm" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cm-to-feet-converter","unit-converter","length-converter"],
  faq: [
    { question: "How many cm are in a foot?", answer: "There are 30.48 centimeters in 1 foot. Multiply feet by 30.48 to get cm." },
  ],
  formula: "1 ft = 30.48 cm | cm = ft x 30.48",
};
