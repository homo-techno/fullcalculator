import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vehicleDepreciationScheduleCalculator: CalculatorDefinition = {
  slug: "vehicle-depreciation-schedule-calculator",
  title: "Vehicle Depreciation Schedule Calculator",
  description: "Calculate fleet vehicle depreciation over time.",
  category: "Finance",
  categorySlug: "$",
  icon: "TrendingDown",
  keywords: ["vehicle","depreciation","fleet","asset","schedule"],
  variants: [{
    id: "standard",
    name: "Vehicle Depreciation Schedule",
    description: "Calculate fleet vehicle depreciation over time.",
    fields: [
      { name: "purchasePrice", label: "Purchase Price ($)", type: "number", min: 1000, max: 500000, defaultValue: 80000 },
      { name: "salvageValue", label: "Salvage Value ($)", type: "number", min: 0, max: 200000, defaultValue: 15000 },
      { name: "usefulLifeYears", label: "Useful Life (years)", type: "number", min: 1, max: 30, defaultValue: 7 },
      { name: "currentYear", label: "Current Year Number", type: "number", min: 1, max: 30, defaultValue: 1 },
    ],
    calculate: (inputs) => {
    const purchasePrice = inputs.purchasePrice as number;
    const salvageValue = inputs.salvageValue as number;
    const usefulLifeYears = inputs.usefulLifeYears as number;
    const currentYear = inputs.currentYear as number;
    const depreciableAmount = purchasePrice - salvageValue;
    const annualDepreciation = depreciableAmount / usefulLifeYears;
    const accumulatedDep = Math.min(annualDepreciation * currentYear, depreciableAmount);
    const bookValue = purchasePrice - accumulatedDep;
    return {
      primary: { label: "Current Book Value", value: "$" + formatNumber(bookValue) },
      details: [
        { label: "Annual Depreciation", value: "$" + formatNumber(annualDepreciation) },
        { label: "Accumulated Depreciation", value: "$" + formatNumber(accumulatedDep) },
        { label: "Depreciable Amount", value: "$" + formatNumber(depreciableAmount) }
      ]
    };
  },
  }],
  relatedSlugs: ["fleet-fuel-cost-calculator","brake-pad-life-calculator","tire-rotation-schedule-calculator"],
  faq: [
    { question: "How is straight-line depreciation calculated?", answer: "Subtract salvage value from cost and divide by the useful life in years." },
    { question: "What is useful life for a fleet truck?", answer: "Fleet trucks are commonly depreciated over 5 to 10 years." },
  ],
  formula: "Annual Depreciation = (Purchase Price - Salvage Value) / Useful Life",
};
