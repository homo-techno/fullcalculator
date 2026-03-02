import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const airportParkingCostCalculator: CalculatorDefinition = {
  slug: "airport-parking-cost-calculator",
  title: "Airport Parking Cost Calculator",
  description: "Compare airport parking costs across different options including economy, garage, valet, and off-site lots.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["airport parking cost","airport parking comparison","long term parking","airport parking rates"],
  variants: [{
    id: "standard",
    name: "Airport Parking Cost",
    description: "Compare airport parking costs across different options including economy, garage, valet, and off-site lots.",
    fields: [
      { name: "tripDays", label: "Trip Length (days)", type: "number", min: 1, max: 60, defaultValue: 7 },
      { name: "economyRate", label: "Economy Lot Daily Rate ($)", type: "number", min: 3, max: 30, defaultValue: 10 },
      { name: "garageRate", label: "Garage Daily Rate ($)", type: "number", min: 10, max: 60, defaultValue: 25 },
      { name: "offSiteRate", label: "Off-Site Lot Daily Rate ($)", type: "number", min: 2, max: 25, defaultValue: 7 },
      { name: "rideshareEach", label: "Rideshare Each Way ($)", type: "number", min: 10, max: 150, defaultValue: 35 },
    ],
    calculate: (inputs) => {
    const tripDays = inputs.tripDays as number;
    const economyRate = inputs.economyRate as number;
    const garageRate = inputs.garageRate as number;
    const offSiteRate = inputs.offSiteRate as number;
    const rideshareEach = inputs.rideshareEach as number;
    const economyTotal = economyRate * tripDays;
    const garageTotal = garageRate * tripDays;
    const offSiteTotal = offSiteRate * tripDays;
    const rideshareTotal = rideshareEach * 2;
    const cheapest = Math.min(economyTotal, garageTotal, offSiteTotal, rideshareTotal);
    const bestOption = cheapest === rideshareTotal ? "Rideshare" : cheapest === offSiteTotal ? "Off-Site Lot" : cheapest === economyTotal ? "Economy Lot" : "Garage";
    return {
      primary: { label: "Best Option", value: bestOption + " - $" + formatNumber(Math.round(cheapest)) },
      details: [
        { label: "Economy Lot", value: "$" + formatNumber(Math.round(economyTotal)) },
        { label: "Garage Parking", value: "$" + formatNumber(Math.round(garageTotal)) },
        { label: "Off-Site Lot", value: "$" + formatNumber(Math.round(offSiteTotal)) },
        { label: "Rideshare (round trip)", value: "$" + formatNumber(Math.round(rideshareTotal)) },
        { label: "Savings vs Garage", value: "$" + formatNumber(Math.round(garageTotal - cheapest)) }
      ]
    };
  },
  }],
  relatedSlugs: ["travel-budget-calculator","commute-cost-calculator","road-trip-cost-calculator"],
  faq: [
    { question: "How much does airport parking cost?", answer: "Airport parking ranges from $5 to $15 per day for economy lots, $15 to $40 per day for covered garages, and $3 to $10 per day for off-site lots with shuttles." },
    { question: "When is rideshare cheaper than parking?", answer: "Rideshare is typically cheaper than parking for trips of 3 days or fewer, especially at airports with expensive parking." },
    { question: "How can I save on airport parking?", answer: "Book online in advance for discounts, use off-site lots with shuttle service, compare rates on apps, or use airport loyalty programs that include free parking perks." },
  ],
  formula: "Option Cost = Daily Rate x Trip Days
Rideshare Cost = Per Trip Rate x 2",
};
