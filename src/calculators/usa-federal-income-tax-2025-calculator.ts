import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const usaFederalIncomeTax2025Calculator: CalculatorDefinition = {
  slug: "usa-federal-income-tax-2025-calculator",
  title: "USA Federal Income Tax 2025 Calculator",
  description: "Free US federal income tax calculator for 2025. Calculate tax with updated brackets, standard deduction, and all filing statuses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["us federal income tax calculator 2025", "usa tax calculator", "federal tax calculator 2025", "irs tax calculator"],
  variants: [{
    id: "standard",
    name: "USA Federal Income Tax 2025",
    description: "Free US federal income tax calculator for 2025",
    fields: [
      { name: "income", label: "Annual Gross Income", type: "number", prefix: "$", min: 0 },
      { name: "status", label: "Filing Status", type: "select", options: [{ label: "Single", value: "single" }, { label: "Married Filing Jointly", value: "married" }, { label: "Head of Household", value: "hoh" }], defaultValue: "single" },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      const status = inputs.status as string;
      if (!income || income <= 0) return null;
      const sd = status === "married" ? 30000 : status === "hoh" ? 22500 : 15000;
      const taxable = Math.max(0, income - sd);
      const brackets: Record<string, {l:number;r:number}[]> = {
        single: [{l:11925,r:0.10},{l:48475,r:0.12},{l:103350,r:0.22},{l:197300,r:0.24},{l:250525,r:0.32},{l:626350,r:0.35},{l:Infinity,r:0.37}],
        married: [{l:23850,r:0.10},{l:96950,r:0.12},{l:206700,r:0.22},{l:394600,r:0.24},{l:501050,r:0.32},{l:751600,r:0.35},{l:Infinity,r:0.37}],
        hoh: [{l:17000,r:0.10},{l:64850,r:0.12},{l:103350,r:0.22},{l:197300,r:0.24},{l:250500,r:0.32},{l:626350,r:0.35},{l:Infinity,r:0.37}],
      };
      const b = brackets[status] || brackets.single;
      let tax = 0, rem = taxable, prev = 0, marginal = 0;
      for (const s of b) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Federal Tax", value: "$" + formatNumber(tax) },
        details: [
          { label: "Standard deduction", value: "$" + formatNumber(sd) },
          { label: "Taxable income", value: "$" + formatNumber(taxable) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal bracket", value: (marginal * 100) + "%" },
          { label: "After-tax income", value: "$" + formatNumber(income - tax) },
        ],
        note: "2025 tax year brackets. Does not include state taxes, FICA, or credits.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What are the 2025 federal tax brackets?", answer: "For single filers: 10% up to $11,925, 12% to $48,475, 22% to $103,350, 24% to $197,300, 32% to $250,525, 35% to $626,350, 37% above. Standard deduction: $15,000." },
    { question: "What is the standard deduction for 2025?", answer: "Standard deduction for 2025: $15,000 (Single), $30,000 (Married Filing Jointly), $22,500 (Head of Household)." },
  ],
  formula: "Tax = Sum of (income in each bracket × rate). Standard deduction subtracted first.",
};
