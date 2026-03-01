import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const longTermCareInsuranceCostCalculator: CalculatorDefinition = {
  slug: "long-term-care-insurance-cost-calculator",
  title: "LTC Insurance Cost Calculator",
  description: "Estimate annual long-term care insurance premiums based on age and benefit options.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["long term care insurance cost", "LTC insurance premium", "long term care calculator"],
  variants: [{
    id: "standard",
    name: "LTC Insurance Cost",
    description: "Estimate annual long-term care insurance premiums based on age and benefit options",
    fields: [
      { name: "age", label: "Current Age", type: "number", min: 40, max: 85, defaultValue: 55 },
      { name: "dailyBenefit", label: "Daily Benefit Amount", type: "number", prefix: "$", min: 50, max: 500, defaultValue: 200 },
      { name: "benefitPeriod", label: "Benefit Period", type: "number", suffix: "years", min: 1, max: 10, defaultValue: 3 },
      { name: "inflation", label: "Inflation Protection", type: "select", options: [{value:"none",label:"None"},{value:"simple",label:"3% Simple"},{value:"compound",label:"3% Compound"}], defaultValue: "simple" },
    ],
    calculate: (inputs) => {
      const age = inputs.age as number;
      const daily = inputs.dailyBenefit as number;
      const period = inputs.benefitPeriod as number;
      const inflation = inputs.inflation as string;
      if (!age || !daily || daily <= 0 || !period) return null;
      const baseRate = daily * 0.015;
      const ageFactor = 1 + Math.pow((age - 40) / 10, 1.5) * 0.5;
      const periodFactor = period / 3;
      const inflationFactor: Record<string, number> = { none: 1.0, simple: 1.40, compound: 1.75 };
      const annualPremium = baseRate * 12 * ageFactor * periodFactor * (inflationFactor[inflation] || 1.0);
      const totalBenefitPool = daily * 365 * period;
      const lifetimePremiums10 = annualPremium * 10;
      return {
        primary: { label: "Estimated Annual Premium", value: "$" + formatNumber(Math.round(annualPremium)) },
        details: [
          { label: "Monthly Premium", value: "$" + formatNumber(Math.round(annualPremium / 12)) },
          { label: "Total Benefit Pool", value: "$" + formatNumber(totalBenefitPool) },
          { label: "10-Year Premium Cost", value: "$" + formatNumber(Math.round(lifetimePremiums10)) },
          { label: "Benefit-to-Premium Ratio", value: (totalBenefitPool / lifetimePremiums10).toFixed(1) + "x" },
        ],
      };
    },
  }],
  relatedSlugs: ["disability-insurance-benefit-calculator", "medicare-part-b-premium-calculator"],
  faq: [
    { question: "When should I buy long-term care insurance?", answer: "The ideal age is between 50 and 65 when premiums are more affordable and you are more likely to qualify medically." },
    { question: "What does long-term care insurance cover?", answer: "It covers nursing home care, assisted living, home health aides, and adult day care services." },
  ],
  formula: "Annual Premium = Base Rate x 12 x Age Factor x Benefit Period Factor x Inflation Factor",
};
