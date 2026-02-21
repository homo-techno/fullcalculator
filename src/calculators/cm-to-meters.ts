import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cmToMetersConverter: CalculatorDefinition = {
  slug: "cm-to-meters-converter",
  title: "Centimeters to Meters Converter",
  description:
    "Free centimeters to meters converter. Instantly convert cm to m with formula and examples. Formula: m = cm ÷ 100.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "centimeters to meters",
    "cm to m",
    "cm to meters",
    "convert centimeters to meters",
    "length conversion",
  ],
  variants: [
    {
      id: "cm-to-meters",
      name: "Centimeters to Meters",
      fields: [
        {
          name: "cm",
          label: "Centimeters (cm)",
          type: "number",
          placeholder: "e.g. 175",
        },
      ],
      calculate: (inputs) => {
        const cm = inputs.cm as number;
        if (cm === undefined || cm === null) return null;
        const meters = cm / 100;
        const mm = cm * 10;
        const inches = cm / 2.54;
        const feet = cm / 30.48;
        return {
          primary: {
            label: `${formatNumber(cm, 2)} cm`,
            value: `${formatNumber(meters, 4)} m`,
          },
          details: [
            { label: "Meters", value: `${formatNumber(meters, 4)} m` },
            { label: "Millimeters", value: `${formatNumber(mm, 2)} mm` },
            { label: "Inches", value: `${formatNumber(inches, 4)} in` },
            { label: "Feet", value: `${formatNumber(feet, 4)} ft` },
            { label: "Formula", value: "m = cm ÷ 100" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "meters-to-cm-converter",
    "cm-to-inches-converter",
    "meters-to-feet-converter",
    "length-converter",
  ],
  faq: [
    {
      question: "How do you convert centimeters to meters?",
      answer:
        "Divide the centimeter value by 100. For example, 175 cm = 175 ÷ 100 = 1.75 m.",
    },
    {
      question: "How many meters is 500 cm?",
      answer:
        "500 cm = 5 meters. Divide 500 by 100 to get 5 m.",
    },
  ],
  formula: "m = cm ÷ 100",
};
