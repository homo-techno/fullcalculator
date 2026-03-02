import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const emergencyFoodSupplyCalculator: CalculatorDefinition = {
  slug: "emergency-food-supply-calculator",
  title: "Emergency Food Supply Calculator",
  description: "Calculate food supplies needed for family emergency prep.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["emergency food","food storage calculator"],
  variants: [{
    id: "standard",
    name: "Emergency Food Supply",
    description: "Calculate food supplies needed for family emergency prep.",
    fields: [
      { name: "people", label: "Number of People", type: "number", min: 1, max: 50, defaultValue: 4 },
      { name: "days", label: "Days of Supply", type: "number", min: 1, max: 365, defaultValue: 14 },
      { name: "calsPerDay", label: "Calories Per Person Per Day", type: "number", min: 1000, max: 4000, defaultValue: 2000 },
      { name: "costPerMeal", label: "Cost Per Meal ($)", type: "number", min: 1, max: 20, defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const people = inputs.people as number;
      const days = inputs.days as number;
      const cals = inputs.calsPerDay as number;
      const cost = inputs.costPerMeal as number;
      if (!people || !days || !cals) return null;
      const totalCals = people * days * cals;
      const meals = people * days * 3;
      const totalCost = meals * cost;
      return {
        primary: { label: "Total Calories Needed", value: formatNumber(totalCals) },
        details: [
          { label: "Total Meals", value: formatNumber(meals) },
          { label: "Estimated Cost", value: "$" + formatNumber(Math.round(totalCost)) },
          { label: "Calories Per Person", value: formatNumber(days * cals) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What foods are best for emergency storage?", answer: "Canned goods, freeze-dried meals, rice, and beans have long shelf lives." },
    { question: "How many calories do I need daily in an emergency?", answer: "Plan for 2000 calories per adult per day at minimum." },
  ],
  formula: "Total Calories = People x Days x Calories/Day",
};
