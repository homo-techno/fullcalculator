import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const babyShowerBudgetCalculator: CalculatorDefinition = {
  slug: "baby-shower-budget-calculator",
  title: "Baby Shower Budget Calculator",
  description: "Plan and budget your baby shower by estimating costs for venue, food, decorations, games, and favors based on guest count.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["baby shower budget","baby shower cost","baby shower planning","shower party budget","baby celebration cost"],
  variants: [{
    id: "standard",
    name: "Baby Shower Budget",
    description: "Plan and budget your baby shower by estimating costs for venue, food, decorations, games, and favors based on guest count.",
    fields: [
      { name: "guests", label: "Number of Guests", type: "number", min: 5, max: 100, defaultValue: 25 },
      { name: "foodPerPerson", label: "Food/Drink Per Person ($)", type: "number", min: 5, max: 50, defaultValue: 15 },
      { name: "venue", label: "Venue Cost ($)", type: "number", min: 0, max: 2000, defaultValue: 200 },
      { name: "decorations", label: "Decorations ($)", type: "number", min: 20, max: 500, defaultValue: 75 },
      { name: "favors", label: "Favor Cost Per Guest ($)", type: "number", min: 1, max: 15, defaultValue: 4 },
    ],
    calculate: (inputs) => {
    const guests = inputs.guests as number;
    const foodPerPerson = inputs.foodPerPerson as number;
    const venue = inputs.venue as number;
    const decorations = inputs.decorations as number;
    const favors = inputs.favors as number;
    const foodTotal = guests * foodPerPerson;
    const favorsTotal = guests * favors;
    const cakeCost = Math.max(40, guests * 3);
    const totalCost = foodTotal + venue + decorations + favorsTotal + cakeCost;
    const perGuest = totalCost / guests;
    return {
      primary: { label: "Total Budget", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Food and Drinks", value: "$" + formatNumber(Math.round(foodTotal)) },
        { label: "Venue", value: "$" + formatNumber(Math.round(venue)) },
        { label: "Cake/Dessert", value: "$" + formatNumber(Math.round(cakeCost)) },
        { label: "Decorations", value: "$" + formatNumber(Math.round(decorations)) },
        { label: "Party Favors", value: "$" + formatNumber(Math.round(favorsTotal)) },
        { label: "Cost Per Guest", value: "$" + formatNumber(Math.round(perGuest)) }
      ]
    };
  },
  }],
  relatedSlugs: ["nursery-setup-cost-calculator","baby-formula-cost-calculator","birthday-party-per-child-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Total = (Food/Person x Guests) + Venue + Decorations + (Favor x Guests) + Cake; Cost Per Guest = Total / Guests",
};
