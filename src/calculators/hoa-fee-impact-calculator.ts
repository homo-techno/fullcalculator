import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hoaFeeImpactCalculator: CalculatorDefinition = {
  slug: "hoa-fee-impact-calculator",
  title: "HOA Fee Impact Calculator",
  description: "Calculate the long-term financial impact of homeowner association fees on your housing budget over time.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["HOA fee impact", "HOA cost calculator", "homeowner association fees"],
  variants: [{
    id: "standard",
    name: "HOA Fee Impact",
    description: "Calculate the long-term financial impact of homeowner association fees on your housing budget over time",
    fields: [
      { name: "monthlyHOA", label: "Monthly HOA Fee", type: "number", prefix: "$", min: 50, max: 2000, step: 25, defaultValue: 300 },
      { name: "annualIncrease", label: "Expected Annual Fee Increase", type: "number", suffix: "%", min: 0, max: 15, step: 0.5, defaultValue: 4 },
      { name: "years", label: "Years of Ownership", type: "number", suffix: "years", min: 1, max: 40, defaultValue: 10 },
      { name: "investmentReturn", label: "Alternative Investment Return", type: "number", suffix: "%", min: 0, max: 15, step: 0.5, defaultValue: 7 },
    ],
    calculate: (inputs) => {
      const monthly = inputs.monthlyHOA as number;
      const increase = (inputs.annualIncrease as number) / 100;
      const years = inputs.years as number;
      const invReturn = (inputs.investmentReturn as number) / 100;
      if (!monthly || !years || monthly <= 0 || years <= 0) return null;
      let totalPaid = 0;
      let opportunityCost = 0;
      let currentMonthly = monthly;
      for (let y = 0; y < years; y++) {
        const annualFee = currentMonthly * 12;
        totalPaid += annualFee;
        opportunityCost = (opportunityCost + annualFee) * (1 + invReturn);
        currentMonthly *= (1 + increase);
      }
      const finalMonthly = monthly * Math.pow(1 + increase, years);
      return {
        primary: { label: "Total HOA Fees Paid", value: "$" + formatNumber(Math.round(totalPaid)) },
        details: [
          { label: "Monthly Fee in Year " + years, value: "$" + formatNumber(Math.round(finalMonthly)) },
          { label: "Opportunity Cost (if invested)", value: "$" + formatNumber(Math.round(opportunityCost)) },
          { label: "Average Monthly Cost", value: "$" + formatNumber(Math.round(totalPaid / years / 12)) },
        ],
      };
    },
  }],
  relatedSlugs: ["home-warranty-calculator", "property-management-fee-calculator"],
  faq: [
    { question: "How much do HOA fees increase each year?", answer: "HOA fees typically increase 3 to 5 percent annually, though increases can be higher if the community needs major repairs or has underfunded reserves." },
    { question: "What do HOA fees cover?", answer: "HOA fees typically cover common area maintenance, landscaping, pool or amenity upkeep, insurance for common areas, and contributions to a reserve fund for future repairs." },
  ],
  formula: "Total HOA Fees = Sum of (Monthly Fee x 12) for Each Year with Annual Increases",
};
