import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const receptionVenueCostCalculator: CalculatorDefinition = {
  slug: "reception-venue-cost-calculator",
  title: "Reception Venue Cost Calculator",
  description: "Estimate reception venue rental costs based on guest count, venue type, hours of rental, and seasonal pricing adjustments.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["reception venue cost","wedding venue rental","venue pricing","event space cost"],
  variants: [{
    id: "standard",
    name: "Reception Venue Cost",
    description: "Estimate reception venue rental costs based on guest count, venue type, hours of rental, and seasonal pricing adjustments.",
    fields: [
      { name: "guestCount", label: "Number of Guests", type: "number", min: 10, max: 500, defaultValue: 150 },
      { name: "venueType", label: "Venue Type", type: "select", options: [{ value: "1", label: "Community Hall" }, { value: "2", label: "Hotel Ballroom" }, { value: "3", label: "Garden/Estate" }, { value: "4", label: "Luxury Resort" }], defaultValue: "2" },
      { name: "rentalHours", label: "Rental Hours", type: "number", min: 2, max: 16, defaultValue: 6 },
      { name: "season", label: "Season", type: "select", options: [{ value: "1", label: "Off-Season (Nov-Mar)" }, { value: "1.3", label: "Peak Season (Jun-Oct)" }, { value: "1.15", label: "Shoulder Season (Apr-May)" }], defaultValue: "1.3" },
    ],
    calculate: (inputs) => {
    const guests = inputs.guestCount as number;
    const venueType = parseFloat(inputs.venueType as unknown as string);
    const hours = inputs.rentalHours as number;
    const seasonMult = parseFloat(inputs.season as unknown as string);
    const baseCosts = { 1: 1500, 2: 4000, 3: 5500, 4: 10000 } as Record<number, number>;
    const baseCost = baseCosts[venueType] || 4000;
    const perGuestFee = venueType * 15;
    const hourlyExtra = hours > 5 ? (hours - 5) * 500 : 0;
    const subtotal = baseCost + (guests * perGuestFee) + hourlyExtra;
    const total = subtotal * seasonMult;
    const perGuest = total / guests;
    return {
      primary: { label: "Estimated Venue Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Base Venue Fee", value: "$" + formatNumber(baseCost) },
        { label: "Guest Surcharge", value: "$" + formatNumber(Math.round(guests * perGuestFee)) },
        { label: "Extra Hours Fee", value: "$" + formatNumber(hourlyExtra) },
        { label: "Seasonal Adjustment", value: (seasonMult * 100 - 100).toFixed(0) + "% markup" },
        { label: "Cost Per Guest", value: "$" + formatNumber(Math.round(perGuest)) }
      ]
    };
  },
  }],
  relatedSlugs: ["wedding-budget-calculator","event-catering-calculator","wedding-guest-calculator"],
  faq: [
    { question: "How much does a wedding reception venue cost?", answer: "Reception venues typically range from $1,500 for a community hall to $15,000 or more for a luxury resort. The average is $5,000 to $10,000 depending on location and guest count." },
    { question: "Does season affect venue pricing?", answer: "Yes. Peak wedding season (June through October) commands 20-40% higher prices. Off-season bookings can save thousands of dollars." },
    { question: "What is included in a venue rental fee?", answer: "Venue fees usually include the space, tables, chairs, basic setup, and a certain number of hours. Catering, decor, and additional hours are often extra." },
  ],
  formula: "Total = (BaseFee + GuestCount x PerGuestFee + ExtraHoursFee) x SeasonMultiplier; Per Guest = Total / GuestCount",
};
