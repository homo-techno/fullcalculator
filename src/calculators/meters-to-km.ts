import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const metersToKmConverter: CalculatorDefinition = {
  slug: "meters-to-km-converter",
  title: "Meters to Kilometers Converter",
  description:
    "Free meters to kilometers converter. Instantly convert m to km with formula and examples. Formula: km = m ÷ 1000.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "meters to kilometers",
    "m to km",
    "meters to km",
    "convert meters to kilometers",
    "length conversion",
  ],
  variants: [
    {
      id: "meters-to-km",
      name: "Meters to Kilometers",
      fields: [
        {
          name: "meters",
          label: "Meters (m)",
          type: "number",
          placeholder: "e.g. 5000",
        },
      ],
      calculate: (inputs) => {
        const m = inputs.meters as number;
        if (m === undefined || m === null) return null;
        const km = m / 1000;
        const miles = m * 0.000621371;
        const feet = m * 3.28084;
        const yards = m * 1.09361;
        return {
          primary: {
            label: `${formatNumber(m, 2)} m`,
            value: `${formatNumber(km, 4)} km`,
          },
          details: [
            { label: "Kilometers", value: `${formatNumber(km, 4)} km` },
            { label: "Miles", value: `${formatNumber(miles, 4)} mi` },
            { label: "Feet", value: `${formatNumber(feet, 2)} ft` },
            { label: "Yards", value: `${formatNumber(yards, 2)} yd` },
            { label: "Formula", value: "km = m ÷ 1000" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "km-to-meters-converter",
    "meters-to-feet-converter",
    "miles-to-km-converter",
    "length-converter",
  ],
  faq: [
    {
      question: "How do you convert meters to kilometers?",
      answer:
        "Divide the meter value by 1,000. For example, 5,000 m = 5,000 ÷ 1,000 = 5 km.",
    },
    {
      question: "How many km is 1500 meters?",
      answer:
        "1,500 meters = 1.5 kilometers. Divide 1,500 by 1,000 to get 1.5 km.",
    },
  ],
  formula: "km = m ÷ 1000",
};
