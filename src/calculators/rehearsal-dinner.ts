import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rehearsalDinnerCalculator: CalculatorDefinition = {
  slug: "rehearsal-dinner",
  title: "Rehearsal Dinner Budget Calculator",
  description: "Free rehearsal dinner budget calculator. Plan your rehearsal dinner costs including venue, food, drinks, and decorations.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["rehearsal dinner", "rehearsal dinner budget", "wedding rehearsal", "pre-wedding dinner", "rehearsal dinner cost"],
  variants: [
    {
      id: "standard",
      name: "Standard Budget",
      fields: [
        { name: "guestCount", label: "Number of Guests", type: "number", placeholder: "e.g. 40" },
        { name: "venueType", label: "Venue Type", type: "select", options: [
          { label: "Restaurant (private room)", value: "restaurant" },
          { label: "Event Venue", value: "venue" },
          { label: "Home/Backyard", value: "home" },
          { label: "Casual (BBQ, pizza)", value: "casual" },
        ] },
        { name: "costPerPerson", label: "Food & Drink Per Person ($)", type: "number", placeholder: "e.g. 65" },
        { name: "venueRental", label: "Venue Rental Fee ($)", type: "number", placeholder: "e.g. 500" },
        { name: "decorations", label: "Decorations ($)", type: "number", placeholder: "e.g. 200" },
        { name: "gratuity", label: "Gratuity (%)", type: "number", placeholder: "e.g. 20" },
      ],
      calculate: (inputs) => {
        const guestCount = (inputs.guestCount as number) || 0;
        const costPerPerson = (inputs.costPerPerson as number) || 65;
        const venueRental = (inputs.venueRental as number) || 0;
        const decorations = (inputs.decorations as number) || 0;
        const gratuity = (inputs.gratuity as number) || 20;
        if (guestCount <= 0) return null;
        const foodDrinkTotal = guestCount * costPerPerson;
        const gratuityAmount = foodDrinkTotal * (gratuity / 100);
        const totalCost = foodDrinkTotal + venueRental + decorations + gratuityAmount;
        const perPersonTotal = totalCost / guestCount;
        return {
          primary: { label: "Total Rehearsal Dinner Cost", value: "$" + formatNumber(totalCost, 2) },
          details: [
            { label: "Food & Drinks", value: "$" + formatNumber(foodDrinkTotal, 2) },
            { label: "Venue Rental", value: "$" + formatNumber(venueRental, 2) },
            { label: "Decorations", value: "$" + formatNumber(decorations, 2) },
            { label: "Gratuity", value: "$" + formatNumber(gratuityAmount, 2) },
            { label: "Cost Per Person", value: "$" + formatNumber(perPersonTotal, 2) },
            { label: "Guest Count", value: formatNumber(guestCount) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["catering-quantity", "wedding-guest-list", "wedding-drink"],
  faq: [
    { question: "How much does a rehearsal dinner cost?", answer: "Rehearsal dinners typically cost $1,500-$5,000 for 30-50 guests, or about $40-$100 per person depending on the venue and menu." },
    { question: "Who should be invited to the rehearsal dinner?", answer: "Traditionally, the rehearsal dinner includes the wedding party, their partners, immediate family, officiant, and out-of-town guests. The guest list is typically 30-50 people." },
  ],
  formula: "Total = (Guests x Cost Per Person) + Venue + Decorations + Gratuity",
};
