import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const emiCalculator: CalculatorDefinition = {
  slug: "emi-calculator",
  title: "EMI Calculator",
  description:
    "Free EMI calculator. Calculate equated monthly installments for home loans, car loans, and personal loans. See total interest payable and payment breakdowns.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "EMI calculator",
    "loan EMI calculator",
    "home loan EMI",
    "car loan EMI",
    "personal loan EMI",
    "monthly installment calculator",
    "equated monthly installment",
  ],
  variants: [
    {
      id: "basic",
      name: "EMI Calculator",
      description: "Calculate equated monthly installment for any loan",
      fields: [
        {
          name: "principal",
          label: "Loan Amount",
          type: "number",
          placeholder: "e.g. 1000000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "rate",
          label: "Annual Interest Rate",
          type: "number",
          placeholder: "e.g. 8.5",
          suffix: "%",
          min: 0,
          max: 50,
          step: 0.1,
        },
        {
          name: "tenure",
          label: "Loan Tenure",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "years",
          min: 1,
          max: 30,
        },
      ],
      calculate: (inputs) => {
        const P = inputs.principal as number;
        const annualRate = inputs.rate as number;
        const years = inputs.tenure as number;
        if (!P || !annualRate || !years) return null;

        const r = annualRate / 12 / 100;
        const n = years * 12;
        const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalPayment = emi * n;
        const totalInterest = totalPayment - P;

        return {
          primary: { label: "Monthly EMI", value: `₹${formatNumber(emi)}` },
          details: [
            { label: "Loan amount", value: `₹${formatNumber(P)}` },
            { label: "Total interest payable", value: `₹${formatNumber(totalInterest)}` },
            { label: "Total payment (principal + interest)", value: `₹${formatNumber(totalPayment)}` },
            {
              label: "Interest as % of loan",
              value: `${formatNumber((totalInterest / P) * 100)}%`,
            },
          ],
        };
      },
    },
    {
      id: "affordability",
      name: "Loan Affordability",
      description: "Calculate the maximum loan you can afford based on EMI budget",
      fields: [
        {
          name: "emi",
          label: "Monthly EMI Budget",
          type: "number",
          placeholder: "e.g. 25000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "rate",
          label: "Annual Interest Rate",
          type: "number",
          placeholder: "e.g. 8.5",
          suffix: "%",
          min: 0,
          max: 50,
          step: 0.1,
        },
        {
          name: "tenure",
          label: "Loan Tenure",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "years",
          min: 1,
          max: 30,
        },
      ],
      calculate: (inputs) => {
        const emi = inputs.emi as number;
        const annualRate = inputs.rate as number;
        const years = inputs.tenure as number;
        if (!emi || !annualRate || !years) return null;

        const r = annualRate / 12 / 100;
        const n = years * 12;
        const principal = emi * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
        const totalPayment = emi * n;
        const totalInterest = totalPayment - principal;

        return {
          primary: { label: "Maximum Loan Amount", value: `₹${formatNumber(principal)}` },
          details: [
            { label: "Monthly EMI", value: `₹${formatNumber(emi)}` },
            { label: "Total interest payable", value: `₹${formatNumber(totalInterest)}` },
            { label: "Total payment", value: `₹${formatNumber(totalPayment)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "loan-calculator", "car-loan-calculator"],
  faq: [
    {
      question: "What is EMI?",
      answer:
        "EMI (Equated Monthly Installment) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are used to pay off both interest and principal each month so that over a specified number of years, the loan is fully paid off.",
    },
    {
      question: "How is EMI calculated?",
      answer:
        "EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P is the loan principal, r is the monthly interest rate (annual rate / 12 / 100), and n is the total number of monthly payments.",
    },
    {
      question: "Does a longer tenure reduce EMI?",
      answer:
        "Yes, a longer tenure reduces the monthly EMI amount. However, you end up paying more total interest over the life of the loan. A shorter tenure means higher EMIs but less total interest paid.",
    },
  ],
  formula: "EMI = P × r × (1+r)^n / ((1+r)^n - 1)",
};
