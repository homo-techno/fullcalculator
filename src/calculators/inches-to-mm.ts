import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const inchesToMmConverter: CalculatorDefinition = {
  slug: "inches-to-mm-converter",
  title: "Inches to MM Converter",
  description:
    "Free inches to millimeters converter. Quickly convert inches to mm with our easy calculator. 1 inch = 25.4 mm.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "inches to mm",
    "inches to millimeters",
    "inch to mm",
    "in to mm",
    "convert inches to mm",
  ],
  variants: [
    {
      id: "inches-to-mm",
      name: "Inches to Millimeters",
      fields: [
        {
          name: "inches",
          label: "Inches",
          type: "number",
          placeholder: "e.g. 5",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.inches as number;
        if (val === undefined || val === null) return null;
        const mm = val * 25.4;
        return {
          primary: {
            label: `${formatNumber(val, 4)} inches`,
            value: `${formatNumber(mm, 4)} mm`,
          },
          details: [
            { label: "Millimeters", value: formatNumber(mm, 4) },
            { label: "Centimeters", value: formatNumber(mm / 10, 4) },
            { label: "Meters", value: formatNumber(mm / 1000, 6) },
            { label: "Feet", value: formatNumber(val / 12, 6) },
          ],
        };
      },
    },
    {
      id: "mm-to-inches",
      name: "Millimeters to Inches",
      fields: [
        {
          name: "mm",
          label: "Millimeters",
          type: "number",
          placeholder: "e.g. 127",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.mm as number;
        if (val === undefined || val === null) return null;
        const inches = val / 25.4;
        return {
          primary: {
            label: `${formatNumber(val, 4)} mm`,
            value: `${formatNumber(inches, 4)} inches`,
          },
          details: [
            { label: "Inches", value: formatNumber(inches, 4) },
            { label: "Feet", value: formatNumber(inches / 12, 6) },
            { label: "Centimeters", value: formatNumber(val / 10, 4) },
            { label: "Meters", value: formatNumber(val / 1000, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "mm-to-inches-converter",
    "inches-to-cm-converter",
    "cm-to-inches-converter",
    "unit-converter",
  ],
  faq: [
    {
      question: "How many mm in an inch?",
      answer:
        "1 inch = 25.4 millimeters exactly. This is an international standard.",
    },
    {
      question: "How do I convert inches to mm?",
      answer:
        "Multiply the number of inches by 25.4. For example, 5 inches = 5 × 25.4 = 127 mm.",
    },
  ],
  formula: "mm = inches × 25.4",
};
