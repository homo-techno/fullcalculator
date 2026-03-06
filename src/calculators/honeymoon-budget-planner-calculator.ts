import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const honeymoonBudgetPlannerCalculator: CalculatorDefinition = {
  slug: "honeymoon-budget-planner-calculator",
  title: "Honeymoon Budget Planner Calculator",
  description: "Plan and estimate your honeymoon budget including flights, accommodation, meals, activities, and spending money.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["honeymoon budget","honeymoon cost","honeymoon planning","travel budget wedding"],
  variants: [{
    id: "standard",
    name: "Honeymoon Budget Planner",
    description: "Plan and estimate your honeymoon budget including flights, accommodation, meals, activities, and spending money.",
    fields: [
      { name: "nights", label: "Number of Nights", type: "number", min: 1, max: 30, defaultValue: 7 },
      { name: "flightCost", label: "Flights (both people, $)", type: "number", min: 0, max: 10000, defaultValue: 1500 },
      { name: "hotelPerNight", label: "Hotel Per Night ($)", type: "number", min: 50, max: 2000, defaultValue: 250 },
      { name: "mealsPerDay", label: "Meals Per Day (both, $)", type: "number", min: 20, max: 500, defaultValue: 120 },
      { name: "activitiesPerDay", label: "Activities Per Day ($)", type: "number", min: 0, max: 500, defaultValue: 80 },
      { name: "spendingMoney", label: "Shopping/Souvenirs ($)", type: "number", min: 0, max: 5000, defaultValue: 500 },
    ],
    calculate: (inputs) => {
    const nights = inputs.nights as number;
    const flights = inputs.flightCost as number;
    const hotel = inputs.hotelPerNight as number;
    const meals = inputs.mealsPerDay as number;
    const activities = inputs.activitiesPerDay as number;
    const shopping = inputs.spendingMoney as number;
    const totalHotel = nights * hotel;
    const totalMeals = nights * meals;
    const totalActivities = nights * activities;
    const total = flights + totalHotel + totalMeals + totalActivities + shopping;
    const perDay = total / nights;
    return {
      primary: { label: "Total Honeymoon Budget", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Flights", value: "$" + formatNumber(flights) },
        { label: "Accommodation", value: "$" + formatNumber(Math.round(totalHotel)) },
        { label: "Meals", value: "$" + formatNumber(Math.round(totalMeals)) },
        { label: "Activities", value: "$" + formatNumber(Math.round(totalActivities)) },
        { label: "Shopping/Souvenirs", value: "$" + formatNumber(shopping) },
        { label: "Average Per Day", value: "$" + formatNumber(Math.round(perDay)) }
      ]
    };
  },
  }],
  relatedSlugs: ["wedding-budget-calculator","destination-wedding-savings-calculator","anniversary-gift-budget-calculator"],
  faq: [
    { question: "How much does the average honeymoon cost?", answer: "The average honeymoon costs $4,000 to $5,000 for a domestic trip and $5,000 to $10,000 for an international destination. Luxury honeymoons can exceed $15,000." },
    { question: "How long should a honeymoon be?", answer: "Most honeymoons last 7 to 10 days. Some couples opt for a mini-moon of 3-4 days after the wedding and take a longer trip later." },
    { question: "When should you book your honeymoon?", answer: "Book flights and hotels 6-9 months in advance for the best rates. Popular destinations during peak season should be booked even earlier." },
  ],
  formula: "Total = Flights + (Nights x HotelPerNight) + (Nights x MealsPerDay) + (Nights x ActivitiesPerDay) + Shopping; Average Per Day = Total / Nights",
};
