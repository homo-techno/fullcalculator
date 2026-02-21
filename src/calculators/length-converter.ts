import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const lengthUnits: Record<string, number> = {
  m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144,
  ft: 0.3048, in: 0.0254, nm: 1852, um: 0.000001,
};
const unitLabels: Record<string, string> = {
  m: "Meters", km: "Kilometers", cm: "Centimeters", mm: "Millimeters",
  mi: "Miles", yd: "Yards", ft: "Feet", in: "Inches", nm: "Nautical Miles", um: "Micrometers",
};

export const lengthConverter: CalculatorDefinition = {
  slug: "length-converter",
  title: "Length Converter",
  description: "Free length converter. Convert between meters, feet, inches, miles, kilometers, yards, and more.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["length converter", "feet to meters", "inches to cm", "miles to km", "meter converter", "distance converter"],
  variants: [
    {
      id: "convert",
      name: "Convert Length",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 100" },
        {
          name: "from", label: "From", type: "select",
          options: Object.entries(unitLabels).map(([v, l]) => ({ label: l, value: v })),
        },
        {
          name: "to", label: "To", type: "select",
          options: Object.entries(unitLabels).map(([v, l]) => ({ label: l, value: v })),
        },
      ],
      calculate: (inputs) => {
        const val = inputs.value as number;
        const from = (inputs.from as string) || "ft";
        const to = (inputs.to as string) || "m";
        if (!val) return null;
        const meters = val * (lengthUnits[from] || 1);
        const result = meters / (lengthUnits[to] || 1);
        return {
          primary: { label: `${val} ${unitLabels[from] || from}`, value: `${formatNumber(result, 6)} ${unitLabels[to] || to}` },
          details: [
            { label: "Meters", value: formatNumber(meters, 6) },
            { label: "Feet", value: formatNumber(meters / lengthUnits.ft, 6) },
            { label: "Inches", value: formatNumber(meters / lengthUnits.in, 4) },
            { label: "Kilometers", value: formatNumber(meters / lengthUnits.km, 6) },
            { label: "Miles", value: formatNumber(meters / lengthUnits.mi, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "speed-converter", "area-converter"],
  faq: [{ question: "How many feet are in a meter?", answer: "1 meter = 3.28084 feet. 1 foot = 0.3048 meters. 1 inch = 2.54 cm. 1 mile = 1.60934 km. 1 yard = 0.9144 meters." }],
  formula: "1 m = 3.281 ft = 39.37 in | 1 mi = 1.609 km",
};
