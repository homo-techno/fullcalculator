import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const barMitzvahCostCalculator: CalculatorDefinition = {
  slug: "bar-mitzvah-cost-calculator",
  title: "Bar/Bat Mitzvah Cost Calculator",
  description:
    "Estimate Bar or Bat Mitzvah celebration costs. Calculate expenses for venue, catering, entertainment, decorations, invitations, and more.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "bar mitzvah cost",
    "bat mitzvah cost",
    "bar mitzvah budget",
    "jewish celebration",
    "mitzvah party",
  ],
  variants: [
    {
      id: "fullCelebration",
      name: "Full Celebration Budget",
      description: "Calculate all party-related expenses",
      fields: [
        { name: "numGuests", label: "Number of Guests", type: "number", placeholder: "e.g. 150", defaultValue: 150 },
        { name: "venueRental", label: "Venue Rental ($)", type: "number", placeholder: "e.g. 3000", defaultValue: 3000 },
        { name: "cateringPerPerson", label: "Catering per Person ($)", type: "number", placeholder: "e.g. 75", defaultValue: 75 },
        { name: "djEntertainment", label: "DJ/Entertainment ($)", type: "number", placeholder: "e.g. 2000", defaultValue: 2000 },
        { name: "decorations", label: "Decorations & Theme ($)", type: "number", placeholder: "e.g. 2000", defaultValue: 2000 },
        { name: "invitations", label: "Invitations ($)", type: "number", placeholder: "e.g. 500", defaultValue: 500 },
        { name: "photography", label: "Photography/Video ($)", type: "number", placeholder: "e.g. 2500", defaultValue: 2500 },
        { name: "partyFavors", label: "Party Favors ($)", type: "number", placeholder: "e.g. 500", defaultValue: 500 },
        { name: "attire", label: "Attire ($)", type: "number", placeholder: "e.g. 500", defaultValue: 500 },
        { name: "tutoring", label: "Torah Tutoring ($)", type: "number", placeholder: "e.g. 1500", defaultValue: 1500 },
      ],
      calculate: (inputs) => {
        const numGuests = parseFloat(inputs.numGuests as string) || 0;
        const venueRental = parseFloat(inputs.venueRental as string) || 0;
        const cateringPerPerson = parseFloat(inputs.cateringPerPerson as string) || 0;
        const djEntertainment = parseFloat(inputs.djEntertainment as string) || 0;
        const decorations = parseFloat(inputs.decorations as string) || 0;
        const invitations = parseFloat(inputs.invitations as string) || 0;
        const photography = parseFloat(inputs.photography as string) || 0;
        const partyFavors = parseFloat(inputs.partyFavors as string) || 0;
        const attire = parseFloat(inputs.attire as string) || 0;
        const tutoring = parseFloat(inputs.tutoring as string) || 0;

        if (numGuests <= 0) return null;

        const cateringTotal = numGuests * cateringPerPerson;
        const grandTotal = venueRental + cateringTotal + djEntertainment + decorations + invitations + photography + partyFavors + attire + tutoring;
        const costPerGuest = grandTotal / numGuests;

        return {
          primary: { label: "Total Celebration Cost", value: `$${formatNumber(grandTotal, 2)}` },
          details: [
            { label: "Catering Total", value: `$${formatNumber(cateringTotal, 2)}` },
            { label: "Venue Rental", value: `$${formatNumber(venueRental, 2)}` },
            { label: "DJ/Entertainment", value: `$${formatNumber(djEntertainment, 2)}` },
            { label: "Decorations", value: `$${formatNumber(decorations, 2)}` },
            { label: "Photography/Video", value: `$${formatNumber(photography, 2)}` },
            { label: "Torah Tutoring", value: `$${formatNumber(tutoring, 2)}` },
            { label: "Cost per Guest", value: `$${formatNumber(costPerGuest, 2)}` },
          ],
        };
      },
    },
    {
      id: "budgetTier",
      name: "Budget Tier Estimator",
      description: "Get estimates based on celebration scale",
      fields: [
        { name: "tier", label: "Celebration Scale", type: "select", options: [
          { label: "Modest (kiddush lunch)", value: "modest" },
          { label: "Mid-Range (nice party)", value: "midrange" },
          { label: "Upscale (full event)", value: "upscale" },
          { label: "Luxury (premium everything)", value: "luxury" },
        ], defaultValue: "midrange" },
        { name: "numGuests", label: "Number of Guests", type: "number", placeholder: "e.g. 150", defaultValue: 150 },
        { name: "region", label: "Region", type: "select", options: [
          { label: "Low cost area", value: "low" },
          { label: "Average area", value: "avg" },
          { label: "High cost metro", value: "high" },
        ], defaultValue: "avg" },
      ],
      calculate: (inputs) => {
        const tier = inputs.tier as string;
        const numGuests = parseFloat(inputs.numGuests as string) || 150;
        const region = inputs.region as string;

        const perGuestCosts: Record<string, number> = {
          modest: 30,
          midrange: 100,
          upscale: 175,
          luxury: 300,
        };
        const fixedCosts: Record<string, number> = {
          modest: 3000,
          midrange: 8000,
          upscale: 15000,
          luxury: 25000,
        };
        const regionMultiplier: Record<string, number> = { low: 0.75, avg: 1, high: 1.4 };

        const m = regionMultiplier[region] || 1;
        const perGuest = (perGuestCosts[tier] || 100) * m;
        const fixed = (fixedCosts[tier] || 8000) * m;
        const total = (perGuest * numGuests) + fixed;

        return {
          primary: { label: "Estimated Total", value: `$${formatNumber(total, 2)}` },
          details: [
            { label: "Per-Guest Costs", value: `$${formatNumber(perGuest * numGuests, 2)}` },
            { label: "Fixed Costs (venue, photo, etc.)", value: `$${formatNumber(fixed, 2)}` },
            { label: "Cost per Guest", value: `$${formatNumber(total / numGuests, 2)}` },
            { label: "Monthly Savings (12 months)", value: `$${formatNumber(total / 12, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["quinceanera-cost-calculator", "destination-wedding-cost-calculator", "party-calculator"],
  faq: [
    {
      question: "How much does a Bar/Bat Mitzvah cost?",
      answer:
        "Costs range widely from $5,000 for a modest kiddush lunch to $50,000+ for a lavish party. The average celebration costs $15,000-$30,000, with catering and venue being the largest expenses.",
    },
    {
      question: "What are the biggest expenses for a Bar/Bat Mitzvah?",
      answer:
        "Catering typically accounts for 40-50% of the budget, followed by the venue (15-20%), entertainment (10-15%), and photography/video (8-12%). Torah tutoring costs $1,000-$3,000 and is often overlooked in budgeting.",
    },
    {
      question: "How far in advance should I start planning?",
      answer:
        "Start planning 12-18 months in advance, especially if you want a popular venue or date. Book the venue and caterer first, then entertainment and photographer. Send save-the-dates 6 months ahead and invitations 6-8 weeks before.",
    },
  ],
  formula:
    "Total = Venue + (Guests × Catering per Person) + Entertainment + Decorations + Photography + Invitations + Favors + Attire + Tutoring",
};
