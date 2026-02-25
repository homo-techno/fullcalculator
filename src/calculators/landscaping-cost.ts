import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const landscapingCostCalculator: CalculatorDefinition = {
  slug: "landscaping-cost-calculator",
  title: "Landscaping Cost Calculator",
  description: "Free landscaping cost calculator. Estimate the cost of landscaping projects including lawn, plants, hardscaping, irrigation, and design.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["landscaping cost calculator", "yard landscaping cost", "landscape design cost", "landscaping price estimate", "how much does landscaping cost"],
  variants: [
    {
      id: "project",
      name: "Landscaping Project",
      fields: [
        { name: "yardSqFt", label: "Yard/Project Area (sq ft)", type: "number", placeholder: "e.g. 3000" },
        { name: "projectScope", label: "Project Scope", type: "select", options: [
          { label: "Basic cleanup & mulch ($1-3/sq ft)", value: "2" },
          { label: "Moderate (plants, beds, edging) ($5-10/sq ft)", value: "7.5" },
          { label: "Major (full landscape design) ($10-25/sq ft)", value: "17" },
          { label: "Premium (hardscape + plants) ($20-50/sq ft)", value: "35" },
        ], defaultValue: "7.5" },
        { name: "sod", label: "Sod / Lawn", type: "select", options: [
          { label: "No new lawn", value: "0" },
          { label: "Seed ($0.10-0.30/sq ft)", value: "0.2" },
          { label: "Sod ($0.50-1.50/sq ft)", value: "1" },
          { label: "Sod + soil prep ($1-3/sq ft)", value: "2" },
        ], defaultValue: "0" },
        { name: "irrigation", label: "Irrigation System", type: "select", options: [
          { label: "No irrigation", value: "0" },
          { label: "Basic sprinkler zones ($2,000-$4,000)", value: "3000" },
          { label: "Full irrigation system ($4,000-$8,000)", value: "6000" },
          { label: "Drip + sprinkler ($5,000-$12,000)", value: "8000" },
        ], defaultValue: "0" },
        { name: "lighting", label: "Landscape Lighting", type: "select", options: [
          { label: "No lighting", value: "0" },
          { label: "Basic path lights ($500-$1,500)", value: "1000" },
          { label: "Full lighting design ($2,000-$5,000)", value: "3500" },
        ], defaultValue: "0" },
        { name: "trees", label: "Number of Trees", type: "number", placeholder: "e.g. 3", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const sqft = inputs.yardSqFt as number;
        const scopeCost = parseFloat(inputs.projectScope as string) || 7.5;
        const sodCost = parseFloat(inputs.sod as string) || 0;
        const irrigationCost = parseInt(inputs.irrigation as string) || 0;
        const lightingCost = parseInt(inputs.lighting as string) || 0;
        const trees = (inputs.trees as number) || 0;
        if (!sqft) return null;
        const baseCost = sqft * scopeCost;
        const sodTotal = sqft * sodCost;
        const treeCost = trees * 350; // avg $250-450 per tree planted
        const designFee = baseCost > 10000 ? 1500 : baseCost > 5000 ? 750 : 0;
        const totalCost = baseCost + sodTotal + irrigationCost + lightingCost + treeCost + designFee;
        const details = [
          { label: "Base landscaping", value: `$${formatNumber(baseCost)}` },
          { label: "Project area", value: `${formatNumber(sqft, 0)} sq ft` },
        ];
        if (sodTotal > 0) details.push({ label: "Sod/seeding", value: `$${formatNumber(sodTotal)}` });
        if (trees > 0) details.push({ label: "Trees planted", value: `${trees} × $350 = $${formatNumber(treeCost)}` });
        if (irrigationCost > 0) details.push({ label: "Irrigation system", value: `$${formatNumber(irrigationCost)}` });
        if (lightingCost > 0) details.push({ label: "Landscape lighting", value: `$${formatNumber(lightingCost)}` });
        if (designFee > 0) details.push({ label: "Design fee", value: `$${formatNumber(designFee)}` });
        details.push({ label: "Cost per sq ft", value: `$${formatNumber(totalCost / sqft)}` });
        return {
          primary: { label: "Estimated Landscaping Cost", value: `$${formatNumber(totalCost)}` },
          details,
          note: "Costs vary widely by region, plant selection, and site conditions. Get 2-3 quotes from local landscapers.",
        };
      },
    },
  ],
  relatedSlugs: ["fence-cost-calculator", "patio-cost-calculator", "deck-cost-calculator"],
  faq: [
    { question: "How much does landscaping cost?", answer: "Basic cleanup: $500-$3,000. Moderate planting & beds: $3,000-$15,000. Full landscape design: $10,000-$50,000+. Premium with hardscape: $25,000-$100,000+. Individual costs: trees $150-$500 each, sod $0.50-$1.50/sq ft, irrigation $2,000-$8,000, retaining walls $20-$50/sq ft." },
  ],
  formula: "Total = (Sq Ft × Scope Cost) + Sod + Trees + Irrigation + Lighting + Design Fee",
};
