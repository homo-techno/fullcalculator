import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const septicTankSizeCalculator: CalculatorDefinition = {
  slug: "septic-tank-size-calculator",
  title: "Septic Tank Size Calculator",
  description: "Free septic tank size calculator. Determine the right septic tank capacity and estimate installation costs based on household size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["septic tank size", "septic tank calculator", "septic system cost", "septic tank capacity", "septic installation cost"],
  variants: [
    {
      id: "size",
      name: "Septic Tank Size",
      fields: [
        { name: "bedrooms", label: "Number of Bedrooms", type: "number", placeholder: "e.g. 3" },
        { name: "occupants", label: "Number of Occupants", type: "number", placeholder: "e.g. 4" },
        { name: "waterUsage", label: "Water Usage Level", type: "select", options: [
          { label: "Low (conservation habits)", value: "0.8" },
          { label: "Average", value: "1.0" },
          { label: "High (large family, frequent laundry)", value: "1.3" },
        ], defaultValue: "1.0" },
        { name: "soilType", label: "Soil Type", type: "select", options: [
          { label: "Sandy (good drainage)", value: "sandy" },
          { label: "Loam (average)", value: "loam" },
          { label: "Clay (poor drainage)", value: "clay" },
        ], defaultValue: "loam" },
      ],
      calculate: (inputs) => {
        const bedrooms = inputs.bedrooms as number;
        const occupants = inputs.occupants as number;
        const usageFactor = parseFloat(inputs.waterUsage as string) || 1.0;
        const soil = inputs.soilType as string;
        if (!bedrooms) return null;
        // Most codes require minimum based on bedrooms
        let minGallons: number;
        if (bedrooms <= 2) minGallons = 750;
        else if (bedrooms === 3) minGallons = 1000;
        else if (bedrooms === 4) minGallons = 1250;
        else if (bedrooms === 5) minGallons = 1500;
        else minGallons = 1500 + (bedrooms - 5) * 250;
        const dailyFlow = (occupants || bedrooms * 2) * 75 * usageFactor;
        const recommendedGallons = Math.max(minGallons, Math.ceil(dailyFlow * 2 / 250) * 250);
        let drainFieldSqFt: number;
        if (soil === "sandy") drainFieldSqFt = Math.ceil(dailyFlow * 0.8);
        else if (soil === "loam") drainFieldSqFt = Math.ceil(dailyFlow * 1.2);
        else drainFieldSqFt = Math.ceil(dailyFlow * 2.0);
        const tankCost = recommendedGallons <= 1000 ? 2500 : recommendedGallons <= 1500 ? 3500 : 5000;
        const drainFieldCost = drainFieldSqFt * 12;
        const permitCost = 500;
        const totalCost = tankCost + drainFieldCost + permitCost;
        return {
          primary: { label: "Recommended Tank Size", value: `${formatNumber(recommendedGallons, 0)} gallons` },
          details: [
            { label: "Code minimum", value: `${formatNumber(minGallons, 0)} gallons` },
            { label: "Daily wastewater flow", value: `${formatNumber(dailyFlow, 0)} gallons` },
            { label: "Drain field size", value: `${formatNumber(drainFieldSqFt, 0)} sq ft` },
            { label: "Tank cost estimate", value: `$${formatNumber(tankCost)}` },
            { label: "Drain field cost", value: `$${formatNumber(drainFieldCost)}` },
            { label: "Permits", value: `$${formatNumber(permitCost)}` },
            { label: "Total estimated cost", value: `$${formatNumber(totalCost)}` },
          ],
          note: "Septic system requirements vary by jurisdiction. Always check local codes and have a perc test performed.",
        };
      },
    },
  ],
  relatedSlugs: ["well-depth-cost-calculator", "water-softener-size-calculator", "square-footage-calculator"],
  faq: [
    { question: "What size septic tank do I need?", answer: "Most codes require: 1-2 bedrooms: 750-1,000 gallons. 3 bedrooms: 1,000 gallons. 4 bedrooms: 1,250 gallons. 5+ bedrooms: 1,500+ gallons. A complete septic system (tank + drain field) typically costs $5,000-$20,000 depending on soil conditions and system type." },
  ],
  formula: "Tank Size = max(Code Minimum, Daily Flow × 2) | Daily Flow = Occupants × 75 gal × Usage Factor",
};
