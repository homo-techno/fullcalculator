import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mmToInchesConverter: CalculatorDefinition = {
  slug: "mm-to-inches-converter",
  title: "MM to Inches Converter",
  description:
    "Free millimeters to inches converter. Quickly convert mm to inches with our easy calculator. 1 mm = 0.03937 inches.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "mm to inches",
    "millimeters to inches",
    "mm converter",
    "mm to in",
    "convert mm to inches",
  ],
  variants: [
    {
      id: "mm-to-inches",
      name: "Millimeters to Inches",
      fields: [
        {
          name: "mm",
          label: "Millimeters",
          type: "number",
          placeholder: "e.g. 25",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.mm as number;
        if (val === undefined || val === null) return null;
        const inches = val * 0.0393701;
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
    {
      id: "inches-to-mm",
      name: "Inches to Millimeters",
      fields: [
        {
          name: "inches",
          label: "Inches",
          type: "number",
          placeholder: "e.g. 1",
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
  ],
  relatedSlugs: [
    "inches-to-mm-converter",
    "inches-to-cm-converter",
    "cm-to-inches-converter",
    "unit-converter",
  ],
  faq: [
    {
      question: "How many inches in a millimeter?",
      answer:
        "1 millimeter = 0.0393701 inches. To convert mm to inches, divide the mm value by 25.4.",
    },
    {
      question: "How do I convert mm to inches?",
      answer:
        "Divide the number of millimeters by 25.4. For example, 25 mm = 25 / 25.4 = 0.9843 inches.",
    },
  ],
  formula: "inches = mm ÷ 25.4",
};
