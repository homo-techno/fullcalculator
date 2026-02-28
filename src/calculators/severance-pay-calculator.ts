import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const severancePayCalculator: CalculatorDefinition = {
  slug: "severance-pay-calculator",
  title: "Severance Pay Estimator",
  description: "Free severance pay calculator. Estimate your severance package based on tenure, salary, and common company policies.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["severance pay calculator", "severance package calculator", "termination pay estimator"],
  variants: [{
    id: "standard",
    name: "Severance Pay",
    description: "Free severance pay calculator",
    fields: [
      { name: "salary", label: "Annual Salary", type: "number", prefix: "$", min: 0 },
      { name: "years", label: "Years of Service", type: "number", min: 0, max: 50 },
      { name: "policy", label: "Severance Policy", type: "select", options: [{ label: "1 week per year (common)", value: "1" }, { label: "2 weeks per year (generous)", value: "2" }, { label: "1 month per year (executive)", value: "4.33" }], defaultValue: "1" },
      { name: "ptoBalance", label: "Unused PTO Days", type: "number", min: 0, defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const salary = inputs.salary as number;
      const years = inputs.years as number;
      const weeksPerYear = parseFloat(inputs.policy as string);
      const pto = (inputs.ptoBalance as number) || 0;
      if (!salary || !years) return null;
      const weeklySalary = salary / 52;
      const severanceWeeks = years * weeksPerYear;
      const severancePay = weeklySalary * severanceWeeks;
      const dailySalary = salary / 260;
      const ptoPayout = dailySalary * pto;
      const total = severancePay + ptoPayout;
      return {
        primary: { label: "Total Severance", value: "$" + formatNumber(total) },
        details: [
          { label: "Severance pay (" + formatNumber(severanceWeeks) + " weeks)", value: "$" + formatNumber(severancePay) },
          { label: "PTO payout (" + pto + " days)", value: "$" + formatNumber(ptoPayout) },
          { label: "Weekly salary", value: "$" + formatNumber(weeklySalary) },
          { label: "Months of coverage", value: formatNumber(severanceWeeks / 4.33) },
        ],
        note: "Severance is not legally required in most US states. Packages are negotiable. Consider COBRA health insurance continuation costs.",
      };
    },
  }],
  relatedSlugs: ["hourly-to-salary-calculator", "bonus-tax-calculator"],
  faq: [
    { question: "How is severance pay calculated?", answer: "Common formula: 1-2 weeks of pay per year of service. Executive packages may offer 1 month per year. Plus unused PTO payout." },
    { question: "Is severance pay taxable?", answer: "Yes, severance is taxed as regular income. It may push you into a higher tax bracket. Some employers offer lump sum vs. salary continuation." },
  ],
  formula: "Severance = (Annual Salary / 52) × Years × Weeks per Year + PTO Payout",
};
