import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const closetRemodelCalculator: CalculatorDefinition = {
  slug: "closet-remodel-calculator",
  title: "Closet Remodel Calculator",
  description: "Estimate the cost to remodel or build a walk-in closet with custom shelving and organization systems.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["closet remodel cost", "walk-in closet cost", "custom closet cost"],
  variants: [{
    id: "standard",
    name: "Closet Remodel",
    description: "Estimate the cost to remodel or build a walk-in closet with custom shelving and organization systems",
    fields: [
      { name: "sqft", label: "Closet Size", type: "number", suffix: "sq ft", min: 10, max: 200, defaultValue: 50 },
      { name: "system", label: "Organization System", type: "select", options: [{value:"wire",label:"Wire Shelving"},{value:"laminate",label:"Laminate"},{value:"wood",label:"Solid Wood"}], defaultValue: "laminate" },
      { name: "features", label: "Extra Features", type: "select", options: [{value:"basic",label:"Basic (shelves only)"},{value:"standard",label:"Standard (shelves + drawers)"},{value:"deluxe",label:"Deluxe (island, lighting, mirror)"}], defaultValue: "standard" },
    ],
    calculate: (inputs) => {
      const sqft = inputs.sqft as number;
      const system = inputs.system as string;
      const features = inputs.features as string;
      if (!sqft || sqft <= 0) return null;
      const systemRate: Record<string, number> = { wire: 8, laminate: 20, wood: 45 };
      const featureCost: Record<string, number> = { basic: 200, standard: 800, deluxe: 2500 };
      const materialCost = sqft * (systemRate[system] || 20);
      const laborCost = sqft * 15;
      const extras = featureCost[features] || 800;
      const painting = sqft * 3;
      const total = materialCost + laborCost + extras + painting;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Organization System", value: "$" + formatNumber(materialCost) },
          { label: "Installation Labor", value: "$" + formatNumber(laborCost) },
          { label: "Extra Features", value: "$" + formatNumber(extras) },
          { label: "Painting and Finishing", value: "$" + formatNumber(painting) },
        ],
      };
    },
  }],
  relatedSlugs: ["sunroom-cost-calculator", "porch-cost-calculator"],
  faq: [
    { question: "How much does a closet remodel cost?", answer: "A basic closet remodel with wire shelving costs $500 to $1,500. Custom wood systems in a walk-in closet range from $2,000 to $8,000 or more." },
    { question: "What is the best closet organization system?", answer: "Laminate systems offer a good balance of durability, appearance, and cost. Solid wood is the most premium option but costs significantly more." },
  ],
  formula: "Total = (Sq Ft x System Rate) + Labor + Features + Painting",
};
