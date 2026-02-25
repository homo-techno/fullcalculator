import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const storageUnitSizeCalculator: CalculatorDefinition = {
  slug: "storage-unit-size-calculator",
  title: "Storage Unit Size Calculator",
  description: "Free storage unit size calculator. Find the right storage unit size and estimate monthly costs based on your belongings.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["storage unit size", "what size storage unit", "storage unit calculator", "self storage size", "storage cost estimator"],
  variants: [
    {
      id: "byHome",
      name: "By Home Size",
      fields: [
        { name: "bedrooms", label: "Number of Bedrooms", type: "number", placeholder: "e.g. 2" },
        { name: "storageType", label: "What Are You Storing?", type: "select", options: [
          { label: "Full home contents", value: "1.0" },
          { label: "Half the home", value: "0.5" },
          { label: "Just furniture", value: "0.35" },
          { label: "Seasonal/boxes only", value: "0.15" },
        ], defaultValue: "1.0" },
        { name: "climate", label: "Climate Control", type: "select", options: [
          { label: "Standard (no climate control)", value: "1.0" },
          { label: "Climate controlled (+30%)", value: "1.3" },
        ], defaultValue: "1.0" },
      ],
      calculate: (inputs) => {
        const bedrooms = inputs.bedrooms as number;
        const storageFactor = parseFloat(inputs.storageType as string) || 1.0;
        const climateFactor = parseFloat(inputs.climate as string) || 1.0;
        if (!bedrooms) return null;
        const baseSqFt = bedrooms <= 1 ? 75 : bedrooms === 2 ? 150 : bedrooms === 3 ? 200 : bedrooms === 4 ? 300 : 400;
        const neededSqFt = Math.round(baseSqFt * storageFactor);
        let unitSize: string;
        let unitSqFt: number;
        let baseCost: number;
        if (neededSqFt <= 25) { unitSize = "5×5"; unitSqFt = 25; baseCost = 55; }
        else if (neededSqFt <= 50) { unitSize = "5×10"; unitSqFt = 50; baseCost = 90; }
        else if (neededSqFt <= 100) { unitSize = "10×10"; unitSqFt = 100; baseCost = 140; }
        else if (neededSqFt <= 150) { unitSize = "10×15"; unitSqFt = 150; baseCost = 185; }
        else if (neededSqFt <= 200) { unitSize = "10×20"; unitSqFt = 200; baseCost = 225; }
        else if (neededSqFt <= 300) { unitSize = "10×30"; unitSqFt = 300; baseCost = 310; }
        else { unitSize = "10×40+"; unitSqFt = 400; baseCost = 400; }
        const monthlyCost = Math.round(baseCost * climateFactor);
        return {
          primary: { label: "Recommended Unit Size", value: `${unitSize} (${unitSqFt} sq ft)` },
          details: [
            { label: "Estimated space needed", value: `${neededSqFt} sq ft` },
            { label: "Unit area", value: `${unitSqFt} sq ft` },
            { label: "Est. monthly cost", value: `$${formatNumber(monthlyCost)}` },
            { label: "Est. annual cost", value: `$${formatNumber(monthlyCost * 12)}` },
            { label: "Climate control", value: climateFactor > 1 ? "Yes" : "No" },
          ],
          note: "Costs vary significantly by location. Urban areas may cost 50-100% more than rural areas.",
        };
      },
    },
  ],
  relatedSlugs: ["moving-truck-size-calculator", "square-footage-calculator", "closet-organizer-cost-calculator"],
  faq: [
    { question: "What size storage unit do I need?", answer: "1-bedroom apartment: 5×10 (50 sq ft). 2-bedroom: 10×10 (100 sq ft). 3-bedroom house: 10×15 (150 sq ft). 4-bedroom: 10×20 (200 sq ft). These are for full home contents; storing partial items requires proportionally less space." },
  ],
  formula: "Space Needed = Base Size × Storage Factor | Monthly Cost based on unit size × Climate Factor",
};
