import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mortgageRefinanceCalculator: CalculatorDefinition = {
  slug: "mortgage-refinance-calculator",
  title: "Mortgage Refinance Calculator",
  description:
    "Free mortgage refinance calculator. Compare your current mortgage to a new one and find your monthly savings and break-even point.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["mortgage refinance", "refinance", "mortgage", "interest rate", "break-even"],
  variants: [
    {
      id: "comparison",
      name: "Refinance Comparison",
      fields: [
        { name: "remainingBalance", label: "Remaining Loan Balance ($)", type: "number", placeholder: "e.g. 300000" },
        { name: "oldRate", label: "Current Interest Rate (%)", type: "number", placeholder: "e.g. 6.5" },
        { name: "oldRemainingYears", label: "Remaining Years on Current Loan", type: "number", placeholder: "e.g. 25" },
        { name: "newRate", label: "New Interest Rate (%)", type: "number", placeholder: "e.g. 5.5" },
        { name: "newTerm", label: "New Loan Term (years)", type: "number", placeholder: "e.g. 30" },
        { name: "closingCosts", label: "Closing Costs ($)", type: "number", placeholder: "e.g. 5000" },
      ],
      calculate: (inputs) => {
        const remainingBalance = inputs.remainingBalance as number;
        const oldRate = inputs.oldRate as number;
        const oldRemainingYears = inputs.oldRemainingYears as number;
        const newRate = inputs.newRate as number;
        const newTerm = inputs.newTerm as number;
        const closingCosts = inputs.closingCosts as number || 0;

        if (!remainingBalance || !oldRate || !oldRemainingYears || !newRate || !newTerm) return null;

        // Current mortgage payment
        const oldMonthlyRate = (oldRate / 100) / 12;
        const oldMonths = oldRemainingYears * 12;
        const oldPayment = remainingBalance * (oldMonthlyRate * Math.pow(1 + oldMonthlyRate, oldMonths)) /
          (Math.pow(1 + oldMonthlyRate, oldMonths) - 1);
        const oldTotalCost = oldPayment * oldMonths;

        // New mortgage payment
        const newMonthlyRate = (newRate / 100) / 12;
        const newMonths = newTerm * 12;
        const newLoanAmount = remainingBalance + closingCosts;
        const newPayment = newLoanAmount * (newMonthlyRate * Math.pow(1 + newMonthlyRate, newMonths)) /
          (Math.pow(1 + newMonthlyRate, newMonths) - 1);
        const newTotalCost = newPayment * newMonths;

        const monthlySavings = oldPayment - newPayment;
        const breakEvenMonths = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : Infinity;
        const lifetimeSavings = oldTotalCost - newTotalCost;

        return {
          primary: { label: "Monthly Savings", value: `$${formatNumber(monthlySavings, 2)}` },
          details: [
            { label: "Current Monthly Payment", value: `$${formatNumber(oldPayment, 2)}` },
            { label: "New Monthly Payment", value: `$${formatNumber(newPayment, 2)}` },
            { label: "Break-Even Point", value: breakEvenMonths === Infinity ? "N/A" : `${breakEvenMonths} months` },
            { label: "Current Total Remaining Cost", value: `$${formatNumber(oldTotalCost, 2)}` },
            { label: "New Total Cost", value: `$${formatNumber(newTotalCost, 2)}` },
            { label: "Lifetime Savings", value: `$${formatNumber(lifetimeSavings, 2)}` },
            { label: "Closing Costs", value: `$${formatNumber(closingCosts, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["home-equity-calculator", "rent-vs-buy-calculator", "present-value-calculator"],
  faq: [
    { question: "When should I refinance my mortgage?", answer: "Refinancing typically makes sense when you can lower your rate by at least 0.5-1%, plan to stay in the home long enough to recoup closing costs (break-even point), and your credit score qualifies you for better rates." },
    { question: "What is the break-even point?", answer: "The break-even point is how many months of lower payments it takes to recover the closing costs of refinancing. After this point, you start saving money." },
  ],
  formula: "Monthly Payment = P × [r(1+r)^n] / [(1+r)^n - 1]; Break-Even = Closing Costs / Monthly Savings",
};
