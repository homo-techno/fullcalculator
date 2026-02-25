import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const travelBudgetDaily: CalculatorDefinition = {
  slug: "travel-budget-daily",
  title: "Daily Travel Budget Calculator",
  description:
    "Free online daily travel budget calculator. Calculate your daily travel budget by destination and travel style to plan your trip finances.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "travel budget",
    "daily budget",
    "trip budget",
    "travel cost",
    "vacation budget",
  ],
  variants: [
    {
      id: "daily-budget",
      name: "Calculate Daily Travel Budget",
      fields: [
        {
          name: "destination",
          label: "Destination",
          type: "select",
          options: [
            { label: "Western Europe", value: "weurope" },
            { label: "Eastern Europe", value: "eeurope" },
            { label: "Southeast Asia", value: "seasia" },
            { label: "Japan / South Korea", value: "eastasia" },
            { label: "Australia / New Zealand", value: "aunz" },
            { label: "Central America", value: "camerica" },
            { label: "South America", value: "samerica" },
            { label: "North Africa / Middle East", value: "mena" },
            { label: "Sub-Saharan Africa", value: "ssafrica" },
            { label: "India / South Asia", value: "sasia" },
            { label: "United States / Canada", value: "namerica" },
          ],
        },
        {
          name: "travelStyle",
          label: "Travel Style",
          type: "select",
          options: [
            { label: "Budget Backpacker", value: "budget" },
            { label: "Comfortable Mid-Range", value: "midrange" },
            { label: "Upscale / Luxury", value: "luxury" },
          ],
        },
        {
          name: "days",
          label: "Number of Days",
          type: "number",
          placeholder: "e.g. 14",
        },
        {
          name: "travelers",
          label: "Number of Travelers",
          type: "number",
          placeholder: "e.g. 2",
        },
      ],
      calculate: (inputs) => {
        const days = parseFloat(inputs.days as string) || 0;
        const travelers = parseFloat(inputs.travelers as string) || 1;
        const destination = inputs.destination as string;
        const travelStyle = inputs.travelStyle as string;

        // Daily per-person costs: [budget, midrange, luxury]
        const dailyCosts: Record<string, number[]> = {
          weurope: [60, 150, 350],
          eeurope: [30, 80, 200],
          seasia: [20, 60, 180],
          eastasia: [50, 120, 300],
          aunz: [60, 140, 320],
          camerica: [25, 65, 170],
          samerica: [30, 75, 200],
          mena: [35, 90, 250],
          ssafrica: [30, 80, 220],
          sasia: [15, 50, 150],
          namerica: [60, 150, 350],
        };

        const styleIndex = travelStyle === "budget" ? 0 : travelStyle === "midrange" ? 1 : 2;
        const dailyPerPerson = (dailyCosts[destination] || dailyCosts.weurope)[styleIndex];
        const dailyTotal = dailyPerPerson * travelers;
        const tripTotal = dailyTotal * days;

        // Breakdown percentages
        const accommodation = dailyPerPerson * 0.35;
        const food = dailyPerPerson * 0.25;
        const transport = dailyPerPerson * 0.20;
        const activities = dailyPerPerson * 0.15;
        const misc = dailyPerPerson * 0.05;

        return {
          primary: { label: "Total Trip Budget", value: "$" + formatNumber(tripTotal, 2) },
          details: [
            { label: "Daily per Person", value: "$" + formatNumber(dailyPerPerson, 2) },
            { label: "Daily Total (all travelers)", value: "$" + formatNumber(dailyTotal, 2) },
            { label: "Accommodation/day/person", value: "$" + formatNumber(accommodation, 2) + " (35%)" },
            { label: "Food/day/person", value: "$" + formatNumber(food, 2) + " (25%)" },
            { label: "Transport/day/person", value: "$" + formatNumber(transport, 2) + " (20%)" },
            { label: "Activities/day/person", value: "$" + formatNumber(activities, 2) + " (15%)" },
            { label: "Miscellaneous/day/person", value: "$" + formatNumber(misc, 2) + " (5%)" },
          ],
          note: "Add 10-15% buffer for unexpected expenses. Flights not included.",
        };
      },
    },
  ],
  relatedSlugs: ["backpacking-cost", "beach-vacation-cost", "road-trip-cost"],
  faq: [
    {
      question: "How much should I budget per day for travel?",
      answer:
        "Daily budgets vary widely: $15-30 for budget travel in Southeast Asia, $60-150 for mid-range travel in Europe, and $150-350+ for luxury travel. The destination and travel style are the biggest factors.",
    },
    {
      question: "What percentage of my budget goes to each category?",
      answer:
        "A typical breakdown is 35% accommodation, 25% food, 20% local transport, 15% activities/entertainment, and 5% miscellaneous (tips, toiletries, SIM cards, etc.).",
    },
    {
      question: "Should I budget extra for emergencies?",
      answer:
        "Yes, add a 10-15% buffer to your total budget for unexpected expenses like medical costs, lost items, transportation delays, or spontaneous activities.",
    },
  ],
  formula:
    "Total Budget = Daily per Person x Travelers x Days\nBreakdown: 35% accommodation, 25% food, 20% transport, 15% activities, 5% misc",
};
