import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const businessLoanPaymentCalculator: CalculatorDefinition = {
  slug: "business-loan-payment-calculator",
  title: "Business Loan Payment Calculator",
  description: "Calculate monthly payment for a business loan.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["business loan payment","loan payment calculator"],
  variants: [{
    id: "standard",
    name: "Business Loan Payment",
    description: "Calculate monthly payment for a business loan.",
    fields: [
      { name: "loanAmount", label: "Loan Amount ($)", type: "number", min: 1, max: 100000000, defaultValue: 50000 },
      { name: "annualRate", label: "Annual Interest Rate (%)", type: "number", min: 0.1, max: 50, defaultValue: 7 },
      { name: "termMonths", label: "Term (months)", type: "number", min: 1, max: 600, defaultValue: 60 },
    ],
    calculate: (inputs) => {
      const p = inputs.loanAmount as number;
      const r = inputs.annualRate as number;
      const n = inputs.termMonths as number;
      if (!p || !r || !n) return null;
      const mr = r / 100 / 12;
      const payment = p * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
      const totalPaid = payment * n;
      const totalInterest = totalPaid - p;
      return {
        primary: { label: "Monthly Payment", value: "$" + formatNumber(Math.round(payment * 100) / 100) },
        details: [
          { label: "Total Paid", value: "$" + formatNumber(Math.round(totalPaid)) },
          { label: "Total Interest", value: "$" + formatNumber(Math.round(totalInterest)) },
          { label: "Interest to Principal Ratio", value: (totalInterest / p * 100).toFixed(1) + "%" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is a typical business loan rate?", answer: "Rates range from 5% to 30% depending on credit and loan type." },
    { question: "How does term length affect payments?", answer: "Longer terms lower monthly payments but increase total interest." },
  ],
  formula: "Payment = P x r(1+r)^n / ((1+r)^n - 1)",
};
