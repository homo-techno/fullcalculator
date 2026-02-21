import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const foodCostCalculator: CalculatorDefinition = {
  slug: "food-cost-calculator",
  title: "Food Cost Calculator",
  description:
    "Free food cost calculator. Calculate recipe cost, cost per serving, food cost percentage, and suggested menu price for restaurants and home cooking.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "food cost calculator",
    "recipe cost calculator",
    "cost per serving",
    "food cost percentage",
    "menu pricing calculator",
    "restaurant food cost",
  ],
  variants: [
    {
      id: "recipe-cost",
      name: "Recipe Cost",
      description: "Calculate cost per serving from total recipe cost",
      fields: [
        {
          name: "totalCost",
          label: "Total Recipe Cost ($)",
          type: "number",
          placeholder: "e.g. 25.50",
        },
        {
          name: "servings",
          label: "Number of Servings",
          type: "number",
          placeholder: "e.g. 8",
        },
        {
          name: "targetFoodCost",
          label: "Target Food Cost %",
          type: "select",
          options: [
            { label: "25% (Fine Dining)", value: "25" },
            { label: "28% (Casual Dining)", value: "28" },
            { label: "30% (Standard)", value: "30" },
            { label: "33% (Fast Casual)", value: "33" },
            { label: "35% (Budget)", value: "35" },
          ],
        },
      ],
      calculate: (inputs) => {
        const totalCost = inputs.totalCost as number;
        const servings = inputs.servings as number;
        const targetFoodCost = parseFloat(inputs.targetFoodCost as string) || 30;
        if (!totalCost || !servings) return null;

        const costPerServing = totalCost / servings;
        const suggestedMenuPrice = costPerServing / (targetFoodCost / 100);
        const markup = suggestedMenuPrice / costPerServing;

        return {
          primary: {
            label: "Cost Per Serving",
            value: "$" + formatNumber(costPerServing, 2),
          },
          details: [
            { label: "Total Recipe Cost", value: "$" + formatNumber(totalCost, 2) },
            { label: "Servings", value: String(servings) },
            { label: "Cost Per Serving", value: "$" + formatNumber(costPerServing, 2) },
            { label: "Target Food Cost %", value: targetFoodCost + "%" },
            { label: "Suggested Menu Price", value: "$" + formatNumber(suggestedMenuPrice, 2) },
            { label: "Markup", value: formatNumber(markup, 1) + "x" },
            { label: "Gross Profit per Serving", value: "$" + formatNumber(suggestedMenuPrice - costPerServing, 2) },
          ],
        };
      },
    },
    {
      id: "food-cost-pct",
      name: "Food Cost Percentage",
      description: "Calculate your actual food cost percentage",
      fields: [
        {
          name: "ingredientCost",
          label: "Ingredient Cost ($)",
          type: "number",
          placeholder: "e.g. 4.50",
        },
        {
          name: "menuPrice",
          label: "Menu Selling Price ($)",
          type: "number",
          placeholder: "e.g. 15.00",
        },
      ],
      calculate: (inputs) => {
        const ingredientCost = inputs.ingredientCost as number;
        const menuPrice = inputs.menuPrice as number;
        if (!ingredientCost || !menuPrice) return null;

        const foodCostPct = (ingredientCost / menuPrice) * 100;
        const grossProfit = menuPrice - ingredientCost;
        const grossProfitPct = (grossProfit / menuPrice) * 100;

        let rating: string;
        if (foodCostPct <= 25) rating = "Excellent (Fine Dining Target)";
        else if (foodCostPct <= 30) rating = "Good (Industry Standard)";
        else if (foodCostPct <= 35) rating = "Acceptable";
        else rating = "High - Consider adjusting";

        return {
          primary: {
            label: "Food Cost Percentage",
            value: formatNumber(foodCostPct, 1) + "%",
          },
          details: [
            { label: "Ingredient Cost", value: "$" + formatNumber(ingredientCost, 2) },
            { label: "Menu Price", value: "$" + formatNumber(menuPrice, 2) },
            { label: "Gross Profit", value: "$" + formatNumber(grossProfit, 2) },
            { label: "Gross Profit %", value: formatNumber(grossProfitPct, 1) + "%" },
            { label: "Rating", value: rating },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["meal-prep-calculator", "party-food-calculator"],
  faq: [
    {
      question: "What is a good food cost percentage?",
      answer:
        "The industry standard for restaurants is 28-32%. Fine dining aims for 25-28%, casual dining 28-32%, and fast-casual 30-35%. Food cost percentage = (Ingredient Cost / Selling Price) x 100.",
    },
    {
      question: "How do I calculate food cost percentage?",
      answer:
        "Food Cost Percentage = (Total Food Cost / Total Food Sales) x 100. For a single dish: divide the ingredient cost by the menu price and multiply by 100. A dish costing $5 in ingredients sold for $18 has a 27.8% food cost.",
    },
    {
      question: "How do I price my menu items?",
      answer:
        "Divide your food cost by your target food cost percentage. If a dish costs $4.50 and your target is 30%, the menu price should be $4.50 / 0.30 = $15.00. Also consider competitor pricing and perceived value.",
    },
  ],
  formula:
    "Food Cost % = (Ingredient Cost / Menu Price) x 100. Suggested Menu Price = Food Cost / Target Food Cost %. Gross Profit = Menu Price - Food Cost. Industry standard food cost is 28-32%.",
};
