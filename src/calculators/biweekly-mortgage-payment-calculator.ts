import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const biweeklyMortgagePaymentCalculator: CalculatorDefinition = {
  slug: "biweekly-mortgage-payment-calculator",
  title: "Biweekly Mortgage Payment Calculator",
  description: "Compare biweekly versus monthly mortgage payments and see interest savings.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["biweekly mortgage", "biweekly payment savings", "mortgage biweekly calculator"],
  variants: [{
    id: "standard",
    name: "Biweekly Mortgage Payment",
    description: "Compare biweekly versus monthly mortgage payments and see interest savings",
    fields: [
      { name: "loanAmount", label: "Loan Amount", type: "number", prefix: "$", min: 10000, max: 2000000, defaultValue: 300000 },
      { name: "rate", label: "Interest Rate", type: "number", suffix: "%", min: 0.1, max: 15, step: 0.01, defaultValue: 6.0 },
      { name: "term", label: "Loan Term", type: "number", suffix: "years", min: 5, max: 30, defaultValue: 30 },
    ],
    calculate: (inputs) => {
      const P = inputs.loanAmount as number;
      const r = (inputs.rate as number) / 100 / 12;
      const years = inputs.term as number;
      if (!P || P <= 0 || !r || !years) return null;
      const n = years * 12;
      const monthlyPmt = P * r / (1 - Math.pow(1 + r, -n));
      const biweeklyPmt = monthlyPmt / 2;
      const annualMonthly = monthlyPmt * 12;
      const annualBiweekly = biweeklyPmt * 26;
      const extraPerYear = annualBiweekly - annualMonthly;
      const totalMonthly = monthlyPmt * n;
      let bal = P;
      let biMonths = 0;
      const biR = (inputs.rate as number) / 100 / 26;
      let totalBi = 0;
      while (bal > 0 && biMonths < 1000) {
        const interest = bal * biR;
        const principal = biweeklyPmt - interest;
        bal -= principal;
        totalBi += biweeklyPmt;
        biMonths++;
      }
      const yearsSaved = years - (biMonths / 26);
      const interestSaved = totalMonthly - totalBi;
      return {
        primary: { label: "Biweekly Payment", value: "$" + formatNumber(biweeklyPmt) },
        details: [
          { label: "Monthly Payment", value: "$" + formatNumber(monthlyPmt) },
          { label: "Extra Paid Per Year", value: "$" + formatNumber(extraPerYear) },
          { label: "Years Saved", value: formatNumber(yearsSaved) },
          { label: "Interest Saved", value: "$" + formatNumber(Math.max(0, interestSaved)) },
        ],
      };
    },
  }],
  relatedSlugs: ["mortgage-extra-payments-calculator", "mortgage-payoff-calculator"],
  faq: [
    { question: "How does biweekly mortgage payment work?", answer: "You pay half your monthly payment every two weeks, resulting in 26 half-payments or 13 full payments per year instead of 12." },
    { question: "How much can biweekly payments save?", answer: "Biweekly payments can shave 4 to 6 years off a 30-year mortgage and save tens of thousands in interest." },
  ],
  formula: "Biweekly Payment = Monthly Payment / 2; 26 payments per year vs 12",
};
