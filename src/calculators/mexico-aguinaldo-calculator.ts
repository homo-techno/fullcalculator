import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mexicoAguinaldoCalculator: CalculatorDefinition = {
  slug: "mexico-aguinaldo-calculator",
  title: "Mexico Aguinaldo Calculator",
  description: "Free aguinaldo (Christmas bonus) calculator for Mexico. Calculate your legal minimum Christmas bonus and tax-exempt portion.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["aguinaldo calculator", "mexico christmas bonus calculator", "aguinaldo mexico 2025"],
  variants: [{
    id: "standard",
    name: "Mexico Aguinaldo",
    description: "Free aguinaldo (Christmas bonus) calculator for Mexico",
    fields: [
      { name: "dailySalary", label: "Daily Salary", type: "number", prefix: "MX$", min: 0 },
      { name: "daysWorked", label: "Days Worked This Year", type: "number", defaultValue: 365, min: 1, max: 365 },
    ],
    calculate: (inputs) => {
      const daily = inputs.dailySalary as number;
      const days = inputs.daysWorked as number;
      if (!daily || !days) return null;
      const fullAguinaldo = daily * 15;
      const proportional = fullAguinaldo * days / 365;
      const umaDaily = 113.14;
      const exempt = umaDaily * 30;
      const taxable = Math.max(0, proportional - exempt);
      return {
        primary: { label: "Aguinaldo", value: "MX$" + formatNumber(proportional) },
        details: [
          { label: "Full year (15 days)", value: "MX$" + formatNumber(fullAguinaldo) },
          { label: "Days worked", value: String(days) + " / 365" },
          { label: "Tax-exempt (30 UMA days)", value: "MX$" + formatNumber(exempt) },
          { label: "Taxable portion", value: "MX$" + formatNumber(taxable) },
        ],
        note: "Legal minimum: 15 days of salary. Tax-exempt up to 30 days of UMA (MX$113.14/day × 30). Due by Dec 20.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is aguinaldo calculated in Mexico?", answer: "Aguinaldo = daily salary × 15 days (minimum by law). If you worked less than a full year, it is prorated: (daily salary × 15) × days worked / 365." },
    { question: "Is aguinaldo taxable in Mexico?", answer: "Aguinaldo is tax-exempt up to 30 days of UMA (approximately MX$3,394 in 2025). Any excess is subject to ISR." },
  ],
  formula: "Aguinaldo = Daily Salary × 15 × Days Worked / 365",
};
