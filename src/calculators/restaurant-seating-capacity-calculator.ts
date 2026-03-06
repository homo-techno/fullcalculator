import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const restaurantSeatingCapacityCalculator: CalculatorDefinition = {
  slug: "restaurant-seating-capacity-calculator",
  title: "Restaurant Seating Capacity Calculator",
  description: "Calculate the optimal seating capacity for your restaurant based on total dining area, service style, and local code requirements for aisle and spacing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["restaurant seating capacity","dining room layout","restaurant seats per square foot","restaurant floor plan"],
  variants: [{
    id: "standard",
    name: "Restaurant Seating Capacity",
    description: "Calculate the optimal seating capacity for your restaurant based on total dining area, service style, and local code requirements for aisle and spacing.",
    fields: [
      { name: "diningArea", label: "Dining Area (sq ft)", type: "number", min: 100, max: 50000, defaultValue: 2000 },
      { name: "serviceStyle", label: "Service Style", type: "select", options: [{ value: "1", label: "Fast Food / Counter (12 sq ft/seat)" }, { value: "2", label: "Fast Casual (15 sq ft/seat)" }, { value: "3", label: "Full Service (18 sq ft/seat)" }, { value: "4", label: "Fine Dining (22 sq ft/seat)" }], defaultValue: "3" },
      { name: "avgPartySize", label: "Average Party Size", type: "number", min: 1, max: 12, defaultValue: 3 },
      { name: "turnsPerService", label: "Table Turns Per Service", type: "number", min: 1, max: 8, defaultValue: 2 },
    ],
    calculate: (inputs) => {
    const area = inputs.diningArea as number;
    const style = parseInt(inputs.serviceStyle as string);
    const partySize = inputs.avgPartySize as number;
    const turns = inputs.turnsPerService as number;
    const sqFtPerSeat = { 1: 12, 2: 15, 3: 18, 4: 22 };
    const perSeat = sqFtPerSeat[style] || 18;
    const maxSeats = Math.floor(area / perSeat);
    const numTables = Math.floor(maxSeats / partySize);
    const guestsPerService = maxSeats * turns;
    const guestsPerDay = guestsPerService * 2;
    return {
      primary: { label: "Maximum Seating Capacity", value: formatNumber(maxSeats) + " seats" },
      details: [
        { label: "Square Feet Per Seat", value: formatNumber(perSeat) + " sq ft" },
        { label: "Estimated Tables", value: formatNumber(numTables) },
        { label: "Guests Per Service (with turns)", value: formatNumber(guestsPerService) },
        { label: "Guests Per Day (lunch + dinner)", value: formatNumber(guestsPerDay) }
      ]
    };
  },
  }],
  relatedSlugs: ["table-turnover-rate-calculator","restaurant-break-even-calculator"],
  faq: [
    { question: "How many square feet per seat does a restaurant need?", answer: "Fast food averages 12 square feet per seat, fast casual 15, full-service restaurants 18, and fine dining 20 to 25 square feet per seat. These figures include aisle space and table clearance." },
    { question: "What is table turn rate?", answer: "Table turn rate is the number of times a table is occupied by different parties during a single meal service. Fast casual restaurants average 3 to 4 turns, full service 1.5 to 2.5 turns, and fine dining 1 to 1.5 turns." },
    { question: "How does seating capacity affect revenue?", answer: "More seats allow more covers per service, but overcrowding reduces guest satisfaction. Optimal seating balances capacity with comfort. Increasing table turns through efficient service is often more profitable than adding seats." },
  ],
  formula: "Max Seats = Dining Area (sq ft) / Sq Ft Per Seat
Estimated Tables = Max Seats / Average Party Size
Guests Per Service = Max Seats x Table Turns",
};
