import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const brazil13thSalaryCalculator: CalculatorDefinition = {
  slug: "brazil-13th-salary-calculator",
  title: "Brazil 13th Salary Calculator",
  description: "Free 13th salary (décimo terceiro) calculator for Brazil. Calculate your Christmas bonus based on months worked.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["13th salary calculator brazil", "decimo terceiro calculator", "brazil christmas bonus"],
  variants: [{
    id: "standard",
    name: "Brazil 13th Salary",
    description: "Free 13th salary (décimo terceiro) calculator for Brazil",
    fields: [
      { name: "salary", label: "Monthly Salary", type: "number", prefix: "R$", min: 0 },
      { name: "months", label: "Months Worked This Year", type: "number", min: 1, max: 12, defaultValue: 12 },
    ],
    calculate: (inputs) => {
      const salary = inputs.salary as number;
      const months = inputs.months as number;
      if (!salary || !months) return null;
      const gross13 = salary * months / 12;
      return {
        primary: { label: "13th Salary (Gross)", value: "R$" + formatNumber(gross13) },
        details: [
          { label: "Monthly salary", value: "R$" + formatNumber(salary) },
          { label: "Months worked", value: String(months) + " / 12" },
          { label: "1st installment (by Nov 30)", value: "R$" + formatNumber(gross13 / 2) },
          { label: "2nd installment (by Dec 20)", value: "R$" + formatNumber(gross13 / 2) },
        ],
        note: "INSS and IRPF are deducted from the 2nd installment. FGTS 8% is paid on each installment.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is 13th salary calculated in Brazil?", answer: "13th salary = (monthly salary / 12) × months worked. Paid in 2 installments: 1st by November 30, 2nd by December 20." },
    { question: "Is 13th salary taxable in Brazil?", answer: "Yes, INSS and income tax (IRPF) are deducted from the 2nd installment. FGTS of 8% is also calculated on the 13th salary." },
  ],
  formula: "13th Salary = Monthly Salary × Months Worked / 12",
};
