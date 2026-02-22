import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const honeymoonBudgetCalculator: CalculatorDefinition = {
  slug: "honeymoon-budget",
  title: "Honeymoon Budget Calculator",
  description: "Free honeymoon budget calculator. Plan your honeymoon expenses including flights, accommodation, meals, activities, and spending money.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["honeymoon budget", "honeymoon cost", "honeymoon planning", "travel budget", "wedding trip"],
  variants: [
    {
      id: "detailed",
      name: "Detailed Honeymoon Budget",
      fields: [
        { name: "nights", label: "Number of Nights", type: "number", placeholder: "e.g. 7" },
        { name: "flightsCost", label: "Flights (total for 2) ($)", type: "number", placeholder: "e.g. 1500" },
        { name: "hotelPerNight", label: "Hotel Per Night ($)", type: "number", placeholder: "e.g. 250" },
        { name: "mealsPerDay", label: "Meals Per Day for 2 ($)", type: "number", placeholder: "e.g. 120" },
        { name: "activitiesPerDay", label: "Activities Per Day ($)", type: "number", placeholder: "e.g. 100" },
        { name: "transportPerDay", label: "Local Transport Per Day ($)", type: "number", placeholder: "e.g. 40" },
        { name: "shoppingBudget", label: "Shopping/Souvenirs ($)", type: "number", placeholder: "e.g. 300" },
        { name: "travelInsurance", label: "Travel Insurance ($)", type: "number", placeholder: "e.g. 150" },
      ],
      calculate: (inputs) => {
        const nights = (inputs.nights as number) || 0;
        const flightsCost = (inputs.flightsCost as number) || 0;
        const hotelPerNight = (inputs.hotelPerNight as number) || 0;
        const mealsPerDay = (inputs.mealsPerDay as number) || 0;
        const activitiesPerDay = (inputs.activitiesPerDay as number) || 0;
        const transportPerDay = (inputs.transportPerDay as number) || 0;
        const shoppingBudget = (inputs.shoppingBudget as number) || 0;
        const travelInsurance = (inputs.travelInsurance as number) || 0;
        if (nights <= 0) return null;
        const days = nights + 1;
        const hotelTotal = nights * hotelPerNight;
        const mealsTotal = days * mealsPerDay;
        const activitiesTotal = days * activitiesPerDay;
        const transportTotal = days * transportPerDay;
        const totalCost = flightsCost + hotelTotal + mealsTotal + activitiesTotal + transportTotal + shoppingBudget + travelInsurance;
        const perDay = totalCost / days;
        return {
          primary: { label: "Total Honeymoon Budget", value: "$" + formatNumber(totalCost, 2) },
          details: [
            { label: "Flights", value: "$" + formatNumber(flightsCost, 2) },
            { label: "Accommodation", value: "$" + formatNumber(hotelTotal, 2) },
            { label: "Meals", value: "$" + formatNumber(mealsTotal, 2) },
            { label: "Activities", value: "$" + formatNumber(activitiesTotal, 2) },
            { label: "Local Transport", value: "$" + formatNumber(transportTotal, 2) },
            { label: "Shopping/Souvenirs", value: "$" + formatNumber(shoppingBudget, 2) },
            { label: "Travel Insurance", value: "$" + formatNumber(travelInsurance, 2) },
            { label: "Average Per Day", value: "$" + formatNumber(perDay, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wedding-registry", "wedding-guest-list", "engagement-ring-budget"],
  faq: [
    { question: "How much should you budget for a honeymoon?", answer: "The average honeymoon costs $4,000-$8,000, but can range from $2,000 for a domestic trip to $15,000+ for luxury international destinations." },
    { question: "When should you book your honeymoon?", answer: "Book flights and hotels 4-6 months in advance for the best rates. Book popular destinations and peak seasons even earlier, 6-9 months out." },
  ],
  formula: "Total = Flights + (Hotel x Nights) + (Daily Costs x Days) + Shopping + Insurance",
};
