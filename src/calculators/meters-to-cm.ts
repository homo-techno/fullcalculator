import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const metersToCmConverter: CalculatorDefinition = {
  slug: "meters-to-cm-converter",
  title: "Meters to Centimeters Converter",
  description:
    "Free meters to centimeters converter. Instantly convert m to cm with formula and examples. Formula: cm = m × 100.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "meters to centimeters",
    "m to cm",
    "meters to cm",
    "convert meters to centimeters",
    "length conversion",
  ],
  variants: [
    {
      id: "meters-to-cm",
      name: "Meters to Centimeters",
      fields: [
        {
          name: "meters",
          label: "Meters (m)",
          type: "number",
          placeholder: "e.g. 1.75",
        },
      ],
      calculate: (inputs) => {
        const m = inputs.meters as number;
        if (m === undefined || m === null) return null;
        const cm = m * 100;
        const mm = m * 1000;
        const inches = m * 39.3701;
        const feet = m * 3.28084;
        return {
          primary: {
            label: `${formatNumber(m, 4)} m`,
            value: `${formatNumber(cm, 2)} cm`,
          },
          details: [
            { label: "Centimeters", value: `${formatNumber(cm, 4)} cm` },
            { label: "Millimeters", value: `${formatNumber(mm, 2)} mm` },
            { label: "Inches", value: `${formatNumber(inches, 4)} in` },
            { label: "Feet", value: `${formatNumber(feet, 4)} ft` },
            { label: "Formula", value: "cm = m × 100" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "cm-to-meters-converter",
    "meters-to-feet-converter",
    "inches-to-cm-converter",
    "length-converter",
  ],
  faq: [
    {
      question: "How many centimeters are in a meter?",
      answer:
        "There are 100 centimeters in 1 meter. To convert meters to centimeters, multiply by 100.",
    },
    {
      question: "How many cm is 1.75 meters?",
      answer:
        "1.75 meters = 175 centimeters. Multiply 1.75 by 100 to get 175 cm.",
    },
  ],
  formula: "cm = m × 100",
};
