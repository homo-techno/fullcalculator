import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const trustFundCalculator: CalculatorDefinition = {
  slug: "trust-fund-calculator",
  title: "Trust Fund Calculator",
  description: "Project the growth of a trust fund over time based on the initial deposit, contributions, and rate of return.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["trust fund growth", "trust fund calculator", "trust investment projection"],
  variants: [{
    id: "standard",
    name: "Trust Fund",
    description: "Project the growth of a trust fund over time based on the initial deposit, contributions, and rate of return",
    fields: [
      { name: "initialDeposit", label: "Initial Trust Deposit", type: "number", prefix: "$", min: 0, max: 50000000, step: 1000, defaultValue: 250000 },
      { name: "annualContribution", label: "Annual Contribution", type: "number", prefix: "$", min: 0, max: 1000000, step: 500, defaultValue: 10000 },
      { name: "years", label: "Time Horizon", type: "number", suffix: "years", min: 1, max: 50, defaultValue: 18 },
      { name: "returnRate", label: "Expected Annual Return", type: "number", suffix: "%", min: 0, max: 15, step: 0.5, defaultValue: 6 },
    ],
    calculate: (inputs) => {
      const initial = inputs.initialDeposit as number;
      const annual = inputs.annualContribution as number;
      const years = inputs.years as number;
      const rate = (inputs.returnRate as number) / 100;
      if (!years || years <= 0) return null;
      let balance = initial || 0;
      let totalContributions = initial || 0;
      for (let i = 0; i < years; i++) {
        balance = balance * (1 + rate) + annual;
        totalContributions += annual;
      }
      const totalGrowth = balance - totalContributions;
      return {
        primary: { label: "Projected Trust Value", value: "$" + formatNumber(Math.round(balance)) },
        details: [
          { label: "Total Contributions", value: "$" + formatNumber(Math.round(totalContributions)) },
          { label: "Investment Growth", value: "$" + formatNumber(Math.round(totalGrowth)) },
          { label: "Growth Percentage", value: formatNumber(Math.round((totalGrowth / totalContributions) * 10000) / 100) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["estate-tax-calculator", "inheritance-tax-calculator"],
  faq: [
    { question: "What is a trust fund?", answer: "A trust fund is a legal entity that holds assets on behalf of a beneficiary, managed by a trustee according to the terms established by the grantor." },
    { question: "What rate of return should I expect from a trust fund?", answer: "Trust funds invested in a diversified portfolio typically earn between 5 and 8 percent annually over the long term, depending on the asset allocation." },
  ],
  formula: "Future Value = Initial x (1 + Rate)^Years + Annual Contribution x [((1 + Rate)^Years - 1) / Rate]",
};
