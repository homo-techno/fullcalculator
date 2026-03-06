import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const barPourCostCalculator: CalculatorDefinition = {
  slug: "bar-pour-cost-calculator",
  title: "Bar Pour Cost Calculator",
  description: "Calculate your bar pour cost percentage for cocktails, beer, and wine by comparing the cost of ingredients to the selling price for each drink.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["bar pour cost","liquor cost percentage","drink cost calculator","bar profitability"],
  variants: [{
    id: "standard",
    name: "Bar Pour Cost",
    description: "Calculate your bar pour cost percentage for cocktails, beer, and wine by comparing the cost of ingredients to the selling price for each drink.",
    fields: [
      { name: "bottleCost", label: "Bottle or Ingredient Cost ($)", type: "number", min: 0.5, max: 1000, defaultValue: 28 },
      { name: "servingsPerBottle", label: "Servings Per Bottle", type: "number", min: 1, max: 100, defaultValue: 17 },
      { name: "sellingPrice", label: "Drink Selling Price ($)", type: "number", min: 0.5, max: 200, defaultValue: 12 },
      { name: "mixerCost", label: "Mixer and Garnish Cost Per Drink ($)", type: "number", min: 0, max: 20, defaultValue: 0.75 },
      { name: "drinksPerWeek", label: "Drinks Sold Per Week", type: "number", min: 1, max: 10000, defaultValue: 200 },
    ],
    calculate: (inputs) => {
    const bottleCost = inputs.bottleCost as number;
    const servings = inputs.servingsPerBottle as number;
    const price = inputs.sellingPrice as number;
    const mixer = inputs.mixerCost as number;
    const weekly = inputs.drinksPerWeek as number;
    const costPerDrink = (bottleCost / servings) + mixer;
    const pourCostPct = price > 0 ? (costPerDrink / price) * 100 : 0;
    const profitPerDrink = price - costPerDrink;
    const weeklyRevenue = weekly * price;
    const weeklyProfit = weekly * profitPerDrink;
    return {
      primary: { label: "Pour Cost Percentage", value: formatNumber(Math.round(pourCostPct * 100) / 100) + "%" },
      details: [
        { label: "Cost Per Drink", value: "$" + formatNumber(Math.round(costPerDrink * 100) / 100) },
        { label: "Profit Per Drink", value: "$" + formatNumber(Math.round(profitPerDrink * 100) / 100) },
        { label: "Weekly Revenue", value: "$" + formatNumber(Math.round(weeklyRevenue)) },
        { label: "Weekly Gross Profit", value: "$" + formatNumber(Math.round(weeklyProfit)) }
      ]
    };
  },
  }],
  relatedSlugs: ["cocktail-recipe-cost-calculator","happy-hour-profit-calculator"],
  faq: [
    { question: "What is a good pour cost percentage?", answer: "A healthy bar pour cost is typically 18 to 24 percent. Liquor pours average 18 to 20 percent, draft beer 20 to 24 percent, bottled beer 24 to 28 percent, and wine 30 to 35 percent." },
    { question: "How do I reduce bar pour cost?", answer: "Use measured pourers or jiggers, implement strict inventory tracking, train bartenders on recipes, reduce over-pouring, minimize spillage and waste, and renegotiate supplier pricing." },
    { question: "How many servings are in a standard liquor bottle?", answer: "A standard 750ml bottle contains about 17 servings at 1.5 ounces each. A liter bottle yields approximately 22 servings at the same pour size." },
  ],
  formula: "Cost Per Drink = (Bottle Cost / Servings Per Bottle) + Mixer Cost; Pour Cost % = (Cost Per Drink / Selling Price) x 100; Profit Per Drink = Selling Price - Cost Per Drink",
};
