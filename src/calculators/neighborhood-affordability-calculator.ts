import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const neighborhoodAffordabilityCalculator: CalculatorDefinition = {
  slug: "neighborhood-affordability-calculator",
  title: "Neighborhood Affordability Calculator",
  description: "Calculate a housing affordability index for a neighborhood.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["neighborhood","affordability","housing","income"],
  variants: [{
    id: "standard",
    name: "Neighborhood Affordability",
    description: "Calculate a housing affordability index for a neighborhood.",
    fields: [
      { name: "medianIncome", label: "Household Income ($)", type: "number", min: 20000, max: 500000, defaultValue: 65000 },
      { name: "medianHomePrice", label: "Median Home Price ($)", type: "number", min: 50000, max: 2000000, defaultValue: 350000 },
      { name: "interestRate", label: "Mortgage Rate (%)", type: "number", min: 2, max: 12, defaultValue: 6.5 },
    ],
    calculate: (inputs) => {
    const medianIncome = inputs.medianIncome as number;
    const medianHomePrice = inputs.medianHomePrice as number;
    const interestRate = inputs.interestRate as number;
    const monthlyRate = interestRate / 100 / 12;
    const loanAmount = medianHomePrice * 0.8;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, 360)) / (Math.pow(1 + monthlyRate, 360) - 1);
    const monthlyIncome = medianIncome / 12;
    const ratio = (monthlyPayment / monthlyIncome) * 100;
    const affordable = ratio <= 28 ? "Yes" : "No";
    return { primary: { label: "Housing Cost Ratio", value: ratio.toFixed(1) + "%" }, details: [{ label: "Monthly Mortgage Payment", value: "$" + formatNumber(monthlyPayment) }, { label: "Monthly Income", value: "$" + formatNumber(monthlyIncome) }, { label: "Meets 28% Rule", value: affordable }] };
  },
  }],
  relatedSlugs: ["relocation-cost-of-living-calculator","commute-comparison-calculator","moving-cost-calculator"],
  faq: [
    { question: "What is the 28% rule for housing?", answer: "Spend no more than 28% of gross income on housing costs." },
    { question: "What is a good affordability ratio?", answer: "Below 28% is considered affordable by lender standards." },
    { question: "Does this include taxes and insurance?", answer: "No, add about 1.5% of home value yearly for those costs." },
  ],
  formula: "Ratio = MonthlyMortgage / MonthlyIncome * 100",
};
