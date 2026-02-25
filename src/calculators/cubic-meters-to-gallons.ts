import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cubicMetersToGallons: CalculatorDefinition = {
  slug: "cubic-meters-to-gallons",
  title: "Cubic Meters to Gallons",
  description: "Free cubic meters to gallons converter. Convert volume from cubic meters to US gallons instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["cubic meters to gallons", "m3 to gallons", "volume conversion", "cubic meter gallon"],
  variants: [
    {
      id: "cubic-meters-to-gallons",
      name: "Cubic Meters to Gallons",
      fields: [
        { name: "cubicMeters", label: "Volume (m³)", type: "number", placeholder: "e.g. 1", suffix: "m³" },
      ],
      calculate: (inputs) => {
        const cubicMeters = inputs.cubicMeters as number;
        if (cubicMeters === undefined) return null;
        const usGallons = cubicMeters * 264.172;
        const liters = cubicMeters * 1000;
        const imperialGallons = cubicMeters * 219.969;
        const cubicFeet = cubicMeters * 35.3147;
        return {
          primary: { label: "US Gallons", value: formatNumber(usGallons, 2), suffix: "gal" },
          details: [
            { label: "Cubic Meters", value: `${formatNumber(cubicMeters, 4)} m³` },
            { label: "US Gallons", value: `${formatNumber(usGallons, 2)} gal` },
            { label: "Imperial Gallons", value: `${formatNumber(imperialGallons, 2)} imp gal` },
            { label: "Liters", value: `${formatNumber(liters, 2)} L` },
            { label: "Cubic Feet", value: `${formatNumber(cubicFeet, 4)} ft³` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gallons-to-cubic-meters", "cubic-inches-to-liters", "unit-converter"],
  faq: [
    { question: "How many gallons in a cubic meter?", answer: "One cubic meter equals approximately 264.172 US gallons or 219.969 imperial gallons." },
    { question: "What is the difference between US and Imperial gallons?", answer: "A US gallon is 3.785 liters while an Imperial gallon is 4.546 liters. The Imperial gallon is about 20% larger." },
  ],
  formula: "US gallons = m³ × 264.172",
};
