import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const usaFicaCalculator: CalculatorDefinition = {
  slug: "usa-fica-calculator",
  title: "USA FICA & Social Security Calculator",
  description: "Free FICA calculator. Calculate Social Security (6.2%), Medicare (1.45%), and Additional Medicare Tax for US employees.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["fica calculator", "social security tax calculator", "medicare tax calculator", "payroll tax calculator"],
  variants: [{
    id: "standard",
    name: "USA FICA & Social Security",
    description: "Free FICA calculator",
    fields: [
      { name: "income", label: "Annual Gross Wages", type: "number", prefix: "$", min: 0 },
      { name: "status", label: "Filing Status", type: "select", options: [{ label: "Single", value: "200000" }, { label: "Married Filing Jointly", value: "250000" }], defaultValue: "200000" },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      const threshold = parseFloat(inputs.status as string);
      if (!income || income <= 0) return null;
      const ssWageBase = 176100;
      const ssTax = Math.min(income, ssWageBase) * 0.062;
      const medicare = income * 0.0145;
      const additionalMedicare = Math.max(0, income - threshold) * 0.009;
      const total = ssTax + medicare + additionalMedicare;
      return {
        primary: { label: "Total FICA Tax", value: "$" + formatNumber(total) },
        details: [
          { label: "Social Security (6.2%)", value: "$" + formatNumber(ssTax) },
          { label: "Medicare (1.45%)", value: "$" + formatNumber(medicare) },
          { label: "Additional Medicare (0.9%)", value: "$" + formatNumber(additionalMedicare) },
          { label: "SS wage base (2025)", value: "$176,100" },
          { label: "Effective FICA rate", value: formatNumber((total / income) * 100) + "%" },
        ],
        note: "Employee share only. Employer pays matching 6.2% SS + 1.45% Medicare.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is FICA tax?", answer: "FICA includes Social Security tax (6.2% up to $176,100 in 2025) and Medicare tax (1.45% on all wages). An additional 0.9% Medicare applies above $200K (single) or $250K (married)." },
    { question: "Is there a cap on Social Security tax?", answer: "Yes, Social Security tax only applies to the first $176,100 of wages in 2025. Medicare has no wage cap." },
  ],
  formula: "FICA = SS (6.2% × min(wage, $176,100)) + Medicare (1.45%) + Additional Medicare (0.9% above threshold)",
};
