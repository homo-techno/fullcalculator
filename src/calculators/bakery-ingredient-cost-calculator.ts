import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bakeryIngredientCostCalculator: CalculatorDefinition = {
  slug: "bakery-ingredient-cost-calculator",
  title: "Bakery Ingredient Cost Calculator",
  description: "Calculate ingredient costs per batch and per unit for bakery products by entering flour, sugar, butter, eggs, and other component prices.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["bakery ingredient cost","baking recipe cost","bakery pricing","cost per pastry"],
  variants: [{
    id: "standard",
    name: "Bakery Ingredient Cost",
    description: "Calculate ingredient costs per batch and per unit for bakery products by entering flour, sugar, butter, eggs, and other component prices.",
    fields: [
      { name: "flourCost", label: "Flour Cost Per Batch ($)", type: "number", min: 0, max: 500, defaultValue: 2.50 },
      { name: "sugarCost", label: "Sugar and Sweeteners Per Batch ($)", type: "number", min: 0, max: 500, defaultValue: 1.20 },
      { name: "butterDairyCost", label: "Butter and Dairy Per Batch ($)", type: "number", min: 0, max: 500, defaultValue: 3.80 },
      { name: "eggsCost", label: "Eggs Per Batch ($)", type: "number", min: 0, max: 200, defaultValue: 1.50 },
      { name: "otherIngredients", label: "Other Ingredients Per Batch ($)", type: "number", min: 0, max: 500, defaultValue: 1.00 },
      { name: "unitsPerBatch", label: "Units Produced Per Batch", type: "number", min: 1, max: 1000, defaultValue: 24 },
      { name: "sellingPrice", label: "Selling Price Per Unit ($)", type: "number", min: 0.01, max: 500, defaultValue: 3.50 },
    ],
    calculate: (inputs) => {
    const flour = inputs.flourCost as number;
    const sugar = inputs.sugarCost as number;
    const butter = inputs.butterDairyCost as number;
    const eggs = inputs.eggsCost as number;
    const other = inputs.otherIngredients as number;
    const units = inputs.unitsPerBatch as number;
    const price = inputs.sellingPrice as number;
    const batchCost = flour + sugar + butter + eggs + other;
    const costPerUnit = units > 0 ? batchCost / units : 0;
    const profitPerUnit = price - costPerUnit;
    const margin = price > 0 ? (profitPerUnit / price) * 100 : 0;
    const batchRevenue = units * price;
    const batchProfit = batchRevenue - batchCost;
    return {
      primary: { label: "Cost Per Unit", value: "$" + formatNumber(Math.round(costPerUnit * 100) / 100) },
      details: [
        { label: "Total Batch Cost", value: "$" + formatNumber(Math.round(batchCost * 100) / 100) },
        { label: "Profit Per Unit", value: "$" + formatNumber(Math.round(profitPerUnit * 100) / 100) },
        { label: "Profit Margin", value: formatNumber(Math.round(margin * 10) / 10) + "%" },
        { label: "Batch Revenue", value: "$" + formatNumber(Math.round(batchRevenue * 100) / 100) },
        { label: "Batch Profit", value: "$" + formatNumber(Math.round(batchProfit * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["food-cost-percentage-calculator","menu-pricing-calculator"],
  faq: [
    { question: "What is a good profit margin for a bakery?", answer: "Bakeries typically target a gross profit margin of 50 to 70 percent on individual items. Overall net profit margins for bakery businesses range from 5 to 15 percent after accounting for labor, rent, and overhead." },
    { question: "How do I price bakery items?", answer: "A common rule is to multiply your ingredient cost by 3 to 4 for retail items. This covers ingredients at roughly 25 to 35 percent, labor at 25 to 35 percent, overhead at 15 to 25 percent, and leaves profit." },
    { question: "What are the most expensive bakery ingredients?", answer: "Butter, vanilla extract, chocolate, and nuts are typically the most expensive bakery ingredients. Specialty items like saffron, high-quality cocoa, and imported European butter can significantly increase recipe costs." },
  ],
  formula: "Batch Cost = Flour + Sugar + Butter/Dairy + Eggs + Other Ingredients
Cost Per Unit = Batch Cost / Units Per Batch
Profit Margin = ((Selling Price - Cost Per Unit) / Selling Price) x 100",
};
