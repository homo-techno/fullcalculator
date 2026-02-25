import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sidingCostCalculator: CalculatorDefinition = {
  slug: "siding-cost-calculator",
  title: "Siding Cost Calculator",
  description: "Free siding cost calculator. Estimate the cost of new siding installation by material, home size, and labor.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["siding cost calculator", "vinyl siding cost", "new siding cost", "siding installation cost", "house siding cost"],
  variants: [
    {
      id: "siding",
      name: "Siding Installation",
      fields: [
        { name: "sqft", label: "Exterior Wall Area (sq ft)", type: "number", placeholder: "e.g. 2000" },
        { name: "material", label: "Siding Material", type: "select", options: [
          { label: "Vinyl ($2-7/sq ft)", value: "4.5" },
          { label: "Fiber cement (Hardie) ($5-12/sq ft)", value: "8.5" },
          { label: "Wood clapboard ($6-12/sq ft)", value: "9" },
          { label: "Engineered wood ($4-9/sq ft)", value: "6.5" },
          { label: "Aluminum ($3-7/sq ft)", value: "5" },
          { label: "Stucco ($6-12/sq ft)", value: "9" },
          { label: "Stone veneer ($10-30/sq ft)", value: "20" },
          { label: "Brick veneer ($8-20/sq ft)", value: "14" },
        ], defaultValue: "4.5" },
        { name: "stories", label: "Number of Stories", type: "select", options: [
          { label: "1 story", value: "1.0" },
          { label: "2 stories (+10-15%)", value: "1.12" },
          { label: "3 stories (+20-30%)", value: "1.25" },
        ], defaultValue: "1.0" },
        { name: "removal", label: "Remove Old Siding?", type: "select", options: [
          { label: "No (install over existing)", value: "0" },
          { label: "Yes ($1-2/sq ft)", value: "1.5" },
        ], defaultValue: "1.5" },
        { name: "insulation", label: "Add Insulation?", type: "select", options: [
          { label: "No additional insulation", value: "0" },
          { label: "Foam board ($1-3/sq ft)", value: "2" },
          { label: "House wrap only ($0.50-1/sq ft)", value: "0.75" },
        ], defaultValue: "0.75" },
      ],
      calculate: (inputs) => {
        const sqft = inputs.sqft as number;
        const materialCost = parseFloat(inputs.material as string) || 4.5;
        const storyFactor = parseFloat(inputs.stories as string) || 1.0;
        const removalCost = parseFloat(inputs.removal as string) || 0;
        const insulationCost = parseFloat(inputs.insulation as string) || 0;
        if (!sqft) return null;
        const materialTotal = sqft * materialCost;
        const laborTotal = sqft * 3 * storyFactor; // ~$3/sq ft base labor
        const removalTotal = removalCost * sqft;
        const insulationTotal = insulationCost * sqft;
        const trim = sqft * 0.75; // corners, windows, doors
        const permits = 250;
        const totalCost = materialTotal + laborTotal + removalTotal + insulationTotal + trim + permits;
        return {
          primary: { label: "Estimated Siding Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Material cost", value: `$${formatNumber(materialTotal)}` },
            { label: "Labor cost", value: `$${formatNumber(laborTotal)}` },
            { label: "Old siding removal", value: removalCost > 0 ? `$${formatNumber(removalTotal)}` : "None" },
            { label: "Insulation/wrap", value: insulationCost > 0 ? `$${formatNumber(insulationTotal)}` : "None" },
            { label: "Trim & accessories", value: `$${formatNumber(trim)}` },
            { label: "Permits", value: `$${permits}` },
            { label: "Wall area", value: `${formatNumber(sqft, 0)} sq ft` },
            { label: "Cost per sq ft", value: `$${formatNumber(totalCost / sqft)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["roof-replacement-cost-calculator", "window-replacement-cost-calculator", "room-paint-cost-calculator"],
  faq: [
    { question: "How much does new siding cost?", answer: "Vinyl: $5,000-$16,000 for a typical home. Fiber cement: $12,000-$30,000. Wood: $14,000-$30,000. Stone veneer: $25,000-$65,000. Costs vary based on home size, number of stories, and whether old siding needs removal." },
  ],
  formula: "Total = (Sq Ft × Material) + (Sq Ft × Labor × Story Factor) + Removal + Insulation + Trim + Permits",
};
