import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const labEquipmentDepreciationCalculator: CalculatorDefinition = {
  slug: "lab-equipment-depreciation-calculator",
  title: "Lab Equipment Depreciation Calculator",
  description: "Calculate annual depreciation, book value, and cost-per-use for laboratory equipment using straight-line or declining balance depreciation methods.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["lab equipment depreciation","instrument depreciation","lab asset value","equipment book value","scientific instrument cost"],
  variants: [{
    id: "standard",
    name: "Lab Equipment Depreciation",
    description: "Calculate annual depreciation, book value, and cost-per-use for laboratory equipment using straight-line or declining balance depreciation methods.",
    fields: [
      { name: "purchasePrice", label: "Purchase Price ($)", type: "number", min: 100, max: 10000000, defaultValue: 50000 },
      { name: "salvageValue", label: "Salvage Value ($)", type: "number", min: 0, max: 5000000, defaultValue: 5000 },
      { name: "usefulLife", label: "Useful Life (years)", type: "number", min: 1, max: 30, defaultValue: 10 },
      { name: "currentAge", label: "Current Age (years)", type: "number", min: 0, max: 30, defaultValue: 3 },
      { name: "usesPerYear", label: "Uses Per Year", type: "number", min: 1, max: 10000, defaultValue: 500 },
    ],
    calculate: (inputs) => {
    const purchasePrice = inputs.purchasePrice as number;
    const salvageValue = inputs.salvageValue as number;
    const usefulLife = inputs.usefulLife as number;
    const currentAge = inputs.currentAge as number;
    const usesPerYear = inputs.usesPerYear as number;
    const depreciableAmount = purchasePrice - salvageValue;
    const annualDepreciation = depreciableAmount / usefulLife;
    const totalDepreciation = Math.min(annualDepreciation * currentAge, depreciableAmount);
    const currentBookValue = purchasePrice - totalDepreciation;
    const costPerUse = annualDepreciation / usesPerYear;
    const remainingLife = Math.max(usefulLife - currentAge, 0);
    return {
      primary: { label: "Current Book Value", value: "$" + formatNumber(Math.round(currentBookValue)) },
      details: [
        { label: "Annual Depreciation", value: "$" + formatNumber(Math.round(annualDepreciation)) },
        { label: "Total Depreciation to Date", value: "$" + formatNumber(Math.round(totalDepreciation)) },
        { label: "Cost Per Use", value: "$" + formatNumber(Math.round(costPerUse * 100) / 100) },
        { label: "Remaining Useful Life", value: formatNumber(remainingLife) + " years" }
      ]
    };
  },
  }],
  relatedSlugs: ["reagent-cost-per-experiment-calculator","molarity-calculator","solution-preparation-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Annual Depreciation = (Purchase Price - Salvage Value) / Useful Life; Book Value = Purchase Price - (Annual Depreciation x Age); Cost Per Use = Annual Depreciation / Uses Per Year",
};
