import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const acresToHectaresConverter: CalculatorDefinition = {
  slug: "acres-to-hectares-converter",
  title: "Acres to Hectares Converter",
  description: "Free acres to hectares converter. Convert between acres and hectares instantly. Includes square feet, square meters, and square miles.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["acres to hectares", "hectares to acres", "acre converter", "land area converter", "ac to ha"],
  variants: [
    {
      id: "convert",
      name: "Convert Acres to Hectares",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 10" },
        { name: "direction", label: "Direction", type: "select", options: [
          { label: "Acres to Hectares", value: "ac_to_ha" },
          { label: "Hectares to Acres", value: "ha_to_ac" },
        ], defaultValue: "ac_to_ha" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const direction = inputs.direction as string;
        if (value === undefined) return null;
        const acreToHa = 0.404686;
        if (direction === "ha_to_ac") {
          const acres = value / acreToHa;
          return {
            primary: { label: `${formatNumber(value)} hectares`, value: `${formatNumber(acres, 4)} acres` },
            details: [
              { label: "Acres", value: formatNumber(acres, 4) },
              { label: "Square Feet", value: formatNumber(acres * 43560, 0) },
              { label: "Square Meters", value: formatNumber(value * 10000, 0) },
              { label: "Square Miles", value: formatNumber(acres / 640, 6) },
              { label: "Square Kilometers", value: formatNumber(value / 100, 6) },
            ],
          };
        }
        const hectares = value * acreToHa;
        return {
          primary: { label: `${formatNumber(value)} acres`, value: `${formatNumber(hectares, 4)} hectares` },
          details: [
            { label: "Hectares", value: formatNumber(hectares, 4) },
            { label: "Square Feet", value: formatNumber(value * 43560, 0) },
            { label: "Square Meters", value: formatNumber(hectares * 10000, 0) },
            { label: "Square Miles", value: formatNumber(value / 640, 6) },
            { label: "Square Kilometers", value: formatNumber(hectares / 100, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["area-converter", "unit-converter", "square-footage-calculator"],
  faq: [
    { question: "How many hectares are in an acre?", answer: "1 acre = 0.404686 hectares. To convert acres to hectares, multiply by 0.404686. Conversely, 1 hectare = 2.47105 acres." },
    { question: "How big is a hectare?", answer: "A hectare is 10,000 square meters (100m x 100m), or about 2.47 acres. It is roughly the size of two football fields side by side." },
  ],
  formula: "1 acre = 0.404686 hectares | 1 hectare = 2.47105 acres | 1 acre = 43,560 ft² | 1 hectare = 10,000 m²",
};
