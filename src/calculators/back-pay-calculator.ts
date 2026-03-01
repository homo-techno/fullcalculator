import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const backPayCalculator: CalculatorDefinition = {
  slug: "back-pay-calculator",
  title: "Back Pay Calculator",
  description: "Calculate back pay owed for wrongful termination or unpaid wages.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["back pay calculator", "unpaid wages", "wrongful termination pay"],
  variants: [{
    id: "standard",
    name: "Back Pay",
    description: "Calculate back pay owed for wrongful termination or unpaid wages",
    fields: [
      { name: "hourlyRate", label: "Hourly Rate", type: "number", prefix: "$", min: 1, max: 1000, defaultValue: 30 },
      { name: "hoursPerWeek", label: "Hours Per Week", type: "number", min: 1, max: 80, defaultValue: 40 },
      { name: "weeksOwed", label: "Weeks of Back Pay Owed", type: "number", min: 1, max: 260, defaultValue: 12 },
      { name: "benefits", label: "Weekly Benefits Value", type: "number", prefix: "$", min: 0, max: 5000, defaultValue: 200 },
    ],
    calculate: (inputs) => {
      const rate = inputs.hourlyRate as number;
      const hours = inputs.hoursPerWeek as number;
      const weeks = inputs.weeksOwed as number;
      const benefits = inputs.benefits as number;
      if (!rate || rate <= 0 || !hours || !weeks) return null;
      const weeklyPay = rate * hours;
      const totalWages = weeklyPay * weeks;
      const totalBenefits = benefits * weeks;
      const totalOwed = totalWages + totalBenefits;
      const withInterest = totalOwed * 1.03;
      return {
        primary: { label: "Total Back Pay Owed", value: "$" + formatNumber(Math.round(totalOwed)) },
        details: [
          { label: "Weekly Pay", value: "$" + formatNumber(weeklyPay) },
          { label: "Total Wages", value: "$" + formatNumber(totalWages) },
          { label: "Total Benefits Value", value: "$" + formatNumber(totalBenefits) },
          { label: "With Interest (3%)", value: "$" + formatNumber(Math.round(withInterest)) },
        ],
      };
    },
  }],
  relatedSlugs: ["wage-theft-recovery-calculator", "time-and-a-half-calculator"],
  faq: [
    { question: "What is back pay?", answer: "Back pay is compensation owed to an employee for work already performed or wages lost due to wrongful termination or pay violations." },
    { question: "Is back pay taxable?", answer: "Yes, back pay is subject to federal and state income taxes as well as Social Security and Medicare taxes." },
  ],
  formula: "Total Back Pay = (Hourly Rate x Hours/Week x Weeks) + (Weekly Benefits x Weeks)",
};
