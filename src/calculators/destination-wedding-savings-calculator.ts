import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const destinationWeddingSavingsCalculator: CalculatorDefinition = {
  slug: "destination-wedding-savings-calculator",
  title: "Destination Wedding Savings Calculator",
  description: "Compare the cost of a local wedding versus a destination wedding including travel, venue, guest expenses, and potential savings.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["destination wedding cost","destination vs local wedding","wedding abroad cost","travel wedding savings"],
  variants: [{
    id: "standard",
    name: "Destination Wedding Savings",
    description: "Compare the cost of a local wedding versus a destination wedding including travel, venue, guest expenses, and potential savings.",
    fields: [
      { name: "localCost", label: "Estimated Local Wedding Cost ($)", type: "number", min: 5000, max: 200000, defaultValue: 35000 },
      { name: "destVenueCost", label: "Destination Venue Package ($)", type: "number", min: 2000, max: 100000, defaultValue: 12000 },
      { name: "coupleFlights", label: "Couple Flight Cost ($)", type: "number", min: 200, max: 10000, defaultValue: 1500 },
      { name: "guestsLocal", label: "Local Wedding Guest Count", type: "number", min: 20, max: 500, defaultValue: 150 },
      { name: "guestsDest", label: "Destination Guest Count", type: "number", min: 5, max: 200, defaultValue: 40 },
      { name: "destPerGuestCost", label: "Destination Per-Guest Cost ($)", type: "number", min: 50, max: 500, defaultValue: 150 },
      { name: "extraTravel", label: "Additional Travel Costs ($)", type: "number", min: 0, max: 20000, defaultValue: 3000 },
    ],
    calculate: (inputs) => {
    const localCost = inputs.localCost as number;
    const destVenue = inputs.destVenueCost as number;
    const flights = inputs.coupleFlights as number;
    const guestsLocal = inputs.guestsLocal as number;
    const guestsDest = inputs.guestsDest as number;
    const destPerGuest = inputs.destPerGuestCost as number;
    const extraTravel = inputs.extraTravel as number;
    const destGuestCost = guestsDest * destPerGuest;
    const destTotal = destVenue + flights + destGuestCost + extraTravel;
    const savings = localCost - destTotal;
    const localPerGuest = localCost / guestsLocal;
    const destPerGuestTotal = destTotal / guestsDest;
    return {
      primary: { label: "Destination Wedding Cost", value: "$" + formatNumber(Math.round(destTotal)) },
      details: [
        { label: "Local Wedding Cost", value: "$" + formatNumber(localCost) },
        { label: "Savings with Destination", value: "$" + formatNumber(Math.round(savings)) },
        { label: "Destination Per Guest", value: "$" + formatNumber(Math.round(destPerGuestTotal)) },
        { label: "Local Per Guest", value: "$" + formatNumber(Math.round(localPerGuest)) },
        { label: "Guest Reduction", value: formatNumber(guestsLocal - guestsDest) + " fewer guests" }
      ]
    };
  },
  }],
  relatedSlugs: ["wedding-budget-calculator","honeymoon-budget-planner-calculator","reception-venue-cost-calculator"],
  faq: [
    { question: "Is a destination wedding cheaper than a local one?", answer: "Destination weddings can be 30-50% cheaper than local weddings primarily because fewer guests attend. The smaller guest list significantly reduces catering and venue costs." },
    { question: "How many guests attend a destination wedding?", answer: "On average, 50-70% of invited guests attend a destination wedding compared to 80-90% for a local wedding. Most destination weddings have 30-50 guests." },
    { question: "Who pays for travel to a destination wedding?", answer: "Guests typically pay for their own travel and accommodation. Some couples help by negotiating group hotel rates or covering welcome dinner costs." },
  ],
  formula: "Destination Total = VenuePackage + Flights + (DestGuests x PerGuestCost) + TravelCosts
Savings = LocalCost - DestinationTotal",
};
