import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carDepreciationScheduleCalculator: CalculatorDefinition = {
  slug: "car-depreciation-schedule-calculator",
  title: "Car Depreciation Schedule Calculator",
  description: "Calculate year-by-year depreciation of your vehicle based on purchase price, age, and condition.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["car depreciation", "vehicle depreciation schedule", "car value over time"],
  variants: [{
    id: "standard",
    name: "Car Depreciation Schedule",
    description: "Calculate year-by-year depreciation of your vehicle based on purchase price, age, and condition",
    fields: [
      { name: "purchasePrice", label: "Purchase Price", type: "number", prefix: "$", min: 1000, max: 500000, defaultValue: 35000 },
      { name: "currentAge", label: "Current Age", type: "number", suffix: "years", min: 0, max: 30, defaultValue: 0 },
      { name: "yearsToProject", label: "Years to Project", type: "number", suffix: "years", min: 1, max: 20, defaultValue: 5 },
      { name: "condition", label: "Condition", type: "select", options: [{value:"excellent",label:"Excellent"},{value:"good",label:"Good"},{value:"fair",label:"Fair"}], defaultValue: "good" },
    ],
    calculate: (inputs) => {
      const price = inputs.purchasePrice as number;
      const age = inputs.currentAge as number;
      const years = inputs.yearsToProject as number;
      const cond = inputs.condition as string;
      if (!price || price <= 0 || !years) return null;
      const condFactor: Record<string, number> = { excellent: 0.12, good: 0.15, fair: 0.20 };
      const rate = condFactor[cond] || 0.15;
      let currentVal = price;
      for (let i = 0; i < age; i++) { currentVal *= (1 - rate); }
      const startVal = currentVal;
      const endVal = currentVal * Math.pow(1 - rate, years);
      const totalLoss = startVal - endVal;
      return {
        primary: { label: "Value After " + years + " Years", value: "$" + formatNumber(Math.round(endVal)) },
        details: [
          { label: "Current Value", value: "$" + formatNumber(Math.round(startVal)) },
          { label: "Total Depreciation", value: "$" + formatNumber(Math.round(totalLoss)) },
          { label: "Annual Rate", value: (rate * 100).toFixed(1) + "%" },
          { label: "Percent Remaining", value: ((endVal / price) * 100).toFixed(1) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["car-lease-buyout-calculator", "car-shipping-cost-calculator"],
  faq: [
    { question: "How fast do cars depreciate?", answer: "Most cars lose about 15-20% of their value each year, with the steepest drop in the first year." },
    { question: "What affects car depreciation?", answer: "Mileage, condition, brand reliability, and market demand all impact how quickly a car loses value." },
  ],
  formula: "Future Value = Current Value x (1 - Depreciation Rate) ^ Years",
};
