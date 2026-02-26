import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carAffordabilityMonthlyCalculator: CalculatorDefinition = {
  slug: "car-affordability-monthly-calculator",
  title: "Car Affordability Calculator (By Monthly Budget)",
  description:
    "Free online car affordability calculator. Find out how much car you can afford based on your monthly budget, income, and expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "car affordability calculator",
    "how much car can I afford",
    "car budget calculator",
    "auto affordability",
    "monthly car budget",
  ],
  variants: [
    {
      id: "by-budget",
      name: "Affordability by Monthly Budget",
      description: "Determine the max car price you can afford from your monthly budget",
      fields: [
        { name: "monthlyBudget", label: "Monthly Car Budget", type: "number", placeholder: "e.g. 500", prefix: "$" },
        { name: "downPayment", label: "Down Payment", type: "number", placeholder: "e.g. 5000", prefix: "$" },
        { name: "tradeIn", label: "Trade-In Value", type: "number", placeholder: "e.g. 3000", prefix: "$" },
        { name: "rate", label: "Interest Rate (APR)", type: "number", placeholder: "e.g. 6.5", suffix: "%" },
        {
          name: "term",
          label: "Loan Term",
          type: "select",
          options: [
            { label: "36 months (3 years)", value: "36" },
            { label: "48 months (4 years)", value: "48" },
            { label: "60 months (5 years)", value: "60" },
            { label: "72 months (6 years)", value: "72" },
          ],
          defaultValue: "60",
        },
      ],
      calculate: (inputs) => {
        const budget = parseFloat(inputs.monthlyBudget as string) || 0;
        const down = parseFloat(inputs.downPayment as string) || 0;
        const tradeIn = parseFloat(inputs.tradeIn as string) || 0;
        const apr = parseFloat(inputs.rate as string) || 0;
        const months = parseInt(inputs.term as string) || 60;
        if (!budget) return null;

        let maxLoan: number;
        if (apr === 0) {
          maxLoan = budget * months;
        } else {
          const r = apr / 100 / 12;
          maxLoan = budget * (Math.pow(1 + r, months) - 1) / (r * Math.pow(1 + r, months));
        }
        const maxPrice = maxLoan + down + tradeIn;
        const totalPaid = budget * months + down;
        const totalInterest = totalPaid - maxLoan - down;

        return {
          primary: { label: "Max Vehicle Price", value: `$${formatNumber(maxPrice)}` },
          details: [
            { label: "Max loan amount", value: `$${formatNumber(maxLoan)}` },
            { label: "Down payment", value: `$${formatNumber(down)}` },
            { label: "Trade-in value", value: `$${formatNumber(tradeIn)}` },
            { label: "Total paid over loan", value: `$${formatNumber(totalPaid)}` },
            { label: "Total interest", value: `$${formatNumber(totalInterest > 0 ? totalInterest : 0)}` },
          ],
        };
      },
    },
    {
      id: "by-income",
      name: "Affordability by Income",
      description: "Use the 20/4/10 rule to determine car affordability",
      fields: [
        { name: "monthlyIncome", label: "Gross Monthly Income", type: "number", placeholder: "e.g. 6000", prefix: "$" },
        { name: "monthlyDebts", label: "Other Monthly Debts", type: "number", placeholder: "e.g. 500", prefix: "$" },
        { name: "rate", label: "Interest Rate (APR)", type: "number", placeholder: "e.g. 6.5", suffix: "%" },
      ],
      calculate: (inputs) => {
        const income = parseFloat(inputs.monthlyIncome as string) || 0;
        const debts = parseFloat(inputs.monthlyDebts as string) || 0;
        const apr = parseFloat(inputs.rate as string) || 0;
        if (!income) return null;

        // 10% of gross income for car payment
        const maxPayment = income * 0.10;
        // 20% down payment recommended
        const months = 48; // 4-year loan (20/4/10 rule)
        let maxLoan: number;
        if (apr === 0) {
          maxLoan = maxPayment * months;
        } else {
          const r = apr / 100 / 12;
          maxLoan = maxPayment * (Math.pow(1 + r, months) - 1) / (r * Math.pow(1 + r, months));
        }
        // 20% down means loan is 80% of price
        const maxPrice = maxLoan / 0.8;
        const recommendedDown = maxPrice * 0.2;

        return {
          primary: { label: "Recommended Max Price", value: `$${formatNumber(maxPrice)}` },
          details: [
            { label: "Max monthly payment (10% rule)", value: `$${formatNumber(maxPayment)}` },
            { label: "Recommended down (20%)", value: `$${formatNumber(recommendedDown)}` },
            { label: "Max loan (48 months)", value: `$${formatNumber(maxLoan)}` },
            { label: "Total cost of ownership", value: `$${formatNumber(maxPayment * months + recommendedDown)}` },
          ],
          note: "Based on the 20/4/10 rule: 20% down, 4-year loan, no more than 10% of gross income on payments.",
        };
      },
    },
  ],
  relatedSlugs: ["car-loan-calculator", "car-lease-calculator"],
  faq: [
    {
      question: "What is the 20/4/10 rule for buying a car?",
      answer:
        "The 20/4/10 rule suggests putting at least 20% down, financing for no more than 4 years, and keeping total transportation costs (payment + insurance + gas) under 10% of gross monthly income.",
    },
    {
      question: "How much of my income should go to a car payment?",
      answer:
        "Financial experts recommend keeping your car payment at or below 10-15% of your gross monthly income. The more conservative 10% target helps ensure room for insurance, gas, and maintenance costs.",
    },
  ],
  formula: "Max Loan = Payment x [(1+r)^n - 1] / [r(1+r)^n]",
};
