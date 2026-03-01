import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cltVsPjCalculatorBrazilCalculator: CalculatorDefinition = {
  slug: "clt-vs-pj-calculator-brazil",
  title: "CLT vs PJ Calculator Brazil",
  description: "Compare net income between CLT employment and PJ (Pessoa Juridica) contractor status in Brazil.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["clt vs pj", "clt or pj calculator", "employee vs contractor brazil"],
  variants: [{
    id: "standard",
    name: "CLT vs PJ Brazil",
    description: "Compare net income between CLT employment and PJ (Pessoa Juridica) contractor status in Brazil",
    fields: [
      { name: "grossMonthly", label: "Monthly Gross Compensation", type: "number", prefix: "R$", min: 2000, max: 500000, step: 500, defaultValue: 15000 },
      { name: "pjTaxRegime", label: "PJ Tax Regime", type: "select", options: [{value:"simples",label:"Simples Nacional"},{value:"presumido",label:"Lucro Presumido"}], defaultValue: "simples" },
      { name: "hasHealthPlan", label: "Employer Health Plan (CLT)", type: "select", options: [{value:"yes",label:"Yes"},{value:"no",label:"No"}], defaultValue: "yes" },
    ],
    calculate: (inputs) => {
      const gross = inputs.grossMonthly as number;
      const regime = inputs.pjTaxRegime as string;
      const health = inputs.hasHealthPlan as string;
      if (!gross || gross <= 0) return null;
      const inss = Math.min(gross * 0.11, 856.46);
      const irpfBase = gross - inss;
      let irpf = 0;
      if (irpfBase > 4664.68) irpf = irpfBase * 0.275 - 884.96;
      else if (irpfBase > 3751.05) irpf = irpfBase * 0.225 - 651.73;
      else if (irpfBase > 2826.65) irpf = irpfBase * 0.15 - 370.40;
      else if (irpfBase > 2112) irpf = irpfBase * 0.075 - 158.40;
      irpf = Math.max(0, irpf);
      const cltNet = gross - inss - irpf;
      const cltAnnual = cltNet * 12 + gross + gross / 3;
      const pjTaxRate = regime === "simples" ? 0.06 : 0.1133;
      const pjTax = gross * pjTaxRate;
      const pjNet = gross - pjTax;
      const pjAnnual = pjNet * 12;
      const healthValue = health === "yes" ? 500 : 0;
      const cltTotalAnnual = cltAnnual + healthValue * 12;
      return {
        primary: { label: "CLT vs PJ Monthly Net", value: "R$ " + formatNumber(Math.round(cltNet)) + " vs R$ " + formatNumber(Math.round(pjNet)) },
        details: [
          { label: "CLT Annual (with 13th and vacation)", value: "R$ " + formatNumber(Math.round(cltTotalAnnual)) },
          { label: "PJ Annual", value: "R$ " + formatNumber(Math.round(pjAnnual)) },
          { label: "PJ Advantage", value: pjAnnual > cltTotalAnnual ? "PJ earns R$ " + formatNumber(Math.round(pjAnnual - cltTotalAnnual)) + " more per year" : "CLT earns R$ " + formatNumber(Math.round(cltTotalAnnual - pjAnnual)) + " more per year" },
        ],
      };
    },
  }],
  relatedSlugs: ["irpf-calculator-brazil", "inss-contribution-calculator-brazil"],
  faq: [
    { question: "What is the difference between CLT and PJ in Brazil?", answer: "CLT (Consolidacao das Leis do Trabalho) is formal employment with benefits like FGTS, 13th salary, paid vacation, and INSS. PJ (Pessoa Juridica) is working as a contractor through a company, with fewer benefits but potentially higher net income." },
    { question: "At what salary level does PJ become more advantageous?", answer: "PJ typically becomes more advantageous at higher salary levels where the CLT tax burden is heavier. However, PJ workers must account for the absence of FGTS, 13th salary, paid vacation, and employer-provided benefits." },
  ],
  formula: "CLT Net = Gross - INSS - IRPF + 13th Salary + Vacation Bonus; PJ Net = Gross - Tax (Simples or Presumido)",
};
