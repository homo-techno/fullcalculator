import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const metersToFeetConverter: CalculatorDefinition = {
  slug: "meters-to-feet-converter",
  title: "Meters to Feet Converter",
  description:
    "Free meters to feet converter. Quickly convert meters to feet with our easy calculator. 1 meter = 3.28084 feet.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "meters to feet",
    "m to ft",
    "meter to foot",
    "convert meters to feet",
    "meter converter",
  ],
  variants: [
    {
      id: "meters-to-feet",
      name: "Meters to Feet",
      fields: [
        {
          name: "meters",
          label: "Meters",
          type: "number",
          placeholder: "e.g. 2",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.meters as number;
        if (val === undefined || val === null) return null;
        const feet = val * 3.28084;
        return {
          primary: {
            label: `${formatNumber(val, 4)} meters`,
            value: `${formatNumber(feet, 4)} feet`,
          },
          details: [
            { label: "Feet", value: formatNumber(feet, 4) },
            { label: "Inches", value: formatNumber(feet * 12, 2) },
            { label: "Yards", value: formatNumber(feet / 3, 4) },
            { label: "Centimeters", value: formatNumber(val * 100, 2) },
            { label: "Millimeters", value: formatNumber(val * 1000, 2) },
          ],
        };
      },
    },
    {
      id: "feet-to-meters",
      name: "Feet to Meters",
      fields: [
        {
          name: "feet",
          label: "Feet",
          type: "number",
          placeholder: "e.g. 6",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.feet as number;
        if (val === undefined || val === null) return null;
        const meters = val * 0.3048;
        return {
          primary: {
            label: `${formatNumber(val, 4)} feet`,
            value: `${formatNumber(meters, 4)} meters`,
          },
          details: [
            { label: "Meters", value: formatNumber(meters, 4) },
            { label: "Centimeters", value: formatNumber(meters * 100, 2) },
            { label: "Yards", value: formatNumber(val / 3, 4) },
            { label: "Inches", value: formatNumber(val * 12, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "feet-to-meters-converter",
    "yards-to-meters-converter",
    "inches-to-cm-converter",
    "unit-converter",
  ],
  faq: [
    {
      question: "How many feet in a meter?",
      answer:
        "1 meter = 3.28084 feet. To convert meters to feet, multiply the meter value by 3.28084.",
    },
    {
      question: "How do I convert meters to feet?",
      answer:
        "Multiply the number of meters by 3.28084. For example, 2 meters = 2 × 3.28084 = 6.5617 feet.",
    },
  ],
  formula: "feet = meters × 3.28084",
};
