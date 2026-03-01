import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bowlingCostCalculator: CalculatorDefinition = {
  slug: "bowling-cost-calculator",
  title: "Bowling Cost Calculator",
  description: "Estimate the total cost of a bowling outing including games, shoe rental, and food.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["bowling cost", "bowling night budget", "bowling alley price"],
  variants: [{
    id: "standard",
    name: "Bowling Cost",
    description: "Estimate the total cost of a bowling outing including games, shoe rental, and food",
    fields: [
      { name: "players", label: "Number of Players", type: "number", suffix: "players", min: 1, max: 20, defaultValue: 4 },
      { name: "games", label: "Number of Games", type: "number", suffix: "games", min: 1, max: 10, defaultValue: 3 },
      { name: "pricePerGame", label: "Price per Game per Person", type: "number", prefix: "$", min: 2, max: 15, defaultValue: 5 },
      { name: "foodPerPerson", label: "Food and Drinks per Person", type: "number", prefix: "$", min: 0, max: 50, defaultValue: 12 },
    ],
    calculate: (inputs) => {
      const players = inputs.players as number;
      const games = inputs.games as number;
      const pricePerGame = inputs.pricePerGame as number;
      const food = inputs.foodPerPerson as number;
      if (!players || !games) return null;
      const gamesCost = players * games * pricePerGame;
      const shoeRental = players * 5;
      const foodTotal = players * food;
      const total = gamesCost + shoeRental + foodTotal;
      const perPerson = total / players;
      return {
        primary: { label: "Total Bowling Cost", value: "$" + formatNumber(Math.round(total * 100) / 100) },
        details: [
          { label: "Games Cost", value: "$" + formatNumber(Math.round(gamesCost * 100) / 100) },
          { label: "Shoe Rental", value: "$" + formatNumber(shoeRental) },
          { label: "Cost per Person", value: "$" + formatNumber(Math.round(perPerson * 100) / 100) },
        ],
      };
    },
  }],
  relatedSlugs: ["escape-room-cost-calculator", "movie-night-cost-calculator"],
  faq: [
    { question: "How much does bowling cost per person?", answer: "A typical bowling outing costs $15 to $30 per person for 2 to 3 games including shoe rental. Adding food and drinks can bring the total to $25 to $45 per person." },
    { question: "Is it cheaper to bowl during off-peak hours?", answer: "Yes, many bowling alleys offer discounted rates during weekday afternoons and late-night sessions, often 30 to 50 percent less than peak weekend rates." },
  ],
  formula: "Total = (Players x Games x Price per Game) + (Players x Shoe Rental) + (Players x Food)",
};
