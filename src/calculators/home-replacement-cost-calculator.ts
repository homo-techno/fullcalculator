import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeReplacementCostCalculator: CalculatorDefinition = {
  slug: "home-replacement-cost-calculator",
  title: "Home Replacement Cost Calculator",
  description: "Free home replacement cost calculator for insurance. Estimate rebuilding costs based on square footage and local construction rates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["home replacement cost calculator", "dwelling coverage calculator", "rebuild cost estimator"],
  variants: [{
    id: "standard",
    name: "Home Replacement Cost",
    description: "Free home replacement cost calculator for insurance",
    fields: [
      { name: "sqft", label: "Total Square Footage", type: "number", min: 100, max: 50000 },
      { name: "costPerSqft", label: "Local Build Cost per Sq Ft", type: "number", prefix: "$", min: 50, max: 500, defaultValue: 150 },
      { name: "quality", label: "Build Quality", type: "select", options: [{ label: "Standard (1.0x)", value: "1.0" }, { label: "Above average (1.2x)", value: "1.2" }, { label: "High-end (1.5x)", value: "1.5" }, { label: "Luxury (2.0x)", value: "2.0" }], defaultValue: "1.0" },
    ],
    calculate: (inputs) => {
      const sqft = inputs.sqft as number;
      const cost = inputs.costPerSqft as number;
      const quality = parseFloat(inputs.quality as string);
      if (!sqft || !cost) return null;
      const base = sqft * cost * quality;
      const demolition = sqft * 5;
      const permits = base * 0.03;
      const total = base + demolition + permits;
      return {
        primary: { label: "Replacement Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Construction cost", value: "$" + formatNumber(base) },
          { label: "Demolition/debris removal", value: "$" + formatNumber(demolition) },
          { label: "Permits & fees (~3%)", value: "$" + formatNumber(permits) },
          { label: "Cost per sq ft (adjusted)", value: "$" + formatNumber(cost * quality) },
        ],
        note: "Replacement cost ≠ market value. Insurance covers rebuilding, not land value. Costs vary significantly by region and materials.",
      };
    },
  }],
  relatedSlugs: ["home-affordability-calculator", "property-tax-calculator"],
  faq: [
    { question: "What is replacement cost vs market value?", answer: "Replacement cost is what it would cost to rebuild your home from scratch. Market value includes land and location premiums. Insurance should cover replacement cost." },
    { question: "How much does it cost to build a house per sq ft?", answer: "Average US: $100-200/sq ft for standard construction. Luxury homes: $300-500+/sq ft. Varies greatly by region." },
  ],
  formula: "Replacement Cost = Sq Ft × Local Cost × Quality Multiplier + Demolition + Permits",
};
