import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kitchenRemodelCostCalculator: CalculatorDefinition = {
  slug: "kitchen-remodel-cost-calculator",
  title: "Kitchen Remodel Cost Calculator",
  description: "Free kitchen remodel cost calculator. Estimate the total cost of kitchen renovations including cabinets, countertops, flooring, and appliances.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["kitchen remodel cost", "kitchen renovation cost", "kitchen remodel calculator", "how much to remodel kitchen", "kitchen renovation estimate"],
  variants: [
    {
      id: "remodel",
      name: "Kitchen Remodel",
      fields: [
        { name: "sqft", label: "Kitchen Size (sq ft)", type: "number", placeholder: "e.g. 150" },
        { name: "remodelScope", label: "Remodel Scope", type: "select", options: [
          { label: "Minor refresh (cosmetic updates)", value: "minor" },
          { label: "Mid-range remodel", value: "midrange" },
          { label: "Major remodel (high-end)", value: "major" },
          { label: "Full gut / luxury", value: "luxury" },
        ], defaultValue: "midrange" },
        { name: "cabinets", label: "Cabinets", type: "select", options: [
          { label: "Keep existing (refinish)", value: "refinish" },
          { label: "Reface existing", value: "reface" },
          { label: "New stock cabinets", value: "stock" },
          { label: "New custom cabinets", value: "custom" },
        ], defaultValue: "stock" },
        { name: "appliances", label: "New Appliances?", type: "select", options: [
          { label: "Keep existing", value: "0" },
          { label: "Standard package ($2,000-$5,000)", value: "3500" },
          { label: "Mid-range package ($5,000-$10,000)", value: "7500" },
          { label: "Premium package ($10,000-$25,000)", value: "15000" },
        ], defaultValue: "3500" },
      ],
      calculate: (inputs) => {
        const sqft = inputs.sqft as number;
        const scope = inputs.remodelScope as string;
        const cabinets = inputs.cabinets as string;
        const applianceCost = parseInt(inputs.appliances as string) || 0;
        if (!sqft) return null;
        let baseCostPerSqFt: number;
        if (scope === "minor") baseCostPerSqFt = 75;
        else if (scope === "midrange") baseCostPerSqFt = 200;
        else if (scope === "major") baseCostPerSqFt = 400;
        else baseCostPerSqFt = 650;
        let cabinetCost: number;
        const linearFeet = Math.round(sqft * 0.16); // approximate
        if (cabinets === "refinish") cabinetCost = linearFeet * 50;
        else if (cabinets === "reface") cabinetCost = linearFeet * 120;
        else if (cabinets === "stock") cabinetCost = linearFeet * 200;
        else cabinetCost = linearFeet * 600;
        const baseCost = sqft * baseCostPerSqFt;
        const countertops = sqft * 0.3 * 65; // ~30% of floor area for counters
        const flooring = sqft * 12;
        const labor = baseCost * 0.35;
        const totalCost = baseCost + applianceCost;
        return {
          primary: { label: "Estimated Remodel Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Kitchen size", value: `${sqft} sq ft` },
            { label: "Base renovation cost", value: `$${formatNumber(baseCost)}` },
            { label: "Estimated cabinet cost", value: `$${formatNumber(cabinetCost)}` },
            { label: "Estimated countertop cost", value: `$${formatNumber(countertops)}` },
            { label: "Estimated flooring cost", value: `$${formatNumber(flooring)}` },
            { label: "Appliances", value: applianceCost > 0 ? `$${formatNumber(applianceCost)}` : "Keeping existing" },
            { label: "Cost per sq ft", value: `$${formatNumber(totalCost / sqft)}` },
          ],
          note: "Cabinet and countertop estimates included in base cost. Individual line items shown for reference. Add 15-20% contingency.",
        };
      },
    },
  ],
  relatedSlugs: ["kitchen-cabinet-cost-calculator", "bathroom-remodel-cost-calculator", "tile-calculator"],
  faq: [
    { question: "How much does a kitchen remodel cost?", answer: "Minor refresh: $10,000-$20,000. Mid-range: $25,000-$50,000. Major: $50,000-$100,000. Luxury: $100,000-$200,000+. Cabinets account for ~30% of total cost, countertops ~10%, appliances ~15%, and labor ~20-35%." },
  ],
  formula: "Total = (Sq Ft × Cost/SqFt) + Appliances",
};
