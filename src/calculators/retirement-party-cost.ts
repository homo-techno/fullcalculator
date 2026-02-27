import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const retirementPartyCostCalculator: CalculatorDefinition = {
  slug: "retirement-party-cost-calculator",
  title: "Retirement Party Cost Calculator",
  description:
    "Plan a retirement party budget. Calculate costs for venue, catering, decorations, gifts, and entertainment to celebrate a well-earned retirement.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "retirement party",
    "retirement celebration",
    "retirement budget",
    "retirement event",
    "going away party",
  ],
  variants: [
    {
      id: "fullParty",
      name: "Full Party Budget",
      description: "Plan a complete retirement celebration",
      fields: [
        { name: "numGuests", label: "Number of Guests", type: "number", placeholder: "e.g. 40", defaultValue: 40 },
        { name: "venueType", label: "Venue Type", type: "select", options: [
          { label: "Home/Backyard (free)", value: "home" },
          { label: "Restaurant private room", value: "restaurant" },
          { label: "Banquet hall", value: "banquet" },
          { label: "Community center", value: "community" },
        ], defaultValue: "restaurant" },
        { name: "cateringPerPerson", label: "Food per Person ($)", type: "number", placeholder: "e.g. 30", defaultValue: 30 },
        { name: "drinksPerPerson", label: "Drinks per Person ($)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
        { name: "cake", label: "Cake ($)", type: "number", placeholder: "e.g. 75", defaultValue: 75 },
        { name: "decorations", label: "Decorations ($)", type: "number", placeholder: "e.g. 100", defaultValue: 100 },
        { name: "giftContribution", label: "Group Gift Contribution ($)", type: "number", placeholder: "e.g. 200", defaultValue: 200 },
        { name: "entertainment", label: "Entertainment (slideshow, music) ($)", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
        { name: "invitationsPrinting", label: "Invitations/Printing ($)", type: "number", placeholder: "e.g. 40", defaultValue: 40 },
      ],
      calculate: (inputs) => {
        const numGuests = parseFloat(inputs.numGuests as string) || 0;
        const venueType = inputs.venueType as string;
        const cateringPerPerson = parseFloat(inputs.cateringPerPerson as string) || 0;
        const drinksPerPerson = parseFloat(inputs.drinksPerPerson as string) || 0;
        const cake = parseFloat(inputs.cake as string) || 0;
        const decorations = parseFloat(inputs.decorations as string) || 0;
        const giftContribution = parseFloat(inputs.giftContribution as string) || 0;
        const entertainment = parseFloat(inputs.entertainment as string) || 0;
        const invitationsPrinting = parseFloat(inputs.invitationsPrinting as string) || 0;

        if (numGuests <= 0) return null;

        const venueCosts: Record<string, number> = { home: 0, restaurant: 200, banquet: 500, community: 150 };
        const venue = venueCosts[venueType] || 0;
        const foodTotal = numGuests * cateringPerPerson;
        const drinkTotal = numGuests * drinksPerPerson;
        const grandTotal = venue + foodTotal + drinkTotal + cake + decorations + giftContribution + entertainment + invitationsPrinting;
        const costPerGuest = grandTotal / numGuests;
        const perPersonShare = numGuests > 1 ? (grandTotal - giftContribution) / (numGuests - 1) : grandTotal;

        return {
          primary: { label: "Total Party Cost", value: `$${formatNumber(grandTotal, 2)}` },
          details: [
            { label: "Venue", value: `$${formatNumber(venue, 2)}` },
            { label: "Food Total", value: `$${formatNumber(foodTotal, 2)}` },
            { label: "Drinks Total", value: `$${formatNumber(drinkTotal, 2)}` },
            { label: "Cake", value: `$${formatNumber(cake, 2)}` },
            { label: "Decorations", value: `$${formatNumber(decorations, 2)}` },
            { label: "Group Gift", value: `$${formatNumber(giftContribution, 2)}` },
            { label: "Cost per Guest", value: `$${formatNumber(costPerGuest, 2)}` },
            { label: "Per Person Share (split)", value: `$${formatNumber(perPersonShare, 2)}` },
          ],
        };
      },
    },
    {
      id: "splitCost",
      name: "Cost Split Calculator",
      description: "Calculate how to split party costs among contributors",
      fields: [
        { name: "totalCost", label: "Total Party Cost ($)", type: "number", placeholder: "e.g. 2000", defaultValue: 2000 },
        { name: "numContributors", label: "Number of Contributors", type: "number", placeholder: "e.g. 15", defaultValue: 15 },
        { name: "companyPays", label: "Company Contribution ($)", type: "number", placeholder: "e.g. 500", defaultValue: 0 },
        { name: "giftAmount", label: "Group Gift Amount ($)", type: "number", placeholder: "e.g. 200", defaultValue: 200 },
      ],
      calculate: (inputs) => {
        const totalCost = parseFloat(inputs.totalCost as string) || 0;
        const numContributors = parseFloat(inputs.numContributors as string) || 0;
        const companyPays = parseFloat(inputs.companyPays as string) || 0;
        const giftAmount = parseFloat(inputs.giftAmount as string) || 0;

        if (numContributors <= 0 || totalCost <= 0) return null;

        const totalWithGift = totalCost + giftAmount;
        const remaining = totalWithGift - companyPays;
        const perPerson = remaining / numContributors;

        return {
          primary: { label: "Per Person Share", value: `$${formatNumber(perPerson, 2)}` },
          details: [
            { label: "Total Event + Gift", value: `$${formatNumber(totalWithGift, 2)}` },
            { label: "Company Contribution", value: `$${formatNumber(companyPays, 2)}` },
            { label: "Remaining to Split", value: `$${formatNumber(remaining, 2)}` },
            { label: "Number of Contributors", value: formatNumber(numContributors, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["housewarming-party-calculator", "new-years-party-calculator", "budget-calculator"],
  faq: [
    {
      question: "How much does a retirement party cost?",
      answer:
        "A retirement party typically costs $500-$3,000 depending on venue, catering, and guest count. Office celebrations run $200-$800, while formal events at a restaurant or banquet hall cost $1,500-$5,000+. Costs are often split among coworkers.",
    },
    {
      question: "Who pays for a retirement party?",
      answer:
        "It depends on the setting. Company-hosted parties are paid by the employer. For personal celebrations, costs are often split among friends and coworkers. It is common for 10-20 close colleagues to each contribute $20-$50.",
    },
    {
      question: "What is a good retirement party gift?",
      answer:
        "Popular retirement gifts include experience gifts (travel voucher, spa day), personalized items (engraved watch, photo book), hobby-related items, or a group cash gift. Budget $200-$500 for a group gift from close colleagues.",
    },
  ],
  formula:
    "Total = Venue + (Guests x Food) + (Guests x Drinks) + Cake + Decorations + Gift + Entertainment + Invitations",
};
