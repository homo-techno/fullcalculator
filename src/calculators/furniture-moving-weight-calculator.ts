import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const furnitureMovingWeightCalculator: CalculatorDefinition = {
  slug: "furniture-moving-weight-calculator",
  title: "Furniture Moving Weight Calculator",
  description: "Estimate the total weight of furniture to move.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["furniture","weight","moving","heavy"],
  variants: [{
    id: "standard",
    name: "Furniture Moving Weight",
    description: "Estimate the total weight of furniture to move.",
    fields: [
      { name: "sofas", label: "Sofas and Couches", type: "number", min: 0, max: 10, defaultValue: 1 },
      { name: "beds", label: "Beds (with mattress)", type: "number", min: 0, max: 10, defaultValue: 2 },
      { name: "dressers", label: "Dressers and Desks", type: "number", min: 0, max: 10, defaultValue: 2 },
      { name: "tables", label: "Tables and Chairs", type: "number", min: 0, max: 20, defaultValue: 4 },
    ],
    calculate: (inputs) => {
    const sofas = inputs.sofas as number;
    const beds = inputs.beds as number;
    const dressers = inputs.dressers as number;
    const tables = inputs.tables as number;
    const sofaWeight = sofas * 180;
    const bedWeight = beds * 150;
    const dresserWeight = dressers * 120;
    const tableWeight = tables * 50;
    const totalWeight = sofaWeight + bedWeight + dresserWeight + tableWeight;
    return { primary: { label: "Total Furniture Weight", value: formatNumber(totalWeight) + " lbs" }, details: [{ label: "Sofas", value: formatNumber(sofaWeight) + " lbs" }, { label: "Beds", value: formatNumber(bedWeight) + " lbs" }, { label: "Dressers and Desks", value: formatNumber(dresserWeight) + " lbs" }, { label: "Tables and Chairs", value: formatNumber(tableWeight) + " lbs" }] };
  },
  }],
  relatedSlugs: ["moving-cost-calculator","moving-truck-size-calculator","storage-unit-size-calculator"],
  faq: [
    { question: "How much does a sofa weigh?", answer: "An average sofa weighs about 150 to 200 pounds." },
    { question: "Do movers charge by weight?", answer: "Yes, long distance movers typically charge by total weight." },
    { question: "How do I reduce furniture weight?", answer: "Remove drawers and cushions before moving large pieces." },
  ],
  formula: "Total = Sofas * 180 + Beds * 150 + Dressers * 120 + Tables * 50",
};
