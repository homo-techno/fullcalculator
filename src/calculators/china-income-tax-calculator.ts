import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chinaIncomeTaxCalculator: CalculatorDefinition = {
  slug: "china-income-tax-calculator",
  title: "China Individual Income Tax Calculator",
  description: "Free China IIT calculator. Calculate personal income tax with 7 progressive brackets, standard deduction, and special deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["china income tax calculator", "china iit calculator", "china tax calculator", "chinese income tax"],
  variants: [{
    id: "standard",
    name: "China Individual Income Tax",
    description: "Free China IIT calculator",
    fields: [
      { name: "monthly", label: "Monthly Gross Salary", type: "number", prefix: "¥", min: 0 },
      { name: "insurance", label: "Monthly Social Insurance (employee)", type: "number", prefix: "¥", defaultValue: 0, min: 0 },
      { name: "special", label: "Monthly Special Deductions", type: "number", prefix: "¥", defaultValue: 0, min: 0 },
    ],
    calculate: (inputs) => {
      const monthly = inputs.monthly as number;
      const insurance = (inputs.insurance as number) || 0;
      const special = (inputs.special as number) || 0;
      if (!monthly) return null;
      const annualIncome = monthly * 12;
      const annualDeductions = (5000 + insurance + special) * 12;
      const taxable = Math.max(0, annualIncome - annualDeductions);
      const brackets = [{l:36000,r:0.03,d:0},{l:144000,r:0.10,d:2520},{l:300000,r:0.20,d:16920},{l:420000,r:0.25,d:31920},{l:660000,r:0.30,d:52920},{l:960000,r:0.35,d:85920},{l:Infinity,r:0.45,d:181920}];
      let tax = 0;
      for (const b of brackets) {
        if (taxable <= b.l) { tax = taxable * b.r - b.d; break; }
      }
      tax = Math.max(0, tax);
      const monthlyTax = tax / 12;
      const netMonthly = monthly - insurance - monthlyTax;
      return {
        primary: { label: "Annual Tax", value: "¥" + formatNumber(tax) },
        details: [
          { label: "Monthly tax", value: "¥" + formatNumber(monthlyTax) },
          { label: "Monthly net salary", value: "¥" + formatNumber(netMonthly) },
          { label: "Annual taxable income", value: "¥" + formatNumber(taxable) },
          { label: "Effective rate", value: formatNumber(annualIncome > 0 ? (tax / annualIncome) * 100 : 0) + "%" },
        ],
        note: "Standard deduction: ¥5,000/month (¥60,000/year). Special deductions include children education, housing, elderly care, etc.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What are China IIT brackets?", answer: "China uses 7 brackets: 3% (up to ¥36K), 10% (¥36-144K), 20% (¥144-300K), 25% (¥300-420K), 30% (¥420-660K), 35% (¥660-960K), 45% (above ¥960K). Applied to annual taxable income." },
    { question: "What is the standard deduction in China?", answer: "The standard deduction is ¥5,000 per month (¥60,000 per year). Additional special deductions are available for education, housing, medical expenses, and elderly care." },
  ],
  formula: "Tax = Annual Taxable Income × Rate - Quick Deduction",
};
