import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const feetToMetersConverter: CalculatorDefinition = {
  slug: "feet-to-meters-converter",
  title: "Feet to Meters Converter",
  description:
    "Free feet to meters converter. Quickly convert feet to meters with our easy calculator. 1 foot = 0.3048 meters.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "feet to meters",
    "ft to m",
    "foot to meter",
    "convert feet to meters",
    "feet converter",
  ],
  variants: [
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
            { label: "Miles", value: formatNumber(val / 5280, 6) },
            { label: "Inches", value: formatNumber(val * 12, 2) },
          ],
        };
      },
    },
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
        const feet = val / 0.3048;
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
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "meters-to-feet-converter",
    "yards-to-meters-converter",
    "miles-to-km-converter",
    "unit-converter",
  ],
  faq: [
    {
      question: "How many meters in a foot?",
      answer:
        "1 foot = 0.3048 meters exactly. This is an international standard.",
    },
    {
      question: "How do I convert feet to meters?",
      answer:
        "Multiply the number of feet by 0.3048. For example, 6 feet = 6 × 0.3048 = 1.8288 meters.",
    },
  ],
  formula: "meters = feet × 0.3048",
};
