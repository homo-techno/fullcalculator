import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eyelashExtensionCostCalculator: CalculatorDefinition = {
  slug: "eyelash-extension-cost-calculator",
  title: "Eyelash Extension Cost Calculator",
  description: "Calculate lash extension pricing including fills and upkeep.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["eyelash extension cost","lash extension price","lash fill cost"],
  variants: [{
    id: "standard",
    name: "Eyelash Extension Cost",
    description: "Calculate lash extension pricing including fills and upkeep.",
    fields: [
      { name: "fullSetCost", label: "Full Set Cost ($)", type: "number", min: 100, max: 500, defaultValue: 200 },
      { name: "fillCost", label: "Fill Cost ($)", type: "number", min: 50, max: 200, defaultValue: 75 },
      { name: "fillFrequency", label: "Fills Per Month", type: "number", min: 1, max: 4, defaultValue: 2 },
      { name: "fullSetFrequency", label: "Full Sets Per Year", type: "number", min: 1, max: 6, defaultValue: 3 },
      { name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 },
    ],
    calculate: (inputs) => {
    const fullSetCost = inputs.fullSetCost as number;
    const fillCost = inputs.fillCost as number;
    const fillFrequency = inputs.fillFrequency as number;
    const fullSetFrequency = inputs.fullSetFrequency as number;
    const tip = inputs.tip as number;
    const annualFills = fillFrequency * 12 - fullSetFrequency;
    const subtotal = (fullSetCost * fullSetFrequency) + (fillCost * annualFills);
    const tipTotal = subtotal * (tip / 100);
    const annualTotal = subtotal + tipTotal;
    return {
      primary: { label: "Annual Lash Cost", value: "$" + formatNumber(annualTotal) },
      details: [
        { label: "Full Sets Per Year", value: formatNumber(fullSetFrequency) },
        { label: "Fill Appointments Per Year", value: formatNumber(annualFills) },
        { label: "Monthly Average", value: "$" + formatNumber(annualTotal / 12) }
      ]
    };
  },
  }],
  relatedSlugs: ["nail-salon-cost-calculator","facial-treatment-cost-calculator"],
  faq: [
    { question: "How much do eyelash extensions cost?", answer: "Full sets range from $150 to $400. Fills cost $50 to $150 each." },
    { question: "How often do lash extensions need fills?", answer: "Fills are needed every 2 to 3 weeks to maintain fullness." },
    { question: "Do lash extensions damage natural lashes?", answer: "Properly applied extensions should not damage natural lashes." },
  ],
  formula: "Annual = (Full Set Cost x Sets) + (Fill Cost x Fills) + Tips",
};
