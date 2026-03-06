import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tentRentalCostCalculator: CalculatorDefinition = {
  slug: "tent-rental-cost-calculator",
  title: "Tent Rental Cost Calculator",
  description: "Calculate tent rental costs for outdoor events based on guest count, tent style, flooring, sidewalls, and lighting options.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["tent rental cost","event tent rental","wedding tent","outdoor event tent pricing"],
  variants: [{
    id: "standard",
    name: "Tent Rental Cost",
    description: "Calculate tent rental costs for outdoor events based on guest count, tent style, flooring, sidewalls, and lighting options.",
    fields: [
      { name: "guestCount", label: "Number of Guests", type: "number", min: 10, max: 500, defaultValue: 100 },
      { name: "tentStyle", label: "Tent Style", type: "select", options: [{ value: "1", label: "Frame Tent (basic)" }, { value: "1.5", label: "Pole Tent (classic)" }, { value: "2.5", label: "Sailcloth Tent" }, { value: "3", label: "Clear-Span Structure" }], defaultValue: "1.5" },
      { name: "flooring", label: "Flooring", type: "select", options: [{ value: "0", label: "None (grass)" }, { value: "3", label: "Subflooring ($3/sqft)" }, { value: "6", label: "Dance Floor ($6/sqft)" }, { value: "8", label: "Full Flooring ($8/sqft)" }], defaultValue: "3" },
      { name: "sidewalls", label: "Sidewalls", type: "select", options: [{ value: "0", label: "None (open)" }, { value: "200", label: "Standard White ($200)" }, { value: "500", label: "Clear Panels ($500)" }, { value: "800", label: "French Windows ($800)" }], defaultValue: "200" },
      { name: "lighting", label: "Lighting Package", type: "select", options: [{ value: "0", label: "None" }, { value: "300", label: "Basic String Lights ($300)" }, { value: "800", label: "Chandeliers ($800)" }, { value: "1500", label: "Full Design ($1500)" }], defaultValue: "300" },
    ],
    calculate: (inputs) => {
    const guests = inputs.guestCount as number;
    const styleMult = parseFloat(inputs.tentStyle as unknown as string);
    const floorRate = parseFloat(inputs.flooring as unknown as string);
    const sidewalls = parseFloat(inputs.sidewalls as unknown as string);
    const lighting = parseFloat(inputs.lighting as unknown as string);
    const sqftPerGuest = 15;
    const totalSqft = guests * sqftPerGuest;
    const baseCostPerSqft = 2;
    const tentCost = totalSqft * baseCostPerSqft * styleMult;
    const flooringCost = totalSqft * floorRate;
    const total = tentCost + flooringCost + sidewalls + lighting;
    const delivery = total * 0.1;
    const grandTotal = total + delivery;
    return {
      primary: { label: "Total Tent Rental Cost", value: "$" + formatNumber(Math.round(grandTotal)) },
      details: [
        { label: "Tent Rental", value: "$" + formatNumber(Math.round(tentCost)) },
        { label: "Flooring", value: "$" + formatNumber(Math.round(flooringCost)) },
        { label: "Sidewalls", value: "$" + formatNumber(sidewalls) },
        { label: "Lighting", value: "$" + formatNumber(lighting) },
        { label: "Delivery/Setup (10%)", value: "$" + formatNumber(Math.round(delivery)) },
        { label: "Total Square Footage", value: formatNumber(totalSqft) + " sqft" }
      ]
    };
  },
  }],
  relatedSlugs: ["event-tent-size-calculator","reception-venue-cost-calculator","event-lighting-cost-calculator"],
  faq: [
    { question: "How much does a tent rental cost for a wedding?", answer: "Wedding tent rentals range from $1,000 to $10,000 depending on size and style. A standard pole tent for 100 guests costs $2,000 to $4,000. Sailcloth and clear-span tents cost significantly more." },
    { question: "How much space do you need per guest in a tent?", answer: "Plan for 12-15 square feet per guest for seated dinner with a dance floor. Cocktail-style events need about 8-10 square feet per guest." },
    { question: "Do you need a permit for a tent at a wedding?", answer: "Many municipalities require permits for tents over a certain size (often 200+ square feet). Check with your local building department well in advance." },
  ],
  formula: "Tent Area = Guests x 15 sqft; Tent Cost = Area x BaseCostPerSqft x StyleMultiplier; Total = TentCost + Flooring + Sidewalls + Lighting + Delivery",
};
