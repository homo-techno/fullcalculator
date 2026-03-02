import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const employeeBenefitsCostCalculator: CalculatorDefinition = {
  slug: "employee-benefits-cost-calculator",
  title: "Employee Benefits Cost Calculator",
  description: "Calculate the total annual benefits cost per employee.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["benefits","employee","cost","compensation"],
  variants: [{
    id: "standard",
    name: "Employee Benefits Cost",
    description: "Calculate the total annual benefits cost per employee.",
    fields: [
      { name: "healthInsurance", label: "Health Insurance ($/month)", type: "number", min: 0, max: 3000, defaultValue: 600 },
      { name: "retirementMatch", label: "Retirement Match (%)", type: "number", min: 0, max: 10, defaultValue: 4 },
      { name: "annualSalary", label: "Annual Salary ($)", type: "number", min: 20000, max: 500000, defaultValue: 55000 },
      { name: "otherBenefits", label: "Other Annual Benefits ($)", type: "number", min: 0, max: 20000, defaultValue: 2000 },
    ],
    calculate: (inputs) => {
    const healthInsurance = inputs.healthInsurance as number;
    const retirementMatch = inputs.retirementMatch as number;
    const annualSalary = inputs.annualSalary as number;
    const otherBenefits = inputs.otherBenefits as number;
    const annualHealth = healthInsurance * 12;
    const annualRetirement = annualSalary * (retirementMatch / 100);
    const fica = annualSalary * 0.0765;
    const totalBenefits = annualHealth + annualRetirement + fica + otherBenefits;
    const benefitsPct = (totalBenefits / annualSalary) * 100;
    const totalComp = annualSalary + totalBenefits;
    return { primary: { label: "Total Annual Benefits Cost", value: "$" + formatNumber(totalBenefits) }, details: [{ label: "Health Insurance", value: "$" + formatNumber(annualHealth) }, { label: "Retirement Match", value: "$" + formatNumber(annualRetirement) }, { label: "Employer FICA", value: "$" + formatNumber(fica) }, { label: "Benefits as % of Salary", value: formatNumber(benefitsPct) + "%" }, { label: "Total Compensation", value: "$" + formatNumber(totalComp) }] };
  },
  }],
  relatedSlugs: ["employee-onboarding-cost-calculator","workers-comp-rate-calculator","severance-pay-calculator"],
  faq: [
    { question: "What percentage of salary do benefits typically cost?", answer: "Benefits usually add 25% to 40% on top of base salary." },
    { question: "What is the biggest employee benefit cost?", answer: "Health insurance is typically the largest single benefit expense." },
    { question: "What is employer FICA?", answer: "Employers pay 7.65% of wages for Social Security and Medicare taxes." },
  ],
  formula: "TotalBenefits = HealthInsurance*12 + Salary*RetirementMatch% + Salary*0.0765 + Other",
};
