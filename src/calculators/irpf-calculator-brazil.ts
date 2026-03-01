import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const irpfCalculatorBrazilCalculator: CalculatorDefinition = {
  slug: "irpf-calculator-brazil",
  title: "IRPF Calculator Brazil",
  description: "Calculate Brazilian federal income tax (IRPF) based on monthly or annual gross income and applicable deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["irpf calculator", "imposto de renda", "brazilian income tax calculator"],
  variants: [{
    id: "standard",
    name: "IRPF Brazil",
    description: "Calculate Brazilian federal income tax (IRPF) based on monthly or annual gross income and applicable deductions",
    fields: [
      { name: "monthlyIncome", label: "Monthly Gross Income", type: "number", prefix: "R$", min: 1000, max: 500000, step: 500, defaultValue: 8000 },
      { name: "dependents", label: "Number of Dependents", type: "number", min: 0, max: 10, defaultValue: 1 },
      { name: "inssDeduction", label: "INSS Deduction", type: "number", prefix: "R$", min: 0, max: 10000, step: 50, defaultValue: 900 },
    ],
    calculate: (inputs) => {
      const income = inputs.monthlyIncome as number;
      const dependents = inputs.dependents as number;
      const inss = inputs.inssDeduction as number;
      if (!income || income <= 0) return null;
      const dependentDeduction = (dependents || 0) * 189.59;
      const taxableIncome = income - (inss || 0) - dependentDeduction;
      let tax = 0;
      let effectiveRate = 0;
      if (taxableIncome <= 2112) { tax = 0; }
      else if (taxableIncome <= 2826.65) { tax = taxableIncome * 0.075 - 158.40; }
      else if (taxableIncome <= 3751.05) { tax = taxableIncome * 0.15 - 370.40; }
      else if (taxableIncome <= 4664.68) { tax = taxableIncome * 0.225 - 651.73; }
      else { tax = taxableIncome * 0.275 - 884.96; }
      tax = Math.max(0, tax);
      effectiveRate = income > 0 ? (tax / income) * 100 : 0;
      const annualTax = tax * 12;
      return {
        primary: { label: "Monthly IRPF", value: "R$ " + formatNumber(Math.round(tax * 100) / 100) },
        details: [
          { label: "Annual IRPF", value: "R$ " + formatNumber(Math.round(annualTax)) },
          { label: "Taxable Income", value: "R$ " + formatNumber(Math.round(taxableIncome * 100) / 100) },
          { label: "Effective Tax Rate", value: formatNumber(Math.round(effectiveRate * 100) / 100) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["inss-contribution-calculator-brazil", "clt-vs-pj-calculator-brazil"],
  faq: [
    { question: "Who is required to file IRPF in Brazil?", answer: "Brazilian residents who earn above the annual exemption threshold, have taxable assets above R$ 300,000, or receive income from certain sources are required to file an annual IRPF declaration." },
    { question: "What deductions are available for IRPF?", answer: "Common IRPF deductions include INSS contributions, dependents (R$ 189.59 per month each), education expenses, medical expenses (unlimited), and private pension contributions up to 12 percent of gross income." },
  ],
  formula: "Taxable Income = Gross Income - INSS - Dependent Deductions; Tax = Progressive rate brackets (7.5% to 27.5%)",
};
