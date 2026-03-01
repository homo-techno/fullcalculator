import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mortgageQualificationDtiCalculator: CalculatorDefinition = {
  slug: "mortgage-qualification-dti-calculator",
  title: "Mortgage DTI Calculator",
  description: "Calculate your debt-to-income ratio for mortgage qualification.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["dti calculator", "debt to income ratio", "mortgage qualification"],
  variants: [{
    id: "standard",
    name: "Mortgage DTI",
    description: "Calculate your debt-to-income ratio for mortgage qualification",
    fields: [
      { name: "grossIncome", label: "Monthly Gross Income", type: "number", prefix: "$", min: 500, max: 200000, defaultValue: 8000 },
      { name: "debts", label: "Monthly Debt Payments", type: "number", prefix: "$", min: 0, max: 100000, defaultValue: 500 },
      { name: "proposedPayment", label: "Proposed Mortgage Payment", type: "number", prefix: "$", min: 0, max: 50000, defaultValue: 2000 },
    ],
    calculate: (inputs) => {
      const income = inputs.grossIncome as number;
      const debts = inputs.debts as number;
      const proposed = inputs.proposedPayment as number;
      if (!income || income <= 0) return null;
      const frontEnd = (proposed / income) * 100;
      const backEnd = ((debts + proposed) / income) * 100;
      const status = backEnd <= 36 ? "Excellent" : backEnd <= 43 ? "Acceptable" : backEnd <= 50 ? "Marginal" : "Too High";
      return {
        primary: { label: "Back-End DTI", value: backEnd.toFixed(1) + "%" },
        details: [
          { label: "Front-End DTI (Housing)", value: frontEnd.toFixed(1) + "%" },
          { label: "Total Monthly Obligations", value: "$" + formatNumber(debts + proposed) },
          { label: "Qualification Status", value: status },
          { label: "Max Payment at 43% DTI", value: "$" + formatNumber(income * 0.43 - debts) },
        ],
      };
    },
  }],
  relatedSlugs: ["mortgage-payoff-calculator", "home-value-estimator"],
  faq: [
    { question: "What is a good DTI ratio for a mortgage?", answer: "Most lenders prefer a back-end DTI of 43% or lower, though some programs allow up to 50%." },
    { question: "What is front-end vs back-end DTI?", answer: "Front-end DTI includes only housing costs while back-end DTI includes all monthly debt obligations." },
  ],
  formula: "DTI = (Monthly Debts + Housing Payment) / Gross Monthly Income x 100",
};
