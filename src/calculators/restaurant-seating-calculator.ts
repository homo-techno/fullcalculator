import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const restaurantSeatingCalculator: CalculatorDefinition = {
  slug: "restaurant-seating-calculator",
  title: "Restaurant Seating Calculator",
  description: "Plan restaurant seating capacity from floor area.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["restaurant seating","restaurant capacity calculator"],
  variants: [{
    id: "standard",
    name: "Restaurant Seating",
    description: "Plan restaurant seating capacity from floor area.",
    fields: [
      { name: "diningArea", label: "Dining Area (sq ft)", type: "number", min: 100, max: 20000, defaultValue: 1500 },
      { name: "serviceType", label: "Service Type", type: "select", options: [{ value: "12", label: "Fast Casual (12 sqft/seat)" }, { value: "15", label: "Casual Dining (15 sqft/seat)" }, { value: "20", label: "Fine Dining (20 sqft/seat)" }], defaultValue: "15" },
      { name: "barSeats", label: "Bar Seats", type: "number", min: 0, max: 50, defaultValue: 8 },
      { name: "avgCheck", label: "Average Check ($)", type: "number", min: 5, max: 200, defaultValue: 25 },
    ],
    calculate: (inputs) => {
      const area = inputs.diningArea as number;
      const sqPerSeat = Number(inputs.serviceType as number);
      const bar = inputs.barSeats as number;
      const check = inputs.avgCheck as number;
      if (!area || !sqPerSeat) return null;
      const diningSeats = Math.floor(area / sqPerSeat);
      const totalSeats = diningSeats + bar;
      const turnsPerDay = sqPerSeat <= 12 ? 4 : sqPerSeat <= 15 ? 2.5 : 1.5;
      const dailyRevenue = Math.round(totalSeats * turnsPerDay * check);
      return {
        primary: { label: "Total Seating Capacity", value: formatNumber(totalSeats) + " seats" },
        details: [
          { label: "Dining Seats", value: formatNumber(diningSeats) },
          { label: "Estimated Daily Revenue", value: "$" + formatNumber(dailyRevenue) },
          { label: "Table Turns Per Day", value: formatNumber(turnsPerDay) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How much space per restaurant seat?", answer: "Allow 12 to 15 square feet per seat for casual dining and 18 to 20 for fine dining." },
    { question: "What is a good table turn rate?", answer: "Casual restaurants average 2 to 3 turns per meal period." },
  ],
  formula: "Seats = Floor Area / Sq Ft Per Seat + Bar Seats",
};
