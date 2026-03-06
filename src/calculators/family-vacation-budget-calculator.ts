import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const familyVacationBudgetCalculator: CalculatorDefinition = {
  slug: "family-vacation-budget-calculator",
  title: "Family Vacation Budget Calculator",
  description: "Plan and budget a family vacation by estimating costs for travel, accommodation, food, activities, and incidentals based on destination and family size.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["family vacation budget","family trip cost","vacation planner","travel budget family","holiday cost calculator"],
  variants: [{
    id: "standard",
    name: "Family Vacation Budget",
    description: "Plan and budget a family vacation by estimating costs for travel, accommodation, food, activities, and incidentals based on destination and family size.",
    fields: [
      { name: "familySize", label: "Family Size", type: "number", min: 2, max: 10, defaultValue: 4 },
      { name: "nights", label: "Number of Nights", type: "number", min: 1, max: 21, defaultValue: 7 },
      { name: "hotelPerNight", label: "Accommodation Per Night ($)", type: "number", min: 50, max: 1000, defaultValue: 175 },
      { name: "travelCostTotal", label: "Round Trip Travel Total ($)", type: "number", min: 100, max: 10000, defaultValue: 1600 },
      { name: "foodPerPersonDay", label: "Food Per Person Per Day ($)", type: "number", min: 20, max: 150, defaultValue: 50 },
      { name: "activitiesPerDay", label: "Activities Per Day ($)", type: "number", min: 0, max: 500, defaultValue: 80 },
    ],
    calculate: (inputs) => {
    const familySize = inputs.familySize as number;
    const nights = inputs.nights as number;
    const hotelPerNight = inputs.hotelPerNight as number;
    const travelCostTotal = inputs.travelCostTotal as number;
    const foodPerPersonDay = inputs.foodPerPersonDay as number;
    const activitiesPerDay = inputs.activitiesPerDay as number;
    const days = nights + 1;
    const hotelTotal = hotelPerNight * nights;
    const foodTotal = foodPerPersonDay * familySize * days;
    const activitiesTotal = activitiesPerDay * days;
    const miscellaneous = (hotelTotal + foodTotal + activitiesTotal) * 0.1;
    const totalCost = travelCostTotal + hotelTotal + foodTotal + activitiesTotal + miscellaneous;
    const perPerson = totalCost / familySize;
    const perDay = totalCost / days;
    return {
      primary: { label: "Total Vacation Budget", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Travel", value: "$" + formatNumber(Math.round(travelCostTotal)) },
        { label: "Accommodation", value: "$" + formatNumber(Math.round(hotelTotal)) },
        { label: "Food", value: "$" + formatNumber(Math.round(foodTotal)) },
        { label: "Activities", value: "$" + formatNumber(Math.round(activitiesTotal)) },
        { label: "Miscellaneous (10%)", value: "$" + formatNumber(Math.round(miscellaneous)) },
        { label: "Cost Per Person", value: "$" + formatNumber(Math.round(perPerson)) }
      ]
    };
  },
  }],
  relatedSlugs: ["family-grocery-budget-calculator","birthday-party-per-child-calculator","family-phone-plan-cost-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Total = Travel + (Hotel x Nights) + (Food x Family x Days) + (Activities x Days) + 10% Misc; Cost Per Person = Total / Family Size",
};
