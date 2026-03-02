import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const graduationPartyCalculator: CalculatorDefinition = {
  slug: "graduation-party-calculator",
  title: "Graduation Party Calculator",
  description: "Calculate the total cost of hosting a graduation party.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["graduation","party","cost","celebration","budget"],
  variants: [{
    id: "standard",
    name: "Graduation Party",
    description: "Calculate the total cost of hosting a graduation party.",
    fields: [
      { name: "numGuests", label: "Number of Guests", type: "number", min: 10, max: 200, step: 5, defaultValue: 40 },
      { name: "foodPerPerson", label: "Food Per Person ($)", type: "number", min: 5, max: 50, step: 1, defaultValue: 15 },
      { name: "venueCost", label: "Venue or Rental Cost ($)", type: "number", min: 0, max: 5000, step: 50, defaultValue: 300 },
      { name: "decorations", label: "Decorations ($)", type: "number", min: 0, max: 1000, step: 25, defaultValue: 150 },
      { name: "cakeAndDessert", label: "Cake and Dessert ($)", type: "number", min: 0, max: 500, step: 10, defaultValue: 80 },
    ],
    calculate: (inputs) => {
    const numGuests = inputs.numGuests as number;
    const foodPerPerson = inputs.foodPerPerson as number;
    const venueCost = inputs.venueCost as number;
    const decorations = inputs.decorations as number;
    const cakeAndDessert = inputs.cakeAndDessert as number;
    const totalFood = foodPerPerson * numGuests;
    const grandTotal = totalFood + venueCost + decorations + cakeAndDessert;
    const costPerGuest = grandTotal / numGuests;
    return {
      primary: { label: "Total Party Cost", value: "$" + formatNumber(grandTotal) },
      details: [
        { label: "Total Food Cost", value: "$" + formatNumber(totalFood) },
        { label: "Venue or Rental", value: "$" + formatNumber(venueCost) },
        { label: "Decorations", value: "$" + formatNumber(decorations) },
        { label: "Cost Per Guest", value: "$" + formatNumber(costPerGuest) }
      ]
    };
  },
  }],
  relatedSlugs: ["prom-budget-calculator","college-application-cost-calculator","yearbook-cost-calculator"],
  faq: [
    { question: "How much does a graduation party cost?", answer: "A graduation party typically costs $500 to $2,000 for a home event with 30 to 50 guests." },
    { question: "How much food should I plan per guest?", answer: "Plan for 1 pound of food per guest for a full meal or 6 to 8 appetizer pieces per person." },
  ],
  formula: "Total Cost = (Food x Guests) + Venue + Decorations + Cake",
};
