import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const legalFeeEstimatorCalculator: CalculatorDefinition = {
  slug: "legal-fee-estimator-calculator",
  title: "Legal Fee Estimator Calculator",
  description: "Estimate total legal fees based on case type, complexity, and attorney rate.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["legal fee estimator","lawyer cost","attorney fees","legal costs"],
  variants: [{
    id: "standard",
    name: "Legal Fee Estimator",
    description: "Estimate total legal fees based on case type, complexity, and attorney rate.",
    fields: [
      { name: "caseType", label: "Case Type", type: "select", options: [{ value: "1", label: "Family Law" }, { value: "2", label: "Criminal Defense" }, { value: "3", label: "Personal Injury" }, { value: "4", label: "Business Litigation" }, { value: "5", label: "Estate Planning" }], defaultValue: "1" },
      { name: "complexity", label: "Case Complexity", type: "select", options: [{ value: "1", label: "Simple" }, { value: "2", label: "Moderate" }, { value: "3", label: "Complex" }], defaultValue: "2" },
      { name: "hourlyRate", label: "Attorney Hourly Rate ($)", type: "number", min: 50, max: 1500, defaultValue: 300 },
      { name: "region", label: "Region Cost Factor", type: "select", options: [{ value: "1", label: "Rural" }, { value: "2", label: "Suburban" }, { value: "3", label: "Urban/Metro" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const caseType = inputs.caseType as string;
    const complexity = parseInt(inputs.complexity as string);
    const hourlyRate = inputs.hourlyRate as number;
    const region = parseInt(inputs.region as string);
    const baseHours: Record<string, number> = { "1": 25, "2": 40, "3": 30, "4": 60, "5": 15 };
    const caseNames: Record<string, string> = { "1": "Family Law", "2": "Criminal Defense", "3": "Personal Injury", "4": "Business Litigation", "5": "Estate Planning" };
    const complexityMult = [1, 1.5, 2.5][complexity - 1] || 1.5;
    const regionMult = [0.8, 1, 1.3][region - 1] || 1;
    const estHours = (baseHours[caseType] || 25) * complexityMult;
    const totalFee = estHours * hourlyRate * regionMult;
    const courtCosts = totalFee * 0.08;
    const grandTotal = totalFee + courtCosts;
    return {
      primary: { label: "Estimated Total Legal Fees", value: "$" + formatNumber(grandTotal) },
      details: [
        { label: "Case Type", value: caseNames[caseType] || "General" },
        { label: "Estimated Hours", value: formatNumber(estHours) },
        { label: "Attorney Fees", value: "$" + formatNumber(totalFee) },
        { label: "Estimated Court Costs", value: "$" + formatNumber(courtCosts) }
      ]
    };
  },
  }],
  relatedSlugs: ["billable-hours-calculator","legal-retainer-calculator","attorney-hourly-rate-comparison-calculator"],
  faq: [
    { question: "How much do lawyers charge per hour?", answer: "Attorney rates typically range from $150 to $500+ per hour depending on experience, specialization, and location." },
    { question: "What factors affect legal fees?", answer: "Case complexity, attorney experience, geographic region, case type, and whether the case goes to trial all affect total fees." },
    { question: "Are legal fees tax deductible?", answer: "Some legal fees are deductible, such as those related to business operations, tax advice, or employment discrimination. Personal legal fees are generally not deductible." },
  ],
  formula: "Total Fees = (Base Hours x Complexity Multiplier) x Hourly Rate x Region Factor + Court Costs",
};
