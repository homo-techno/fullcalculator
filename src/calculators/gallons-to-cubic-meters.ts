import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gallonsToCubicMeters: CalculatorDefinition = {
  slug: "gallons-to-cubic-meters",
  title: "Gallons to Cubic Meters",
  description: "Free gallons to cubic meters converter. Convert volume from US gallons to cubic meters instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["gallons to cubic meters", "gal to m3", "volume conversion", "gallon cubic meter"],
  variants: [
    {
      id: "gallons-to-cubic-meters",
      name: "Gallons to Cubic Meters",
      fields: [
        { name: "gallons", label: "Volume (US gallons)", type: "number", placeholder: "e.g. 264", suffix: "gal" },
      ],
      calculate: (inputs) => {
        const gallons = inputs.gallons as number;
        if (gallons === undefined) return null;
        const cubicMeters = gallons / 264.172;
        const liters = gallons * 3.78541;
        const cubicFeet = gallons * 0.133681;
        const imperialGallons = gallons * 0.832674;
        return {
          primary: { label: "Cubic Meters", value: formatNumber(cubicMeters, 6), suffix: "m³" },
          details: [
            { label: "US Gallons", value: `${formatNumber(gallons, 2)} gal` },
            { label: "Cubic Meters", value: `${formatNumber(cubicMeters, 6)} m³` },
            { label: "Liters", value: `${formatNumber(liters, 2)} L` },
            { label: "Cubic Feet", value: `${formatNumber(cubicFeet, 4)} ft³` },
            { label: "Imperial Gallons", value: `${formatNumber(imperialGallons, 2)} imp gal` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cubic-meters-to-gallons", "liters-to-cubic-inches", "unit-converter"],
  faq: [
    { question: "How do I convert gallons to cubic meters?", answer: "Divide the volume in US gallons by 264.172. For example, 264 gallons ≈ 0.9994 m³." },
    { question: "How many liters in a gallon?", answer: "One US gallon equals approximately 3.78541 liters." },
  ],
  formula: "m³ = US gallons ÷ 264.172",
};
