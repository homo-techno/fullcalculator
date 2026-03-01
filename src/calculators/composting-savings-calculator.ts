import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const compostingSavingsCalculator: CalculatorDefinition = {
  slug: "composting-savings-calculator",
  title: "Composting Savings Calculator",
  description: "Estimate the money saved and waste diverted by composting food scraps and yard waste at home.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["composting savings","compost calculator","waste reduction savings"],
  variants: [{
    id: "standard",
    name: "Composting Savings",
    description: "Estimate the money saved and waste diverted by composting food scraps and yard waste at home.",
    fields: [
      { name: "householdSize", label: "Household Size", type: "number", min: 1, max: 10, defaultValue: 3 },
      { name: "trashBagCost", label: "Cost Per Trash Bag", type: "number", prefix: "$", min: 0.1, max: 5, defaultValue: 0.75 },
      { name: "compostUseBags", label: "Compost Bags Saved Per Week", type: "number", min: 0.5, max: 10, defaultValue: 1 },
      { name: "fertilizerCostPerYear", label: "Annual Fertilizer Cost Avoided", type: "number", prefix: "$", min: 0, max: 1000, defaultValue: 100 },
    ],
    calculate: (inputs) => {
      const household = inputs.householdSize as number;
      const bagCost = inputs.trashBagCost as number;
      const bagsSaved = inputs.compostUseBags as number;
      const fertilizerSaved = inputs.fertilizerCostPerYear as number;
      if (!household) return null;
      const weeklyFoodWasteLbs = household * 3.5;
      const annualWasteDiverted = weeklyFoodWasteLbs * 52;
      const annualBagSavings = bagsSaved * 52 * bagCost;
      const totalAnnualSavings = annualBagSavings + fertilizerSaved;
      return {
        primary: { label: "Annual Savings", value: "$" + formatNumber(Math.round(totalAnnualSavings)) },
        details: [
          { label: "Waste Diverted Per Year", value: formatNumber(Math.round(annualWasteDiverted)) + " lbs" },
          { label: "Trash Bag Savings", value: "$" + formatNumber(Math.round(annualBagSavings * 100) / 100) },
          { label: "Fertilizer Savings", value: "$" + formatNumber(Math.round(fertilizerSaved)) },
          { label: "Weekly Food Waste", value: formatNumber(Math.round(weeklyFoodWasteLbs * 10) / 10) + " lbs" },
        ],
      };
    },
  }],
  relatedSlugs: ["carbon-footprint-calculator","tree-planting-offset-calculator"],
  faq: [
    { question: "How much food waste does the average person produce?", answer: "The average American generates about 3 to 4 pounds of food waste per week. Composting can divert 30% or more of household waste from landfills." },
    { question: "What can be composted at home?", answer: "Fruit and vegetable scraps, coffee grounds, eggshells, yard trimmings, leaves, and paper products can all be composted. Avoid meat, dairy, and oily foods in basic home compost systems." },
  ],
  formula: "Annual Savings = (Bags Saved Per Week x 52 x Bag Cost) + Fertilizer Cost Avoided; Waste Diverted = Household Size x 3.5 lbs/week x 52",
};
