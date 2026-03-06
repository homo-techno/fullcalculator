import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const travelDailyBudgetCalculator: CalculatorDefinition = {
  slug: "travel-daily-budget-calculator",
  title: "Travel Daily Budget Calculator",
  description: "Plan your daily travel budget by destination cost level, travel style, and trip length to estimate total trip expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["travel daily budget","trip cost planner","per diem travel","vacation daily spend"],
  variants: [{
    id: "standard",
    name: "Travel Daily Budget",
    description: "Plan your daily travel budget by destination cost level, travel style, and trip length to estimate total trip expenses.",
    fields: [
      { name: "costLevel", label: "Destination Cost Level", type: "select", options: [{ value: "1", label: "Budget (SE Asia, Central America)" }, { value: "2", label: "Moderate (Eastern Europe, Mexico)" }, { value: "3", label: "Average (US, Spain, Italy)" }, { value: "4", label: "Expensive (UK, Japan, Australia)" }, { value: "5", label: "Very Expensive (Switzerland, Norway)" }], defaultValue: "3" },
      { name: "travelStyle", label: "Travel Style", type: "select", options: [{ value: "1", label: "Backpacker" }, { value: "2", label: "Mid-Range" }, { value: "3", label: "Luxury" }], defaultValue: "2" },
      { name: "tripDays", label: "Trip Length (days)", type: "number", min: 1, max: 365, defaultValue: 10 },
      { name: "travelers", label: "Number of Travelers", type: "number", min: 1, max: 10, defaultValue: 2 },
    ],
    calculate: (inputs) => {
    const costLevel = parseInt(inputs.costLevel as string);
    const travelStyle = parseInt(inputs.travelStyle as string);
    const tripDays = inputs.tripDays as number;
    const travelers = inputs.travelers as number;
    const baseCosts = [25, 50, 100, 150, 200];
    const styleMult = [0.6, 1.0, 2.5];
    const dailyCostPP = baseCosts[costLevel - 1] * styleMult[travelStyle - 1];
    const dailyTotal = dailyCostPP * travelers;
    const tripTotal = dailyTotal * tripDays;
    const accommodation = Math.round(dailyCostPP * 0.4 * 100) / 100;
    const food = Math.round(dailyCostPP * 0.3 * 100) / 100;
    const transport = Math.round(dailyCostPP * 0.15 * 100) / 100;
    const activities = Math.round(dailyCostPP * 0.15 * 100) / 100;
    return {
      primary: { label: "Total Trip Cost", value: "$" + formatNumber(Math.round(tripTotal)) },
      details: [
        { label: "Daily Per Person", value: "$" + formatNumber(Math.round(dailyCostPP)) },
        { label: "Accommodation/day/person", value: "$" + formatNumber(accommodation) },
        { label: "Food/day/person", value: "$" + formatNumber(food) },
        { label: "Transport/day/person", value: "$" + formatNumber(transport) },
        { label: "Activities/day/person", value: "$" + formatNumber(activities) }
      ]
    };
  },
  }],
  relatedSlugs: ["travel-budget-calculator","currency-exchange-calculator","hotel-vs-airbnb-calculator"],
  faq: [
    { question: "How much should I budget per day for travel?", answer: "Budget travelers can spend $30 to $50 per day in cheap destinations. Mid-range travelers typically spend $100 to $200 per day in average-cost countries." },
    { question: "What percentage of a travel budget goes to accommodation?", answer: "Accommodation typically accounts for 30 to 50 percent of a daily travel budget, followed by food at 25 to 35 percent." },
    { question: "How can I reduce daily travel costs?", answer: "Stay in hostels or guesthouses, eat local street food, use public transportation, travel in the off-season, and book attractions in advance for discounts." },
  ],
  formula: "Daily Cost Per Person = Base Cost x Style Multiplier; Total Trip Cost = Daily Cost x Travelers x Trip Days",
};
