import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bathroomRemodelCostCalculator: CalculatorDefinition = {
  slug: "bathroom-remodel-cost-calculator",
  title: "Bathroom Remodel Cost Calculator",
  description: "Free bathroom remodel cost calculator. Estimate the total cost of bathroom renovations based on size, materials, and scope of work.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["bathroom remodel cost", "bathroom renovation cost", "bathroom remodel calculator", "bathroom renovation estimate", "how much to remodel bathroom"],
  variants: [
    {
      id: "remodel",
      name: "Bathroom Remodel",
      fields: [
        { name: "sqft", label: "Bathroom Size (sq ft)", type: "number", placeholder: "e.g. 75" },
        { name: "remodelScope", label: "Remodel Scope", type: "select", options: [
          { label: "Cosmetic refresh (paint, fixtures)", value: "cosmetic" },
          { label: "Mid-range remodel", value: "midrange" },
          { label: "High-end remodel", value: "highend" },
          { label: "Full gut renovation", value: "gut" },
        ], defaultValue: "midrange" },
        { name: "bathroomType", label: "Bathroom Type", type: "select", options: [
          { label: "Half bath (no tub/shower)", value: "0.5" },
          { label: "Full bath (tub/shower)", value: "1.0" },
          { label: "Master bath (double vanity)", value: "1.4" },
          { label: "Luxury master bath", value: "2.0" },
        ], defaultValue: "1.0" },
        { name: "tileWork", label: "Tile Work", type: "select", options: [
          { label: "Floor only", value: "floor" },
          { label: "Floor + shower/tub surround", value: "standard" },
          { label: "Full floor to ceiling", value: "full" },
        ], defaultValue: "standard" },
      ],
      calculate: (inputs) => {
        const sqft = inputs.sqft as number;
        const scope = inputs.remodelScope as string;
        const typeFactor = parseFloat(inputs.bathroomType as string) || 1.0;
        const tileWork = inputs.tileWork as string;
        if (!sqft) return null;
        let costPerSqFt: number;
        if (scope === "cosmetic") costPerSqFt = 75;
        else if (scope === "midrange") costPerSqFt = 175;
        else if (scope === "highend") costPerSqFt = 325;
        else costPerSqFt = 500;
        let tileFactor = 1.0;
        if (tileWork === "floor") tileFactor = 0.85;
        else if (tileWork === "full") tileFactor = 1.2;
        const baseCost = sqft * costPerSqFt * typeFactor * tileFactor;
        const plumbing = baseCost * 0.15;
        const electrical = baseCost * 0.08;
        const labor = baseCost * 0.35;
        const materials = baseCost * 0.42;
        const totalCost = baseCost;
        return {
          primary: { label: "Estimated Remodel Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Bathroom size", value: `${sqft} sq ft` },
            { label: "Materials estimate", value: `$${formatNumber(materials)}` },
            { label: "Labor estimate", value: `$${formatNumber(labor)}` },
            { label: "Plumbing", value: `$${formatNumber(plumbing)}` },
            { label: "Electrical", value: `$${formatNumber(electrical)}` },
            { label: "Cost per sq ft", value: `$${formatNumber(costPerSqFt * typeFactor * tileFactor)}` },
          ],
          note: "Costs vary significantly by region. Add 10-20% contingency for unexpected issues.",
        };
      },
    },
  ],
  relatedSlugs: ["kitchen-remodel-cost-calculator", "tile-calculator", "room-paint-cost-calculator"],
  faq: [
    { question: "How much does a bathroom remodel cost?", answer: "Cosmetic refresh: $3,000-$7,000. Mid-range remodel: $10,000-$25,000. High-end remodel: $25,000-$50,000. Full gut renovation: $40,000-$75,000+. Master bathrooms and luxury finishes can push costs significantly higher." },
  ],
  formula: "Total = Sq Ft × Cost/SqFt × Type Factor × Tile Factor",
};
