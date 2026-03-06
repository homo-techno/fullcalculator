import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const menuPricingCalculator: CalculatorDefinition = {
  slug: "menu-pricing-calculator",
  title: "Menu Pricing Calculator",
  description: "Set profitable menu prices by calculating the ideal selling price based on raw ingredient costs, target food cost percentage, and desired profit margin.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["menu pricing","dish pricing strategy","restaurant menu price","food pricing formula"],
  variants: [{
    id: "standard",
    name: "Menu Pricing",
    description: "Set profitable menu prices by calculating the ideal selling price based on raw ingredient costs, target food cost percentage, and desired profit margin.",
    fields: [
      { name: "rawCost", label: "Raw Ingredient Cost ($)", type: "number", min: 0.01, max: 10000, defaultValue: 5.00 },
      { name: "targetFoodCostPct", label: "Target Food Cost (%)", type: "number", min: 10, max: 60, defaultValue: 30 },
      { name: "overhead", label: "Overhead Markup (%)", type: "number", min: 0, max: 100, defaultValue: 15 },
      { name: "desiredMargin", label: "Desired Net Margin (%)", type: "number", min: 1, max: 50, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const raw = inputs.rawCost as number;
    const targetPct = inputs.targetFoodCostPct as number;
    const overhead = inputs.overhead as number / 100;
    const margin = inputs.desiredMargin as number / 100;
    const basePrice = targetPct > 0 ? raw / (targetPct / 100) : 0;
    const withOverhead = basePrice * (1 + overhead);
    const finalPrice = margin < 1 ? withOverhead / (1 - margin) : withOverhead * 2;
    const grossProfit = finalPrice - raw;
    const actualFoodCostPct = finalPrice > 0 ? (raw / finalPrice) * 100 : 0;
    return {
      primary: { label: "Recommended Menu Price", value: "$" + formatNumber(Math.round(finalPrice * 100) / 100) },
      details: [
        { label: "Base Price (from food cost target)", value: "$" + formatNumber(Math.round(basePrice * 100) / 100) },
        { label: "With Overhead Markup", value: "$" + formatNumber(Math.round(withOverhead * 100) / 100) },
        { label: "Gross Profit Per Item", value: "$" + formatNumber(Math.round(grossProfit * 100) / 100) },
        { label: "Actual Food Cost %", value: formatNumber(Math.round(actualFoodCostPct * 10) / 10) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["food-cost-percentage-calculator","plate-cost-calculator"],
  faq: [
    { question: "How should I price my menu items?", answer: "Start by calculating raw ingredient cost per portion, then divide by your target food cost percentage (typically 0.28 to 0.35). Add overhead and desired margin. Also consider competitor pricing and perceived value." },
    { question: "Should all menu items have the same food cost percentage?", answer: "No. Different categories have different norms. Appetizers and desserts often run 20 to 25 percent food cost, entrees 28 to 35 percent, and beverages 15 to 25 percent. Balance high and low cost items across the menu." },
    { question: "What is menu engineering?", answer: "Menu engineering analyzes each item by profitability and popularity. Items are classified as Stars (high profit, high popularity), Puzzles (high profit, low popularity), Plowhorses (low profit, high popularity), and Dogs (low profit, low popularity)." },
  ],
  formula: "Base Price = Raw Cost / (Target Food Cost % / 100)
With Overhead = Base Price x (1 + Overhead %)
Final Price = With Overhead / (1 - Desired Net Margin %)",
};
