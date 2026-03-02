import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const concertVenueCapacityCalculator: CalculatorDefinition = {
  slug: "concert-venue-capacity-calculator",
  title: "Concert Venue Capacity Calculator",
  description: "Calculate safe venue capacity, ticket revenue, and staffing needs for live music events.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["venue","capacity","concert","event","live music","safety"],
  variants: [{
    id: "standard",
    name: "Concert Venue Capacity",
    description: "Calculate safe venue capacity, ticket revenue, and staffing needs for live music events.",
    fields: [
      { name: "venueArea", label: "Venue Area (sq ft)", type: "number", min: 200, max: 500000, defaultValue: 5000 },
      { name: "seatingType", label: "Seating Type", type: "select", options: [{ value: "1", label: "General Admission (Standing)" }, { value: "2", label: "Theater Seating" }, { value: "3", label: "Cabaret/Tables" }, { value: "4", label: "Festival (Outdoor)" }], defaultValue: "1" },
      { name: "ticketPrice", label: "Avg Ticket Price ($)", type: "number", min: 5, max: 500, defaultValue: 35 },
      { name: "stageArea", label: "Stage/Production Area (sq ft)", type: "number", min: 50, max: 50000, defaultValue: 500 },
    ],
    calculate: (inputs) => {
    const venueArea = inputs.venueArea as number;
    const seatingType = inputs.seatingType as number;
    const ticketPrice = inputs.ticketPrice as number;
    const stageArea = inputs.stageArea as number;
    const usableArea = venueArea - stageArea;
    const sqftPerPerson = { 1: 5, 2: 7, 3: 12, 4: 6 };
    const capacity = Math.floor(usableArea / sqftPerPerson[seatingType]);
    const grossRevenue = capacity * ticketPrice;
    const securityStaff = Math.ceil(capacity / 100);
    const barStaff = Math.ceil(capacity / 75);
    const totalStaff = securityStaff + barStaff + 2;
    const seatingLabels = { 1: "Standing GA", 2: "Theater", 3: "Cabaret/Tables", 4: "Festival" };
    return {
      primary: { label: "Max Capacity", value: formatNumber(capacity) + " people" },
      details: [
        { label: "Seating Type", value: seatingLabels[seatingType] },
        { label: "Gross Ticket Revenue", value: "$" + formatNumber(grossRevenue) },
        { label: "Security Staff Needed", value: formatNumber(securityStaff) },
        { label: "Total Staff Needed", value: formatNumber(totalStaff) },
        { label: "Usable Area", value: formatNumber(usableArea) + " sq ft" }
      ]
    };
  },
  }],
  relatedSlugs: ["concert-ticket-value-calculator","speaker-wattage-calculator","soundproofing-cost-calculator"],
  faq: [
    { question: "How many square feet per person at a concert?", answer: "Standing general admission needs about 5-6 sq ft per person, seated venues need 7-12 sq ft per person." },
    { question: "How much security do I need for a concert?", answer: "The general guideline is 1 security guard per 100 attendees, with more for high-energy or alcohol-serving events." },
    { question: "What is the maximum occupancy for a venue?", answer: "Maximum occupancy is determined by fire codes, typically based on available floor space minus stage, exits, and aisles." },
  ],
  formula: "Capacity = (Venue Area - Stage Area) / Sq Ft Per Person",
};
