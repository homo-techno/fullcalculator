import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const medigapPlanComparisonCalculator: CalculatorDefinition = {
  slug: "medigap-plan-comparison-calculator",
  title: "Medigap Plan Comparison Calculator",
  description: "Compare costs of Medigap supplement plans F, G, and N by age and base premium.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["medigap comparison", "medicare supplement plans", "medigap cost"],
  variants: [{
    id: "standard",
    name: "Medigap Plan Comparison",
    description: "Compare costs of Medigap supplement plans F, G, and N by age and base premium",
    fields: [
      { name: "planType", label: "Plan Type", type: "select", options: [{value:"F",label:"Plan F"},{value:"G",label:"Plan G"},{value:"N",label:"Plan N"}], defaultValue: "G" },
      { name: "basePremium", label: "Base Monthly Premium", type: "number", prefix: "$", min: 50, max: 1000, defaultValue: 200 },
      { name: "age", label: "Current Age", type: "number", min: 65, max: 100, defaultValue: 67 },
    ],
    calculate: (inputs) => {
      const plan = inputs.planType as string;
      const base = inputs.basePremium as number;
      const age = inputs.age as number;
      if (!base || base <= 0 || !age) return null;
      const ageAdj = 1 + (age - 65) * 0.02;
      const planAdj: Record<string, number> = { F: 1.15, G: 1.0, N: 0.85 };
      const monthly = base * ageAdj * (planAdj[plan] || 1.0);
      const annual = monthly * 12;
      const outOfPocket: Record<string, number> = { F: 0, G: 226, N: 500 };
      const maxOOP = outOfPocket[plan] || 0;
      const totalAnnualMax = annual + maxOOP;
      return {
        primary: { label: "Estimated Monthly Premium", value: "$" + formatNumber(Math.round(monthly)) },
        details: [
          { label: "Annual Premium", value: "$" + formatNumber(Math.round(annual)) },
          { label: "Max Out-of-Pocket", value: "$" + formatNumber(maxOOP) },
          { label: "Total Annual Max Cost", value: "$" + formatNumber(Math.round(totalAnnualMax)) },
          { label: "Age Adjustment", value: (ageAdj * 100 - 100).toFixed(0) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["medicare-part-b-premium-calculator", "medicare-part-d-coverage-gap-calculator"],
  faq: [
    { question: "Which Medigap plan is the best value?", answer: "Plan G is often the best value because it covers nearly everything Plan F does at a lower premium." },
    { question: "Do Medigap premiums increase with age?", answer: "Yes, most Medigap policies use attained-age pricing, meaning premiums increase as you get older." },
  ],
  formula: "Monthly Premium = Base Premium x Age Adjustment x Plan Type Factor",
};
