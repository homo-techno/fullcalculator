import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const alimonyEstimatorCalculator: CalculatorDefinition = {
  slug: "alimony-estimator-calculator",
  title: "Alimony Estimator Calculator",
  description: "Estimate spousal support payments based on income, marriage duration, and state guidelines.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["alimony calculator","spousal support","maintenance calculator","divorce alimony"],
  variants: [{
    id: "standard",
    name: "Alimony Estimator",
    description: "Estimate spousal support payments based on income, marriage duration, and state guidelines.",
    fields: [
      { name: "payorIncome", label: "Payor Annual Gross Income ($)", type: "number", min: 0, max: 2000000, defaultValue: 120000 },
      { name: "recipientIncome", label: "Recipient Annual Gross Income ($)", type: "number", min: 0, max: 2000000, defaultValue: 40000 },
      { name: "marriageYears", label: "Years of Marriage", type: "number", min: 0, max: 60, defaultValue: 12 },
      { name: "method", label: "Calculation Method", type: "select", options: [{ value: "1", label: "One-Third Rule" }, { value: "2", label: "40% Difference" }, { value: "3", label: "AAML Formula" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const payorIncome = inputs.payorIncome as number;
    const recipientIncome = inputs.recipientIncome as number;
    const marriageYears = inputs.marriageYears as number;
    const method = inputs.method as string;
    const methodNames: Record<string, string> = { "1": "One-Third Rule", "2": "40% Difference", "3": "AAML Formula" };
    let annualAlimony = 0;
    if (method === "1") {
      annualAlimony = (payorIncome - recipientIncome) / 3;
    } else if (method === "2") {
      annualAlimony = (payorIncome - recipientIncome) * 0.4;
    } else {
      annualAlimony = (payorIncome * 0.3) - (recipientIncome * 0.2);
    }
    annualAlimony = Math.max(annualAlimony, 0);
    const monthlyAlimony = annualAlimony / 12;
    const durationYears = Math.min(Math.round(marriageYears * 0.4), marriageYears);
    const totalAlimony = annualAlimony * durationYears;
    return {
      primary: { label: "Estimated Monthly Alimony", value: "$" + formatNumber(monthlyAlimony) },
      details: [
        { label: "Calculation Method", value: methodNames[method] || "One-Third Rule" },
        { label: "Annual Alimony", value: "$" + formatNumber(annualAlimony) },
        { label: "Estimated Duration", value: formatNumber(durationYears) + " years" },
        { label: "Total Over Duration", value: "$" + formatNumber(totalAlimony) }
      ]
    };
  },
  }],
  relatedSlugs: ["child-support-guideline-calculator","legal-fee-estimator-calculator","settlement-value-estimator-calculator"],
  faq: [
    { question: "How long does alimony last?", answer: "Alimony duration varies by state and marriage length. A common guideline is 30 to 50 percent of the marriage duration for marriages over 10 years." },
    { question: "What is the difference between alimony and child support?", answer: "Alimony supports the lower-earning spouse, while child support specifically covers the needs of children. They are calculated separately." },
    { question: "Can alimony be modified after divorce?", answer: "Yes, alimony can often be modified if there is a substantial change in circumstances such as job loss or remarriage of the recipient." },
  ],
  formula: "Monthly Alimony = (Payor Income - Recipient Income) x Method Factor / 12",
};
