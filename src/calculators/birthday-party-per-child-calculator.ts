import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const birthdayPartyPerChildCalculator: CalculatorDefinition = {
  slug: "birthday-party-per-child-calculator",
  title: "Birthday Party Cost Per Child Calculator",
  description: "Calculate the total cost of hosting a children birthday party and determine the per-child expense for venue, food, cake, and party bags.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["birthday party cost","kids party budget","children party planner","party cost per child","birthday celebration budget"],
  variants: [{
    id: "standard",
    name: "Birthday Party Cost Per Child",
    description: "Calculate the total cost of hosting a children birthday party and determine the per-child expense for venue, food, cake, and party bags.",
    fields: [
      { name: "children", label: "Number of Children", type: "number", min: 5, max: 50, defaultValue: 15 },
      { name: "venue", label: "Venue/Entertainment Cost ($)", type: "number", min: 0, max: 2000, defaultValue: 300 },
      { name: "foodPerChild", label: "Food Per Child ($)", type: "number", min: 3, max: 30, defaultValue: 10 },
      { name: "cake", label: "Cake Cost ($)", type: "number", min: 20, max: 300, defaultValue: 60 },
      { name: "partyBagPerChild", label: "Party Bag Per Child ($)", type: "number", min: 2, max: 20, defaultValue: 6 },
      { name: "decorations", label: "Decorations ($)", type: "number", min: 10, max: 300, defaultValue: 40 },
    ],
    calculate: (inputs) => {
    const children = inputs.children as number;
    const venue = inputs.venue as number;
    const foodPerChild = inputs.foodPerChild as number;
    const cake = inputs.cake as number;
    const partyBagPerChild = inputs.partyBagPerChild as number;
    const decorations = inputs.decorations as number;
    const foodTotal = foodPerChild * children;
    const partyBagsTotal = partyBagPerChild * children;
    const totalCost = venue + foodTotal + cake + partyBagsTotal + decorations;
    const perChild = totalCost / children;
    return {
      primary: { label: "Total Party Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Cost Per Child", value: "$" + formatNumber(Math.round(perChild)) },
        { label: "Venue/Entertainment", value: "$" + formatNumber(Math.round(venue)) },
        { label: "Food Total", value: "$" + formatNumber(Math.round(foodTotal)) },
        { label: "Cake", value: "$" + formatNumber(Math.round(cake)) },
        { label: "Party Bags Total", value: "$" + formatNumber(Math.round(partyBagsTotal)) },
        { label: "Decorations", value: "$" + formatNumber(Math.round(decorations)) }
      ]
    };
  },
  }],
  relatedSlugs: ["family-vacation-budget-calculator","baby-shower-budget-calculator","family-grocery-budget-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Total = Venue + (Food/Child x Children) + Cake + (Bag/Child x Children) + Decorations; Cost Per Child = Total / Number of Children",
};
