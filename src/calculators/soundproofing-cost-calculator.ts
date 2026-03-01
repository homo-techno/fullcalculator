import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const soundproofingCostCalculator: CalculatorDefinition = {
  slug: "soundproofing-cost-calculator",
  title: "Soundproofing Cost Calculator",
  description: "Estimate the cost to soundproof a room including materials, labor, and acoustic treatments.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["soundproofing cost", "room soundproofing cost", "sound insulation cost"],
  variants: [{
    id: "standard",
    name: "Soundproofing Cost",
    description: "Estimate the cost to soundproof a room including materials, labor, and acoustic treatments",
    fields: [
      { name: "sqft", label: "Room Size (Wall Area)", type: "number", suffix: "sq ft", min: 50, max: 2000, defaultValue: 400 },
      { name: "level", label: "Soundproofing Level", type: "select", options: [{value:"basic",label:"Basic (weatherstripping + caulk)"},{value:"moderate",label:"Moderate (+ mass loaded vinyl)"},{value:"full",label:"Full (+ double drywall + isolation)"}], defaultValue: "moderate" },
      { name: "surfaces", label: "Surfaces to Treat", type: "select", options: [{value:"walls",label:"Walls Only"},{value:"wallsceiling",label:"Walls + Ceiling"},{value:"all",label:"Walls + Ceiling + Floor"}], defaultValue: "wallsceiling" },
    ],
    calculate: (inputs) => {
      const sqft = inputs.sqft as number;
      const level = inputs.level as string;
      const surfaces = inputs.surfaces as string;
      if (!sqft || sqft <= 0) return null;
      const levelRate: Record<string, number> = { basic: 3, moderate: 8, full: 18 };
      const surfaceMod: Record<string, number> = { walls: 1.0, wallsceiling: 1.4, all: 1.8 };
      const materialCost = sqft * (levelRate[level] || 8) * (surfaceMod[surfaces] || 1.4);
      const labor = sqft * 5 * (surfaceMod[surfaces] || 1.4);
      const door = 300;
      const sealant = 150;
      const total = materialCost + labor + door + sealant;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Soundproofing Materials", value: "$" + formatNumber(materialCost) },
          { label: "Labor", value: "$" + formatNumber(labor) },
          { label: "Solid Core Door", value: "$" + formatNumber(door) },
          { label: "Sealant and Weatherstripping", value: "$" + formatNumber(sealant) },
          { label: "Cost per Sq Ft", value: "$" + formatNumber(total / sqft) },
        ],
      };
    },
  }],
  relatedSlugs: ["sunroom-cost-calculator", "porch-cost-calculator"],
  faq: [
    { question: "How much does it cost to soundproof a room?", answer: "Basic soundproofing costs $1 to $5 per square foot. Moderate treatment with mass loaded vinyl runs $5 to $12 per square foot. Full soundproofing with double drywall and isolation clips costs $15 to $30 per square foot." },
    { question: "What is the most effective soundproofing method?", answer: "The most effective approach combines mass (double drywall), decoupling (isolation clips), damping (Green Glue), and absorption (insulation). No single method works as well as a layered approach." },
  ],
  formula: "Total = (Sq Ft x Level Rate x Surface Modifier) + Labor + Door + Sealant",
};
