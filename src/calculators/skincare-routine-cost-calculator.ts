import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const skincareRoutineCostCalculator: CalculatorDefinition = {
  slug: "skincare-routine-cost-calculator",
  title: "Skincare Routine Cost Calculator",
  description: "Calculate your monthly and annual skincare product budget.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["skincare cost","skincare budget","beauty routine cost"],
  variants: [{
    id: "standard",
    name: "Skincare Routine Cost",
    description: "Calculate your monthly and annual skincare product budget.",
    fields: [
      { name: "cleanser", label: "Cleanser Cost ($)", type: "number", min: 5, max: 100, defaultValue: 15 },
      { name: "moisturizer", label: "Moisturizer Cost ($)", type: "number", min: 5, max: 150, defaultValue: 25 },
      { name: "serum", label: "Serum Cost ($)", type: "number", min: 0, max: 200, defaultValue: 35 },
      { name: "sunscreen", label: "Sunscreen Cost ($)", type: "number", min: 5, max: 60, defaultValue: 15 },
      { name: "extras", label: "Extra Products Cost ($)", type: "number", min: 0, max: 200, defaultValue: 20 },
      { name: "productLifespan", label: "Product Lifespan (months)", type: "number", min: 1, max: 6, defaultValue: 2 },
    ],
    calculate: (inputs) => {
    const cleanser = inputs.cleanser as number;
    const moisturizer = inputs.moisturizer as number;
    const serum = inputs.serum as number;
    const sunscreen = inputs.sunscreen as number;
    const extras = inputs.extras as number;
    const productLifespan = inputs.productLifespan as number;
    const totalProductCost = cleanser + moisturizer + serum + sunscreen + extras;
    const monthlyCost = totalProductCost / productLifespan;
    const annualCost = monthlyCost * 12;
    return {
      primary: { label: "Monthly Skincare Cost", value: "$" + formatNumber(monthlyCost) },
      details: [
        { label: "Total Product Cost", value: "$" + formatNumber(totalProductCost) },
        { label: "Product Lifespan", value: formatNumber(productLifespan) + " months" },
        { label: "Annual Cost", value: "$" + formatNumber(annualCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["perfume-cost-per-wear-calculator","facial-treatment-cost-calculator"],
  faq: [
    { question: "How much should you spend on skincare?", answer: "A basic routine costs $30 to $80 per month. Premium products cost more." },
    { question: "What are the essential skincare products?", answer: "Cleanser, moisturizer, and sunscreen are the three essential products." },
    { question: "How long do skincare products last?", answer: "Most products last 2 to 3 months with daily use." },
  ],
  formula: "Monthly Cost = (Cleanser + Moisturizer + Serum + Sunscreen + Extras) / Lifespan",
};
