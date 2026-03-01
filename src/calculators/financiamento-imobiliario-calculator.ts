import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const financiamentoImobiliarioCalculator: CalculatorDefinition = {
  slug: "financiamento-imobiliario-calculator",
  title: "Financiamento Imobiliario Calculator",
  description: "Calculate monthly payments and total cost of a Brazilian housing finance loan using SAC or PRICE amortization.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["financiamento imobiliario", "housing loan brazil", "mortgage calculator brazil"],
  variants: [{
    id: "standard",
    name: "Financiamento Imobiliario",
    description: "Calculate monthly payments and total cost of a Brazilian housing finance loan using SAC or PRICE amortization",
    fields: [
      { name: "propertyValue", label: "Property Value", type: "number", prefix: "R$", min: 50000, max: 10000000, step: 10000, defaultValue: 400000 },
      { name: "downPayment", label: "Down Payment Percentage", type: "number", suffix: "%", min: 10, max: 80, step: 5, defaultValue: 20 },
      { name: "term", label: "Loan Term", type: "number", suffix: "years", min: 5, max: 35, defaultValue: 30 },
      { name: "annualRate", label: "Annual Interest Rate", type: "number", suffix: "%", min: 4, max: 20, step: 0.1, defaultValue: 9.5 },
    ],
    calculate: (inputs) => {
      const property = inputs.propertyValue as number;
      const downPct = inputs.downPayment as number;
      const termYears = inputs.term as number;
      const rate = inputs.annualRate as number;
      if (!property || !termYears || !rate || property <= 0) return null;
      const downAmount = property * (downPct / 100);
      const loanAmount = property - downAmount;
      const monthlyRate = rate / 100 / 12;
      const totalMonths = termYears * 12;
      const pricePayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
      const totalPaid = pricePayment * totalMonths + downAmount;
      const totalInterest = totalPaid - property;
      return {
        primary: { label: "Monthly Payment (PRICE)", value: "R$ " + formatNumber(Math.round(pricePayment * 100) / 100) },
        details: [
          { label: "Loan Amount", value: "R$ " + formatNumber(Math.round(loanAmount)) },
          { label: "Total Interest Paid", value: "R$ " + formatNumber(Math.round(totalInterest)) },
          { label: "Total Cost of Property", value: "R$ " + formatNumber(Math.round(totalPaid)) },
        ],
      };
    },
  }],
  relatedSlugs: ["iptu-calculator-brazil", "fgts-calculator-brazil"],
  faq: [
    { question: "What is the difference between SAC and PRICE amortization?", answer: "In SAC (Sistema de Amortizacao Constante), monthly payments decrease over time because the principal portion is constant while interest decreases. In PRICE (Tabela Price), payments remain fixed throughout the loan term." },
    { question: "What is the maximum loan term for housing finance in Brazil?", answer: "Brazilian banks typically offer housing finance terms up to 35 years. The maximum financed amount is usually 80 percent of the property value, requiring a minimum 20 percent down payment." },
  ],
  formula: "Monthly Payment (PRICE) = Loan x (Rate x (1 + Rate) ^ Months) / ((1 + Rate) ^ Months - 1)",
};
