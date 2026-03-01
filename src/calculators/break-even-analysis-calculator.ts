import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const breakEvenAnalysisCalculator: CalculatorDefinition = {
  slug: "break-even-analysis-calculator",
  title: "Break-Even Analysis Calculator",
  description: "Determine the number of units or revenue needed to cover all fixed and variable costs and reach the break-even point.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["break even point","break even analysis","breakeven calculator"],
  variants: [{
    id: "standard",
    name: "Break-Even Analysis",
    description: "Determine the number of units or revenue needed to cover all fixed and variable costs and reach the break-even point.",
    fields: [
      { name: "fixedCosts", label: "Total Fixed Costs", type: "number", prefix: "$", min: 0, max: 10000000, defaultValue: 50000 },
      { name: "pricePerUnit", label: "Price Per Unit", type: "number", prefix: "$", min: 0.01, max: 100000, defaultValue: 50 },
      { name: "variableCostPerUnit", label: "Variable Cost Per Unit", type: "number", prefix: "$", min: 0, max: 100000, defaultValue: 20 },
    ],
    calculate: (inputs) => {
      const fixed = inputs.fixedCosts as number;
      const price = inputs.pricePerUnit as number;
      const variable = inputs.variableCostPerUnit as number;
      if (!fixed || !price || price <= variable) return null;
      const contributionMargin = price - variable;
      const breakEvenUnits = Math.ceil(fixed / contributionMargin);
      const breakEvenRevenue = breakEvenUnits * price;
      const marginPercent = (contributionMargin / price) * 100;
      return {
        primary: { label: "Break-Even Units", value: formatNumber(breakEvenUnits) },
        details: [
          { label: "Break-Even Revenue", value: "$" + formatNumber(Math.round(breakEvenRevenue)) },
          { label: "Contribution Margin Per Unit", value: "$" + formatNumber(Math.round(contributionMargin * 100) / 100) },
          { label: "Contribution Margin %", value: formatNumber(Math.round(marginPercent * 10) / 10) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["freelance-rate-calculator","markup-vs-margin-calculator"],
  faq: [
    { question: "What is the contribution margin?", answer: "The contribution margin is the selling price minus the variable cost per unit. It represents the portion of each sale that contributes toward covering fixed costs and generating profit." },
    { question: "Why is break-even analysis important for a new business?", answer: "Break-even analysis helps determine how many sales are needed before a business becomes profitable. It is essential for pricing decisions, financial planning, and evaluating business viability." },
  ],
  formula: "Break-Even Units = Fixed Costs / (Price Per Unit - Variable Cost Per Unit)",
};
