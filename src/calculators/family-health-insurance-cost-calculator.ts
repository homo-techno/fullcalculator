import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const familyHealthInsuranceCostCalculator: CalculatorDefinition = {
  slug: "family-health-insurance-cost-calculator",
  title: "Family Health Insurance Cost Calculator",
  description: "Compare family health insurance plan costs by estimating premiums, deductibles, copays, and out-of-pocket maximums for different plan types.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["health insurance cost","family health plan","insurance comparison","health coverage cost","medical insurance"],
  variants: [{
    id: "standard",
    name: "Family Health Insurance Cost",
    description: "Compare family health insurance plan costs by estimating premiums, deductibles, copays, and out-of-pocket maximums for different plan types.",
    fields: [
      { name: "planType", label: "Plan Type", type: "select", options: [{ value: "1", label: "HMO" }, { value: "2", label: "PPO" }, { value: "3", label: "HDHP with HSA" }, { value: "4", label: "EPO" }], defaultValue: "2" },
      { name: "monthlyPremium", label: "Monthly Premium ($)", type: "number", min: 200, max: 3000, defaultValue: 800 },
      { name: "deductible", label: "Annual Deductible ($)", type: "number", min: 0, max: 15000, defaultValue: 3000 },
      { name: "expectedVisits", label: "Expected Doctor Visits/Year", type: "number", min: 0, max: 50, defaultValue: 12 },
      { name: "copay", label: "Average Copay Per Visit ($)", type: "number", min: 0, max: 100, defaultValue: 30 },
      { name: "oopMax", label: "Out-of-Pocket Maximum ($)", type: "number", min: 1000, max: 20000, defaultValue: 8000 },
    ],
    calculate: (inputs) => {
    const planType = inputs.planType as number;
    const monthlyPremium = inputs.monthlyPremium as number;
    const deductible = inputs.deductible as number;
    const expectedVisits = inputs.expectedVisits as number;
    const copay = inputs.copay as number;
    const oopMax = inputs.oopMax as number;
    const annualPremium = monthlyPremium * 12;
    const copayTotal = expectedVisits * copay;
    const estimatedOOP = Math.min(copayTotal + deductible, oopMax);
    const totalAnnualCost = annualPremium + estimatedOOP;
    const worstCase = annualPremium + oopMax;
    const planLabels = ["", "HMO", "PPO", "HDHP with HSA", "EPO"];
    const monthlyTotal = totalAnnualCost / 12;
    return {
      primary: { label: "Estimated Annual Cost", value: "$" + formatNumber(Math.round(totalAnnualCost)) },
      details: [
        { label: "Plan Type", value: planLabels[planType] },
        { label: "Annual Premiums", value: "$" + formatNumber(Math.round(annualPremium)) },
        { label: "Estimated Out-of-Pocket", value: "$" + formatNumber(Math.round(estimatedOOP)) },
        { label: "Monthly Total (Estimated)", value: "$" + formatNumber(Math.round(monthlyTotal)) },
        { label: "Worst Case (Max OOP)", value: "$" + formatNumber(Math.round(worstCase)) }
      ]
    };
  },
  }],
  relatedSlugs: ["family-life-insurance-calculator","family-emergency-fund-calculator","family-grocery-budget-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Annual Cost = (Monthly Premium x 12) + min(Copays + Deductible, OOP Max)
Worst Case = Annual Premium + Out-of-Pocket Maximum",
};
