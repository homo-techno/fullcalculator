import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const helocPaymentCalculator: CalculatorDefinition = {
  slug: "heloc-payment-calculator",
  title: "HELOC Payment Calculator",
  description: "Estimate home equity line of credit payments and interest costs",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["HELOC payment","home equity line of credit","HELOC calculator"],
  variants: [{
    id: "standard",
    name: "HELOC Payment",
    description: "Estimate home equity line of credit payments and interest costs",
    fields: [
      { name: "creditLine", label: "HELOC Credit Line ($)", type: "number", defaultValue: 50000, min: 0, step: 5000 },
      { name: "amountDrawn", label: "Amount Drawn ($)", type: "number", defaultValue: 30000, min: 0, step: 1000 },
      { name: "interestRate", label: "Interest Rate (%)", type: "number", defaultValue: 8.5, min: 0, max: 20, step: 0.1 },
      { name: "repaymentYears", label: "Repayment Period (years)", type: "number", defaultValue: 10, min: 1, max: 30, step: 1 },
    ],
    calculate: (inputs: Record<string, string | number>) => {
      const line = inputs.creditLine as number || 50000;
      const drawn = Math.min(inputs.amountDrawn as number || 30000, line);
      const rate = (inputs.interestRate as number || 8.5) / 100 / 12;
      const years = inputs.repaymentYears as number || 10;
      const months = years * 12;
      const interestOnly = drawn * rate;
      const fullPayment = rate > 0 ? drawn * rate / (1 - Math.pow(1 + rate, -months)) : drawn / months;
      const totalInterest = fullPayment * months - drawn;
      const totalCost = drawn + totalInterest;
      const availableCredit = line - drawn;
      return {
        primary: { label: "Monthly Payment (P&I)", value: "$" + formatNumber(Math.round(fullPayment)) },
        details: [
          { label: "Interest-Only Payment", value: "$" + formatNumber(Math.round(interestOnly)) },
          { label: "Total Interest Cost", value: "$" + formatNumber(Math.round(totalInterest)) },
          { label: "Total Repayment", value: "$" + formatNumber(Math.round(totalCost)) },
          { label: "Available Credit", value: "$" + formatNumber(Math.round(availableCredit)) }
        ]
      };
    },
  }],
  relatedSlugs: ["home-equity-calculator"],
  faq: [
    { question: "How does a HELOC work?", answer: "A HELOC is a revolving credit line secured by your home. You only pay interest on the amount drawn." },
    { question: "What is the difference between HELOC and home equity loan?", answer: "A HELOC is revolving credit with variable rates. A home equity loan is a lump sum with fixed rates." },
  ],
  formula: "Payment = Drawn Amount x Rate / (1 - (1 + Rate)^-Months)",
};
