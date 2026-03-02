import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tennisCourtCostCalculator: CalculatorDefinition = {
  slug: "tennis-court-cost-calculator",
  title: "Tennis Court Cost Calculator",
  description: "Estimate the cost of building a tennis court.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["tennis","court","cost","construction"],
  variants: [{
    id: "standard",
    name: "Tennis Court Cost",
    description: "Estimate the cost of building a tennis court.",
    fields: [
      { name: "surfaceType", label: "Surface Type", type: "select", options: [{ value: "1", label: "Hard Court" }, { value: "2", label: "Clay" }, { value: "3", label: "Grass" }], defaultValue: "1" },
      { name: "fencing", label: "Include Fencing", type: "select", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }], defaultValue: "1" },
      { name: "lighting", label: "Include Lighting", type: "select", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }], defaultValue: "0" },
    ],
    calculate: (inputs) => {
    const surfaceType = inputs.surfaceType as number;
    const fencing = inputs.fencing as number;
    const lighting = inputs.lighting as number;
    const courtArea = 78 * 36;
    let baseCost = 25000;
    if (surfaceType === 2) baseCost = 35000;
    if (surfaceType === 3) baseCost = 50000;
    const fencingCost = fencing === 1 ? 8000 : 0;
    const lightingCost = lighting === 1 ? 12000 : 0;
    const totalCost = baseCost + fencingCost + lightingCost;
    return {
      primary: { label: "Total Estimated Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Court Area", value: formatNumber(courtArea) + " sq ft" },
        { label: "Base Surface Cost", value: "$" + formatNumber(baseCost) },
        { label: "Fencing Cost", value: "$" + formatNumber(fencingCost) },
        { label: "Lighting Cost", value: "$" + formatNumber(lightingCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["basketball-court-size-calculator","concrete-driveway-cost-calculator"],
  faq: [
    { question: "How much does a tennis court cost?", answer: "A basic hard court costs around 25000 to 50000 dollars." },
    { question: "What is the standard tennis court size?", answer: "A standard tennis court is 78 feet long by 36 feet wide." },
  ],
  formula: "Total Cost = Base Surface Cost + Fencing Cost + Lighting Cost",
};
