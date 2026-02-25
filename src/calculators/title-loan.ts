import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const titleLoanCalculator: CalculatorDefinition = {
  slug: "title-loan-calculator",
  title: "Title Loan Calculator",
  description:
    "Free title loan calculator. Estimate the true cost, monthly payments, and effective APR of a vehicle title loan to understand the full expense of this borrowing option.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "title loan calculator",
    "car title loan",
    "auto title loan calculator",
    "title pawn calculator",
    "vehicle title loan",
    "title loan cost",
  ],
  variants: [
    {
      id: "title-loan-cost",
      name: "Title Loan Cost",
      description: "Calculate the true cost of a vehicle title loan",
      fields: [
        {
          name: "vehicleValue",
          label: "Vehicle Value",
          type: "number",
          placeholder: "e.g. 10000",
          prefix: "$",
          min: 0,
        },
        {
          name: "ltvRatio",
          label: "Loan-to-Value Offered",
          type: "select",
          options: [
            { label: "25% of value", value: "25" },
            { label: "50% of value", value: "50" },
            { label: "75% of value", value: "75" },
            { label: "100% of value", value: "100" },
          ],
          defaultValue: "50",
        },
        {
          name: "monthlyRate",
          label: "Monthly Interest Rate",
          type: "select",
          options: [
            { label: "15% per month", value: "15" },
            { label: "20% per month", value: "20" },
            { label: "25% per month", value: "25" },
            { label: "30% per month", value: "30" },
          ],
          defaultValue: "25",
        },
        {
          name: "term",
          label: "Loan Term",
          type: "select",
          options: [
            { label: "1 month", value: "1" },
            { label: "2 months", value: "2" },
            { label: "3 months", value: "3" },
            { label: "6 months", value: "6" },
          ],
          defaultValue: "1",
        },
      ],
      calculate: (inputs) => {
        const vehicleValue = inputs.vehicleValue as number;
        const ltvPct = parseFloat(inputs.ltvRatio as string) || 50;
        const monthlyRatePct = parseFloat(inputs.monthlyRate as string) || 25;
        const months = parseInt(inputs.term as string) || 1;
        if (!vehicleValue) return null;

        const loanAmount = vehicleValue * (ltvPct / 100);
        const monthlyInterest = loanAmount * (monthlyRatePct / 100);
        const totalInterest = monthlyInterest * months;
        const totalRepayment = loanAmount + totalInterest;
        const annualAPR = monthlyRatePct * 12;
        const riskOfLoss = totalRepayment > vehicleValue ? "High" : "Moderate";

        return {
          primary: {
            label: "Effective Annual APR",
            value: `${formatNumber(annualAPR)}%`,
          },
          details: [
            { label: "Loan amount", value: `$${formatNumber(loanAmount)}` },
            { label: "Monthly interest charge", value: `$${formatNumber(monthlyInterest)}` },
            { label: "Total interest", value: `$${formatNumber(totalInterest)}` },
            { label: "Total repayment", value: `$${formatNumber(totalRepayment)}` },
            { label: "Vehicle value at risk", value: `$${formatNumber(vehicleValue)}` },
            { label: "Risk of vehicle loss", value: riskOfLoss },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["payday-loan-cost-calculator", "personal-loan-calculator"],
  faq: [
    {
      question: "What is a title loan?",
      answer:
        "A title loan is a short-term loan where you use your vehicle title as collateral. You keep driving your car, but the lender can repossess it if you default. Typical amounts are 25-50% of the vehicle's value.",
    },
    {
      question: "Why are title loans so expensive?",
      answer:
        "Title loans charge monthly rates of 15-30%, which translates to annual APRs of 180-360%. They target borrowers with few alternatives and the short terms make rollovers common, compounding costs further.",
    },
    {
      question: "What happens if I can't repay a title loan?",
      answer:
        "If you default on a title loan, the lender can repossess and sell your vehicle. Even after selling, you may still owe money if the sale doesn't cover the full loan balance plus fees.",
    },
  ],
  formula:
    "Loan = Vehicle Value x LTV%. Monthly Interest = Loan x Monthly Rate. APR = Monthly Rate x 12.",
};
