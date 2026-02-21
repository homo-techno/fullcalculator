import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carAffordabilityCalculator: CalculatorDefinition = {
  slug: "car-affordability-calculator",
  title: "Car Affordability Calculator",
  description: "Free car affordability calculator. Find out how much car you can afford based on your income, expenses, down payment, and desired loan terms.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["how much car can I afford", "car affordability", "car budget calculator", "vehicle affordability", "auto budget"],
  variants: [
    {
      id: "income",
      name: "Based on Income",
      description: "Calculate car affordability based on your income",
      fields: [
        { name: "monthlyIncome", label: "Monthly Take-Home Pay", type: "number", placeholder: "e.g. 5000", prefix: "$" },
        { name: "monthlyExpenses", label: "Monthly Expenses (rent, bills, etc.)", type: "number", placeholder: "e.g. 3000", prefix: "$" },
        { name: "downPayment", label: "Down Payment Available", type: "number", placeholder: "e.g. 5000", prefix: "$" },
        { name: "rate", label: "Expected Interest Rate (%)", type: "number", placeholder: "e.g. 6.0", suffix: "%" },
        { name: "term", label: "Loan Term", type: "select", options: [
          { label: "36 months (3 years)", value: "36" },
          { label: "48 months (4 years)", value: "48" },
          { label: "60 months (5 years)", value: "60" },
          { label: "72 months (6 years)", value: "72" },
        ], defaultValue: "60" },
        { name: "pctOfIncome", label: "Max % of Income for Car", type: "select", options: [
          { label: "10% (conservative)", value: "10" },
          { label: "15% (recommended)", value: "15" },
          { label: "20% (aggressive)", value: "20" },
        ], defaultValue: "15" },
      ],
      calculate: (inputs) => {
        const income = inputs.monthlyIncome as number;
        const expenses = (inputs.monthlyExpenses as number) || 0;
        const down = (inputs.downPayment as number) || 0;
        const apr = (inputs.rate as number) || 0;
        const months = parseInt(inputs.term as string) || 60;
        const pct = parseInt(inputs.pctOfIncome as string) || 15;
        if (!income) return null;

        const maxPayment = income * (pct / 100);
        const disposableIncome = income - expenses;
        const recommendedPayment = Math.min(maxPayment, disposableIncome * 0.5);

        let maxLoanAmount: number;
        if (apr === 0) {
          maxLoanAmount = recommendedPayment * months;
        } else {
          const r = apr / 100 / 12;
          maxLoanAmount = recommendedPayment * (Math.pow(1 + r, months) - 1) / (r * Math.pow(1 + r, months));
        }

        const maxCarPrice = maxLoanAmount + down;
        const insuranceEstimate = maxCarPrice * 0.04 / 12; // rough annual 4% of value
        const totalMonthlyCost = recommendedPayment + insuranceEstimate + 100; // +$100 gas/maintenance

        return {
          primary: { label: "Max Vehicle Price", value: `$${formatNumber(maxCarPrice)}` },
          details: [
            { label: "Max monthly payment", value: `$${formatNumber(recommendedPayment)}` },
            { label: "Max loan amount", value: `$${formatNumber(maxLoanAmount)}` },
            { label: "Estimated insurance", value: `$${formatNumber(insuranceEstimate)}/mo` },
            { label: "Est. total monthly cost", value: `$${formatNumber(totalMonthlyCost)}/mo` },
            { label: "Disposable income left", value: `$${formatNumber(disposableIncome - totalMonthlyCost)}/mo` },
          ],
          note: "Total monthly cost includes estimated insurance, gas, and maintenance. The 15% of income rule is a common guideline for car payments.",
        };
      },
    },
    {
      id: "payment",
      name: "Based on Monthly Payment",
      description: "Find max car price from a target monthly payment",
      fields: [
        { name: "targetPayment", label: "Target Monthly Payment", type: "number", placeholder: "e.g. 500", prefix: "$" },
        { name: "downPayment", label: "Down Payment", type: "number", placeholder: "e.g. 5000", prefix: "$" },
        { name: "rate", label: "Interest Rate (%)", type: "number", placeholder: "e.g. 6.0", suffix: "%" },
        { name: "term", label: "Loan Term", type: "select", options: [
          { label: "36 months", value: "36" },
          { label: "48 months", value: "48" },
          { label: "60 months", value: "60" },
          { label: "72 months", value: "72" },
        ], defaultValue: "60" },
      ],
      calculate: (inputs) => {
        const payment = inputs.targetPayment as number;
        const down = (inputs.downPayment as number) || 0;
        const apr = (inputs.rate as number) || 0;
        const months = parseInt(inputs.term as string) || 60;
        if (!payment) return null;

        let loanAmount: number;
        if (apr === 0) {
          loanAmount = payment * months;
        } else {
          const r = apr / 100 / 12;
          loanAmount = payment * (Math.pow(1 + r, months) - 1) / (r * Math.pow(1 + r, months));
        }

        const maxPrice = loanAmount + down;
        const totalPaid = payment * months + down;
        const totalInterest = totalPaid - maxPrice;

        return {
          primary: { label: "Max Vehicle Price", value: `$${formatNumber(maxPrice)}` },
          details: [
            { label: "Loan amount", value: `$${formatNumber(loanAmount)}` },
            { label: "Total you will pay", value: `$${formatNumber(totalPaid)}` },
            { label: "Total interest", value: `$${formatNumber(Math.max(0, totalInterest))}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["car-payment-calculator", "car-loan-calculator", "car-insurance-calculator"],
  faq: [
    { question: "How much of my income should I spend on a car?", answer: "The 20/4/10 rule is a popular guideline: put at least 20% down, finance for no more than 4 years, and keep total transportation costs (payment, insurance, gas, maintenance) under 10% of gross income. Many experts recommend keeping just the car payment at 10-15% of take-home pay." },
    { question: "Should I include insurance and maintenance in my budget?", answer: "Yes. Your total cost of ownership includes the car payment, insurance ($100-$250/month), gas ($100-$300/month), and maintenance ($50-$100/month). Budget for the full picture, not just the monthly payment." },
    { question: "Does a longer loan term mean I can afford more car?", answer: "A longer term lowers your monthly payment but increases total interest paid. You may also owe more than the car is worth for longer. Stick to 60 months or less and focus on what fits your overall budget." },
  ],
  formula: "Max Loan = Payment x ((1+r)^n - 1) / (r x (1+r)^n); Max Price = Max Loan + Down Payment",
};
