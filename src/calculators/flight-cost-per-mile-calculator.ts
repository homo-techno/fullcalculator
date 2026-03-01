import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flightCostPerMileCalculator: CalculatorDefinition = {
  slug: "flight-cost-per-mile-calculator",
  title: "Flight Cost Per Mile Calculator",
  description: "Calculate the cost per mile of a flight to compare value across different routes and airlines.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["flight cost per mile","airfare value","flight cost calculator"],
  variants: [{
    id: "standard",
    name: "Flight Cost Per Mile",
    description: "Calculate the cost per mile of a flight to compare value across different routes and airlines.",
    fields: [
      { name: "ticketPrice", label: "Ticket Price", type: "number", prefix: "$", min: 1, max: 50000, defaultValue: 350 },
      { name: "flightDistance", label: "Flight Distance (miles)", type: "number", min: 50, max: 15000, defaultValue: 1500 },
      { name: "baggageFees", label: "Baggage Fees", type: "number", prefix: "$", min: 0, max: 500, defaultValue: 35 },
      { name: "seatUpgrade", label: "Seat Upgrade Fees", type: "number", prefix: "$", min: 0, max: 5000, defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const price = inputs.ticketPrice as number;
      const distance = inputs.flightDistance as number;
      const baggage = inputs.baggageFees as number;
      const upgrade = inputs.seatUpgrade as number;
      if (!price || !distance || distance <= 0) return null;
      const totalCost = price + baggage + upgrade;
      const costPerMile = totalCost / distance;
      const centsPerMile = costPerMile * 100;
      return {
        primary: { label: "Cost Per Mile", value: "$" + formatNumber(Math.round(costPerMile * 1000) / 1000) },
        details: [
          { label: "Cents Per Mile", value: formatNumber(Math.round(centsPerMile * 10) / 10) + " cents" },
          { label: "Total Flight Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
          { label: "Base Ticket Price", value: "$" + formatNumber(Math.round(price * 100) / 100) },
          { label: "Total Fees", value: "$" + formatNumber(Math.round((baggage + upgrade) * 100) / 100) },
        ],
      };
    },
  }],
  relatedSlugs: ["road-trip-cost-calculator","travel-budget-calculator"],
  faq: [
    { question: "What is a good cost per mile for a flight?", answer: "Domestic flights in the US typically range from 10 to 25 cents per mile. International long-haul flights can be as low as 5 to 10 cents per mile. Lower cost per mile generally indicates better value." },
    { question: "How do I find the distance of a flight?", answer: "Use an online flight distance calculator or check the airline booking page. Most booking sites show flight distance, or you can estimate using the great circle distance between airports." },
  ],
  formula: "Cost Per Mile = (Ticket Price + Baggage Fees + Upgrade Fees) / Flight Distance",
};
