import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const inchesToFeetConverter: CalculatorDefinition = {
  slug: "inches-to-feet-converter",
  title: "Inches to Feet Converter",
  description:
    "Free inches to feet converter. Instantly convert in to ft with formula and examples. Formula: ft = in ÷ 12.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "inches to feet",
    "in to ft",
    "convert inches to feet",
    "inch to foot",
    "length conversion",
  ],
  variants: [
    {
      id: "inches-to-feet",
      name: "Inches to Feet",
      fields: [
        {
          name: "inches",
          label: "Inches (in)",
          type: "number",
          placeholder: "e.g. 72",
        },
      ],
      calculate: (inputs) => {
        const inches = inputs.inches as number;
        if (inches === undefined || inches === null) return null;
        const feet = inches / 12;
        const wholeFeet = Math.floor(feet);
        const remainingInches = inches - wholeFeet * 12;
        const cm = inches * 2.54;
        const meters = inches * 0.0254;
        return {
          primary: {
            label: `${formatNumber(inches, 2)} in`,
            value: `${formatNumber(feet, 4)} ft`,
          },
          details: [
            { label: "Feet", value: `${formatNumber(feet, 4)} ft` },
            { label: "Feet & Inches", value: `${wholeFeet}' ${formatNumber(remainingInches, 1)}"` },
            { label: "Centimeters", value: `${formatNumber(cm, 2)} cm` },
            { label: "Meters", value: `${formatNumber(meters, 4)} m` },
            { label: "Formula", value: "ft = in ÷ 12" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "feet-to-inches-converter",
    "inches-to-cm-converter",
    "feet-to-meters-converter",
    "length-converter",
  ],
  faq: [
    {
      question: "How many feet is 72 inches?",
      answer:
        "72 inches = 6 feet. Divide 72 by 12 to get 6 ft.",
    },
    {
      question: "How do you convert inches to feet?",
      answer:
        "Divide the number of inches by 12. There are 12 inches in 1 foot.",
    },
  ],
  formula: "ft = in ÷ 12",
};
