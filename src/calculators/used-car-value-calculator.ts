import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const usedCarValueCalculator: CalculatorDefinition = {
  slug: "used-car-value-calculator",
  title: "Used Car Value Calculator",
  description: "Estimate the fair market value of a used vehicle",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["used car value","car trade-in value","vehicle market value"],
  variants: [{
    id: "standard",
    name: "Used Car Value",
    description: "Estimate the fair market value of a used vehicle",
    fields: [
      { name: "originalPrice", label: "Original MSRP ($)", type: "number", defaultValue: 30000, min: 0, step: 1000 },
      { name: "age", label: "Vehicle Age (years)", type: "number", defaultValue: 5, min: 0, max: 25, step: 1 },
      { name: "mileage", label: "Current Mileage", type: "number", defaultValue: 60000, min: 0, step: 5000 },
      { name: "condition", label: "Condition (1=Poor, 5=Excellent)", type: "number", defaultValue: 3, min: 1, max: 5, step: 1 },
    ],
    calculate: (inputs: Record<string, string | number>) => {
      const msrp = inputs.originalPrice as number || 30000;
      const age = inputs.age as number || 5;
      const miles = inputs.mileage as number || 60000;
      const condition = inputs.condition as number || 3;
      const depRates = [0.20, 0.15, 0.13, 0.12, 0.11, 0.10, 0.09, 0.08, 0.07, 0.06];
      let value = msrp;
      for (let i = 0; i < age; i++) {
        const r = i < depRates.length ? depRates[i] : 0.05;
        value *= (1 - r);
      }
      const avgMiles = age * 12000;
      const mileageDiff = miles - avgMiles;
      const mileageAdj = mileageDiff * -0.05;
      value += mileageAdj;
      const conditionMultiplier = 0.80 + (condition - 1) * 0.075;
      value *= conditionMultiplier;
      value = Math.max(0, Math.round(value));
      const tradeIn = Math.round(value * 0.85);
      const privateSale = Math.round(value * 1.10);
      return {
        primary: { label: "Estimated Market Value", value: "$" + formatNumber(value) },
        details: [
          { label: "Trade-In Value", value: "$" + formatNumber(tradeIn) },
          { label: "Private Sale Value", value: "$" + formatNumber(privateSale) },
          { label: "Value Retained", value: formatNumber(Math.round(value / msrp * 100)) + "%" },
          { label: "Depreciation Total", value: "$" + formatNumber(Math.round(msrp - value)) }
        ]
      };
    },
  }],
  relatedSlugs: ["car-depreciation-calculator"],
  faq: [
    { question: "How is used car value determined?", answer: "Value is based on original price, age, mileage compared to average, and vehicle condition." },
    { question: "What is the difference between trade-in and private sale?", answer: "Trade-in values are typically 10-15% lower than private sale because dealers need profit margin." },
  ],
  formula: "Value = MSRP x Depreciation Factors x Mileage Adjustment x Condition Multiplier",
};
