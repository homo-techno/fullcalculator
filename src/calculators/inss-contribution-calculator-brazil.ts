import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const inssContributionCalculatorBrazilCalculator: CalculatorDefinition = {
  slug: "inss-contribution-calculator-brazil",
  title: "INSS Contribution Calculator Brazil",
  description: "Calculate the monthly INSS social security contribution for Brazilian workers based on salary and contribution type.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["inss calculator", "inss contribution", "previdencia social calculator"],
  variants: [{
    id: "standard",
    name: "INSS Contribution Brazil",
    description: "Calculate the monthly INSS social security contribution for Brazilian workers based on salary and contribution type",
    fields: [
      { name: "grossSalary", label: "Monthly Gross Salary", type: "number", prefix: "R$", min: 1000, max: 200000, step: 500, defaultValue: 6000 },
      { name: "contributorType", label: "Contributor Type", type: "select", options: [{value:"clt",label:"CLT Employee"},{value:"autonomo",label:"Autonomo (Self-Employed)"},{value:"mei",label:"MEI"}], defaultValue: "clt" },
      { name: "dependents", label: "Number of Dependents", type: "number", min: 0, max: 10, defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const salary = inputs.grossSalary as number;
      const type = inputs.contributorType as string;
      const dependents = inputs.dependents as number;
      if (!salary || salary <= 0) return null;
      let contribution = 0;
      const ceiling = 7786.02;
      if (type === "mei") {
        contribution = 1412 * 0.05;
      } else if (type === "autonomo") {
        const base = Math.min(salary, ceiling);
        contribution = base * 0.20;
      } else {
        let remaining = Math.min(salary, ceiling);
        const brackets = [{limit:1412,rate:0.075},{limit:2666.68,rate:0.09},{limit:4000.03,rate:0.12},{limit:ceiling,rate:0.14}];
        let prev = 0;
        for (const b of brackets) {
          if (remaining <= 0) break;
          const taxable = Math.min(remaining, b.limit - prev);
          contribution += taxable * b.rate;
          remaining -= taxable;
          prev = b.limit;
        }
      }
      const annualContribution = contribution * 12;
      const netSalary = salary - contribution;
      return {
        primary: { label: "Monthly INSS Contribution", value: "R$ " + formatNumber(Math.round(contribution * 100) / 100) },
        details: [
          { label: "Annual Contribution", value: "R$ " + formatNumber(Math.round(annualContribution)) },
          { label: "Net Salary After INSS", value: "R$ " + formatNumber(Math.round(netSalary * 100) / 100) },
          { label: "Effective INSS Rate", value: formatNumber(Math.round(contribution / salary * 10000) / 100) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["irpf-calculator-brazil", "clt-vs-pj-calculator-brazil"],
  faq: [
    { question: "What is the INSS contribution ceiling?", answer: "The INSS contribution ceiling is the maximum salary base on which contributions are calculated. For 2024, the ceiling is approximately R$ 7,786.02 per month. Income above this amount is not subject to INSS." },
    { question: "What benefits does INSS provide?", answer: "INSS provides retirement pensions, disability benefits, sick leave pay (after 15 days), maternity leave pay, death pension for dependents, and accident insurance for contributing workers." },
  ],
  formula: "CLT INSS = Progressive rates (7.5% to 14%) on salary up to ceiling; Autonomo = 20% of income up to ceiling",
};
