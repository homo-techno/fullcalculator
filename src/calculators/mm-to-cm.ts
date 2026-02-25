import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mmToCmConverter: CalculatorDefinition = {
  slug: "mm-to-cm-converter",
  title: "Millimeters to Centimeters Converter",
  description: "Free millimeters to centimeters converter. Convert mm to cm instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["mm to cm","millimeters to centimeters","mm cm converter","metric length"],
  variants: [
    {
      id: "convert",
      name: "Millimeters to Centimeters Converter",
      fields: [
        { name: "value", label: "Millimeters (mm)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const cm = value / 10;
        return {
          primary: { label: `${formatNumber(value)} mm`, value: `${formatNumber(cm, 4)} cm` },
          details: [
            { label: "Centimeters", value: formatNumber(cm, 4) },
            { label: "Meters", value: formatNumber(value / 1000, 6) },
            { label: "Inches", value: formatNumber(value / 25.4, 4) },
            { label: "Formula", value: "mm / 10 = cm" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cm-to-mm-converter","unit-converter","length-converter"],
  faq: [
    { question: "How do you convert mm to cm?", answer: "Divide the millimeter value by 10. For example, 50 mm = 5 cm." },
  ],
  formula: "1 mm = 0.1 cm | cm = mm / 10",
};
