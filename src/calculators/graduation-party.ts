import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const graduationPartyCalculator: CalculatorDefinition = {
  slug: "graduation-party",
  title: "Graduation Party Budget Calculator",
  description: "Free graduation party budget calculator. Plan your graduation celebration expenses including food, venue, decorations, and entertainment.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["graduation party", "graduation budget", "grad party cost", "graduation celebration", "party planning"],
  variants: [
    {
      id: "detailed",
      name: "Detailed Budget",
      fields: [
        { name: "guestCount", label: "Number of Guests", type: "number", placeholder: "e.g. 50" },
        { name: "venueType", label: "Venue Type", type: "select", options: [
          { label: "Home/Backyard", value: "home" },
          { label: "Restaurant", value: "restaurant" },
          { label: "Event Hall", value: "hall" },
          { label: "Park Pavilion", value: "park" },
        ] },
        { name: "foodPerPerson", label: "Food Per Person ($)", type: "number", placeholder: "e.g. 20" },
        { name: "drinkPerPerson", label: "Drinks Per Person ($)", type: "number", placeholder: "e.g. 5" },
        { name: "cakeCost", label: "Cake/Desserts ($)", type: "number", placeholder: "e.g. 100" },
        { name: "decorations", label: "Decorations ($)", type: "number", placeholder: "e.g. 200" },
        { name: "entertainment", label: "Entertainment/Music ($)", type: "number", placeholder: "e.g. 150" },
        { name: "photoSetup", label: "Photo Booth/Setup ($)", type: "number", placeholder: "e.g. 100" },
        { name: "invitations", label: "Invitations/Announcements ($)", type: "number", placeholder: "e.g. 75" },
      ],
      calculate: (inputs) => {
        const guestCount = (inputs.guestCount as number) || 0;
        const venueType = (inputs.venueType as string) || "home";
        const foodPerPerson = (inputs.foodPerPerson as number) || 20;
        const drinkPerPerson = (inputs.drinkPerPerson as number) || 5;
        const cakeCost = (inputs.cakeCost as number) || 0;
        const decorations = (inputs.decorations as number) || 0;
        const entertainment = (inputs.entertainment as number) || 0;
        const photoSetup = (inputs.photoSetup as number) || 0;
        const invitations = (inputs.invitations as number) || 0;
        if (guestCount <= 0) return null;
        const venueCost = venueType === "restaurant" ? guestCount * 15 : venueType === "hall" ? 500 : venueType === "park" ? 75 : 0;
        const foodTotal = guestCount * foodPerPerson;
        const drinkTotal = guestCount * drinkPerPerson;
        const totalCost = venueCost + foodTotal + drinkTotal + cakeCost + decorations + entertainment + photoSetup + invitations;
        const perGuest = totalCost / guestCount;
        return {
          primary: { label: "Total Party Budget", value: "$" + formatNumber(totalCost, 2) },
          details: [
            { label: "Venue", value: "$" + formatNumber(venueCost, 2) },
            { label: "Food", value: "$" + formatNumber(foodTotal, 2) },
            { label: "Drinks", value: "$" + formatNumber(drinkTotal, 2) },
            { label: "Cake/Desserts", value: "$" + formatNumber(cakeCost, 2) },
            { label: "Decorations", value: "$" + formatNumber(decorations, 2) },
            { label: "Entertainment", value: "$" + formatNumber(entertainment, 2) },
            { label: "Photo Setup", value: "$" + formatNumber(photoSetup, 2) },
            { label: "Invitations", value: "$" + formatNumber(invitations, 2) },
            { label: "Cost Per Guest", value: "$" + formatNumber(perGuest, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["baby-shower-budget", "catering-quantity", "party-balloon"],
  faq: [
    { question: "How much does a graduation party cost?", answer: "Graduation parties typically cost $500-$3,000 depending on guest count and venue. A home BBQ for 50 guests might cost $500-$1,000, while a catered event could be $2,000-$5,000." },
    { question: "How many people should you invite to a graduation party?", answer: "Most graduation parties have 30-75 guests including family, friends, and classmates. Open house style events may have more guests cycling through." },
  ],
  formula: "Total = Venue + (Food + Drinks) x Guests + Cake + Decorations + Entertainment + Photos + Invitations",
};
