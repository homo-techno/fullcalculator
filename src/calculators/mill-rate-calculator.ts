import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const millRateCalculator: CalculatorDefinition = {
  slug: "mill-rate-calculator",
  title: "Mill Rate Calculator",
  description: "Calculate the property tax mill rate and estimate property tax based on assessed value and total municipal budget.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["mill rate", "property tax rate", "mill levy calculator"],
  variants: [{
    id: "standard",
    name: "Mill Rate",
    description: "Calculate the property tax mill rate and estimate property tax based on assessed value and total municipal budget",
    fields: [
      { name: "assessedValue", label: "Assessed Property Value", type: "number", prefix: "$", min: 10000, max: 10000000, step: 5000, defaultValue: 250000 },
      { name: "millRate", label: "Mill Rate (mills)", type: "number", suffix: "mills", min: 1, max: 100, step: 0.5, defaultValue: 25 },
      { name: "exemptions", label: "Exemptions (Homestead, etc.)", type: "number", prefix: "$", min: 0, max: 500000, step: 1000, defaultValue: 25000 },
    ],
    calculate: (inputs) => {
      const assessed = inputs.assessedValue as number;
      const mills = inputs.millRate as number;
      const exemptions = inputs.exemptions as number;
      if (!assessed || !mills || assessed <= 0) return null;
      const taxableValue = Math.max(0, assessed - (exemptions || 0));
      const annualTax = (taxableValue / 1000) * mills;
      const monthlyTax = annualTax / 12;
      const effectiveRate = (annualTax / assessed) * 100;
      return {
        primary: { label: "Annual Property Tax", value: "$" + formatNumber(Math.round(annualTax)) },
        details: [
          { label: "Monthly Tax", value: "$" + formatNumber(Math.round(monthlyTax)) },
          { label: "Taxable Value After Exemptions", value: "$" + formatNumber(taxableValue) },
          { label: "Effective Tax Rate", value: formatNumber(Math.round(effectiveRate * 1000) / 1000) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["property-tax-appeal-calculator", "standard-deduction-calculator"],
  faq: [
    { question: "What is a mill rate?", answer: "A mill rate is the amount of tax per one thousand dollars of assessed property value. One mill equals one-tenth of one cent, or $1 per $1,000. A mill rate of 25 means $25 in tax per $1,000 of assessed value." },
    { question: "How is the mill rate determined?", answer: "The mill rate is set by local governments based on the total budget needs divided by the total taxable property value in the municipality. It is typically adjusted annually to meet revenue requirements." },
  ],
  formula: "Annual Tax = (Assessed Value - Exemptions) / 1,000 x Mill Rate",
};
