import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const coffeeShopDailyRevenueCalculator: CalculatorDefinition = {
  slug: "coffee-shop-daily-revenue-calculator",
  title: "Coffee Shop Daily Revenue Calculator",
  description: "Estimate daily and monthly revenue for a coffee shop based on average drinks sold, food sales, average ticket price, and peak versus off-peak traffic.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["coffee shop revenue","cafe daily sales","coffee shop income","coffee business revenue"],
  variants: [{
    id: "standard",
    name: "Coffee Shop Daily Revenue",
    description: "Estimate daily and monthly revenue for a coffee shop based on average drinks sold, food sales, average ticket price, and peak versus off-peak traffic.",
    fields: [
      { name: "drinksPerDay", label: "Drinks Sold Per Day", type: "number", min: 10, max: 2000, defaultValue: 200 },
      { name: "avgDrinkPrice", label: "Average Drink Price ($)", type: "number", min: 1, max: 20, defaultValue: 5.25 },
      { name: "foodItemsPerDay", label: "Food Items Sold Per Day", type: "number", min: 0, max: 500, defaultValue: 60 },
      { name: "avgFoodPrice", label: "Average Food Item Price ($)", type: "number", min: 0, max: 30, defaultValue: 4.50 },
      { name: "daysOpen", label: "Days Open Per Month", type: "number", min: 1, max: 31, defaultValue: 26 },
    ],
    calculate: (inputs) => {
    const drinks = inputs.drinksPerDay as number;
    const drinkPrice = inputs.avgDrinkPrice as number;
    const food = inputs.foodItemsPerDay as number;
    const foodPrice = inputs.avgFoodPrice as number;
    const days = inputs.daysOpen as number;
    const dailyDrinkRev = drinks * drinkPrice;
    const dailyFoodRev = food * foodPrice;
    const dailyTotal = dailyDrinkRev + dailyFoodRev;
    const monthlyRevenue = dailyTotal * days;
    const annualRevenue = monthlyRevenue * 12;
    const avgTicket = (drinks + food) > 0 ? dailyTotal / (drinks + food) : 0;
    return {
      primary: { label: "Daily Revenue", value: "$" + formatNumber(Math.round(dailyTotal)) },
      details: [
        { label: "Daily Drink Revenue", value: "$" + formatNumber(Math.round(dailyDrinkRev)) },
        { label: "Daily Food Revenue", value: "$" + formatNumber(Math.round(dailyFoodRev)) },
        { label: "Average Ticket", value: "$" + formatNumber(Math.round(avgTicket * 100) / 100) },
        { label: "Monthly Revenue", value: "$" + formatNumber(Math.round(monthlyRevenue)) },
        { label: "Annual Revenue (est.)", value: "$" + formatNumber(Math.round(annualRevenue)) }
      ]
    };
  },
  }],
  relatedSlugs: ["restaurant-profit-margin-calculator","bakery-ingredient-cost-calculator"],
  faq: [
    { question: "How much revenue does an average coffee shop make?", answer: "An average coffee shop generates $500 to $2,000 per day in revenue, or roughly $200,000 to $600,000 annually. High-traffic locations in urban areas can exceed $1 million per year." },
    { question: "What is the average profit margin for a coffee shop?", answer: "Coffee shops typically achieve a net profit margin of 5 to 15 percent. Drinks have high margins of 65 to 80 percent, while food items run 50 to 65 percent. Rent and labor are the largest expenses." },
    { question: "How can I increase coffee shop revenue?", answer: "Boost average ticket with upselling, add food and pastry options, introduce loyalty programs, expand into catering and wholesale, offer seasonal specials, and extend operating hours to capture more dayparts." },
  ],
  formula: "Daily Revenue = (Drinks Sold x Avg Drink Price) + (Food Items x Avg Food Price)
Monthly Revenue = Daily Revenue x Days Open
Average Ticket = Daily Revenue / Total Items Sold",
};
