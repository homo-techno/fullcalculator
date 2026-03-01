import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gameNightCalculator: CalculatorDefinition = {
  slug: "game-night-calculator",
  title: "Game Night Calculator",
  description: "Plan your game night hosting costs including snacks, drinks, and supplies for your group.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["game night cost", "game night planner", "hosting game night budget"],
  variants: [{
    id: "standard",
    name: "Game Night",
    description: "Plan your game night hosting costs including snacks, drinks, and supplies for your group",
    fields: [
      { name: "guests", label: "Number of Guests", type: "number", suffix: "guests", min: 2, max: 20, defaultValue: 6 },
      { name: "snackBudget", label: "Snack Budget", type: "number", prefix: "$", min: 5, max: 200, defaultValue: 30 },
      { name: "drinkBudget", label: "Drink Budget", type: "number", prefix: "$", min: 0, max: 200, defaultValue: 25 },
    ],
    calculate: (inputs) => {
      const guests = inputs.guests as number;
      const snacks = inputs.snackBudget as number;
      const drinks = inputs.drinkBudget as number;
      if (!guests || guests <= 0) return null;
      const supplies = 10;
      const total = snacks + drinks + supplies;
      const perGuest = total / guests;
      const splitEvenly = total / (guests + 1);
      return {
        primary: { label: "Total Hosting Cost", value: "$" + formatNumber(Math.round(total * 100) / 100) },
        details: [
          { label: "Cost per Guest (Host Pays All)", value: "$" + formatNumber(Math.round(perGuest * 100) / 100) },
          { label: "Cost if Split Evenly", value: "$" + formatNumber(Math.round(splitEvenly * 100) / 100) + " each" },
          { label: "Supplies Estimate", value: "$" + formatNumber(supplies) },
        ],
      };
    },
  }],
  relatedSlugs: ["movie-night-cost-calculator", "potluck-planner-calculator"],
  faq: [
    { question: "How much does it cost to host a game night?", answer: "A typical game night costs $30 to $60 for snacks and drinks for 4 to 8 guests. Ask guests to bring a dish or drink to reduce costs." },
    { question: "What are good games for game night?", answer: "Popular choices include Codenames, Catan, Ticket to Ride, and Jackbox Party Packs. Choose games that match your group size and experience level." },
  ],
  formula: "Total = Snack Budget + Drink Budget + Supplies",
};
