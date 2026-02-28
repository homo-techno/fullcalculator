import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const germanyMinijobCalculator: CalculatorDefinition = {
  slug: "germany-minijob-calculator",
  title: "Germany Minijob Calculator",
  description: "Free Germany Minijob calculator for 2025. Calculate earnings, hours, and employer costs for Minijob employment.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["germany minijob calculator", "minijob rechner 2025", "minijob 556 euro"],
  variants: [{
    id: "standard",
    name: "Germany Minijob",
    description: "Free Germany Minijob calculator for 2025",
    fields: [
      { name: "hours", label: "Hours per Month", type: "number", min: 1, max: 100 },
      { name: "rate", label: "Hourly Wage", type: "number", prefix: "€", defaultValue: 12.82, min: 12.82, step: 0.01 },
    ],
    calculate: (inputs) => {
      const hours = inputs.hours as number;
      const rate = inputs.rate as number;
      if (!hours || !rate) return null;
      const earnings = hours * rate;
      const isMinijob = earnings <= 556;
      const employerCosts = earnings * 0.28;
      const flatTax = earnings * 0.02;
      return {
        primary: { label: "Monthly Earnings", value: "€" + formatNumber(earnings) },
        details: [
          { label: "Status", value: isMinijob ? "Minijob (€556 limit)" : "Exceeds Minijob limit!" },
          { label: "Employee pays", value: "€0 (tax-free)" },
          { label: "Employer social costs (~28%)", value: "€" + formatNumber(employerCosts) },
          { label: "Flat-rate tax (2%)", value: "€" + formatNumber(flatTax) },
          { label: "Annual earnings", value: "€" + formatNumber(earnings * 12) },
          { label: "Max hours at minimum wage", value: String(Math.floor(556 / 12.82)) + " hrs/month" },
        ],
        note: isMinijob ? "Minijob: employee pays no tax or social contributions. Employer pays ~28% plus 2% flat tax." : "Warning: exceeds €556 Minijob limit. Regular employment rules apply.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is a Minijob in Germany?", answer: "A Minijob is employment earning up to €556/month (2025). Employees pay no income tax or social contributions. Employer pays ~28% in flat-rate social costs plus 2% tax." },
    { question: "What is the minimum wage for Minijobs?", answer: "The 2025 minimum wage is €12.82/hour, which allows a maximum of ~43 hours per month for a Minijob." },
  ],
  formula: "Minijob limit: €556/month. Employee: €0 deductions. Employer: ~28% social + 2% flat tax.",
};
