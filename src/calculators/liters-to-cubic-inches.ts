import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const litersToCubicInches: CalculatorDefinition = {
  slug: "liters-to-cubic-inches",
  title: "Liters to Cubic Inches",
  description: "Free liters to cubic inches converter. Convert volume from liters to cubic inches instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["liters to cubic inches", "L to cu in", "liters to in3", "volume conversion", "engine displacement"],
  variants: [
    {
      id: "liters-to-cubic-inches",
      name: "Liters to Cubic Inches",
      fields: [
        { name: "liters", label: "Volume (L)", type: "number", placeholder: "e.g. 5.7", suffix: "L" },
      ],
      calculate: (inputs) => {
        const liters = inputs.liters as number;
        if (liters === undefined) return null;
        const cubicInches = liters / 0.0163871;
        const milliliters = liters * 1000;
        const cubicCm = liters * 1000;
        const usGallons = liters * 0.264172;
        const cubicFeet = liters * 0.0353147;
        return {
          primary: { label: "Cubic Inches", value: formatNumber(cubicInches, 2), suffix: "in³" },
          details: [
            { label: "Liters", value: `${formatNumber(liters, 4)} L` },
            { label: "Cubic Inches", value: `${formatNumber(cubicInches, 2)} in³` },
            { label: "Milliliters", value: `${formatNumber(milliliters, 0)} mL` },
            { label: "Cubic Centimeters", value: `${formatNumber(cubicCm, 0)} cm³` },
            { label: "US Gallons", value: `${formatNumber(usGallons, 4)} gal` },
            { label: "Cubic Feet", value: `${formatNumber(cubicFeet, 6)} ft³` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cubic-inches-to-liters", "gallons-to-cubic-meters", "unit-converter"],
  faq: [
    { question: "How do I convert liters to cubic inches?", answer: "Divide the volume in liters by 0.0163871, or multiply by 61.0237. For example, 5.7 L ≈ 347.8 in³." },
    { question: "What is 2.0 liters in cubic inches?", answer: "2.0 liters equals approximately 122.05 cubic inches. This is a common engine displacement size." },
  ],
  formula: "in³ = L ÷ 0.0163871",
};
