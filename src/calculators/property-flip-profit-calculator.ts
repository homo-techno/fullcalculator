import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const propertyFlipProfitCalculator: CalculatorDefinition = {
  slug: "property-flip-profit-calculator",
  title: "Property Flip Profit Calculator",
  description: "Estimate profit from buying, renovating, and selling a property",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["house flip","property flip profit","real estate flip"],
  variants: [{
    id: "standard",
    name: "Property Flip Profit",
    description: "Estimate profit from buying, renovating, and selling a property",
    fields: [
      { name: "purchasePrice", label: "Purchase Price ($)", type: "number", defaultValue: 200000, min: 0, step: 10000 },
      { name: "rehabCost", label: "Renovation Cost ($)", type: "number", defaultValue: 40000, min: 0, step: 5000 },
      { name: "afterRepairValue", label: "After Repair Value ($)", type: "number", defaultValue: 300000, min: 0, step: 10000 },
      { name: "holdingMonths", label: "Holding Period (months)", type: "number", defaultValue: 4, min: 1, max: 24, step: 1 },
      { name: "closingCostPct", label: "Closing Costs (%)", type: "number", defaultValue: 8, min: 0, max: 15, step: 0.5 },
    ],
    calculate: (inputs: Record<string, string | number>) => {
      const purchase = inputs.purchasePrice as number || 200000;
      const rehab = inputs.rehabCost as number || 40000;
      const arv = inputs.afterRepairValue as number || 300000;
      const months = inputs.holdingMonths as number || 4;
      const closingPct = (inputs.closingCostPct as number || 8) / 100;
      const closingCosts = arv * closingPct;
      const holdingCosts = (purchase * 0.08 / 12) * months;
      const totalInvestment = purchase + rehab + closingCosts + holdingCosts;
      const profit = arv - totalInvestment;
      const roi = (profit / totalInvestment) * 100;
      const annualizedRoi = roi * (12 / months);
      return {
        primary: { label: "Estimated Profit", value: "$" + formatNumber(Math.round(profit)) },
        details: [
          { label: "Total Investment", value: "$" + formatNumber(Math.round(totalInvestment)) },
          { label: "Closing Costs", value: "$" + formatNumber(Math.round(closingCosts)) },
          { label: "Holding Costs", value: "$" + formatNumber(Math.round(holdingCosts)) },
          { label: "ROI", value: formatNumber(Math.round(roi * 10) / 10) + "%" }
        ]
      };
    },
  }],
  relatedSlugs: ["rental-yield-calculator"],
  faq: [
    { question: "What is the 70% rule in house flipping?", answer: "Do not pay more than 70% of the after repair value minus renovation costs to ensure profitability." },
    { question: "What are holding costs?", answer: "Holding costs include mortgage payments, insurance, taxes, and utilities during the renovation period." },
  ],
  formula: "Profit = After Repair Value - Purchase - Rehab - Closing Costs - Holding Costs",
};
