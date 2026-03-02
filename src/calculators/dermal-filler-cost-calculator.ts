import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dermalFillerCostCalculator: CalculatorDefinition = {
  slug: "dermal-filler-cost-calculator",
  title: "Dermal Filler Cost Calculator",
  description: "Calculate dermal filler cost based on syringes and area.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["dermal filler cost","filler price","lip filler cost"],
  variants: [{
    id: "standard",
    name: "Dermal Filler Cost",
    description: "Calculate dermal filler cost based on syringes and area.",
    fields: [
      { name: "area", label: "Treatment Area", type: "select", options: [{ value: "1", label: "Lips (1 syringe)" }, { value: "2", label: "Cheeks (2 syringes)" }, { value: "1", label: "Nasolabial Folds (1 syringe)" }, { value: "3", label: "Full Face (3 syringes)" }] },
      { name: "costPerSyringe", label: "Cost Per Syringe ($)", type: "number", min: 400, max: 1200, defaultValue: 650 },
      { name: "touchUps", label: "Touch-Ups Per Year", type: "number", min: 0, max: 4, defaultValue: 1 },
      { name: "touchUpSyringes", label: "Syringes Per Touch-Up", type: "number", min: 1, max: 4, defaultValue: 1 },
    ],
    calculate: (inputs) => {
    const syringes = parseInt(inputs.area as string);
    const costPerSyringe = inputs.costPerSyringe as number;
    const touchUps = inputs.touchUps as number;
    const touchUpSyringes = inputs.touchUpSyringes as number;
    const initialCost = syringes * costPerSyringe;
    const touchUpCost = touchUps * touchUpSyringes * costPerSyringe;
    const annualCost = initialCost + touchUpCost;
    return {
      primary: { label: "Initial Treatment Cost", value: "$" + formatNumber(initialCost) },
      details: [
        { label: "Syringes Needed", value: formatNumber(syringes) },
        { label: "Touch-Up Cost", value: "$" + formatNumber(touchUpCost) },
        { label: "Annual Total", value: "$" + formatNumber(annualCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["botox-cost-calculator","cosmetic-surgery-cost-calculator"],
  faq: [
    { question: "How much do dermal fillers cost?", answer: "Fillers cost $500 to $1000 per syringe depending on the brand and area." },
    { question: "How long do fillers last?", answer: "Most fillers last 6 to 18 months depending on the type and location." },
    { question: "How many syringes of filler do I need?", answer: "Lips need 1 syringe. Cheeks need 1 to 2 syringes per side." },
  ],
  formula: "Annual = (Initial Syringes x Cost) + (Touch-Ups x Syringes x Cost)",
};
