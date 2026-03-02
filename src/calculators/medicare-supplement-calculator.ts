import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const medicareSupplementCalculator: CalculatorDefinition = {
  slug: "medicare-supplement-calculator",
  title: "Medicare Supplement Calculator",
  description: "Estimate monthly Medigap supplement premium.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["medigap premium","medicare supplement","medigap cost"],
  variants: [{
    id: "standard",
    name: "Medicare Supplement",
    description: "Estimate monthly Medigap supplement premium.",
    fields: [
      { name: "age", label: "Age", type: "number", min: 65, max: 100, defaultValue: 67 },
      { name: "plan", label: "Plan Type", type: "select", options: [{ value: "F", label: "Plan F" }, { value: "G", label: "Plan G" }, { value: "N", label: "Plan N" }], defaultValue: "G" },
      { name: "smoker", label: "Smoker", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" },
    ],
    calculate: (inputs) => {
      const age = inputs.age as number;
      const plan = inputs.plan as string;
      const smoker = inputs.smoker as string;
      if (!age) return null;
      const basePremium: Record<string, number> = { F: 220, G: 180, N: 130 };
      const base = basePremium[plan] || 180;
      const ageFactor = 1 + (age - 65) * 0.02;
      const smokerFactor = smoker === "1" ? 1.25 : 1;
      const monthly = base * ageFactor * smokerFactor;
      const annual = monthly * 12;
      return {
        primary: { label: "Estimated Monthly Premium", value: "$" + formatNumber(Math.round(monthly)) },
        details: [
          { label: "Plan", value: "Plan " + plan },
          { label: "Age Factor", value: formatNumber(Math.round(ageFactor * 100) / 100) },
          { label: "Annual Premium", value: "$" + formatNumber(Math.round(annual)) },
        ],
      };
  },
  }],
  relatedSlugs: ["retirement-home-cost-calculator","elder-care-cost-calculator"],
  faq: [
    { question: "What is the most popular Medigap plan?", answer: "Plan G is currently the most popular Medigap plan." },
    { question: "When can I enroll in Medigap?", answer: "Open enrollment starts when you turn 65 and enroll in Part B." },
  ],
  formula: "Premium = Base x Age Factor x Smoker Factor",
};
