import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carDepreciationCurveCalculator: CalculatorDefinition = {
  slug: "car-depreciation-curve-calculator",
  title: "Car Depreciation Curve Calculator",
  description: "Estimate your vehicle value over time using an exponential depreciation curve based on purchase price, age, and annual depreciation rate.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["car depreciation curve","vehicle value over time","auto depreciation rate","car resale value"],
  variants: [{
    id: "standard",
    name: "Car Depreciation Curve",
    description: "Estimate your vehicle value over time using an exponential depreciation curve based on purchase price, age, and annual depreciation rate.",
    fields: [
      { name: "purchasePrice", label: "Purchase Price ($)", type: "number", min: 1000, max: 500000, defaultValue: 35000 },
      { name: "vehicleAge", label: "Current Vehicle Age (years)", type: "number", min: 0, max: 30, defaultValue: 3 },
      { name: "annualDepreciation", label: "Annual Depreciation Rate (%)", type: "number", min: 1, max: 40, defaultValue: 15 },
      { name: "projectionYears", label: "Projection Years", type: "number", min: 1, max: 20, defaultValue: 5 },
    ],
    calculate: (inputs) => {
    const price = inputs.purchasePrice as number;
    const age = inputs.vehicleAge as number;
    const rate = inputs.annualDepreciation as number / 100;
    const projection = inputs.projectionYears as number;
    const currentValue = price * Math.pow(1 - rate, age);
    const futureValue = price * Math.pow(1 - rate, age + projection);
    const totalDepreciation = currentValue - futureValue;
    const percentRetained = (futureValue / price) * 100;
    return {
      primary: { label: "Current Value", value: "$" + formatNumber(Math.round(currentValue)) },
      details: [
        { label: "Value After " + projection + " More Years", value: "$" + formatNumber(Math.round(futureValue)) },
        { label: "Depreciation Over Projection", value: "$" + formatNumber(Math.round(totalDepreciation)) },
        { label: "Percent of Original Retained", value: formatNumber(Math.round(percentRetained * 10) / 10) + "%" },
        { label: "Annual Loss (Avg)", value: "$" + formatNumber(Math.round(totalDepreciation / projection)) }
      ]
    };
  },
  }],
  relatedSlugs: ["vehicle-depreciation-schedule-calculator","car-loan-refinance-calculator"],
  faq: [
    { question: "How fast do cars depreciate?", answer: "Most new cars lose about 20 percent of their value in the first year and roughly 15 percent each year after that. After five years a typical car retains about 40 percent of its original value." },
    { question: "What factors affect car depreciation?", answer: "Brand reputation, mileage, condition, color, market demand, fuel efficiency, and whether the model has been redesigned all affect depreciation rates." },
    { question: "Do electric vehicles depreciate differently?", answer: "EVs historically depreciated faster due to battery concerns and rapid technology changes, but newer models with longer range and better battery warranties are holding value better." },
  ],
  formula: "Current Value = Purchase Price x (1 - Depreciation Rate) ^ Age
Future Value = Purchase Price x (1 - Depreciation Rate) ^ (Age + Projection Years)",
};
