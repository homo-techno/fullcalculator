import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carLoanRefinanceCalculator: CalculatorDefinition = {
  slug: "car-loan-refinance-calculator",
  title: "Car Loan Refinance Calculator",
  description: "Compare your current auto loan with a refinanced loan to see potential monthly savings, total interest reduction, and break-even timeline.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["car loan refinance","auto loan refinance","car refinance savings","vehicle loan comparison"],
  variants: [{
    id: "standard",
    name: "Car Loan Refinance",
    description: "Compare your current auto loan with a refinanced loan to see potential monthly savings, total interest reduction, and break-even timeline.",
    fields: [
      { name: "currentBalance", label: "Current Loan Balance ($)", type: "number", min: 1000, max: 100000, defaultValue: 20000 },
      { name: "currentRate", label: "Current Interest Rate (%)", type: "number", min: 0.5, max: 30, defaultValue: 7.5 },
      { name: "currentMonthsLeft", label: "Months Remaining on Current Loan", type: "number", min: 1, max: 84, defaultValue: 48 },
      { name: "newRate", label: "New Interest Rate (%)", type: "number", min: 0.5, max: 30, defaultValue: 4.5 },
      { name: "newTerm", label: "New Loan Term (months)", type: "number", min: 12, max: 84, defaultValue: 48 },
      { name: "refiCost", label: "Refinance Fees ($)", type: "number", min: 0, max: 1000, defaultValue: 200 },
    ],
    calculate: (inputs) => {
    const balance = inputs.currentBalance as number;
    const currentRate = inputs.currentRate as number / 100 / 12;
    const currentMonths = inputs.currentMonthsLeft as number;
    const newRate = inputs.newRate as number / 100 / 12;
    const newTerm = inputs.newTerm as number;
    const refiCost = inputs.refiCost as number;
    const currentPayment = balance * (currentRate * Math.pow(1 + currentRate, currentMonths)) / (Math.pow(1 + currentRate, currentMonths) - 1);
    const newPayment = balance * (newRate * Math.pow(1 + newRate, newTerm)) / (Math.pow(1 + newRate, newTerm) - 1);
    const currentTotalInterest = (currentPayment * currentMonths) - balance;
    const newTotalInterest = (newPayment * newTerm) - balance;
    const monthlySavings = currentPayment - newPayment;
    const totalSavings = currentTotalInterest - newTotalInterest - refiCost;
    const breakEvenMonths = monthlySavings > 0 ? Math.ceil(refiCost / monthlySavings) : 0;
    return {
      primary: { label: "Monthly Savings", value: "$" + formatNumber(Math.round(monthlySavings * 100) / 100) },
      details: [
        { label: "Current Monthly Payment", value: "$" + formatNumber(Math.round(currentPayment * 100) / 100) },
        { label: "New Monthly Payment", value: "$" + formatNumber(Math.round(newPayment * 100) / 100) },
        { label: "Current Total Interest", value: "$" + formatNumber(Math.round(currentTotalInterest)) },
        { label: "New Total Interest", value: "$" + formatNumber(Math.round(newTotalInterest)) },
        { label: "Net Savings (after fees)", value: "$" + formatNumber(Math.round(totalSavings)) },
        { label: "Break-Even Period", value: formatNumber(breakEvenMonths) + " months" }
      ]
    };
  },
  }],
  relatedSlugs: ["car-depreciation-curve-calculator","car-subscription-vs-ownership-calculator"],
  faq: [
    { question: "When should I refinance my car loan?", answer: "Refinancing makes sense when interest rates have dropped significantly, your credit score has improved, or you want to change your loan term. Generally a 1 to 2 percent rate reduction makes refinancing worthwhile." },
    { question: "Does refinancing hurt my credit score?", answer: "A refinance application triggers a hard inquiry that may temporarily lower your score by 5 to 10 points. However, lower payments can improve your debt-to-income ratio over time." },
    { question: "Can I refinance an upside-down car loan?", answer: "Some lenders will refinance when you owe more than the car is worth, but terms may not be as favorable. Paying down the balance closer to the car value first yields better refinance rates." },
  ],
  formula: "Monthly Payment = Balance x [r(1+r)^n] / [(1+r)^n - 1]
Monthly Savings = Current Payment - New Payment
Net Savings = (Current Interest - New Interest) - Refinance Fees
Break-Even = Refinance Fees / Monthly Savings",
};
