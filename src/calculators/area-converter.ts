import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const areaConverter: CalculatorDefinition = {
  slug: "area-converter",
  title: "Area Converter",
  description: "Free area converter. Convert between square feet, square meters, acres, hectares, and square miles.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["area converter", "square feet to acres", "acres to square feet", "hectares to acres", "sq ft to sq m"],
  variants: [
    {
      id: "convert",
      name: "Convert Area",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 5000" },
        { name: "from", label: "From", type: "select", options: [
          { label: "Square Feet (ft²)", value: "sqft" },
          { label: "Square Meters (m²)", value: "sqm" },
          { label: "Square Yards (yd²)", value: "sqyd" },
          { label: "Acres", value: "acre" },
          { label: "Hectares", value: "ha" },
          { label: "Square Miles (mi²)", value: "sqmi" },
          { label: "Square Kilometers (km²)", value: "sqkm" },
        ], defaultValue: "sqft" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const from = inputs.from as string;
        if (!value) return null;
        const toSqM: Record<string, number> = { sqft: 0.092903, sqm: 1, sqyd: 0.836127, acre: 4046.86, ha: 10000, sqmi: 2589988, sqkm: 1000000 };
        const sqm = value * (toSqM[from] || 1);
        return {
          primary: { label: `${formatNumber(value)} ${from}`, value: from === "sqft" ? `${formatNumber(sqm, 4)} m²` : `${formatNumber(sqm / toSqM.sqft, 2)} ft²` },
          details: [
            { label: "Square Feet", value: formatNumber(sqm / toSqM.sqft, 2) },
            { label: "Square Meters", value: formatNumber(sqm, 4) },
            { label: "Square Yards", value: formatNumber(sqm / toSqM.sqyd, 2) },
            { label: "Acres", value: formatNumber(sqm / toSqM.acre, 6) },
            { label: "Hectares", value: formatNumber(sqm / toSqM.ha, 6) },
            { label: "Square Miles", value: formatNumber(sqm / toSqM.sqmi, 8) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["square-footage-calculator", "unit-converter", "volume-calculator"],
  faq: [
    { question: "How many square feet in an acre?", answer: "1 acre = 43,560 square feet. An acre is roughly the size of a football field (without end zones). 1 hectare = 2.471 acres = 107,639 sq ft." },
  ],
  formula: "1 acre = 43,560 ft² | 1 hectare = 10,000 m² = 2.471 acres | 1 mi² = 640 acres",
};
