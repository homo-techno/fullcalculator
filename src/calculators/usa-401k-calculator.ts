import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const usa401kCalculator: CalculatorDefinition = {
  slug: "usa-401k-calculator",
  title: "USA 401(k) Calculator",
  description: "Free 401(k) calculator. Project your retirement savings with employer match, contribution limits, and compound growth.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["401k calculator", "401k retirement calculator", "401k growth calculator"],
  variants: [{
    id: "standard",
    name: "USA 401(k)",
    description: "Free 401(k) calculator",
    fields: [
      { name: "salary", label: "Annual Salary", type: "number", prefix: "$", min: 0 },
      { name: "contribution", label: "Your Contribution", type: "number", suffix: "%", defaultValue: 10, min: 0, max: 100 },
      { name: "match", label: "Employer Match", type: "number", suffix: "%", defaultValue: 50, min: 0, max: 100 },
      { name: "matchLimit", label: "Match up to (% of salary)", type: "number", suffix: "%", defaultValue: 6, min: 0, max: 100 },
      { name: "years", label: "Years to Retirement", type: "number", min: 1, max: 50 },
      { name: "returnRate", label: "Expected Annual Return", type: "number", suffix: "%", defaultValue: 7, min: 0, max: 20 },
    ],
    calculate: (inputs) => {
      const salary = inputs.salary as number;
      const contribPct = (inputs.contribution as number) / 100;
      const matchPct = (inputs.match as number) / 100;
      const matchLimit = (inputs.matchLimit as number) / 100;
      const years = inputs.years as number;
      const ret = (inputs.returnRate as number) / 100;
      if (!salary || !years) return null;
      const annualContrib = Math.min(salary * contribPct, 23500);
      const matchable = Math.min(salary * contribPct, salary * matchLimit);
      const annualMatch = matchable * matchPct;
      const totalAnnual = annualContrib + annualMatch;
      const r = ret / 12;
      const n = years * 12;
      const monthlyContrib = totalAnnual / 12;
      const fv = monthlyContrib * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      return {
        primary: { label: "Projected 401(k) Balance", value: "$" + formatNumber(fv) },
        details: [
          { label: "Your annual contribution", value: "$" + formatNumber(annualContrib) },
          { label: "Employer annual match", value: "$" + formatNumber(annualMatch) },
          { label: "Total invested over " + years + " years", value: "$" + formatNumber(totalAnnual * years) },
          { label: "Investment growth", value: "$" + formatNumber(fv - totalAnnual * years) },
        ],
        note: "2025 contribution limit: $23,500 (under 50), $31,000 (50+), $34,750 (60-63).",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is the 401(k) contribution limit for 2025?", answer: "The 2025 401(k) employee contribution limit is $23,500. Catch-up for age 50+: $7,500 extra. New super catch-up for ages 60-63: $11,250 extra. Total employer+employee limit: $70,000." },
    { question: "How does employer 401(k) match work?", answer: "Common matches are 50% or 100% of your contribution up to a percentage of salary (often 3-6%). For example, 50% match up to 6% means if you contribute 6% ($6K on $100K), employer adds $3K." },
  ],
  formula: "FV = Monthly contributions × [(1+r)^n - 1] / r × (1+r)",
};
