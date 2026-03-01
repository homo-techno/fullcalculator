import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sr22InsuranceCostCalculator: CalculatorDefinition = {
  slug: "sr22-insurance-cost-calculator",
  title: "SR-22 Insurance Cost Calculator",
  description: "Estimate the cost increase for SR-22 insurance based on state and violation type.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["sr22 insurance cost", "sr22 filing cost", "sr22 premium increase"],
  variants: [{
    id: "standard",
    name: "SR-22 Insurance Cost",
    description: "Estimate the cost increase for SR-22 insurance based on state and violation type",
    fields: [
      { name: "state", label: "State", type: "select", options: [{value:"low",label:"Low-Cost State"},{value:"mid",label:"Average State"},{value:"high",label:"High-Cost State"}], defaultValue: "mid" },
      { name: "violation", label: "Violation Type", type: "select", options: [{value:"dui",label:"DUI/DWI"},{value:"reckless",label:"Reckless Driving"},{value:"uninsured",label:"Driving Uninsured"},{value:"multiple",label:"Multiple Violations"}], defaultValue: "dui" },
      { name: "currentPremium", label: "Current Annual Premium", type: "number", prefix: "$", min: 200, max: 20000, defaultValue: 1500 },
    ],
    calculate: (inputs) => {
      const state = inputs.state as string;
      const violation = inputs.violation as string;
      const current = inputs.currentPremium as number;
      if (!current || current <= 0) return null;
      const stateMultiplier: Record<string, number> = { low: 0.8, mid: 1.0, high: 1.3 };
      const violationSurcharge: Record<string, number> = { dui: 0.80, reckless: 0.50, uninsured: 0.30, multiple: 1.00 };
      const surchargeRate = (violationSurcharge[violation] || 0.50) * (stateMultiplier[state] || 1.0);
      const surcharge = current * surchargeRate;
      const newPremium = current + surcharge;
      const filingFee = 25;
      const threeYearCost = surcharge * 3 + filingFee;
      return {
        primary: { label: "Estimated New Annual Premium", value: "$" + formatNumber(newPremium) },
        details: [
          { label: "Annual Surcharge", value: "$" + formatNumber(surcharge) },
          { label: "SR-22 Filing Fee", value: "$" + formatNumber(filingFee) },
          { label: "3-Year Total Extra Cost", value: "$" + formatNumber(threeYearCost) },
          { label: "Premium Increase", value: (surchargeRate * 100).toFixed(0) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["auto-insurance-deductible-comparison-calculator", "umbrella-insurance-coverage-calculator"],
  faq: [
    { question: "How much does SR-22 insurance cost?", answer: "SR-22 filing itself costs $15-$50, but the associated premium increase can be 30% to 100% or more depending on the violation." },
    { question: "How long do you need SR-22 insurance?", answer: "Most states require SR-22 filing for 3 years, though some require it for up to 5 years." },
  ],
  formula: "New Premium = Current Premium + (Current Premium x Violation Surcharge x State Multiplier)",
};
