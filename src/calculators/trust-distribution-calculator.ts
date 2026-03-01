import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const trustDistributionCalculator: CalculatorDefinition = {
  slug: "trust-distribution-calculator",
  title: "Trust Distribution Calculator",
  description: "Calculate the periodic distribution amounts from a trust based on the trust balance and distribution schedule.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["trust distribution","trust payout calculator","trust income calculator"],
  variants: [{
    id: "standard",
    name: "Trust Distribution",
    description: "Calculate the periodic distribution amounts from a trust based on the trust balance and distribution schedule.",
    fields: [
      { name: "trustBalance", label: "Trust Balance", type: "number", prefix: "$", min: 1000, max: 100000000, defaultValue: 1000000 },
      { name: "distributionRate", label: "Annual Distribution Rate", type: "number", suffix: "%", min: 1, max: 100, defaultValue: 5 },
      { name: "growthRate", label: "Annual Growth Rate", type: "number", suffix: "%", min: 0, max: 15, defaultValue: 4 },
      { name: "yearsRemaining", label: "Years of Distributions", type: "number", min: 1, max: 50, defaultValue: 20 },
    ],
    calculate: (inputs) => {
      const balance = inputs.trustBalance as number;
      const distRate = (inputs.distributionRate as number) / 100;
      const growth = (inputs.growthRate as number) / 100;
      const years = inputs.yearsRemaining as number;
      if (!balance || !years) return null;
      const annualDist = balance * distRate;
      const monthlyDist = annualDist / 12;
      let totalDistributed = 0;
      let currentBalance = balance;
      for (let y = 0; y < years; y++) {
        const yearDist = currentBalance * distRate;
        totalDistributed += yearDist;
        currentBalance = (currentBalance - yearDist) * (1 + growth);
      }
      return {
        primary: { label: "Current Annual Distribution", value: "$" + formatNumber(Math.round(annualDist)) },
        details: [
          { label: "Current Monthly Distribution", value: "$" + formatNumber(Math.round(monthlyDist)) },
          { label: "Total Distributed Over " + years + " Years", value: "$" + formatNumber(Math.round(totalDistributed)) },
          { label: "Projected Balance After " + years + " Years", value: "$" + formatNumber(Math.round(currentBalance)) },
        ],
      };
    },
  }],
  relatedSlugs: ["estate-tax-calculator","retirement-income-calculator"],
  faq: [
    { question: "What is a typical trust distribution rate?", answer: "Many trusts distribute 3% to 5% of the trust balance annually. The Uniform Prudent Investor Act suggests that a total return approach balancing growth and income is appropriate for most trusts." },
    { question: "Can a trust last indefinitely?", answer: "Trust duration depends on state law. Some states allow perpetual trusts, while others follow the Rule Against Perpetuities, which typically limits trusts to about 90 years or a life in being plus 21 years." },
  ],
  formula: "Annual Distribution = Trust Balance x Distribution Rate; Projected Balance = (Balance - Distribution) x (1 + Growth Rate) over each year",
};
