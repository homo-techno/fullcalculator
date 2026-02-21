import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cmToInchesConverter: CalculatorDefinition = {
  slug: "cm-to-inches-converter",
  title: "CM to Inches Converter",
  description:
    "Free centimeters to inches converter. Quickly convert cm to inches with our easy calculator. 1 cm = 0.3937 inches.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "cm to inches",
    "centimeters to inches",
    "cm converter",
    "cm to in",
    "convert cm to inches",
  ],
  variants: [
    {
      id: "cm-to-inches",
      name: "Centimeters to Inches",
      fields: [
        {
          name: "cm",
          label: "Centimeters",
          type: "number",
          placeholder: "e.g. 30",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.cm as number;
        if (val === undefined || val === null) return null;
        const inches = val / 2.54;
        return {
          primary: {
            label: `${formatNumber(val, 4)} cm`,
            value: `${formatNumber(inches, 4)} inches`,
          },
          details: [
            { label: "Inches", value: formatNumber(inches, 4) },
            { label: "Feet", value: formatNumber(inches / 12, 4) },
            { label: "Millimeters", value: formatNumber(val * 10, 2) },
            { label: "Meters", value: formatNumber(val / 100, 6) },
          ],
        };
      },
    },
    {
      id: "inches-to-cm",
      name: "Inches to Centimeters",
      fields: [
        {
          name: "inches",
          label: "Inches",
          type: "number",
          placeholder: "e.g. 12",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.inches as number;
        if (val === undefined || val === null) return null;
        const cm = val * 2.54;
        return {
          primary: {
            label: `${formatNumber(val, 4)} inches`,
            value: `${formatNumber(cm, 4)} cm`,
          },
          details: [
            { label: "Centimeters", value: formatNumber(cm, 4) },
            { label: "Millimeters", value: formatNumber(cm * 10, 2) },
            { label: "Meters", value: formatNumber(cm / 100, 6) },
            { label: "Feet", value: formatNumber(val / 12, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "inches-to-cm-converter",
    "mm-to-inches-converter",
    "inches-to-mm-converter",
    "unit-converter",
  ],
  faq: [
    {
      question: "How many inches in a centimeter?",
      answer:
        "1 centimeter = 0.393701 inches. To convert cm to inches, divide the cm value by 2.54.",
    },
    {
      question: "How do I convert cm to inches?",
      answer:
        "Divide the number of centimeters by 2.54. For example, 30 cm = 30 / 2.54 = 11.811 inches.",
    },
  ],
  formula: "inches = cm ÷ 2.54",
};
