import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fhaLoanCalculator: CalculatorDefinition = {
  slug: "fha-loan-calculator",
  title: "FHA Loan Calculator",
  description:
    "Free FHA loan calculator. Calculate FHA mortgage payments including upfront and annual mortgage insurance premiums (MIP). See total monthly cost with FHA loan requirements.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "fha loan calculator",
    "fha mortgage calculator",
    "fha payment calculator",
    "fha mip calculator",
    "fha mortgage insurance",
  ],
  variants: [
    {
      id: "fha-payment",
      name: "FHA Loan Payment",
      description: "Calculate monthly FHA loan payment including mortgage insurance premiums",
      fields: [
        {
          name: "homePrice",
          label: "Home Price",
          type: "number",
          placeholder: "e.g. 300000",
          prefix: "$",
          min: 0,
        },
        {
          name: "downPaymentPct",
          label: "Down Payment",
          type: "number",
          placeholder: "e.g. 3.5",
          suffix: "%",
          min: 3.5,
          max: 100,
          step: 0.1,
          defaultValue: 3.5,
        },
        {
          name: "interestRate",
          label: "Interest Rate",
          type: "number",
          placeholder: "e.g. 6.5",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "term",
          label: "Loan Term",
          type: "select",
          options: [
            { label: "30 years", value: "30" },
            { label: "15 years", value: "15" },
          ],
          defaultValue: "30",
        },
      ],
      calculate: (inputs) => {
        const homePrice = inputs.homePrice as number;
        const downPct = (inputs.downPaymentPct as number) || 3.5;
        const rate = inputs.interestRate as number;
        const years = parseInt(inputs.term as string) || 30;
        if (!homePrice || !rate) return null;

        const downPayment = homePrice * (downPct / 100);
        const baseLoan = homePrice - downPayment;

        // FHA Upfront MIP = 1.75% of base loan amount (financed into loan)
        const upfrontMIP = baseLoan * 0.0175;
        const totalLoan = baseLoan + upfrontMIP;

        // Annual MIP rate = 0.55% for most FHA loans (> 95% LTV, 30-year)
        const annualMIPRate = 0.0055;
        const monthlyMIP = (baseLoan * annualMIPRate) / 12;

        // Calculate principal & interest payment
        const monthlyRate = rate / 100 / 12;
        const numPayments = years * 12;
        const monthlyPI =
          (totalLoan * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
          (Math.pow(1 + monthlyRate, numPayments) - 1);

        const totalMonthly = monthlyPI + monthlyMIP;
        const totalPaid = totalMonthly * numPayments;
        const totalInterest = totalPaid - baseLoan;
        const ltv = ((baseLoan / homePrice) * 100);

        return {
          primary: {
            label: "Monthly Payment (with MIP)",
            value: `$${formatNumber(totalMonthly)}`,
          },
          details: [
            { label: "Principal & interest", value: `$${formatNumber(monthlyPI)}` },
            { label: "Monthly MIP", value: `$${formatNumber(monthlyMIP)}` },
            { label: "Base loan amount", value: `$${formatNumber(baseLoan)}` },
            { label: "Upfront MIP (financed)", value: `$${formatNumber(upfrontMIP)}` },
            { label: "Total loan (with upfront MIP)", value: `$${formatNumber(totalLoan)}` },
            { label: "Down payment", value: `$${formatNumber(downPayment)}` },
            { label: "Loan-to-value (LTV)", value: `${formatNumber(ltv, 1)}%` },
            { label: "Total cost over loan life", value: `$${formatNumber(totalPaid)}` },
          ],
          note: "FHA MIP is required for the life of the loan when down payment is less than 10%. Annual MIP rate of 0.55% is used for most 30-year FHA loans.",
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "home-affordability-calculator", "va-loan-calculator"],
  faq: [
    {
      question: "What is FHA mortgage insurance (MIP)?",
      answer:
        "FHA loans require two types of mortgage insurance: an upfront MIP of 1.75% of the loan amount (usually financed into the loan) and an annual MIP of 0.55% paid monthly. Unlike conventional PMI, FHA MIP typically lasts the life of the loan if your down payment is under 10%.",
    },
    {
      question: "What is the minimum down payment for an FHA loan?",
      answer:
        "The minimum FHA down payment is 3.5% of the purchase price if your credit score is 580 or higher. Borrowers with credit scores between 500-579 need a minimum 10% down payment.",
    },
    {
      question: "Can I remove FHA mortgage insurance?",
      answer:
        "If you put less than 10% down, FHA MIP lasts the entire loan term. With 10% or more down, MIP drops off after 11 years. Many borrowers refinance to a conventional loan once they reach 20% equity to eliminate mortgage insurance entirely.",
    },
  ],
  formula:
    "Monthly Payment = P&I + Monthly MIP. P&I = L[r(1+r)^n]/[(1+r)^n-1] where L = base loan + 1.75% upfront MIP. Monthly MIP = (Base Loan × 0.55%) / 12.",
};
