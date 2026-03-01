import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const movieNightCostCalculator: CalculatorDefinition = {
  slug: "movie-night-cost-calculator",
  title: "Movie Night Cost Calculator",
  description: "Compare the cost of going to the theater versus hosting a movie night at home.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["movie night cost", "theater vs home movie", "movie budget calculator"],
  variants: [{
    id: "standard",
    name: "Movie Night Cost",
    description: "Compare the cost of going to the theater versus hosting a movie night at home",
    fields: [
      { name: "people", label: "Number of People", type: "number", suffix: "people", min: 1, max: 20, defaultValue: 4 },
      { name: "ticketPrice", label: "Movie Ticket Price", type: "number", prefix: "$", min: 5, max: 30, defaultValue: 14 },
      { name: "snackBudget", label: "Snack Budget per Person", type: "number", prefix: "$", min: 0, max: 50, defaultValue: 10 },
      { name: "venue", label: "Venue", type: "select", options: [{value:"theater",label:"Movie Theater"},{value:"home",label:"Home Streaming"}], defaultValue: "theater" },
    ],
    calculate: (inputs) => {
      const people = inputs.people as number;
      const ticket = inputs.ticketPrice as number;
      const snack = inputs.snackBudget as number;
      const venue = inputs.venue as string;
      if (!people || people <= 0) return null;
      let totalCost = 0;
      if (venue === "theater") {
        totalCost = (ticket * people) + (snack * people);
      } else {
        const rentalFee = 6;
        const homeSnacks = snack * 0.4 * people;
        totalCost = rentalFee + homeSnacks;
      }
      const costPerPerson = totalCost / people;
      const theaterTotal = (ticket * people) + (snack * people);
      const homeTotal = 6 + (snack * 0.4 * people);
      const savings = theaterTotal - homeTotal;
      return {
        primary: { label: "Total Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
        details: [
          { label: "Cost per Person", value: "$" + formatNumber(Math.round(costPerPerson * 100) / 100) },
          { label: "Theater Cost", value: "$" + formatNumber(Math.round(theaterTotal * 100) / 100) },
          { label: "Home Movie Savings", value: "$" + formatNumber(Math.round(savings * 100) / 100) },
        ],
      };
    },
  }],
  relatedSlugs: ["concert-budget-calculator", "game-night-calculator"],
  faq: [
    { question: "How much does a movie night out typically cost?", answer: "A movie theater outing typically costs $20 to $30 per person when including tickets, popcorn, and drinks. A home movie night usually costs $3 to $5 per person." },
    { question: "What do I need for a home movie night?", answer: "A streaming subscription or rental, comfortable seating, snacks, and good lighting control are the essentials for a great home movie night." },
  ],
  formula: "Total Cost = (Ticket Price x People) + (Snack Budget x People) or Rental Fee + Home Snacks",
};
