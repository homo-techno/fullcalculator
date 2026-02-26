import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const birthdayPartyCostCalculator: CalculatorDefinition = {
  slug: "birthday-party-cost-calculator",
  title: "Birthday Party Cost Planner",
  description:
    "Free birthday party cost calculator. Estimate the total cost of throwing a birthday party including venue, food, decorations, entertainment, and favors.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "birthday party cost",
    "birthday party budget",
    "party cost calculator",
    "birthday party planner",
    "party budget calculator",
  ],
  variants: [
    {
      id: "detailed",
      name: "Detailed Budget",
      description: "Plan a detailed birthday party budget",
      fields: [
        {
          name: "guestCount",
          label: "Number of Guests",
          type: "number",
          placeholder: "e.g. 20",
          min: 5,
          max: 100,
          step: 1,
          defaultValue: 20,
        },
        {
          name: "venueType",
          label: "Venue Type",
          type: "select",
          options: [
            { label: "At Home (free)", value: "home" },
            { label: "Park/Public Space ($0-50)", value: "park" },
            { label: "Restaurant (per person pricing)", value: "restaurant" },
            { label: "Party Venue (bowling, trampoline, etc.)", value: "venue" },
            { label: "Rented Space (hall, event room)", value: "rented" },
          ],
          defaultValue: "home",
        },
        {
          name: "foodType",
          label: "Food Plan",
          type: "select",
          options: [
            { label: "Homemade (cake + snacks)", value: "homemade" },
            { label: "Catered / Delivered", value: "catered" },
            { label: "Restaurant (included in venue)", value: "restaurant" },
            { label: "Pizza Party", value: "pizza" },
          ],
          defaultValue: "homemade",
        },
        {
          name: "entertainment",
          label: "Entertainment",
          type: "select",
          options: [
            { label: "DIY Games (low cost)", value: "diy" },
            { label: "Hired Entertainer", value: "entertainer" },
            { label: "Bounce House Rental", value: "bounce" },
            { label: "Activity Venue (included)", value: "included" },
            { label: "None / Simple", value: "none" },
          ],
          defaultValue: "diy",
        },
        {
          name: "partyBags",
          label: "Party Favor Bags",
          type: "select",
          options: [
            { label: "No Favors", value: "none" },
            { label: "Simple ($2-3/child)", value: "simple" },
            { label: "Standard ($5-8/child)", value: "standard" },
            { label: "Premium ($10-15/child)", value: "premium" },
          ],
          defaultValue: "simple",
        },
      ],
      calculate: (inputs) => {
        const guests = parseFloat(inputs.guestCount as string);
        const venueType = inputs.venueType as string;
        const foodType = inputs.foodType as string;
        const entertainment = inputs.entertainment as string;
        const partyBags = inputs.partyBags as string;
        if (!guests) return null;

        // Venue costs
        const venueCosts: Record<string, number> = {
          home: 0,
          park: 25,
          restaurant: guests * 15,
          venue: guests * 20 + 100,
          rented: 200,
        };

        // Food costs per person
        const foodPerPerson: Record<string, number> = {
          homemade: 5,
          catered: 15,
          restaurant: 0, // included in venue
          pizza: 6,
        };

        // Cake cost
        const cakeCost = guests <= 15 ? 30 : guests <= 30 ? 50 : 75;

        // Entertainment
        const entertainmentCosts: Record<string, number> = {
          diy: 25,
          entertainer: 200,
          bounce: 250,
          included: 0,
          none: 0,
        };

        // Party bags per child (assume 70% of guests are children)
        const childGuests = Math.ceil(guests * 0.7);
        const favorPerChild: Record<string, number> = {
          none: 0,
          simple: 2.5,
          standard: 6,
          premium: 12,
        };

        // Decorations (balloons, banner, tablecloths)
        const decorations = guests <= 15 ? 25 : guests <= 30 ? 40 : 60;

        // Paper goods (plates, cups, napkins)
        const paperGoods = guests * 1.5;

        const venueCost = venueCosts[venueType] || 0;
        const foodCost = (foodPerPerson[foodType] || 5) * guests;
        const entertainCost = entertainmentCosts[entertainment] || 0;
        const favorCost = (favorPerChild[partyBags] || 0) * childGuests;

        const totalCost = venueCost + foodCost + cakeCost + entertainCost + favorCost + decorations + paperGoods;
        const costPerGuest = totalCost / guests;

        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Cost per Guest", value: `$${formatNumber(costPerGuest)}` },
            { label: "Venue", value: `$${formatNumber(venueCost)}` },
            { label: "Food & Drinks", value: `$${formatNumber(foodCost)}` },
            { label: "Cake", value: `$${formatNumber(cakeCost)}` },
            { label: "Entertainment", value: `$${formatNumber(entertainCost)}` },
            { label: "Party Favors", value: `$${formatNumber(favorCost)}` },
            { label: "Decorations", value: `$${formatNumber(decorations)}` },
            { label: "Paper Goods", value: `$${formatNumber(paperGoods)}` },
          ],
        };
      },
    },
    {
      id: "quick-estimate",
      name: "Quick Estimate",
      description: "Get a fast estimate based on guest count and party level",
      fields: [
        {
          name: "guestCount",
          label: "Number of Guests",
          type: "number",
          placeholder: "e.g. 20",
          min: 5,
          max: 100,
          step: 1,
          defaultValue: 20,
        },
        {
          name: "partyLevel",
          label: "Party Level",
          type: "select",
          options: [
            { label: "Budget-Friendly ($8-12/guest)", value: "budget" },
            { label: "Standard ($15-25/guest)", value: "standard" },
            { label: "Premium ($30-50/guest)", value: "premium" },
            { label: "Luxury ($50+/guest)", value: "luxury" },
          ],
          defaultValue: "standard",
        },
        {
          name: "ageGroup",
          label: "Birthday Person's Age Group",
          type: "select",
          options: [
            { label: "Toddler (1-3)", value: "toddler" },
            { label: "Child (4-10)", value: "child" },
            { label: "Tween (11-13)", value: "tween" },
            { label: "Teen (14-17)", value: "teen" },
            { label: "Adult (18+)", value: "adult" },
          ],
          defaultValue: "child",
        },
      ],
      calculate: (inputs) => {
        const guests = parseFloat(inputs.guestCount as string);
        const level = inputs.partyLevel as string;
        const age = inputs.ageGroup as string;
        if (!guests) return null;

        const costRanges: Record<string, { low: number; high: number }> = {
          budget: { low: 8, high: 12 },
          standard: { low: 15, high: 25 },
          premium: { low: 30, high: 50 },
          luxury: { low: 50, high: 80 },
        };

        // Age multiplier (teens/adults slightly more expensive)
        const ageMult: Record<string, number> = {
          toddler: 0.85,
          child: 1.0,
          tween: 1.1,
          teen: 1.2,
          adult: 1.3,
        };

        const range = costRanges[level] || costRanges.standard;
        const mult = ageMult[age] || 1.0;
        const midCost = ((range.low + range.high) / 2) * mult;
        const total = midCost * guests;
        const lowEstimate = range.low * mult * guests;
        const highEstimate = range.high * mult * guests;

        return {
          primary: { label: "Estimated Total", value: `$${formatNumber(total)}` },
          details: [
            { label: "Cost Range", value: `$${formatNumber(lowEstimate)} - $${formatNumber(highEstimate)}` },
            { label: "Per Guest", value: `$${formatNumber(midCost)}` },
            { label: "Guest Count", value: formatNumber(guests, 0) },
            { label: "Party Level", value: level.charAt(0).toUpperCase() + level.slice(1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gift-budget-calculator", "wedding-timeline-calculator"],
  faq: [
    {
      question: "How much should I spend on a birthday party?",
      answer:
        "The average children's birthday party costs $300-$500 for 15-20 guests. Budget-friendly parties at home can cost $100-$200, while venue parties with entertainment range from $400-$800. Set a budget before planning to avoid overspending.",
    },
    {
      question: "What are the biggest birthday party expenses?",
      answer:
        "The biggest costs are typically the venue (if renting), food and cake, and entertainment. For at-home parties, food is usually the largest expense. Decorations and party favors are areas where you can save the most.",
    },
    {
      question: "How can I throw a birthday party on a budget?",
      answer:
        "Host at home or a free public park, make your own cake, plan DIY games, use printable decorations, keep the guest list focused, and skip expensive party favors. A fun, well-planned party does not have to be expensive.",
    },
  ],
  formula:
    "Total Cost = Venue + (Food per Person x Guests) + Cake + Entertainment + (Favors x Children) + Decorations + Paper Goods",
};
