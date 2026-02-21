import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const movingCostCalculator: CalculatorDefinition = {
  slug: "moving-cost-calculator",
  title: "Moving Cost Calculator",
  description: "Free moving cost calculator. Estimate the cost of a local or long-distance move based on home size and distance.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["moving cost calculator", "moving estimate", "relocation cost", "moving expenses", "how much does moving cost"],
  variants: [
    {
      id: "estimate",
      name: "Moving Cost Estimate",
      fields: [
        { name: "bedrooms", label: "Number of Bedrooms", type: "select", options: [
          { label: "Studio", value: "0" }, { label: "1 Bedroom", value: "1" },
          { label: "2 Bedrooms", value: "2" }, { label: "3 Bedrooms", value: "3" },
          { label: "4+ Bedrooms", value: "4" },
        ]},
        { name: "distance", label: "Distance (miles)", type: "number", placeholder: "e.g. 500" },
        { name: "type", label: "Move Type", type: "select", options: [
          { label: "Full service (movers pack everything)", value: "full" },
          { label: "Standard (movers load/unload)", value: "standard" },
          { label: "DIY (rent truck)", value: "diy" },
        ]},
      ],
      calculate: (inputs) => {
        const beds = parseInt((inputs.bedrooms as string) || "2");
        const distance = inputs.distance as number;
        const type = (inputs.type as string) || "standard";
        if (!distance) return null;
        const isLocal = distance <= 100;
        const weightBase = [2000, 3500, 5000, 8000, 12000][beds] || 5000;
        let baseCost: number;
        if (type === "diy") {
          baseCost = isLocal ? 100 + distance * 1.5 : 800 + distance * 0.8;
          baseCost += [50, 100, 150, 200, 250][beds] || 150;
        } else if (type === "full") {
          baseCost = isLocal ? weightBase * 0.15 + distance * 2 : weightBase * 0.50 + distance * 0.5;
          baseCost *= 1.5;
        } else {
          baseCost = isLocal ? weightBase * 0.12 + distance * 1.5 : weightBase * 0.40 + distance * 0.5;
        }
        const low = baseCost * 0.8;
        const high = baseCost * 1.3;
        return {
          primary: { label: "Estimated Cost", value: `$${formatNumber(low, 0)} – $${formatNumber(high, 0)}` },
          details: [
            { label: "Average estimate", value: `$${formatNumber(baseCost, 0)}` },
            { label: "Move type", value: isLocal ? `Local (${distance} mi)` : `Long-distance (${distance} mi)` },
            { label: "Est. weight", value: `${formatNumber(weightBase, 0)} lbs` },
            { label: "Tip (15-20%)", value: `$${formatNumber(baseCost * 0.15, 0)} – $${formatNumber(baseCost * 0.2, 0)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["road-trip-calculator", "square-footage-calculator", "cost-per-unit-calculator"],
  faq: [{ question: "How much does it cost to move?", answer: "Local moves (under 100 miles): $300-$1,500 for a 1BR, $800-$2,500 for 3BR. Long-distance (1000+ miles): $2,000-$5,000 for 1BR, $4,000-$8,000+ for 3BR. Full-service with packing costs 50-100% more." }],
  formula: "Cost depends on weight, distance, and service level",
};
