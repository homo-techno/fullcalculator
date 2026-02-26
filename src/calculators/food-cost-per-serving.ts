import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const foodCostPerServingCalculator: CalculatorDefinition = {
  slug: "food-cost-per-serving-calculator",
  title: "Food Cost Per Serving Calculator",
  description:
    "Free food cost per serving calculator for restaurants and home cooks. Calculate exact cost per plate, food cost percentage, and menu pricing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "food cost per serving",
    "cost per plate",
    "restaurant food cost",
    "menu pricing calculator",
    "food cost percentage",
    "recipe costing",
  ],
  variants: [
    {
      id: "recipe-cost",
      name: "Recipe Costing",
      description:
        "Calculate the cost per serving for a recipe",
      fields: [
        {
          name: "totalIngredientCost",
          label: "Total Ingredient Cost ($)",
          type: "number",
          placeholder: "e.g. 18.50",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "servings",
          label: "Number of Servings",
          type: "number",
          placeholder: "e.g. 8",
          min: 1,
          step: 1,
        },
        {
          name: "wasteFactor",
          label: "Waste/Trim Factor",
          type: "select",
          options: [
            { label: "None (0%)", value: "0" },
            { label: "Low (5%)", value: "0.05" },
            { label: "Average (10%)", value: "0.10" },
            { label: "High (15%)", value: "0.15" },
            { label: "Very High (20%)", value: "0.20" },
          ],
          defaultValue: "0.10",
        },
      ],
      calculate: (inputs) => {
        const totalCost = parseFloat(inputs.totalIngredientCost as string);
        const servings = parseFloat(inputs.servings as string);
        const wasteFactor = parseFloat(inputs.wasteFactor as string);
        if (!totalCost || totalCost < 0 || !servings || servings <= 0) return null;

        const adjustedCost = totalCost * (1 + wasteFactor);
        const costPerServing = adjustedCost / servings;

        // Menu pricing suggestions at different food cost percentages
        const price30 = costPerServing / 0.30;
        const price25 = costPerServing / 0.25;
        const price35 = costPerServing / 0.35;

        return {
          primary: {
            label: "Cost Per Serving",
            value: `$${formatNumber(costPerServing, 2)}`,
          },
          details: [
            { label: "Raw Ingredient Cost", value: `$${formatNumber(totalCost, 2)}` },
            { label: "Waste Adjustment", value: `+$${formatNumber(totalCost * wasteFactor, 2)} (${formatNumber(wasteFactor * 100, 0)}%)` },
            { label: "Adjusted Total Cost", value: `$${formatNumber(adjustedCost, 2)}` },
            { label: "Cost Per Serving", value: `$${formatNumber(costPerServing, 2)}` },
            { label: "Menu Price (25% food cost)", value: `$${formatNumber(price25, 2)}` },
            { label: "Menu Price (30% food cost)", value: `$${formatNumber(price30, 2)}` },
            { label: "Menu Price (35% food cost)", value: `$${formatNumber(price35, 2)}` },
          ],
          note: "Restaurants typically target 25-35% food cost. A 30% food cost means for every $1 of food cost, the menu price should be approximately $3.33.",
        };
      },
    },
    {
      id: "menu-pricing",
      name: "Menu Pricing",
      description:
        "Calculate the ideal menu price based on food cost percentage target",
      fields: [
        {
          name: "costPerServing",
          label: "Cost Per Serving ($)",
          type: "number",
          placeholder: "e.g. 3.50",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "targetFoodCostPct",
          label: "Target Food Cost %",
          type: "select",
          options: [
            { label: "20% (premium)", value: "20" },
            { label: "25% (upscale)", value: "25" },
            { label: "28% (fine dining)", value: "28" },
            { label: "30% (casual dining)", value: "30" },
            { label: "33% (fast casual)", value: "33" },
            { label: "35% (budget)", value: "35" },
          ],
          defaultValue: "30",
        },
      ],
      calculate: (inputs) => {
        const costPerServing = parseFloat(inputs.costPerServing as string);
        const targetPct = parseFloat(inputs.targetFoodCostPct as string);
        if (!costPerServing || costPerServing < 0 || !targetPct) return null;

        const menuPrice = costPerServing / (targetPct / 100);
        const grossProfit = menuPrice - costPerServing;
        const grossProfitPct = (grossProfit / menuPrice) * 100;

        return {
          primary: {
            label: `Menu Price at ${formatNumber(targetPct)}% food cost`,
            value: `$${formatNumber(menuPrice, 2)}`,
          },
          details: [
            { label: "Food Cost Per Serving", value: `$${formatNumber(costPerServing, 2)}` },
            { label: "Suggested Menu Price", value: `$${formatNumber(menuPrice, 2)}` },
            { label: "Gross Profit Per Plate", value: `$${formatNumber(grossProfit, 2)}` },
            { label: "Gross Profit Margin", value: `${formatNumber(grossProfitPct, 1)}%` },
          ],
        };
      },
    },
    {
      id: "food-cost-pct",
      name: "Food Cost Percentage",
      description:
        "Calculate your actual food cost percentage from menu price and ingredient cost",
      fields: [
        {
          name: "menuPrice",
          label: "Menu Price ($)",
          type: "number",
          placeholder: "e.g. 14.99",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "ingredientCost",
          label: "Ingredient Cost ($)",
          type: "number",
          placeholder: "e.g. 4.25",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
      ],
      calculate: (inputs) => {
        const menuPrice = parseFloat(inputs.menuPrice as string);
        const ingredientCost = parseFloat(inputs.ingredientCost as string);
        if (!menuPrice || menuPrice <= 0 || !ingredientCost || ingredientCost < 0)
          return null;

        const foodCostPct = (ingredientCost / menuPrice) * 100;
        const grossProfit = menuPrice - ingredientCost;

        let rating = "Good";
        if (foodCostPct > 35) rating = "High - consider adjusting";
        if (foodCostPct > 40) rating = "Very High - review pricing";
        if (foodCostPct <= 25) rating = "Excellent";

        return {
          primary: {
            label: "Food Cost Percentage",
            value: `${formatNumber(foodCostPct, 1)}%`,
          },
          details: [
            { label: "Food Cost %", value: `${formatNumber(foodCostPct, 1)}%` },
            { label: "Gross Profit", value: `$${formatNumber(grossProfit, 2)}` },
            { label: "Rating", value: rating },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "meal-prep-cost-calculator",
    "break-even-calculator",
    "cooking-converter",
  ],
  faq: [
    {
      question: "What is a good food cost percentage for a restaurant?",
      answer:
        "Most restaurants aim for 25-35% food cost. Fine dining typically runs 28-35%, casual dining 30-35%, and fast casual 25-30%. Lower food cost percentage means higher profit margin per plate, but pricing must remain competitive.",
    },
    {
      question: "How do I calculate food cost per serving at home?",
      answer:
        "Add up the cost of all ingredients used in a recipe (use unit prices from your receipts). Divide the total by the number of servings the recipe makes. Add 5-10% for waste and trimmings to get a realistic cost per serving.",
    },
  ],
  formula:
    "Cost Per Serving = (Total Ingredient Cost x (1 + Waste %)) / Servings | Menu Price = Cost Per Serving / Target Food Cost %",
};
