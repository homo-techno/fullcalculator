import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const familyReunionCostCalculator: CalculatorDefinition = {
  slug: "family-reunion-cost-calculator",
  title: "Family Reunion Cost Calculator",
  description:
    "Calculate the per-person cost of a family reunion. Plan venue, food, activities, and supplies with cost-splitting across families.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "family reunion",
    "reunion cost",
    "family gathering",
    "reunion budget",
    "family event",
  ],
  variants: [
    {
      id: "fullReunion",
      name: "Full Reunion Budget",
      description: "Plan all reunion expenses and split costs",
      fields: [
        { name: "numAttendees", label: "Number of Attendees", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
        { name: "numDays", label: "Number of Days", type: "number", placeholder: "e.g. 2", defaultValue: 2 },
        { name: "venueRental", label: "Venue Rental Total ($)", type: "number", placeholder: "e.g. 500", defaultValue: 500 },
        { name: "foodPerPersonPerDay", label: "Food per Person per Day ($)", type: "number", placeholder: "e.g. 20", defaultValue: 20 },
        { name: "activitiesCost", label: "Activities/Entertainment ($)", type: "number", placeholder: "e.g. 200", defaultValue: 200 },
        { name: "supplies", label: "Supplies (plates, cups, etc.) ($)", type: "number", placeholder: "e.g. 75", defaultValue: 75 },
        { name: "tshirts", label: "Reunion T-shirts (total) ($)", type: "number", placeholder: "e.g. 300", defaultValue: 0 },
        { name: "photographer", label: "Photographer ($)", type: "number", placeholder: "e.g. 200", defaultValue: 0 },
        { name: "numFamilies", label: "Number of Family Units", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
      ],
      calculate: (inputs) => {
        const numAttendees = parseFloat(inputs.numAttendees as string) || 0;
        const numDays = parseFloat(inputs.numDays as string) || 1;
        const venueRental = parseFloat(inputs.venueRental as string) || 0;
        const foodPerPersonPerDay = parseFloat(inputs.foodPerPersonPerDay as string) || 0;
        const activitiesCost = parseFloat(inputs.activitiesCost as string) || 0;
        const supplies = parseFloat(inputs.supplies as string) || 0;
        const tshirts = parseFloat(inputs.tshirts as string) || 0;
        const photographer = parseFloat(inputs.photographer as string) || 0;
        const numFamilies = parseFloat(inputs.numFamilies as string) || 1;

        if (numAttendees <= 0) return null;

        const foodTotal = numAttendees * foodPerPersonPerDay * numDays;
        const grandTotal = venueRental + foodTotal + activitiesCost + supplies + tshirts + photographer;
        const costPerPerson = grandTotal / numAttendees;
        const costPerFamily = grandTotal / numFamilies;

        return {
          primary: { label: "Total Reunion Cost", value: `$${formatNumber(grandTotal, 2)}` },
          details: [
            { label: "Food Total", value: `$${formatNumber(foodTotal, 2)}` },
            { label: "Venue Rental", value: `$${formatNumber(venueRental, 2)}` },
            { label: "Activities", value: `$${formatNumber(activitiesCost, 2)}` },
            { label: "Supplies", value: `$${formatNumber(supplies, 2)}` },
            { label: "T-shirts", value: `$${formatNumber(tshirts, 2)}` },
            { label: "Cost per Person", value: `$${formatNumber(costPerPerson, 2)}` },
            { label: "Cost per Family Unit", value: `$${formatNumber(costPerFamily, 2)}` },
          ],
        };
      },
    },
    {
      id: "potluck",
      name: "Potluck Style",
      description: "Calculate costs when families bring dishes",
      fields: [
        { name: "numAttendees", label: "Number of Attendees", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
        { name: "numFamilies", label: "Number of Families", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
        { name: "mainDishCost", label: "Shared Main Dish Cost ($)", type: "number", placeholder: "e.g. 200", defaultValue: 200 },
        { name: "venueRental", label: "Venue/Shelter Rental ($)", type: "number", placeholder: "e.g. 200", defaultValue: 200 },
        { name: "drinks", label: "Drinks & Ice ($)", type: "number", placeholder: "e.g. 80", defaultValue: 80 },
        { name: "supplies", label: "Paper Goods & Supplies ($)", type: "number", placeholder: "e.g. 60", defaultValue: 60 },
        { name: "activities", label: "Games & Activities ($)", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
      ],
      calculate: (inputs) => {
        const numAttendees = parseFloat(inputs.numAttendees as string) || 0;
        const numFamilies = parseFloat(inputs.numFamilies as string) || 1;
        const mainDishCost = parseFloat(inputs.mainDishCost as string) || 0;
        const venueRental = parseFloat(inputs.venueRental as string) || 0;
        const drinks = parseFloat(inputs.drinks as string) || 0;
        const supplies = parseFloat(inputs.supplies as string) || 0;
        const activities = parseFloat(inputs.activities as string) || 0;

        if (numAttendees <= 0) return null;

        const sharedCosts = mainDishCost + venueRental + drinks + supplies + activities;
        const perFamily = sharedCosts / numFamilies;
        const perPerson = sharedCosts / numAttendees;

        return {
          primary: { label: "Shared Costs Total", value: `$${formatNumber(sharedCosts, 2)}` },
          details: [
            { label: "Per Family Contribution", value: `$${formatNumber(perFamily, 2)}` },
            { label: "Per Person Cost", value: `$${formatNumber(perPerson, 2)}` },
            { label: "Main Dish", value: `$${formatNumber(mainDishCost, 2)}` },
            { label: "Venue", value: `$${formatNumber(venueRental, 2)}` },
            { label: "Drinks & Ice", value: `$${formatNumber(drinks, 2)}` },
          ],
          note: "Each family also brings a side dish or dessert to share.",
        };
      },
    },
  ],
  relatedSlugs: ["fourth-of-july-party-calculator", "superbowl-party-calculator", "housewarming-party-calculator"],
  faq: [
    {
      question: "How much does a family reunion cost?",
      answer:
        "A typical family reunion costs $500-$3,000+ depending on size and venue. Per person, expect $15-$50 for a one-day event or $30-$100+ for a multi-day gathering. Potluck style can reduce costs to $5-$15 per person.",
    },
    {
      question: "How do you split family reunion costs fairly?",
      answer:
        "Common approaches: per-person fee (fairest for singles), per-family unit fee (easier to manage), or tiered pricing (adults full price, kids half, under 5 free). Use a shared spreadsheet or app like Splitwise to track contributions.",
    },
    {
      question: "How do I plan a family reunion on a budget?",
      answer:
        "Use public parks (free or cheap pavilion rental), do potluck-style meals, plan free activities (sports, games, talent show), use digital invitations, and start a reunion fund where families contribute monthly throughout the year.",
    },
  ],
  formula:
    "Total = Venue + (Attendees x Food/Person x Days) + Activities + Supplies + Extras; Per Family = Total / Number of Families",
};
