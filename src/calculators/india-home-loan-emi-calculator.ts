import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const indiaHomeLoanEmiCalculator: CalculatorDefinition = {
  slug: "india-home-loan-emi-calculator",
  title: "India Home Loan EMI Calculator",
  description: "Free home loan EMI calculator for India. Calculate monthly EMI, total interest, and amortization for housing loans.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["emi calculator", "home loan emi calculator", "housing loan calculator india"],
  variants: [{
    id: "standard",
    name: "India Home Loan EMI",
    description: "Free home loan EMI calculator for India",
    fields: [
      { name: "principal", label: "Loan Amount", type: "number", prefix: "₹", min: 100000 },
      { name: "rate", label: "Annual Interest Rate", type: "number", suffix: "%", defaultValue: 8.5, min: 1, max: 20, step: 0.1 },
      { name: "tenure", label: "Loan Tenure", type: "number", suffix: "years", defaultValue: 20, min: 1, max: 30 },
    ],
    calculate: (inputs) => {
      const p = inputs.principal as number;
      const annualRate = inputs.rate as number;
      const years = inputs.tenure as number;
      if (!p || !annualRate || !years) return null;
      const r = annualRate / 100 / 12;
      const n = years * 12;
      const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      const totalPayment = emi * n;
      const totalInterest = totalPayment - p;
      return {
        primary: { label: "Monthly EMI", value: "₹" + formatNumber(emi) },
        details: [
          { label: "Total payment", value: "₹" + formatNumber(totalPayment) },
          { label: "Total interest", value: "₹" + formatNumber(totalInterest) },
          { label: "Interest to principal ratio", value: formatNumber((totalInterest / p) * 100) + "%" },
          { label: "Loan amount", value: "₹" + formatNumber(p) },
        ],
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is EMI calculated?", answer: "EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P is the loan amount, r is the monthly interest rate, and n is the total number of months." },
    { question: "What is a good home loan interest rate in India?", answer: "As of 2024-25, home loan rates in India range from 8.25% to 9.5% depending on the lender, loan amount, and your credit score." },
  ],
  formula: "EMI = P × r × (1+r)^n / ((1+r)^n - 1)",
};
