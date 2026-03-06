import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const estatePlanningCostCalculator: CalculatorDefinition = {
  slug: "estate-planning-cost-calculator",
  title: "Estate Planning Cost Calculator",
  description: "Estimate the cost of essential estate planning documents including wills, trusts, power of attorney, and guardianship designations for families.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["estate planning cost","will cost","trust cost","estate attorney fees","family estate plan"],
  variants: [{
    id: "standard",
    name: "Estate Planning Cost",
    description: "Estimate the cost of essential estate planning documents including wills, trusts, power of attorney, and guardianship designations for families.",
    fields: [
      { name: "planType", label: "Estate Plan Type", type: "select", options: [{ value: "1", label: "Basic Will Package" }, { value: "2", label: "Will + Trust" }, { value: "3", label: "Comprehensive Estate Plan" }], defaultValue: "2" },
      { name: "estateSize", label: "Estimated Estate Value ($)", type: "number", min: 50000, max: 10000000, defaultValue: 500000 },
      { name: "region", label: "Cost Region", type: "select", options: [{ value: "0.8", label: "Low Cost Area" }, { value: "1.0", label: "Average" }, { value: "1.3", label: "High Cost Area" }, { value: "1.6", label: "Major Metro" }], defaultValue: "1.0" },
      { name: "children", label: "Number of Minor Children", type: "number", min: 0, max: 10, defaultValue: 2 },
    ],
    calculate: (inputs) => {
    const planType = inputs.planType as number;
    const estateSize = inputs.estateSize as number;
    const region = inputs.region as number;
    const children = inputs.children as number;
    const baseCosts = [0, 500, 2500, 5000];
    const baseCost = baseCosts[planType];
    const guardianshipCost = children > 0 ? 200 + (children * 50) : 0;
    const complexityAdj = estateSize > 1000000 ? 1.3 : (estateSize > 500000 ? 1.15 : 1.0);
    const totalCost = (baseCost + guardianshipCost) * region * complexityAdj;
    const planLabels = ["", "Basic Will Package", "Will + Trust", "Comprehensive Estate Plan"];
    const annualMaintenance = planType >= 2 ? totalCost * 0.05 : 0;
    return {
      primary: { label: "Estimated Estate Planning Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Plan Type", value: planLabels[planType] },
        { label: "Base Legal Fees", value: "$" + formatNumber(Math.round(baseCost * region)) },
        { label: "Guardianship Documents", value: "$" + formatNumber(Math.round(guardianshipCost * region)) },
        { label: "Complexity Adjustment", value: formatNumber(Math.round((complexityAdj - 1) * 100)) + "% premium" },
        { label: "Annual Maintenance/Updates", value: "$" + formatNumber(Math.round(annualMaintenance)) }
      ]
    };
  },
  }],
  relatedSlugs: ["family-emergency-fund-calculator","family-life-insurance-calculator","college-529-projector-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Total = (Base Cost + Guardianship) x Region Multiplier x Complexity Adjustment; Guardianship = $200 + $50 per child",
};
