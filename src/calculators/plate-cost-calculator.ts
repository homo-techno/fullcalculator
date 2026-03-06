import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const plateCostCalculator: CalculatorDefinition = {
  slug: "plate-cost-calculator",
  title: "Plate Cost Calculator",
  description: "Break down the exact cost of each plate by entering individual ingredient weights and unit prices to optimize recipe profitability and portion control.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["plate cost","dish cost breakdown","recipe costing","portion cost calculator"],
  variants: [{
    id: "standard",
    name: "Plate Cost",
    description: "Break down the exact cost of each plate by entering individual ingredient weights and unit prices to optimize recipe profitability and portion control.",
    fields: [
      { name: "proteinCost", label: "Protein Cost ($)", type: "number", min: 0, max: 200, defaultValue: 3.50 },
      { name: "starchCost", label: "Starch/Grain Cost ($)", type: "number", min: 0, max: 50, defaultValue: 0.45 },
      { name: "vegetableCost", label: "Vegetable/Side Cost ($)", type: "number", min: 0, max: 50, defaultValue: 0.80 },
      { name: "sauceCost", label: "Sauce/Dressing Cost ($)", type: "number", min: 0, max: 50, defaultValue: 0.35 },
      { name: "garnishCost", label: "Garnish and Extras ($)", type: "number", min: 0, max: 50, defaultValue: 0.20 },
      { name: "sellingPrice", label: "Menu Selling Price ($)", type: "number", min: 1, max: 500, defaultValue: 18.00 },
    ],
    calculate: (inputs) => {
    const protein = inputs.proteinCost as number;
    const starch = inputs.starchCost as number;
    const veg = inputs.vegetableCost as number;
    const sauce = inputs.sauceCost as number;
    const garnish = inputs.garnishCost as number;
    const price = inputs.sellingPrice as number;
    const totalCost = protein + starch + veg + sauce + garnish;
    const foodCostPct = price > 0 ? (totalCost / price) * 100 : 0;
    const grossProfit = price - totalCost;
    const grossMargin = price > 0 ? (grossProfit / price) * 100 : 0;
    const proteinPct = totalCost > 0 ? (protein / totalCost) * 100 : 0;
    return {
      primary: { label: "Total Plate Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
      details: [
        { label: "Food Cost Percentage", value: formatNumber(Math.round(foodCostPct * 10) / 10) + "%" },
        { label: "Gross Profit Per Plate", value: "$" + formatNumber(Math.round(grossProfit * 100) / 100) },
        { label: "Gross Margin", value: formatNumber(Math.round(grossMargin * 10) / 10) + "%" },
        { label: "Protein % of Plate Cost", value: formatNumber(Math.round(proteinPct * 10) / 10) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["food-cost-percentage-calculator","menu-pricing-calculator"],
  faq: [
    { question: "What is plate costing?", answer: "Plate costing is the process of calculating the exact ingredient cost of every component on a dish. It accounts for protein, starch, vegetables, sauces, garnishes, and any condiments to determine the total food cost per serving." },
    { question: "What percentage of plate cost is typically protein?", answer: "Protein is usually the most expensive component, accounting for 50 to 70 percent of total plate cost. Managing protein portions is the most effective way to control overall food cost." },
    { question: "How often should I recalculate plate costs?", answer: "Recalculate plate costs monthly or whenever ingredient prices change significantly. Seasonal price fluctuations, supplier changes, and recipe modifications all warrant a fresh plate cost analysis." },
  ],
  formula: "Total Plate Cost = Protein + Starch + Vegetable + Sauce + Garnish; Food Cost % = (Total Plate Cost / Menu Price) x 100; Gross Profit = Menu Price - Total Plate Cost",
};
