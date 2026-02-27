import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wholeHouseFanCalculator: CalculatorDefinition = {
  slug: "whole-house-fan-calculator",
  title: "Whole House Fan Calculator",
  description: "Free whole house fan calculator. Estimate costs and plan your budget.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["whole house fan calculator", "cost calculator", "budget planner"],
  variants: [
    {
      id: "estimate",
      name: "Cost Estimate",
      description: "Estimate whole house fan costs",
      fields: [
        {
          name: "area",
          label: "Area / Size",
          type: "number",
          placeholder: "e.g. 500",
          suffix: "sq ft",
          min: 0,
        },
        {
          name: "unitCost",
          label: "Cost per Unit",
          type: "number",
          placeholder: "e.g. 5",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "labor",
          label: "Labor Cost",
          type: "number",
          placeholder: "e.g. 500",
          prefix: "$",
          min: 0,
        }
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const unit = inputs.unitCost as number;
        const labor = inputs.labor as number || 0;
        if (!area || !unit) return null;
        const material = area * unit;
        const total = material + labor;
        return {
          primary: { label: "Total Cost", value: "$" + formatNumber(total) },
          details: [
            { label: "Material cost", value: "$" + formatNumber(material) },
            { label: "Labor cost", value: "$" + formatNumber(labor) },
            { label: "Cost per sq ft", value: "$" + formatNumber(total / area) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    { question: "How much does whole house fan cost?", answer: "Costs vary by location, quality, and requirements. Use our calculator for a personalized estimate." },
    { question: "How can I save money?", answer: "Compare providers, look for seasonal discounts, and plan ahead to reduce costs." },
  ],
  formula: "Total = Sum of all cost components",
};
