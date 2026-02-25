import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cmToMmConverter: CalculatorDefinition = {
  slug: "cm-to-mm-converter",
  title: "Centimeters to Millimeters Converter",
  description: "Free centimeters to millimeters converter. Convert cm to mm instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["cm to mm","centimeters to millimeters","cm mm converter","metric length"],
  variants: [
    {
      id: "convert",
      name: "Centimeters to Millimeters Converter",
      fields: [
        { name: "value", label: "Centimeters (cm)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const mm = value * 10;
        return {
          primary: { label: `${formatNumber(value)} cm`, value: `${formatNumber(mm, 4)} mm` },
          details: [
            { label: "Millimeters", value: formatNumber(mm, 4) },
            { label: "Meters", value: formatNumber(value / 100, 6) },
            { label: "Inches", value: formatNumber(value / 2.54, 4) },
            { label: "Formula", value: "cm x 10 = mm" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mm-to-cm-converter","unit-converter","length-converter"],
  faq: [
    { question: "How do you convert cm to mm?", answer: "Multiply the centimeter value by 10. For example, 5 cm = 50 mm." },
  ],
  formula: "1 cm = 10 mm | mm = cm x 10",
};
