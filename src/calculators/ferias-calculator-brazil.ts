import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const feriasCalculatorBrazilCalculator: CalculatorDefinition = {
  slug: "ferias-calculator-brazil",
  title: "Ferias Calculator Brazil",
  description: "Calculate vacation pay (ferias) for Brazilian CLT employees including the constitutional one-third bonus.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["ferias calculator", "vacation pay brazil", "ferias remuneradas calculator"],
  variants: [{
    id: "standard",
    name: "Ferias Brazil",
    description: "Calculate vacation pay (ferias) for Brazilian CLT employees including the constitutional one-third bonus",
    fields: [
      { name: "monthlySalary", label: "Monthly Gross Salary", type: "number", prefix: "R$", min: 1000, max: 200000, step: 500, defaultValue: 5000 },
      { name: "vacationDays", label: "Vacation Days Taken", type: "number", suffix: "days", min: 10, max: 30, defaultValue: 30 },
      { name: "sellDays", label: "Days Sold (Abono Pecuniario)", type: "number", suffix: "days", min: 0, max: 10, defaultValue: 0 },
      { name: "dependents", label: "Number of Dependents", type: "number", min: 0, max: 10, defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const salary = inputs.monthlySalary as number;
      const vacDays = inputs.vacationDays as number;
      const sellDays = inputs.sellDays as number;
      const dependents = inputs.dependents as number;
      if (!salary || !vacDays || salary <= 0) return null;
      const dailyRate = salary / 30;
      const vacationPay = dailyRate * vacDays;
      const constitutionalBonus = vacationPay / 3;
      const soldDaysPay = dailyRate * (sellDays || 0);
      const soldDaysBonus = soldDaysPay / 3;
      const grossTotal = vacationPay + constitutionalBonus + soldDaysPay + soldDaysBonus;
      const inss = Math.min((vacationPay + constitutionalBonus) * 0.11, 856.46);
      const depDeduction = (dependents || 0) * 189.59;
      const irpfBase = vacationPay + constitutionalBonus - inss - depDeduction;
      let irpf = 0;
      if (irpfBase > 4664.68) irpf = irpfBase * 0.275 - 884.96;
      else if (irpfBase > 3751.05) irpf = irpfBase * 0.225 - 651.73;
      else if (irpfBase > 2826.65) irpf = irpfBase * 0.15 - 370.40;
      else if (irpfBase > 2112) irpf = irpfBase * 0.075 - 158.40;
      irpf = Math.max(0, irpf);
      const netTotal = grossTotal - inss - irpf;
      return {
        primary: { label: "Net Vacation Pay", value: "R$ " + formatNumber(Math.round(netTotal * 100) / 100) },
        details: [
          { label: "Gross Vacation Pay", value: "R$ " + formatNumber(Math.round(vacationPay)) },
          { label: "Constitutional 1/3 Bonus", value: "R$ " + formatNumber(Math.round(constitutionalBonus)) },
          { label: "Total Deductions (INSS + IRPF)", value: "R$ " + formatNumber(Math.round(inss + irpf)) },
        ],
      };
    },
  }],
  relatedSlugs: ["decimo-terceiro-calculator", "rescisao-calculator-brazil"],
  faq: [
    { question: "What is the constitutional one-third vacation bonus?", answer: "Brazilian law guarantees that employees receive an additional one-third of their salary as a bonus on top of regular vacation pay. This constitutional bonus applies to all CLT workers taking their annual vacation." },
    { question: "Can vacation days be sold in Brazil?", answer: "Yes. Brazilian workers can sell up to one-third of their vacation days (10 out of 30 days) through abono pecuniario. The sold days are paid at the daily rate plus the one-third constitutional bonus and are exempt from income tax." },
  ],
  formula: "Vacation Pay = (Salary / 30) x Vacation Days; Total = Vacation Pay + 1/3 Bonus + Sold Days - INSS - IRPF",
};
