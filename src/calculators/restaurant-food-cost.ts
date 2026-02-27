import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const restaurantFoodCostCalculator: CalculatorDefinition = {
  slug: "restaurant-food-cost",
  title: "Restaurant Food Cost Calculator",
  description:
    "Calculate your restaurant food cost percentage, menu pricing, and ideal food cost targets to maximize profitability.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "restaurant",
    "food cost",
    "menu pricing",
    "COGS",
    "food percentage",
    "profit margin",
    "recipe cost",
  ],
  variants: [
    {
      slug: "restaurant-food-cost",
      title: "Food Cost Percentage",
      description:
        "Calculate your actual food cost percentage and compare it to industry targets.",
      fields: [
        {
          name: "totalFoodPurchases",
          label: "Total Food Purchases ($)",
          type: "number",
          defaultValue: "15000",
        },
        {
          name: "beginningInventory",
          label: "Beginning Inventory ($)",
          type: "number",
          defaultValue: "5000",
        },
        {
          name: "endingInventory",
          label: "Ending Inventory ($)",
          type: "number",
          defaultValue: "4500",
        },
        {
          name: "totalFoodSales",
          label: "Total Food Sales ($)",
          type: "number",
          defaultValue: "50000",
        },
        {
          name: "targetFoodCost",
          label: "Target Food Cost (%)",
          type: "number",
          defaultValue: "30",
        },
      ],
      calculate(inputs) {
        const purchases = parseFloat(inputs.totalFoodPurchases as string);
        const beginInv = parseFloat(inputs.beginningInventory as string);
        const endInv = parseFloat(inputs.endingInventory as string);
        const sales = parseFloat(inputs.totalFoodSales as string);
        const target = parseFloat(inputs.targetFoodCost as string);

        const cogs = beginInv + purchases - endInv;
        const foodCostPercent = (cogs / sales) * 100;
        const targetCogs = sales * (target / 100);
        const variance = cogs - targetCogs;
        const grossProfit = sales - cogs;
        const grossMargin = (grossProfit / sales) * 100;
        const idealSales = cogs / (target / 100);
        const neededPriceIncrease = ((idealSales - sales) / sales) * 100;

        return {
          "Cost of Goods Sold (COGS)": `$${formatNumber(cogs)}`,
          "Actual Food Cost %": `${formatNumber(foodCostPercent)}%`,
          "Target Food Cost %": `${formatNumber(target)}%`,
          "Target COGS": `$${formatNumber(targetCogs)}`,
          "Variance from Target": `$${formatNumber(variance)}`,
          "Gross Profit": `$${formatNumber(grossProfit)}`,
          "Gross Margin": `${formatNumber(grossMargin)}%`,
          "Required Sales at Target": `$${formatNumber(idealSales)}`,
          "Price Increase Needed": `${formatNumber(neededPriceIncrease)}%`,
        };
      },
    },
    {
      slug: "restaurant-food-cost-menu",
      title: "Menu Item Pricing",
      description: "Calculate the ideal menu price for a dish based on ingredient costs.",
      fields: [
        {
          name: "ingredientCost",
          label: "Total Ingredient Cost ($)",
          type: "number",
          defaultValue: "4.50",
        },
        {
          name: "targetFoodCostPercent",
          label: "Target Food Cost (%)",
          type: "number",
          defaultValue: "30",
        },
        {
          name: "portionsPerRecipe",
          label: "Portions Per Recipe",
          type: "number",
          defaultValue: "4",
        },
        {
          name: "wastePercent",
          label: "Waste/Spoilage Factor (%)",
          type: "number",
          defaultValue: "5",
        },
      ],
      calculate(inputs) {
        const ingredientCost = parseFloat(inputs.ingredientCost as string);
        const targetPercent = parseFloat(inputs.targetFoodCostPercent as string) / 100;
        const portions = parseFloat(inputs.portionsPerRecipe as string);
        const waste = parseFloat(inputs.wastePercent as string) / 100;

        const costPerPortion = ingredientCost / portions;
        const adjustedCost = costPerPortion * (1 + waste);
        const idealPrice = adjustedCost / targetPercent;
        const roundedPrice = Math.ceil(idealPrice * 4) / 4;
        const actualFoodCost = (adjustedCost / roundedPrice) * 100;
        const profitPerPlate = roundedPrice - adjustedCost;

        return {
          "Cost Per Portion": `$${formatNumber(costPerPortion)}`,
          "Adjusted Cost (with waste)": `$${formatNumber(adjustedCost)}`,
          "Ideal Menu Price": `$${formatNumber(idealPrice)}`,
          "Rounded Menu Price": `$${formatNumber(roundedPrice)}`,
          "Actual Food Cost %": `${formatNumber(actualFoodCost)}%`,
          "Profit Per Plate": `$${formatNumber(profitPerPlate)}`,
        };
      },
    },
  ],
  relatedSlugs: [
    "restaurant-labor-cost",
    "product-pricing",
    "wholesale-markup",
  ],
  faq: [
    {
      question: "What is a good food cost percentage for a restaurant?",
      answer:
        "The ideal food cost percentage varies by restaurant type: fast casual (25-30%), casual dining (28-35%), fine dining (30-40%). Most restaurants aim for 28-32% overall. Higher-end ingredients may have higher percentages offset by premium pricing.",
    },
    {
      question: "How do you calculate food cost percentage?",
      answer:
        "Food Cost % = (Beginning Inventory + Purchases - Ending Inventory) / Total Food Sales x 100. This gives your actual food cost for the period. Track this weekly or monthly to catch issues early.",
    },
  ],
  formula:
    "COGS = Beginning Inventory + Purchases - Ending Inventory. Food Cost % = COGS / Food Sales x 100. Menu Price = (Ingredient Cost / Portions) x (1 + Waste%) / Target Food Cost %.",
};
