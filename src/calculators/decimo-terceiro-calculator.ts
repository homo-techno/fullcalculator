import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const decimoTerceiroCalculator: CalculatorDefinition = {
  slug: "decimo-terceiro-calculator",
  title: "Decimo Terceiro Calculator",
  description: "Calculate the 13th salary (decimo terceiro) payment for Brazilian CLT employees based on months worked and salary.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["decimo terceiro", "13th salary calculator", "thirteenth salary brazil"],
  variants: [{
    id: "standard",
    name: "Decimo Terceiro",
    description: "Calculate the 13th salary (decimo terceiro) payment for Brazilian CLT employees based on months worked and salary",
    fields: [
      { name: "monthlySalary", label: "Monthly Gross Salary", type: "number", prefix: "R$", min: 1000, max: 200000, step: 500, defaultValue: 6000 },
      { name: "monthsWorked", label: "Months Worked This Year", type: "number", suffix: "months", min: 1, max: 12, defaultValue: 12 },
      { name: "dependents", label: "Number of Dependents", type: "number", min: 0, max: 10, defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const salary = inputs.monthlySalary as number;
      const months = inputs.monthsWorked as number;
      const dependents = inputs.dependents as number;
      if (!salary || !months || salary <= 0) return null;
      const gross13th = salary * (months / 12);
      const inss = Math.min(gross13th * 0.11, 856.46);
      const depDeduction = (dependents || 0) * 189.59;
      const irpfBase = gross13th - inss - depDeduction;
      let irpf = 0;
      if (irpfBase > 4664.68) irpf = irpfBase * 0.275 - 884.96;
      else if (irpfBase > 3751.05) irpf = irpfBase * 0.225 - 651.73;
      else if (irpfBase > 2826.65) irpf = irpfBase * 0.15 - 370.40;
      else if (irpfBase > 2112) irpf = irpfBase * 0.075 - 158.40;
      irpf = Math.max(0, irpf);
      const net13th = gross13th - inss - irpf;
      return {
        primary: { label: "Net 13th Salary", value: "R$ " + formatNumber(Math.round(net13th * 100) / 100) },
        details: [
          { label: "Gross 13th Salary", value: "R$ " + formatNumber(Math.round(gross13th * 100) / 100) },
          { label: "INSS Deduction", value: "R$ " + formatNumber(Math.round(inss * 100) / 100) },
          { label: "IRPF Deduction", value: "R$ " + formatNumber(Math.round(irpf * 100) / 100) },
        ],
      };
    },
  }],
  relatedSlugs: ["ferias-calculator-brazil", "rescisao-calculator-brazil"],
  faq: [
    { question: "When is the 13th salary paid in Brazil?", answer: "The 13th salary is paid in two installments. The first installment (50 percent of gross salary) is paid between February and November, and the second installment (remaining balance minus deductions) is paid by December 20." },
    { question: "Is the 13th salary subject to taxes?", answer: "Yes. The 13th salary is subject to INSS and IRPF deductions, which are calculated separately from the regular monthly salary. The deductions are applied on the second installment." },
  ],
  formula: "Gross 13th = Monthly Salary x (Months Worked / 12); Net 13th = Gross - INSS - IRPF",
};
