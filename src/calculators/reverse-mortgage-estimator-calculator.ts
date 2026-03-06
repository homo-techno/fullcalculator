import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const reverseMortgageEstimatorCalculator: CalculatorDefinition = {
  slug: "reverse-mortgage-estimator-calculator",
  title: "Reverse Mortgage Estimator Calculator",
  description: "Estimate how much you could receive from a reverse mortgage (HECM) based on your home value, age, and current interest rates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["reverse mortgage calculator","HECM calculator","reverse mortgage estimator","home equity conversion"],
  variants: [{
    id: "standard",
    name: "Reverse Mortgage Estimator",
    description: "Estimate how much you could receive from a reverse mortgage (HECM) based on your home value, age, and current interest rates.",
    fields: [
      { name: "homeValue", label: "Home Value ($)", type: "number", min: 50000, max: 5000000, defaultValue: 350000 },
      { name: "mortgageBalance", label: "Existing Mortgage Balance ($)", type: "number", min: 0, max: 5000000, defaultValue: 50000 },
      { name: "borrowerAge", label: "Youngest Borrower Age", type: "number", min: 62, max: 95, defaultValue: 70 },
      { name: "interestRate", label: "Expected Interest Rate (%)", type: "number", min: 2, max: 12, defaultValue: 6.5 },
      { name: "hecmLimit", label: "FHA Lending Limit ($)", type: "number", min: 100000, max: 1500000, defaultValue: 1149825 },
    ],
    calculate: (inputs) => {
    const homeVal = inputs.homeValue as number;
    const balance = inputs.mortgageBalance as number;
    const age = inputs.borrowerAge as number;
    const rate = inputs.interestRate as number;
    const limit = inputs.hecmLimit as number;
    const maxClaimAmount = Math.min(homeVal, limit);
    const ageFactor = Math.min(0.75, Math.max(0.30, 0.30 + (age - 62) * 0.012 - rate * 0.015));
    const principalLimit = Math.round(maxClaimAmount * ageFactor);
    const closingCosts = Math.round(maxClaimAmount * 0.02 + 2500);
    const netAvailable = Math.max(0, principalLimit - balance - closingCosts);
    const monthlyPayout = Math.round(netAvailable / ((95 - age) * 12));
    return {
      primary: { label: "Estimated Net Proceeds", value: "$" + formatNumber(netAvailable) },
      details: [
        { label: "Principal Limit", value: "$" + formatNumber(principalLimit) },
        { label: "Less Existing Mortgage", value: "$" + formatNumber(Math.round(balance)) },
        { label: "Less Closing Costs", value: "$" + formatNumber(closingCosts) },
        { label: "Estimated Monthly Tenure Payment", value: "$" + formatNumber(monthlyPayout) },
        { label: "Max Claim Amount", value: "$" + formatNumber(Math.round(maxClaimAmount)) }
      ]
    };
  },
  }],
  relatedSlugs: ["retirement-income-gap-calculator","retirement-healthcare-cost-calculator"],
  faq: [
    { question: "What is a reverse mortgage?", answer: "A reverse mortgage, most commonly a Home Equity Conversion Mortgage (HECM), allows homeowners 62 and older to convert part of their home equity into cash without selling the home or making monthly mortgage payments. The loan is repaid when the borrower moves out, sells, or passes away." },
    { question: "How much can I borrow with a reverse mortgage?", answer: "The amount depends on your age, home value, current interest rates, and the FHA lending limit. Generally, older borrowers with more valuable homes and lower interest rates can access a larger percentage of their equity." },
    { question: "What are the risks of a reverse mortgage?", answer: "Risks include accruing interest that reduces home equity over time, potential fees and closing costs, and the requirement to maintain the home and pay property taxes and insurance. Heirs may inherit less equity or need to repay the loan." },
  ],
  formula: "Max Claim Amount = min(Home Value, FHA Limit)
Principal Limit = Max Claim Amount x Age/Rate Factor
Net Available = Principal Limit - Existing Mortgage - Closing Costs",
};
