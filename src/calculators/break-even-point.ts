import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const breakEvenPointCalculator: CalculatorDefinition = {
  slug: "break-even-point-calculator",
  title: "Break Even Point Calculator",
  description: "Free break even point in units calculator. Calculate how many units you need to sell to cover costs and start making profit.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["break even point calculator", "break even units", "BEP calculator", "units to break even", "contribution margin"],
  variants: [
    {
      id: "units",
      name: "Break Even in Units",
      description: "Calculate the number of units needed to break even",
      fields: [
        { name: "fixedCosts", label: "Total Fixed Costs", type: "number", placeholder: "e.g. 50000", prefix: "$" },
        { name: "sellingPrice", label: "Selling Price per Unit", type: "number", placeholder: "e.g. 100", prefix: "$" },
        { name: "variableCost", label: "Variable Cost per Unit", type: "number", placeholder: "e.g. 60", prefix: "$" },
      ],
      calculate: (inputs) => {
        const fixed = inputs.fixedCosts as number;
        const price = inputs.sellingPrice as number;
        const variable = (inputs.variableCost as number) || 0;
        if (!fixed || !price || price <= variable) return null;
        const contributionMargin = price - variable;
        const contributionRatio = contributionMargin / price;
        const bepUnits = Math.ceil(fixed / contributionMargin);
        const bepRevenue = bepUnits * price;
        return {
          primary: { label: "Break Even Point", value: `${formatNumber(bepUnits, 0)} units` },
          details: [
            { label: "Break Even Revenue", value: `$${formatNumber(bepRevenue)}` },
            { label: "Contribution Margin/Unit", value: `$${formatNumber(contributionMargin)}` },
            { label: "Contribution Margin Ratio", value: `${formatNumber(contributionRatio * 100)}%` },
            { label: "Fixed Costs", value: `$${formatNumber(fixed)}` },
          ],
        };
      },
    },
    {
      id: "targetProfit",
      name: "Units for Target Profit",
      description: "Calculate units needed to reach a specific profit target",
      fields: [
        { name: "fixedCosts", label: "Total Fixed Costs", type: "number", placeholder: "e.g. 50000", prefix: "$" },
        { name: "sellingPrice", label: "Selling Price per Unit", type: "number", placeholder: "e.g. 100", prefix: "$" },
        { name: "variableCost", label: "Variable Cost per Unit", type: "number", placeholder: "e.g. 60", prefix: "$" },
        { name: "targetProfit", label: "Target Profit", type: "number", placeholder: "e.g. 30000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const fixed = inputs.fixedCosts as number;
        const price = inputs.sellingPrice as number;
        const variable = (inputs.variableCost as number) || 0;
        const target = inputs.targetProfit as number;
        if (!fixed || !price || price <= variable || !target) return null;
        const contributionMargin = price - variable;
        const unitsNeeded = Math.ceil((fixed + target) / contributionMargin);
        const revenueNeeded = unitsNeeded * price;
        const bepUnits = Math.ceil(fixed / contributionMargin);
        const additionalUnits = unitsNeeded - bepUnits;
        return {
          primary: { label: "Units Needed for Target Profit", value: formatNumber(unitsNeeded, 0) },
          details: [
            { label: "Revenue Needed", value: `$${formatNumber(revenueNeeded)}` },
            { label: "Break Even Units", value: formatNumber(bepUnits, 0) },
            { label: "Additional Units Above BEP", value: formatNumber(additionalUnits, 0) },
            { label: "Contribution Margin/Unit", value: `$${formatNumber(contributionMargin)}` },
            { label: "Target Profit", value: `$${formatNumber(target)}` },
          ],
        };
      },
    },
    {
      id: "multiProduct",
      name: "Break Even Revenue",
      description: "Calculate break even using weighted average contribution margin",
      fields: [
        { name: "fixedCosts", label: "Total Fixed Costs", type: "number", placeholder: "e.g. 100000", prefix: "$" },
        { name: "totalRevenue", label: "Total Revenue (expected)", type: "number", placeholder: "e.g. 500000", prefix: "$" },
        { name: "totalVariableCosts", label: "Total Variable Costs", type: "number", placeholder: "e.g. 300000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const fixed = inputs.fixedCosts as number;
        const revenue = inputs.totalRevenue as number;
        const variable = inputs.totalVariableCosts as number;
        if (!fixed || !revenue || variable === undefined) return null;
        const contributionMarginRatio = (revenue - variable) / revenue;
        if (contributionMarginRatio <= 0) return null;
        const bepRevenue = fixed / contributionMarginRatio;
        const safetyMargin = revenue - bepRevenue;
        const safetyPct = (safetyMargin / revenue) * 100;
        return {
          primary: { label: "Break Even Revenue", value: `$${formatNumber(bepRevenue)}` },
          details: [
            { label: "Contribution Margin Ratio", value: `${formatNumber(contributionMarginRatio * 100)}%` },
            { label: "Margin of Safety ($)", value: `$${formatNumber(safetyMargin)}` },
            { label: "Margin of Safety (%)", value: `${formatNumber(safetyPct)}%` },
            { label: "Total Fixed Costs", value: `$${formatNumber(fixed)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["break-even-calculator", "margin-calculator", "profit-margin-calculator"],
  faq: [
    { question: "What is the break even point in units?", answer: "The break even point in units is the number of products you must sell to cover all fixed and variable costs. BEP (units) = Fixed Costs / (Selling Price per Unit - Variable Cost per Unit). Selling more units than BEP generates profit." },
    { question: "What is contribution margin?", answer: "Contribution margin is the selling price minus the variable cost per unit. It represents how much each unit sold contributes toward covering fixed costs and generating profit. A higher contribution margin means you break even faster." },
    { question: "What is the margin of safety?", answer: "The margin of safety is the difference between actual (or expected) sales and break even sales. It shows how much sales can decline before you start losing money. Margin of Safety = Actual Sales - Break Even Sales." },
  ],
  formula: "BEP (units) = Fixed Costs / (Price - Variable Cost) | BEP ($) = Fixed Costs / Contribution Margin Ratio | Margin of Safety = Actual Sales - BEP Sales",
};
