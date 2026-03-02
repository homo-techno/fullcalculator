import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const familyPhonePlanCostCalculator: CalculatorDefinition = {
  slug: "family-phone-plan-cost-calculator",
  title: "Family Phone Plan Cost Calculator",
  description: "Compare and estimate the monthly cost of family phone plans based on number of lines, data needs, and device payment options.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["family phone plan","cell phone family cost","mobile plan comparison","family wireless plan","phone plan budget"],
  variants: [{
    id: "standard",
    name: "Family Phone Plan Cost",
    description: "Compare and estimate the monthly cost of family phone plans based on number of lines, data needs, and device payment options.",
    fields: [
      { name: "lines", label: "Number of Lines", type: "number", min: 2, max: 8, defaultValue: 4 },
      { name: "dataPerLine", label: "Data Tier", type: "select", options: [{ value: "30", label: "Basic 5GB ($30/line)" }, { value: "45", label: "Standard 15GB ($45/line)" }, { value: "55", label: "Unlimited ($55/line)" }, { value: "70", label: "Premium Unlimited ($70/line)" }], defaultValue: "55" },
      { name: "devicePayments", label: "Device Payments Per Month ($)", type: "number", min: 0, max: 200, defaultValue: 50 },
      { name: "insurance", label: "Device Insurance Per Line ($)", type: "number", min: 0, max: 20, defaultValue: 8 },
    ],
    calculate: (inputs) => {
    const lines = inputs.lines as number;
    const dataPerLine = inputs.dataPerLine as number;
    const devicePayments = inputs.devicePayments as number;
    const insurance = inputs.insurance as number;
    const planCost = lines * dataPerLine;
    const multiLineDiscount = lines >= 3 ? planCost * 0.1 : 0;
    const insuranceTotal = lines * insurance;
    const fees = lines * 3.5;
    const monthly = planCost - multiLineDiscount + devicePayments + insuranceTotal + fees;
    const annual = monthly * 12;
    const perLine = monthly / lines;
    return {
      primary: { label: "Monthly Family Plan Cost", value: "$" + formatNumber(Math.round(monthly)) },
      details: [
        { label: "Plan Base Cost", value: "$" + formatNumber(Math.round(planCost)) },
        { label: "Multi-Line Discount", value: "-$" + formatNumber(Math.round(multiLineDiscount)) },
        { label: "Device Payments", value: "$" + formatNumber(Math.round(devicePayments)) },
        { label: "Insurance and Fees", value: "$" + formatNumber(Math.round(insuranceTotal + fees)) },
        { label: "Cost Per Line", value: "$" + formatNumber(Math.round(perLine)) },
        { label: "Annual Cost", value: "$" + formatNumber(Math.round(annual)) }
      ]
    };
  },
  }],
  relatedSlugs: ["family-grocery-budget-calculator","family-vacation-budget-calculator","college-529-projector-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Monthly = (Lines x Rate - Multi-Line Discount) + Device Payments + (Insurance x Lines) + Fees
Multi-Line Discount = 10% if 3+ lines",
};
