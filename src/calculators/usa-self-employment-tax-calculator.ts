import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const usaSelfEmploymentTaxCalculator: CalculatorDefinition = {
  slug: "usa-self-employment-tax-calculator",
  title: "USA Self-Employment Tax Calculator",
  description: "Free self-employment tax calculator for 1099 workers. Calculate SE tax, income tax, and quarterly estimated payments.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["self employment tax calculator", "1099 tax calculator", "freelancer tax calculator usa", "se tax calculator"],
  variants: [{
    id: "standard",
    name: "USA Self-Employment Tax",
    description: "Free self-employment tax calculator for 1099 workers",
    fields: [
      { name: "income", label: "Net Self-Employment Income", type: "number", prefix: "$", min: 0 },
      { name: "status", label: "Filing Status", type: "select", options: [{ label: "Single", value: "single" }, { label: "Married Filing Jointly", value: "married" }], defaultValue: "single" },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      const status = inputs.status as string;
      if (!income || income <= 0) return null;
      const seBase = income * 0.9235;
      const ssTax = Math.min(seBase, 176100) * 0.124;
      const medicareTax = seBase * 0.029;
      const addMedicare = Math.max(0, seBase - (status === "married" ? 250000 : 200000)) * 0.009;
      const seTax = ssTax + medicareTax + addMedicare;
      const seDeduction = seTax / 2;
      const sd = status === "married" ? 30000 : 15000;
      const taxableIncome = Math.max(0, income - seDeduction - sd);
      const brackets = status === "married" ?
        [{l:23850,r:0.10},{l:96950,r:0.12},{l:206700,r:0.22},{l:394600,r:0.24},{l:501050,r:0.32},{l:751600,r:0.35},{l:Infinity,r:0.37}] :
        [{l:11925,r:0.10},{l:48475,r:0.12},{l:103350,r:0.22},{l:197300,r:0.24},{l:250525,r:0.32},{l:626350,r:0.35},{l:Infinity,r:0.37}];
      let incomeTax = 0, rem = taxableIncome, prev = 0;
      for (const b of brackets) { const t = Math.min(rem, b.l - prev); if (t <= 0) break; incomeTax += t * b.r; rem -= t; prev = b.l; }
      const totalTax = seTax + incomeTax;
      const quarterly = totalTax / 4;
      return {
        primary: { label: "Total Tax", value: "$" + formatNumber(totalTax) },
        details: [
          { label: "Self-employment tax", value: "$" + formatNumber(seTax) },
          { label: "Federal income tax", value: "$" + formatNumber(incomeTax) },
          { label: "SE tax deduction (50%)", value: "$" + formatNumber(seDeduction) },
          { label: "Quarterly estimated payment", value: "$" + formatNumber(quarterly) },
          { label: "Effective total rate", value: formatNumber((totalTax / income) * 100) + "%" },
        ],
        note: "SE tax: 15.3% (12.4% SS + 2.9% Medicare) on 92.35% of net income. Half deductible.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is self-employment tax calculated?", answer: "SE tax is 15.3% (12.4% SS + 2.9% Medicare) on 92.35% of net self-employment income. SS applies up to $176,100 (2025). Half of SE tax is deductible from income." },
    { question: "When are quarterly estimated tax payments due?", answer: "Due dates: April 15, June 15, September 15, and January 15 of the next year. Pay if you expect to owe $1,000+ in tax." },
  ],
  formula: "SE Tax = 15.3% × (Net Income × 92.35%). Income Tax = Progressive brackets on (income - SE deduction - standard deduction).",
};
