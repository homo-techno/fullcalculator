import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cubicInchesToLiters: CalculatorDefinition = {
  slug: "cubic-inches-to-liters",
  title: "Cubic Inches to Liters",
  description: "Free cubic inches to liters converter. Convert volume from cubic inches to liters instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["cubic inches to liters", "cu in to liters", "in3 to L", "volume conversion", "engine displacement"],
  variants: [
    {
      id: "cubic-inches-to-liters",
      name: "Cubic Inches to Liters",
      fields: [
        { name: "cubicInches", label: "Volume (in³)", type: "number", placeholder: "e.g. 350", suffix: "in³" },
      ],
      calculate: (inputs) => {
        const cubicInches = inputs.cubicInches as number;
        if (cubicInches === undefined) return null;
        const liters = cubicInches * 0.0163871;
        const milliliters = cubicInches * 16.3871;
        const cubicCm = cubicInches * 16.3871;
        const usGallons = cubicInches * 0.004329;
        const cubicFeet = cubicInches / 1728;
        return {
          primary: { label: "Liters", value: formatNumber(liters, 4), suffix: "L" },
          details: [
            { label: "Cubic Inches", value: `${formatNumber(cubicInches, 2)} in³` },
            { label: "Liters", value: `${formatNumber(liters, 4)} L` },
            { label: "Milliliters", value: `${formatNumber(milliliters, 2)} mL` },
            { label: "Cubic Centimeters", value: `${formatNumber(cubicCm, 2)} cm³` },
            { label: "US Gallons", value: `${formatNumber(usGallons, 4)} gal` },
            { label: "Cubic Feet", value: `${formatNumber(cubicFeet, 6)} ft³` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["liters-to-cubic-inches", "cubic-meters-to-gallons", "unit-converter"],
  faq: [
    { question: "How do I convert cubic inches to liters?", answer: "Multiply the volume in cubic inches by 0.0163871. For example, 350 in³ = 5.735 liters (a common engine size)." },
    { question: "Why is this conversion useful?", answer: "This conversion is commonly used for engine displacement. For example, a 350 cubic inch engine is approximately 5.7 liters." },
  ],
  formula: "L = in³ × 0.0163871",
};
