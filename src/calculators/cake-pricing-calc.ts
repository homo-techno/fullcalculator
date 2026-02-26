import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cakePricingCalculator: CalculatorDefinition = {
  slug: "cake-pricing-calc",
  title: "Cake Pricing Calculator for Bakers",
  description: "Free online cake pricing calculator. Calculate the cost and selling price of custom cakes including ingredients, labor, and overhead.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cake pricing calculator", "cake cost calculator", "bakery pricing", "cake business", "cost of cake", "baker calculator"],
  variants: [
    {
      id: "cake-price",
      name: "Cake Price Calculator",
      fields: [
        { name: "ingredientCost", label: "Total Ingredient Cost ($)", type: "number", placeholder: "e.g. 15", prefix: "$", step: 0.5 },
        { name: "hoursLabor", label: "Hours of Labor", type: "number", placeholder: "e.g. 3", step: 0.25 },
        { name: "hourlyRate", label: "Hourly Rate ($)", type: "number", placeholder: "e.g. 25", prefix: "$" },
        { name: "overheadPct", label: "Overhead (%)", type: "number", placeholder: "e.g. 15", defaultValue: 15 },
        { name: "profitMargin", label: "Profit Margin (%)", type: "number", placeholder: "e.g. 30", defaultValue: 30 },
        { name: "servings", label: "Number of Servings", type: "number", placeholder: "e.g. 24" },
      ],
      calculate: (inputs) => {
        const ingredientCost = parseFloat(inputs.ingredientCost as string) || 0;
        const hoursLabor = parseFloat(inputs.hoursLabor as string) || 0;
        const hourlyRate = parseFloat(inputs.hourlyRate as string) || 0;
        const overheadPct = parseFloat(inputs.overheadPct as string) || 15;
        const profitMargin = parseFloat(inputs.profitMargin as string) || 30;
        const servings = parseFloat(inputs.servings as string) || 1;

        const laborCost = hoursLabor * hourlyRate;
        const subtotal = ingredientCost + laborCost;
        const overhead = subtotal * (overheadPct / 100);
        const totalCost = subtotal + overhead;
        const profit = totalCost * (profitMargin / 100);
        const sellingPrice = totalCost + profit;
        const pricePerServing = sellingPrice / servings;

        return {
          primary: { label: "Selling Price", value: `$${formatNumber(sellingPrice)}` },
          details: [
            { label: "Ingredient Cost", value: `$${formatNumber(ingredientCost)}` },
            { label: "Labor Cost", value: `$${formatNumber(laborCost)}` },
            { label: "Overhead", value: `$${formatNumber(overhead)}` },
            { label: "Total Cost", value: `$${formatNumber(totalCost)}` },
            { label: "Profit", value: `$${formatNumber(profit)}` },
            { label: "Price per Serving", value: `$${formatNumber(pricePerServing)}` },
            { label: "Servings", value: formatNumber(servings) },
          ],
        };
      },
    },
    {
      id: "cake-per-tier",
      name: "Tiered Cake Estimator",
      fields: [
        {
          name: "tiers",
          label: "Number of Tiers",
          type: "select",
          options: [
            { label: "1 Tier", value: "1" },
            { label: "2 Tiers", value: "2" },
            { label: "3 Tiers", value: "3" },
            { label: "4 Tiers", value: "4" },
            { label: "5 Tiers", value: "5" },
          ],
        },
        { name: "servingsNeeded", label: "Servings Needed", type: "number", placeholder: "e.g. 100" },
        { name: "costPerServing", label: "Target Price per Serving ($)", type: "number", placeholder: "e.g. 6", prefix: "$", step: 0.5 },
        {
          name: "complexity",
          label: "Design Complexity",
          type: "select",
          options: [
            { label: "Simple (buttercream)", value: "simple" },
            { label: "Medium (fondant, some detail)", value: "medium" },
            { label: "Complex (sculpted, flowers, etc.)", value: "complex" },
          ],
        },
      ],
      calculate: (inputs) => {
        const tiers = parseFloat(inputs.tiers as string) || 1;
        const servingsNeeded = parseFloat(inputs.servingsNeeded as string) || 0;
        const costPerServing = parseFloat(inputs.costPerServing as string) || 0;
        const complexity = inputs.complexity as string;

        const complexityMultiplier: Record<string, number> = {
          simple: 1.0,
          medium: 1.4,
          complex: 2.0,
        };

        const tierMultiplier = 1 + (tiers - 1) * 0.15;
        const mult = complexityMultiplier[complexity] || 1.0;
        const basePrice = servingsNeeded * costPerServing;
        const adjustedPrice = basePrice * mult * tierMultiplier;
        const deliveryFee = tiers > 2 ? 75 : 50;
        const totalPrice = adjustedPrice + deliveryFee;

        return {
          primary: { label: "Suggested Total Price", value: `$${formatNumber(totalPrice)}` },
          details: [
            { label: "Base Price", value: `$${formatNumber(basePrice)}` },
            { label: "Adjusted for Complexity", value: `$${formatNumber(adjustedPrice)}` },
            { label: "Delivery Fee", value: `$${formatNumber(deliveryFee)}` },
            { label: "Price per Serving", value: `$${formatNumber(totalPrice / servingsNeeded)}` },
            { label: "Tiers", value: formatNumber(tiers) },
            { label: "Servings", value: formatNumber(servingsNeeded) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["catering-serving-calc", "grams-to-cups", "cups-to-grams"],
  faq: [
    {
      question: "How do I price a custom cake?",
      answer: "Add up ingredient costs, labor (hours x hourly rate), and overhead (utilities, rent, insurance — usually 10-20% of subtotal). Then add your desired profit margin (typically 20-40%).",
    },
    {
      question: "What is a fair hourly rate for cake decorating?",
      answer: "Hourly rates vary by location and experience. Home bakers typically charge $20-35/hour, while professional bakeries may calculate $30-50/hour or more.",
    },
    {
      question: "How much should I charge per serving?",
      answer: "Average prices range from $3-5 per serving for simple cakes, $5-8 for medium complexity, and $8-15+ for complex custom designs. Wedding cakes typically start at $5-7 per serving.",
    },
  ],
  formula: "selling_price = (ingredient_cost + labor_cost + overhead) × (1 + profit_margin%)",
};
