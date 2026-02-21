import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const travelBudgetCalculator: CalculatorDefinition = {
  slug: "travel-budget-calculator",
  title: "Travel Budget Calculator",
  description:
    "Free travel budget calculator. Estimate your total trip cost by entering daily expenses for hotel, food, transport, activities, and flight costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "travel budget",
    "trip cost",
    "vacation budget",
    "travel expenses",
    "trip planner",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Travel Budget",
      fields: [
        {
          name: "days",
          label: "Number of Days",
          type: "number",
          placeholder: "e.g. 7",
        },
        {
          name: "hotel",
          label: "Daily Hotel Cost ($)",
          type: "number",
          placeholder: "e.g. 150",
        },
        {
          name: "food",
          label: "Daily Food Cost ($)",
          type: "number",
          placeholder: "e.g. 50",
        },
        {
          name: "transport",
          label: "Daily Transport Cost ($)",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "activities",
          label: "Daily Activities Cost ($)",
          type: "number",
          placeholder: "e.g. 40",
        },
        {
          name: "flights",
          label: "Total Flight Cost ($)",
          type: "number",
          placeholder: "e.g. 500",
        },
      ],
      calculate: (inputs) => {
        const days = inputs.days as number;
        const hotel = inputs.hotel as number;
        const food = inputs.food as number;
        const transport = inputs.transport as number;
        const activities = inputs.activities as number;
        const flights = inputs.flights as number;

        if (!days || days <= 0) return null;

        const dailyHotel = hotel || 0;
        const dailyFood = food || 0;
        const dailyTransport = transport || 0;
        const dailyActivities = activities || 0;
        const flightCost = flights || 0;

        const totalHotel = dailyHotel * days;
        const totalFood = dailyFood * days;
        const totalTransport = dailyTransport * days;
        const totalActivities = dailyActivities * days;
        const dailyTotal =
          dailyHotel + dailyFood + dailyTransport + dailyActivities;
        const totalDailyExpenses = dailyTotal * days;
        const totalTripCost = totalDailyExpenses + flightCost;

        return {
          primary: {
            label: "Total Trip Cost",
            value: `$${formatNumber(totalTripCost, 2)}`,
          },
          details: [
            {
              label: "Trip Duration",
              value: `${formatNumber(days, 0)} days`,
            },
            {
              label: "Daily Expenses Total",
              value: `$${formatNumber(dailyTotal, 2)}/day`,
            },
            {
              label: "Hotel Total",
              value: `$${formatNumber(totalHotel, 2)}`,
            },
            {
              label: "Food Total",
              value: `$${formatNumber(totalFood, 2)}`,
            },
            {
              label: "Transport Total",
              value: `$${formatNumber(totalTransport, 2)}`,
            },
            {
              label: "Activities Total",
              value: `$${formatNumber(totalActivities, 2)}`,
            },
            {
              label: "Flights",
              value: `$${formatNumber(flightCost, 2)}`,
            },
            {
              label: "Total Daily Expenses",
              value: `$${formatNumber(totalDailyExpenses, 2)}`,
            },
            {
              label: "Total Trip Cost",
              value: `$${formatNumber(totalTripCost, 2)}`,
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["currency-tip-calculator", "flight-distance-calculator"],
  faq: [
    {
      question: "How is the travel budget calculated?",
      answer:
        "Total trip cost = (daily hotel + daily food + daily transport + daily activities) x number of days + flight cost. Enter each daily expense and the calculator totals everything.",
    },
    {
      question: "What expenses should I include?",
      answer:
        "Include accommodation, meals, local transportation (taxis, metro, car rental), activities and entertainment, and flight or travel costs. Consider adding 10-20% extra for unexpected expenses.",
    },
  ],
  formula:
    "Total = (Hotel/day + Food/day + Transport/day + Activities/day) x Days + Flights.",
};
