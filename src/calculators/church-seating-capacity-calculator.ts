import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const churchSeatingCapacityCalculator: CalculatorDefinition = {
  slug: "church-seating-capacity-calculator",
  title: "Church Seating Capacity Calculator",
  description: "Estimate church pew seating capacity by room dimensions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["church","seating","pews","capacity"],
  variants: [{
    id: "standard",
    name: "Church Seating Capacity",
    description: "Estimate church pew seating capacity by room dimensions.",
    fields: [
      { name: "roomLength", label: "Room Length (ft)", type: "number", min: 20, max: 500, defaultValue: 80 },
      { name: "roomWidth", label: "Room Width (ft)", type: "number", min: 15, max: 300, defaultValue: 50 },
      { name: "pewLength", label: "Pew Length (ft)", type: "number", min: 6, max: 20, defaultValue: 12 },
      { name: "aisleWidth", label: "Aisle Width (ft)", type: "number", min: 3, max: 10, defaultValue: 5 },
    ],
    calculate: (inputs) => {
    const roomLength = inputs.roomLength as number;
    const roomWidth = inputs.roomWidth as number;
    const pewLength = inputs.pewLength as number;
    const aisleWidth = inputs.aisleWidth as number;
    const usableLength = roomLength * 0.75;
    const rowSpacing = 3;
    const rows = Math.floor(usableLength / rowSpacing);
    const pewsPerRow = Math.floor((roomWidth - aisleWidth) / pewLength);
    const totalPews = rows * pewsPerRow;
    const seatsPerPew = Math.floor(pewLength / 1.8);
    const totalSeats = totalPews * seatsPerPew;
    return { primary: { label: "Total Seating Capacity", value: formatNumber(totalSeats) + " seats" }, details: [{ label: "Number of Rows", value: formatNumber(rows) }, { label: "Pews Per Row", value: formatNumber(pewsPerRow) }, { label: "Total Pews", value: formatNumber(totalPews) }, { label: "Seats Per Pew", value: formatNumber(seatsPerPew) }] };
  },
  }],
  relatedSlugs: ["conference-room-calculator","church-budget-calculator","potluck-food-calculator"],
  faq: [
    { question: "How much space does each person need in a pew?", answer: "About 18 to 22 inches or roughly 1.8 feet per person." },
    { question: "What is standard pew row spacing?", answer: "Rows are typically 33 to 36 inches apart from back to back." },
    { question: "How wide should a church aisle be?", answer: "Main aisles should be at least 4 to 5 feet for fire code compliance." },
  ],
  formula: "TotalSeats = Rows * PewsPerRow * SeatsPerPew; Rows = UsableLength / RowSpacing",
};
