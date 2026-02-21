import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carPaymentCalculator: CalculatorDefinition = {
  slug: "car-payment-calculator",
  title: "Car Payment Calculator",
  description: "Free car payment calculator. Estimate monthly auto loan payments based on vehicle price, down payment, interest rate, and loan term.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["car payment", "auto loan payment", "monthly car payment", "car finance payment", "vehicle payment estimator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Car Payment",
      description: "Estimate your monthly car payment",
      fields: [
        { name: "price", label: "Vehicle Price", type: "number", placeholder: "e.g. 35000", prefix: "$" },
        { name: "downPayment", label: "Down Payment", type: "number", placeholder: "e.g. 5000", prefix: "$" },
        { name: "rate", label: "Interest Rate (%)", type: "number", placeholder: "e.g. 5.5", suffix: "%" },
        { name: "term", label: "Loan Term", type: "select", options: [
          { label: "24 months (2 years)", value: "24" },
          { label: "36 months (3 years)", value: "36" },
          { label: "48 months (4 years)", value: "48" },
          { label: "60 months (5 years)", value: "60" },
          { label: "72 months (6 years)", value: "72" },
          { label: "84 months (7 years)", value: "84" },
        ], defaultValue: "60" },
        { name: "salesTax", label: "Sales Tax (%)", type: "number", placeholder: "e.g. 6.0", suffix: "%" },
      ],
      calculate: (inputs) => {
        const price = inputs.price as number;
        const down = (inputs.downPayment as number) || 0;
        const apr = (inputs.rate as number) || 0;
        const months = parseInt(inputs.term as string) || 60;
        const taxRate = (inputs.salesTax as number) || 0;
        if (!price) return null;

        const taxAmount = price * (taxRate / 100);
        const principal = price + taxAmount - down;
        if (principal <= 0) return null;

        let payment: number;
        let totalInterest: number;
        if (apr === 0) {
          payment = principal / months;
          totalInterest = 0;
        } else {
          const r = apr / 100 / 12;
          payment = principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
          totalInterest = payment * months - principal;
        }

        const totalCost = payment * months + down;

        return {
          primary: { label: "Monthly Payment", value: `$${formatNumber(payment)}` },
          details: [
            { label: "Loan amount", value: `$${formatNumber(principal)}` },
            { label: "Sales tax", value: `$${formatNumber(taxAmount)}` },
            { label: "Total interest paid", value: `$${formatNumber(totalInterest)}` },
            { label: "Total cost of vehicle", value: `$${formatNumber(totalCost)}` },
          ],
        };
      },
    },
    {
      id: "biweekly",
      name: "Bi-Weekly Car Payment",
      description: "Calculate bi-weekly payment and savings",
      fields: [
        { name: "price", label: "Vehicle Price", type: "number", placeholder: "e.g. 35000", prefix: "$" },
        { name: "downPayment", label: "Down Payment", type: "number", placeholder: "e.g. 5000", prefix: "$" },
        { name: "rate", label: "Interest Rate (%)", type: "number", placeholder: "e.g. 5.5", suffix: "%" },
        { name: "term", label: "Loan Term", type: "select", options: [
          { label: "36 months (3 years)", value: "36" },
          { label: "48 months (4 years)", value: "48" },
          { label: "60 months (5 years)", value: "60" },
          { label: "72 months (6 years)", value: "72" },
        ], defaultValue: "60" },
      ],
      calculate: (inputs) => {
        const price = inputs.price as number;
        const down = (inputs.downPayment as number) || 0;
        const apr = (inputs.rate as number) || 0;
        const months = parseInt(inputs.term as string) || 60;
        if (!price) return null;

        const principal = price - down;
        if (principal <= 0) return null;

        let monthlyPayment: number;
        let totalInterestMonthly: number;
        if (apr === 0) {
          monthlyPayment = principal / months;
          totalInterestMonthly = 0;
        } else {
          const r = apr / 100 / 12;
          monthlyPayment = principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
          totalInterestMonthly = monthlyPayment * months - principal;
        }

        const biweeklyPayment = monthlyPayment / 2;
        // 26 bi-weekly payments per year = 13 monthly equivalents
        const annualExtra = monthlyPayment; // one extra month per year
        const interestSaved = totalInterestMonthly * 0.08; // approximate 8% interest savings
        const monthsSaved = Math.round(months * 0.08);

        return {
          primary: { label: "Bi-Weekly Payment", value: `$${formatNumber(biweeklyPayment)}` },
          details: [
            { label: "Monthly equivalent", value: `$${formatNumber(monthlyPayment)}` },
            { label: "Extra payment per year", value: `$${formatNumber(annualExtra)}` },
            { label: "Estimated interest savings", value: `$${formatNumber(interestSaved)}` },
            { label: "Months saved", value: `~${monthsSaved} months` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["car-loan-calculator", "car-affordability-calculator", "car-lease-vs-buy-calculator"],
  faq: [
    { question: "How is a car payment calculated?", answer: "Car payments are calculated using the loan amortization formula: M = P x r(1+r)^n / ((1+r)^n - 1), where P is the loan principal, r is the monthly interest rate, and n is the number of months. The principal is the vehicle price minus your down payment plus any taxes and fees." },
    { question: "What is a good monthly car payment?", answer: "Financial experts recommend keeping your car payment at or below 15% of your take-home pay. For example, if you bring home $4,000/month, aim for a car payment of $600 or less. The total cost of vehicle ownership (payment, insurance, gas, maintenance) should not exceed 20% of income." },
    { question: "Should I choose a longer loan term for lower payments?", answer: "While longer loan terms (72-84 months) lower your monthly payment, you pay significantly more in interest over the life of the loan. You may also end up owing more than the car is worth (being 'underwater'). Most experts recommend 60 months or less." },
  ],
  formula: "M = P x r(1+r)^n / ((1+r)^n - 1), where P = loan principal, r = monthly interest rate, n = number of months",
};
