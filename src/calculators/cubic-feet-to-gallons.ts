import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cubicFeetToGallonsConverter: CalculatorDefinition = {
  slug: "cubic-feet-to-gallons-converter",
  title: "Cubic Feet to Gallons Converter",
  description: "Free cubic feet to gallons converter. Convert between cubic feet and US/Imperial gallons instantly. Great for tanks, pools, and water volume.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["cubic feet to gallons", "cu ft to gallons", "cf to gal", "cubic foot gallon converter", "water volume converter"],
  variants: [
    {
      id: "convert",
      name: "Convert Cubic Feet to Gallons",
      fields: [
        { name: "value", label: "Cubic Feet (ft³)", type: "number", placeholder: "e.g. 10" },
        { name: "gallonType", label: "Gallon Type", type: "select", options: [
          { label: "US Gallon", value: "us" },
          { label: "Imperial (UK) Gallon", value: "imperial" },
        ], defaultValue: "us" },
        { name: "direction", label: "Direction", type: "select", options: [
          { label: "Cubic Feet to Gallons", value: "cf_to_gal" },
          { label: "Gallons to Cubic Feet", value: "gal_to_cf" },
        ], defaultValue: "cf_to_gal" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const gallonType = inputs.gallonType as string;
        const direction = inputs.direction as string;
        if (value === undefined) return null;
        const usGalPerCuFt = 7.48052;
        const impGalPerCuFt = 6.22884;
        const factor = gallonType === "imperial" ? impGalPerCuFt : usGalPerCuFt;
        if (direction === "gal_to_cf") {
          const cuFt = value / factor;
          return {
            primary: { label: `${formatNumber(value)} gal`, value: `${formatNumber(cuFt, 4)} ft³` },
            details: [
              { label: "Cubic Feet", value: formatNumber(cuFt, 6) },
              { label: "Liters", value: formatNumber(cuFt * 28.3168, 2) },
              { label: "Cubic Meters", value: formatNumber(cuFt * 0.0283168, 6) },
              { label: "Cubic Inches", value: formatNumber(cuFt * 1728, 2) },
            ],
          };
        }
        const gallons = value * factor;
        return {
          primary: { label: `${formatNumber(value)} ft³`, value: `${formatNumber(gallons, 4)} gal` },
          details: [
            { label: "US Gallons", value: formatNumber(value * usGalPerCuFt, 4) },
            { label: "Imperial Gallons", value: formatNumber(value * impGalPerCuFt, 4) },
            { label: "Liters", value: formatNumber(value * 28.3168, 2) },
            { label: "Cubic Inches", value: formatNumber(value * 1728, 0) },
            { label: "Quarts (US)", value: formatNumber(value * usGalPerCuFt * 4, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "volume-calculator", "pool-volume-calculator"],
  faq: [
    { question: "How many gallons are in a cubic foot?", answer: "1 cubic foot = 7.48052 US gallons = 6.22884 Imperial (UK) gallons. To convert cubic feet to gallons, multiply by the appropriate factor." },
    { question: "How do I calculate the gallons in a tank?", answer: "Calculate the volume in cubic feet (length x width x height in feet), then multiply by 7.48052 for US gallons. For a 4x2x2 ft tank: 16 ft³ × 7.48 = 119.7 gallons." },
  ],
  formula: "1 ft³ = 7.48052 US gal = 6.22884 Imperial gal = 28.3168 L | 1 US gal = 0.13368 ft³",
};
