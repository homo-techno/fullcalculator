import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waterSoftenerSizeCalculator: CalculatorDefinition = {
  slug: "water-softener-size-calculator",
  title: "Water Softener Size Calculator",
  description: "Free water softener size calculator. Determine the right water softener grain capacity based on household size and water hardness.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["water softener size", "water softener calculator", "grain capacity calculator", "water hardness calculator", "water softener cost"],
  variants: [
    {
      id: "size",
      name: "Water Softener Size",
      fields: [
        { name: "people", label: "Number of People in Household", type: "number", placeholder: "e.g. 4" },
        { name: "hardness", label: "Water Hardness (GPG)", type: "number", placeholder: "e.g. 15" },
        { name: "ironContent", label: "Iron Content (ppm)", type: "select", options: [
          { label: "None / minimal (0 ppm)", value: "0" },
          { label: "Low (1-2 ppm)", value: "5" },
          { label: "Moderate (3-5 ppm)", value: "12" },
          { label: "High (5+ ppm)", value: "20" },
        ], defaultValue: "0" },
        { name: "regenDays", label: "Regeneration Frequency", type: "select", options: [
          { label: "Every 7 days (standard)", value: "7" },
          { label: "Every 5 days", value: "5" },
          { label: "Every 10 days", value: "10" },
        ], defaultValue: "7" },
      ],
      calculate: (inputs) => {
        const people = inputs.people as number;
        const hardness = inputs.hardness as number;
        const ironAdj = parseInt(inputs.ironContent as string) || 0;
        const regenDays = parseInt(inputs.regenDays as string) || 7;
        if (!people || !hardness) return null;
        const dailyUsageGal = people * 75; // average 75 gal/person/day
        const effectiveHardness = hardness + ironAdj;
        const dailyGrains = dailyUsageGal * effectiveHardness;
        const requiredCapacity = dailyGrains * regenDays;
        let recommendedSize: string;
        let systemCost: string;
        if (requiredCapacity <= 24000) { recommendedSize = "24,000 grain"; systemCost = "$400-$800"; }
        else if (requiredCapacity <= 32000) { recommendedSize = "32,000 grain"; systemCost = "$500-$1,000"; }
        else if (requiredCapacity <= 48000) { recommendedSize = "48,000 grain"; systemCost = "$700-$1,500"; }
        else if (requiredCapacity <= 64000) { recommendedSize = "64,000 grain"; systemCost = "$900-$2,000"; }
        else { recommendedSize = "80,000+ grain"; systemCost = "$1,200-$3,000"; }
        const saltPerMonth = Math.round((requiredCapacity / regenDays) * 30 / 3000); // ~3000 grains per lb salt
        return {
          primary: { label: "Recommended Size", value: recommendedSize },
          details: [
            { label: "Daily water usage", value: `${dailyUsageGal} gallons` },
            { label: "Effective hardness", value: `${effectiveHardness} GPG` },
            { label: "Daily grains to remove", value: formatNumber(dailyGrains, 0) },
            { label: "Capacity needed", value: `${formatNumber(requiredCapacity, 0)} grains` },
            { label: "Est. salt usage/month", value: `${saltPerMonth} lbs` },
            { label: "Est. system cost", value: systemCost },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["septic-tank-size-calculator", "well-depth-cost-calculator", "water-intake-calculator"],
  faq: [
    { question: "How do I determine the right water softener size?", answer: "Multiply daily water usage (people × 75 gallons) by water hardness (GPG) to get daily grain removal needed. Multiply by days between regeneration (usually 7). Choose a softener with at least that grain capacity. For example, 4 people with 15 GPG hardness need a 32,000-48,000 grain unit." },
  ],
  formula: "Capacity = (People × 75 gal/day) × Hardness (GPG) × Regeneration Days",
};
