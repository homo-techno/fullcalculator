import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const concertTicketValueCalculator: CalculatorDefinition = {
  slug: "concert-ticket-value-calculator",
  title: "Concert Ticket Value Calculator",
  description: "Evaluate whether a concert ticket price offers good value based on show length, artists, and extras.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["concert","ticket","value","entertainment","live music"],
  variants: [{
    id: "standard",
    name: "Concert Ticket Value",
    description: "Evaluate whether a concert ticket price offers good value based on show length, artists, and extras.",
    fields: [
      { name: "ticketPrice", label: "Ticket Price ($)", type: "number", min: 10, max: 5000, defaultValue: 85 },
      { name: "showHours", label: "Expected Show Length (hours)", type: "number", min: 0.5, max: 8, defaultValue: 2.5 },
      { name: "numArtists", label: "Number of Acts", type: "number", min: 1, max: 20, defaultValue: 3 },
      { name: "travelCost", label: "Travel & Parking ($)", type: "number", min: 0, max: 500, defaultValue: 30 },
      { name: "foodDrink", label: "Estimated Food & Drink ($)", type: "number", min: 0, max: 500, defaultValue: 40 },
    ],
    calculate: (inputs) => {
    const ticketPrice = inputs.ticketPrice as number;
    const showHours = inputs.showHours as number;
    const numArtists = inputs.numArtists as number;
    const travelCost = inputs.travelCost as number;
    const foodDrink = inputs.foodDrink as number;
    const totalCost = ticketPrice + travelCost + foodDrink;
    const costPerHour = totalCost / showHours;
    const costPerAct = totalCost / numArtists;
    const costPerMinute = totalCost / (showHours * 60);
    const movieEquivalent = totalCost / 15;
    return {
      primary: { label: "Cost Per Hour of Entertainment", value: "$" + formatNumber(costPerHour) },
      details: [
        { label: "Total Evening Cost", value: "$" + formatNumber(totalCost) },
        { label: "Cost Per Act", value: "$" + formatNumber(costPerAct) },
        { label: "Cost Per Minute", value: "$" + formatNumber(costPerMinute) },
        { label: "Equivalent Movie Tickets", value: formatNumber(movieEquivalent) }
      ]
    };
  },
  }],
  relatedSlugs: ["concert-venue-capacity-calculator","dj-set-time-planner-calculator","music-streaming-revenue-calculator"],
  faq: [
    { question: "How do you determine if a concert ticket is worth it?", answer: "Divide total cost by hours of entertainment. Under $30 per hour is generally good value compared to other entertainment." },
    { question: "What is the average concert ticket price?", answer: "Average concert ticket prices range from $50 to $150, though top artists can command $200 or more." },
    { question: "Should I factor in travel costs?", answer: "Yes, travel, parking, food, and drinks can easily double the cost of attending a concert." },
  ],
  formula: "Cost Per Hour = (Ticket + Travel + Food) / Show Hours",
};
