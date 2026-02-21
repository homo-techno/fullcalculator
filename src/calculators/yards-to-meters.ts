import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const yardsToMetersConverter: CalculatorDefinition = {
  slug: "yards-to-meters-converter",
  title: "Yards to Meters Converter",
  description:
    "Free yards to meters converter. Quickly convert yards to meters with our easy calculator. 1 yard = 0.9144 meters.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "yards to meters",
    "yd to m",
    "yard to meter",
    "convert yards to meters",
    "yard converter",
  ],
  variants: [
    {
      id: "yards-to-meters",
      name: "Yards to Meters",
      fields: [
        {
          name: "yards",
          label: "Yards",
          type: "number",
          placeholder: "e.g. 100",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.yards as number;
        if (val === undefined || val === null) return null;
        const meters = val * 0.9144;
        return {
          primary: {
            label: `${formatNumber(val, 4)} yards`,
            value: `${formatNumber(meters, 4)} meters`,
          },
          details: [
            { label: "Meters", value: formatNumber(meters, 4) },
            { label: "Centimeters", value: formatNumber(meters * 100, 2) },
            { label: "Feet", value: formatNumber(val * 3, 2) },
            { label: "Inches", value: formatNumber(val * 36, 2) },
            { label: "Kilometers", value: formatNumber(meters / 1000, 6) },
          ],
        };
      },
    },
    {
      id: "meters-to-yards",
      name: "Meters to Yards",
      fields: [
        {
          name: "meters",
          label: "Meters",
          type: "number",
          placeholder: "e.g. 91",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.meters as number;
        if (val === undefined || val === null) return null;
        const yards = val / 0.9144;
        return {
          primary: {
            label: `${formatNumber(val, 4)} meters`,
            value: `${formatNumber(yards, 4)} yards`,
          },
          details: [
            { label: "Yards", value: formatNumber(yards, 4) },
            { label: "Feet", value: formatNumber(yards * 3, 2) },
            { label: "Inches", value: formatNumber(yards * 36, 2) },
            { label: "Centimeters", value: formatNumber(val * 100, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "feet-to-meters-converter",
    "meters-to-feet-converter",
    "miles-to-km-converter",
    "unit-converter",
  ],
  faq: [
    {
      question: "How many meters in a yard?",
      answer:
        "1 yard = 0.9144 meters exactly. This is an international standard defined since 1959.",
    },
    {
      question: "How do I convert yards to meters?",
      answer:
        "Multiply the number of yards by 0.9144. For example, 100 yards = 100 × 0.9144 = 91.44 meters.",
    },
  ],
  formula: "meters = yards × 0.9144",
};
