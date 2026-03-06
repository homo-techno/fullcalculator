import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const banquetHallRentalCostCalculator: CalculatorDefinition = {
  slug: "banquet-hall-rental-cost-calculator",
  title: "Banquet Hall Rental Cost Calculator",
  description: "Estimate total banquet hall rental costs by entering room size, event duration, catering needs, and additional services like AV equipment and decor.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["banquet hall rental","event venue cost","banquet room pricing","reception hall cost"],
  variants: [{
    id: "standard",
    name: "Banquet Hall Rental Cost",
    description: "Estimate total banquet hall rental costs by entering room size, event duration, catering needs, and additional services like AV equipment and decor.",
    fields: [
      { name: "guestCount", label: "Number of Guests", type: "number", min: 20, max: 2000, defaultValue: 150 },
      { name: "venueType", label: "Venue Type", type: "select", options: [{ value: "1", label: "Basic Hall ($500-1500)" }, { value: "2", label: "Mid-Range Venue ($1500-4000)" }, { value: "3", label: "Upscale Venue ($4000-10000)" }, { value: "4", label: "Luxury Venue ($10000+)" }], defaultValue: "2" },
      { name: "eventHours", label: "Event Duration (hours)", type: "number", min: 1, max: 24, defaultValue: 5 },
      { name: "cateringPerHead", label: "Catering Per Person ($)", type: "number", min: 0, max: 300, defaultValue: 55 },
      { name: "avDecor", label: "AV, Decor and Extras ($)", type: "number", min: 0, max: 50000, defaultValue: 2000 },
    ],
    calculate: (inputs) => {
    const guests = inputs.guestCount as number;
    const venue = parseInt(inputs.venueType as string);
    const hours = inputs.eventHours as number;
    const catering = inputs.cateringPerHead as number;
    const extras = inputs.avDecor as number;
    const venueBase = { 1: 1000, 2: 2750, 3: 7000, 4: 15000 };
    const base = venueBase[venue] || 2750;
    const hourlyExtra = hours > 5 ? (hours - 5) * (base * 0.1) : 0;
    const venueCost = base + hourlyExtra;
    const cateringTotal = guests * catering;
    const grandTotal = venueCost + cateringTotal + extras;
    const perGuestTotal = guests > 0 ? grandTotal / guests : 0;
    return {
      primary: { label: "Total Event Cost", value: "$" + formatNumber(Math.round(grandTotal)) },
      details: [
        { label: "Venue Rental", value: "$" + formatNumber(Math.round(venueCost)) },
        { label: "Total Catering", value: "$" + formatNumber(Math.round(cateringTotal)) },
        { label: "AV, Decor and Extras", value: "$" + formatNumber(Math.round(extras)) },
        { label: "Cost Per Guest", value: "$" + formatNumber(Math.round(perGuestTotal * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["catering-cost-per-head-calculator","buffet-quantity-calculator"],
  faq: [
    { question: "How much does it cost to rent a banquet hall?", answer: "Banquet hall rentals range from $500 to $2,000 for basic community halls, $1,500 to $5,000 for mid-range venues, and $5,000 to $20,000 or more for upscale or luxury venues. Pricing varies by location, day of week, and season." },
    { question: "What is included in a banquet hall rental?", answer: "Basic rentals typically include the space, tables, chairs, and basic cleanup. Upgraded packages may include table linens, place settings, staff, parking, and a bridal suite. Catering, bar, AV, and decor are usually separate." },
    { question: "How do I choose the right size banquet hall?", answer: "Plan for 12 to 15 square feet per seated guest or 6 to 8 square feet for standing receptions. A 200-guest seated dinner needs about 2,500 to 3,000 square feet of dining space plus room for buffet, bar, and dance floor." },
  ],
  formula: "Venue Cost = Base Rental + Extra Hours Charge
Total Catering = Guests x Catering Per Person
Grand Total = Venue Cost + Total Catering + AV/Decor/Extras",
};
