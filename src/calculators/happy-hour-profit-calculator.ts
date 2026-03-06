import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const happyHourProfitCalculator: CalculatorDefinition = {
  slug: "happy-hour-profit-calculator",
  title: "Happy Hour Profit Calculator",
  description: "Analyze the profitability of your happy hour program by comparing discounted pricing, increased volume, and food sales to determine if promotions boost overall profit.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["happy hour profit","drink discount profit","bar promotion analysis","happy hour revenue"],
  variants: [{
    id: "standard",
    name: "Happy Hour Profit",
    description: "Analyze the profitability of your happy hour program by comparing discounted pricing, increased volume, and food sales to determine if promotions boost overall profit.",
    fields: [
      { name: "regularDrinkPrice", label: "Regular Avg Drink Price ($)", type: "number", min: 3, max: 50, defaultValue: 12 },
      { name: "happyHourDiscount", label: "Happy Hour Discount (%)", type: "number", min: 10, max: 60, defaultValue: 30 },
      { name: "regularDrinksPerHour", label: "Drinks Sold Per Hour (Regular)", type: "number", min: 5, max: 500, defaultValue: 25 },
      { name: "happyHourDrinksPerHour", label: "Drinks Sold Per Hour (Happy Hour)", type: "number", min: 5, max: 500, defaultValue: 55 },
      { name: "happyHourDuration", label: "Happy Hour Duration (hours)", type: "number", min: 1, max: 6, defaultValue: 2 },
      { name: "avgFoodPerGuest", label: "Avg Food Spend Per Guest ($)", type: "number", min: 0, max: 50, defaultValue: 8 },
      { name: "pourCostPct", label: "Pour Cost (%)", type: "number", min: 10, max: 40, defaultValue: 22 },
    ],
    calculate: (inputs) => {
    const regPrice = inputs.regularDrinkPrice as number;
    const discount = inputs.happyHourDiscount as number / 100;
    const regDrinks = inputs.regularDrinksPerHour as number;
    const hhDrinks = inputs.happyHourDrinksPerHour as number;
    const duration = inputs.happyHourDuration as number;
    const foodSpend = inputs.avgFoodPerGuest as number;
    const pourCost = inputs.pourCostPct as number / 100;
    const hhPrice = regPrice * (1 - discount);
    const costPerDrink = regPrice * pourCost;
    const regProfitPerHour = regDrinks * (regPrice - costPerDrink);
    const hhDrinkProfit = hhDrinks * (hhPrice - costPerDrink);
    const hhFoodRevenue = hhDrinks * foodSpend * 0.5;
    const hhFoodProfit = hhFoodRevenue * 0.6;
    const hhTotalPerHour = hhDrinkProfit + hhFoodProfit;
    const totalHHProfit = hhTotalPerHour * duration;
    const regularEquiv = regProfitPerHour * duration;
    const netDifference = totalHHProfit - regularEquiv;
    return {
      primary: { label: "Happy Hour Total Profit", value: "$" + formatNumber(Math.round(totalHHProfit)) },
      details: [
        { label: "Happy Hour Drink Price", value: "$" + formatNumber(Math.round(hhPrice * 100) / 100) },
        { label: "HH Drink Profit / Hour", value: "$" + formatNumber(Math.round(hhDrinkProfit)) },
        { label: "HH Food Profit / Hour", value: "$" + formatNumber(Math.round(hhFoodProfit)) },
        { label: "Equivalent Regular Period Profit", value: "$" + formatNumber(Math.round(regularEquiv)) },
        { label: "Net Gain/Loss vs Regular", value: (netDifference >= 0 ? "$" : "-$") + formatNumber(Math.round(Math.abs(netDifference))) }
      ]
    };
  },
  }],
  relatedSlugs: ["bar-pour-cost-calculator","cocktail-recipe-cost-calculator"],
  faq: [
    { question: "Is happy hour profitable for restaurants?", answer: "Happy hour can be very profitable when it drives significantly higher volume and food sales. The key is that increased guest count and food spending offset the lower drink margins. Most successful programs double or triple drink volume." },
    { question: "What is a good happy hour discount?", answer: "Most restaurants offer 20 to 40 percent off drinks and select appetizers during happy hour. Half-price drinks are common. The discount should be enough to drive traffic but not so deep that margins disappear." },
    { question: "How can I maximize happy hour profit?", answer: "Promote high-margin food items alongside drink specials, offer discounted appetizers to increase food attach rate, time happy hour to fill slow periods, limit the discount to well drinks and select beers, and create a fun atmosphere to encourage return visits." },
  ],
  formula: "HH Drink Price = Regular Price x (1 - Discount %)
HH Drink Profit/Hr = HH Drinks/Hr x (HH Price - Cost Per Drink)
Net Gain = Total HH Profit - Equivalent Regular Period Profit",
};
