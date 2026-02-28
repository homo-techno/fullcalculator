import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const brazilInssCalculator: CalculatorDefinition = {
  slug: "brazil-inss-calculator",
  title: "Brazil INSS Calculator",
  description: "Free INSS (social security) contribution calculator for Brazil. Calculate progressive employee contributions for 2025.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["inss calculator", "brazil social security calculator", "inss 2025 calculator"],
  variants: [{
    id: "standard",
    name: "Brazil INSS",
    description: "Free INSS (social security) contribution calculator for Brazil",
    fields: [
      { name: "salary", label: "Monthly Gross Salary", type: "number", prefix: "R$", min: 0 },
    ],
    calculate: (inputs) => {
      const salary = inputs.salary as number;
      if (!salary || salary <= 0) return null;
      const brackets = [{l:1518,r:0.075},{l:2793.88,r:0.09},{l:4190.83,r:0.12},{l:8157.41,r:0.14}];
      let contrib = 0, rem = Math.min(salary, 8157.41), prev = 0;
      for (const b of brackets) { const t = Math.min(rem, b.l - prev); if (t <= 0) break; contrib += t * b.r; rem -= t; prev = b.l; }
      return {
        primary: { label: "INSS Contribution", value: "R$" + formatNumber(contrib) },
        details: [
          { label: "Gross salary", value: "R$" + formatNumber(salary) },
          { label: "After INSS", value: "R$" + formatNumber(salary - contrib) },
          { label: "Effective rate", value: formatNumber((contrib / salary) * 100) + "%" },
          { label: "INSS ceiling", value: "R$8,157.41" },
        ],
        note: "INSS 2025 progressive rates: 7.5% (up to R$1,518), 9% (R$1,518-2,793.88), 12% (R$2,793.88-4,190.83), 14% (R$4,190.83-8,157.41).",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is INSS calculated in Brazil?", answer: "INSS uses progressive rates: 7.5% up to R$1,518, 9% (R$1,518-2,793.88), 12% (R$2,793.88-4,190.83), 14% (R$4,190.83-8,157.41). Max contribution: ~R$951.63." },
    { question: "What is the INSS ceiling for 2025?", answer: "The INSS salary ceiling for 2025 is R$8,157.41/month, with a maximum monthly contribution of approximately R$951.63." },
  ],
  formula: "INSS = Progressive rates: 7.5% / 9% / 12% / 14% on salary brackets up to R$8,157.41",
};
