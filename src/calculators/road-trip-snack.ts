import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const roadTripSnackCalculator: CalculatorDefinition = {
  slug: "road-trip-snack-calculator",
  title: "Road Trip Snack Calculator",
  description:
    "Free road trip snack calculator. Figure out how many snacks, drinks, and meals you need for your road trip based on trip length and number of passengers.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "road trip snacks",
    "road trip food",
    "travel snacks",
    "trip food planning",
    "snack calculator",
    "road trip planner",
  ],
  variants: [
    {
      id: "snack-planner",
      name: "Snack Planner",
      description: "Plan snacks and drinks for your road trip",
      fields: [
        {
          name: "drivingHours",
          label: "Total Driving Hours",
          type: "number",
          placeholder: "e.g. 8",
          min: 1,
          max: 72,
          step: 0.5,
        },
        {
          name: "passengers",
          label: "Number of Passengers (including driver)",
          type: "number",
          placeholder: "e.g. 4",
          min: 1,
          max: 20,
        },
        {
          name: "snackFrequency",
          label: "Snack Frequency",
          type: "select",
          options: [
            { label: "Light (every 3 hours)", value: "3" },
            { label: "Moderate (every 2 hours)", value: "2" },
            { label: "Heavy (every hour)", value: "1" },
          ],
        },
        {
          name: "budgetPerSnack",
          label: "Budget per Snack Item ($)",
          type: "number",
          placeholder: "e.g. 2.00",
          min: 0.5,
          step: 0.25,
          prefix: "$",
          defaultValue: 2,
        },
      ],
      calculate: (inputs) => {
        const hours = inputs.drivingHours as number;
        const passengers = inputs.passengers as number;
        const freqStr = (inputs.snackFrequency as string) || "2";
        const budgetPerSnack = (inputs.budgetPerSnack as number) || 2;

        if (!hours || !passengers) return null;

        const freq = parseFloat(freqStr);
        const snackRounds = Math.ceil(hours / freq);
        const totalSnacks = snackRounds * passengers;

        // Water: 1 bottle per person per 2 hours
        const waterBottles = Math.ceil(hours / 2) * passengers;

        // Meals: 1 meal per 5 hours
        const meals = Math.floor(hours / 5) * passengers;

        const snackCost = totalSnacks * budgetPerSnack;
        const waterCost = waterBottles * 1.5;
        const mealCost = meals * 10;
        const totalCost = snackCost + waterCost + mealCost;

        // Bathroom breaks estimate: every 2-3 hours
        const bathroomBreaks = Math.ceil(hours / 2.5);

        return {
          primary: {
            label: "Total Snack Items",
            value: formatNumber(totalSnacks),
            suffix: "snacks",
          },
          details: [
            { label: "Snack rounds", value: formatNumber(snackRounds) },
            { label: "Snacks per person", value: formatNumber(snackRounds) },
            { label: "Water bottles needed", value: formatNumber(waterBottles) },
            { label: "Meals needed", value: formatNumber(meals) },
            { label: "Snack budget", value: `$${formatNumber(snackCost, 2)}` },
            { label: "Water budget", value: `$${formatNumber(waterCost, 2)}` },
            { label: "Meal budget", value: `$${formatNumber(mealCost, 2)}` },
            { label: "Total food budget", value: `$${formatNumber(totalCost, 2)}` },
            { label: "Estimated bathroom breaks", value: formatNumber(bathroomBreaks) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "road-trip-calculator",
    "gas-cost-trip-calculator",
    "fuel-cost-calculator",
  ],
  faq: [
    {
      question: "How many snacks do I need for a road trip?",
      answer:
        "A good rule of thumb is one snack per person every 2 hours. For a 6-hour trip with 4 people, that is about 12 snacks plus water and any meals.",
    },
    {
      question: "What are the best road trip snacks?",
      answer:
        "Non-messy, non-perishable snacks are ideal: trail mix, granola bars, jerky, crackers, dried fruit, and pretzels. Pack a cooler for fresh items like cheese sticks, grapes, and sandwiches.",
    },
  ],
  formula:
    "Total Snacks = ceil(Hours / Frequency) x Passengers. Water = ceil(Hours / 2) x Passengers. Meals = floor(Hours / 5) x Passengers.",
};
