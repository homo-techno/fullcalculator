import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const concertBudgetCalculator: CalculatorDefinition = {
  slug: "concert-budget-calculator",
  title: "Concert Budget Calculator",
  description: "Plan your total concert trip budget including tickets, travel, food, and merchandise.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["concert budget", "concert trip cost", "concert expense planner"],
  variants: [{
    id: "standard",
    name: "Concert Budget",
    description: "Plan your total concert trip budget including tickets, travel, food, and merchandise",
    fields: [
      { name: "ticketCost", label: "Ticket Cost", type: "number", prefix: "$", min: 10, max: 2000, defaultValue: 120 },
      { name: "people", label: "Number of People", type: "number", suffix: "people", min: 1, max: 10, defaultValue: 2 },
      { name: "travelCost", label: "Travel Cost (Round Trip)", type: "number", prefix: "$", min: 0, max: 2000, defaultValue: 50 },
      { name: "extras", label: "Food and Merchandise Budget", type: "number", prefix: "$", min: 0, max: 500, defaultValue: 60 },
    ],
    calculate: (inputs) => {
      const ticket = inputs.ticketCost as number;
      const people = inputs.people as number;
      const travel = inputs.travelCost as number;
      const extras = inputs.extras as number;
      if (!people || people <= 0) return null;
      const ticketsTotal = ticket * people;
      const extrasTotal = extras * people;
      const totalCost = ticketsTotal + travel + extrasTotal;
      const perPerson = totalCost / people;
      return {
        primary: { label: "Total Concert Budget", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
        details: [
          { label: "Tickets Total", value: "$" + formatNumber(Math.round(ticketsTotal * 100) / 100) },
          { label: "Cost per Person", value: "$" + formatNumber(Math.round(perPerson * 100) / 100) },
          { label: "Travel + Extras", value: "$" + formatNumber(Math.round((travel + extrasTotal) * 100) / 100) },
        ],
      };
    },
  }],
  relatedSlugs: ["movie-night-cost-calculator", "theme-park-budget-calculator"],
  faq: [
    { question: "How much should I budget for a concert?", answer: "Budget for the ticket price plus 30 to 50 percent more for parking, food, drinks, and merchandise. A typical concert outing costs $80 to $200 per person." },
    { question: "How can I save money on concert tickets?", answer: "Buy tickets early during presale events, use credit card reward points, check resale sites close to the event date, and consider lawn or general admission seats." },
  ],
  formula: "Total Budget = (Ticket Cost x People) + Travel Cost + (Extras x People)",
};
