import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const inchesToCmConverter: CalculatorDefinition = {
  slug: "inches-to-cm-converter",
  title: "Inches to CM Converter",
  description:
    "Free inches to centimeters converter. Quickly convert inches to cm with our easy calculator. 1 inch = 2.54 cm.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "inches to cm",
    "inches to centimeters",
    "inch converter",
    "in to cm",
    "convert inches to cm",
  ],
  variants: [
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
  ],
  relatedSlugs: [
    "cm-to-inches-converter",
    "mm-to-inches-converter",
    "inches-to-mm-converter",
    "unit-converter",
  ],
  faq: [
    {
      question: "How many cm in an inch?",
      answer:
        "1 inch = 2.54 centimeters exactly. This is an international standard defined since 1959.",
    },
    {
      question: "How do I convert inches to cm?",
      answer:
        "Multiply the number of inches by 2.54. For example, 10 inches = 10 × 2.54 = 25.4 cm.",
    },
  ],
  formula: "cm = inches × 2.54",
};
