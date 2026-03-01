import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const n503020Calculator: CalculatorDefinition = {
  slug: "50-30-20-calculator",
  title: "50/30/20 Budget Calculator",
  description: "Split your income into needs, wants, and savings using the 50/30/20 rule.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["50 30 20 rule", "budget calculator", "50 30 20 budget"],
  variants: [{
    id: "standard",
    name: "50/30/20 Budget",
    description: "Split your income into needs, wants, and savings using the 50/30/20 rule",
    fields: [
      { name: "monthlyIncome", label: "Monthly After-Tax Income", type: "number", prefix: "$", min: 100, max: 500000, defaultValue: 5000 },
    ],
    calculate: (inputs) => {
      const income = inputs.monthlyIncome as number;
      if (!income || income <= 0) return null;
      const needs = income * 0.50;
      const wants = income * 0.30;
      const savings = income * 0.20;
      return {
        primary: { label: "Needs (50%)", value: "$" + formatNumber(needs) },
        details: [
          { label: "Wants (30%)", value: "$" + formatNumber(wants) },
          { label: "Savings (20%)", value: "$" + formatNumber(savings) },
          { label: "Annual Savings", value: "$" + formatNumber(savings * 12) },
        ],
      };
    },
  }],
  relatedSlugs: ["monthly-budget-calculator", "mortgage-qualification-dti-calculator"],
  faq: [
    { question: "What is the 50/30/20 rule?", answer: "The 50/30/20 rule allocates 50% of after-tax income to needs, 30% to wants, and 20% to savings and debt repayment." },
    { question: "What counts as needs vs wants?", answer: "Needs include housing, food, utilities, and insurance. Wants include dining out, entertainment, and subscriptions." },
  ],
  formula: "Needs = Income x 0.50; Wants = Income x 0.30; Savings = Income x 0.20",
};
