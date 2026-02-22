import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const babyShowerBudgetCalculator: CalculatorDefinition = {
  slug: "baby-shower-budget",
  title: "Baby Shower Budget Calculator",
  description: "Free baby shower budget calculator. Plan your baby shower expenses including venue, food, decorations, games, and favors.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["baby shower", "baby shower budget", "shower planning", "baby shower cost", "party budget"],
  variants: [
    {
      id: "detailed",
      name: "Detailed Budget",
      fields: [
        { name: "guestCount", label: "Number of Guests", type: "number", placeholder: "e.g. 30" },
        { name: "venueType", label: "Venue Type", type: "select", options: [
          { label: "Home/Backyard", value: "home" },
          { label: "Restaurant", value: "restaurant" },
          { label: "Event Space", value: "event" },
          { label: "Park/Outdoor", value: "park" },
        ] },
        { name: "foodPerPerson", label: "Food Per Person ($)", type: "number", placeholder: "e.g. 25" },
        { name: "drinkPerPerson", label: "Drinks Per Person ($)", type: "number", placeholder: "e.g. 8" },
        { name: "decorations", label: "Decorations ($)", type: "number", placeholder: "e.g. 150" },
        { name: "cakeCost", label: "Cake/Desserts ($)", type: "number", placeholder: "e.g. 75" },
        { name: "games", label: "Games & Prizes ($)", type: "number", placeholder: "e.g. 50" },
        { name: "favorCostEach", label: "Favor Cost Per Guest ($)", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const guestCount = (inputs.guestCount as number) || 0;
        const venueType = (inputs.venueType as string) || "home";
        const foodPerPerson = (inputs.foodPerPerson as number) || 25;
        const drinkPerPerson = (inputs.drinkPerPerson as number) || 8;
        const decorations = (inputs.decorations as number) || 0;
        const cakeCost = (inputs.cakeCost as number) || 0;
        const games = (inputs.games as number) || 0;
        const favorCostEach = (inputs.favorCostEach as number) || 0;
        if (guestCount <= 0) return null;
        const venueCost = venueType === "restaurant" ? guestCount * 10 : venueType === "event" ? 300 : venueType === "park" ? 50 : 0;
        const foodTotal = guestCount * foodPerPerson;
        const drinkTotal = guestCount * drinkPerPerson;
        const favorTotal = guestCount * favorCostEach;
        const totalCost = venueCost + foodTotal + drinkTotal + decorations + cakeCost + games + favorTotal;
        const perGuest = totalCost / guestCount;
        return {
          primary: { label: "Total Baby Shower Budget", value: "$" + formatNumber(totalCost, 2) },
          details: [
            { label: "Venue", value: "$" + formatNumber(venueCost, 2) },
            { label: "Food", value: "$" + formatNumber(foodTotal, 2) },
            { label: "Drinks", value: "$" + formatNumber(drinkTotal, 2) },
            { label: "Cake/Desserts", value: "$" + formatNumber(cakeCost, 2) },
            { label: "Decorations", value: "$" + formatNumber(decorations, 2) },
            { label: "Games & Prizes", value: "$" + formatNumber(games, 2) },
            { label: "Favors", value: "$" + formatNumber(favorTotal, 2) },
            { label: "Cost Per Guest", value: "$" + formatNumber(perGuest, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["graduation-party", "catering-quantity", "party-balloon"],
  faq: [
    { question: "How much does a baby shower cost?", answer: "Baby showers typically cost $500-$2,000 for 20-30 guests. Home-hosted showers are the most affordable at $300-$800, while restaurant or venue showers cost more." },
    { question: "Who typically pays for a baby shower?", answer: "The host (usually a close friend, sister, or family member) traditionally pays. Some modern showers split costs among multiple hosts or the bridal party." },
  ],
  formula: "Total = Venue + (Food + Drinks) x Guests + Decorations + Cake + Games + Favors",
};
