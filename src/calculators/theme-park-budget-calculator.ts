import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const themeParkBudgetCalculator: CalculatorDefinition = {
  slug: "theme-park-budget-calculator",
  title: "Theme Park Budget Calculator",
  description: "Estimate the total cost of a theme park visit including admission, food, and souvenirs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["theme park budget", "theme park cost", "amusement park budget"],
  variants: [{
    id: "standard",
    name: "Theme Park Budget",
    description: "Estimate the total cost of a theme park visit including admission, food, and souvenirs",
    fields: [
      { name: "adults", label: "Number of Adults", type: "number", suffix: "adults", min: 0, max: 20, defaultValue: 2 },
      { name: "children", label: "Number of Children", type: "number", suffix: "children", min: 0, max: 20, defaultValue: 2 },
      { name: "ticketType", label: "Ticket Type", type: "select", options: [{value:"single",label:"Single Day"},{value:"multi",label:"Multi-Day (2 days)"},{value:"season",label:"Season Pass"}], defaultValue: "single" },
      { name: "foodBudget", label: "Food Budget per Person", type: "number", prefix: "$", min: 10, max: 200, defaultValue: 50 },
    ],
    calculate: (inputs) => {
      const adults = inputs.adults as number;
      const children = inputs.children as number;
      const ticketType = inputs.ticketType as string;
      const food = inputs.foodBudget as number;
      if ((adults + children) <= 0) return null;
      const adultPrices: Record<string, number> = { single: 110, multi: 190, season: 350 };
      const childPrices: Record<string, number> = { single: 85, multi: 150, season: 280 };
      const adultTickets = adults * (adultPrices[ticketType] || 110);
      const childTickets = children * (childPrices[ticketType] || 85);
      const totalPeople = adults + children;
      const foodTotal = food * totalPeople;
      const parking = 30;
      const souvenirs = totalPeople * 20;
      const total = adultTickets + childTickets + foodTotal + parking + souvenirs;
      return {
        primary: { label: "Total Trip Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Admission Total", value: "$" + formatNumber(Math.round(adultTickets + childTickets)) },
          { label: "Food and Souvenirs", value: "$" + formatNumber(Math.round(foodTotal + souvenirs)) },
          { label: "Cost per Person", value: "$" + formatNumber(Math.round(total / totalPeople)) },
        ],
      };
    },
  }],
  relatedSlugs: ["concert-budget-calculator", "zoo-visit-cost-calculator"],
  faq: [
    { question: "How much does a theme park trip cost for a family of 4?", answer: "A typical single-day theme park visit for a family of four costs $500 to $800 including tickets, food, parking, and souvenirs." },
    { question: "Are season passes worth it?", answer: "Season passes are usually worth it if you visit three or more times per year. They often include perks like free parking and discounts on food and merchandise." },
  ],
  formula: "Total = Adult Tickets + Child Tickets + Food + Parking + Souvenirs",
};
