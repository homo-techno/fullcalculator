import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const propertyTaxAppealCalculator: CalculatorDefinition = {
  slug: "property-tax-appeal-calculator",
  title: "Property Tax Appeal Calculator",
  description: "Estimate the potential tax savings from a successful property tax assessment appeal.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["property tax appeal", "tax assessment appeal", "property tax reduction"],
  variants: [{
    id: "standard",
    name: "Property Tax Appeal",
    description: "Estimate the potential tax savings from a successful property tax assessment appeal",
    fields: [
      { name: "currentAssessment", label: "Current Assessed Value", type: "number", prefix: "$", min: 10000, max: 10000000, step: 5000, defaultValue: 350000 },
      { name: "targetAssessment", label: "Target (Fair) Value", type: "number", prefix: "$", min: 10000, max: 10000000, step: 5000, defaultValue: 300000 },
      { name: "taxRate", label: "Local Tax Rate", type: "number", suffix: "%", min: 0.1, max: 5, step: 0.1, defaultValue: 1.5 },
      { name: "appealCost", label: "Estimated Appeal Cost", type: "number", prefix: "$", min: 0, max: 10000, step: 50, defaultValue: 500 },
    ],
    calculate: (inputs) => {
      const current = inputs.currentAssessment as number;
      const target = inputs.targetAssessment as number;
      const rate = inputs.taxRate as number;
      const cost = inputs.appealCost as number;
      if (!current || !target || !rate || current <= 0 || target <= 0) return null;
      const reduction = Math.max(0, current - target);
      const annualSavings = reduction * (rate / 100);
      const netFirstYear = annualSavings - (cost || 0);
      const fiveYearSavings = annualSavings * 5 - (cost || 0);
      const percentReduction = (reduction / current) * 100;
      return {
        primary: { label: "Annual Tax Savings", value: "$" + formatNumber(Math.round(annualSavings)) },
        details: [
          { label: "Assessment Reduction", value: "$" + formatNumber(reduction) + " (" + formatNumber(Math.round(percentReduction)) + "%)" },
          { label: "Net First Year Savings", value: "$" + formatNumber(Math.round(netFirstYear)) },
          { label: "5-Year Net Savings", value: "$" + formatNumber(Math.round(fiveYearSavings)) },
        ],
      };
    },
  }],
  relatedSlugs: ["mill-rate-calculator", "tax-refund-calculator"],
  faq: [
    { question: "When should I appeal my property tax assessment?", answer: "Consider appealing if your assessed value is significantly higher than comparable recent sales in your area, if there are errors in the property description, or if market values have declined since the last assessment." },
    { question: "What evidence do I need for a property tax appeal?", answer: "Strong evidence includes recent comparable sales data, an independent appraisal, photos of property condition issues, documentation of errors in the assessment record, and any other factors affecting market value." },
  ],
  formula: "Annual Savings = (Current Assessment - Target Assessment) x Tax Rate; Net Savings = Annual Savings - Appeal Cost",
};
