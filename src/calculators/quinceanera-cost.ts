import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const quinceaeneraCostCalculator: CalculatorDefinition = {
  slug: "quinceanera-cost-calculator",
  title: "Quincea\u00f1era Cost Estimator",
  description:
    "Estimate the total cost of a Quincea\u00f1era celebration. Calculate expenses for venue, catering, dress, court, decorations, music, and more.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "quinceanera cost",
    "quince budget",
    "quincea\u00f1era planner",
    "quince party",
    "15th birthday",
  ],
  variants: [
    {
      id: "fullCelebration",
      name: "Full Celebration",
      description: "Calculate all Quincea\u00f1era expenses",
      fields: [
        { name: "numGuests", label: "Number of Guests", type: "number", placeholder: "e.g. 200", defaultValue: 200 },
        { name: "venueRental", label: "Venue Rental ($)", type: "number", placeholder: "e.g. 2500", defaultValue: 2500 },
        { name: "cateringPerPerson", label: "Catering per Person ($)", type: "number", placeholder: "e.g. 40", defaultValue: 40 },
        { name: "dressCost", label: "Quincea\u00f1era Dress ($)", type: "number", placeholder: "e.g. 500", defaultValue: 500 },
        { name: "courtAttire", label: "Court (Damas/Chambelanes) Attire ($)", type: "number", placeholder: "e.g. 800", defaultValue: 800 },
        { name: "djBand", label: "DJ or Band ($)", type: "number", placeholder: "e.g. 1500", defaultValue: 1500 },
        { name: "decorations", label: "Decorations ($)", type: "number", placeholder: "e.g. 1500", defaultValue: 1500 },
        { name: "photography", label: "Photography/Video ($)", type: "number", placeholder: "e.g. 2000", defaultValue: 2000 },
        { name: "cake", label: "Cake ($)", type: "number", placeholder: "e.g. 500", defaultValue: 500 },
        { name: "invitations", label: "Invitations ($)", type: "number", placeholder: "e.g. 300", defaultValue: 300 },
        { name: "churchCeremony", label: "Church/Ceremony ($)", type: "number", placeholder: "e.g. 500", defaultValue: 500 },
      ],
      calculate: (inputs) => {
        const numGuests = parseFloat(inputs.numGuests as string) || 0;
        const venueRental = parseFloat(inputs.venueRental as string) || 0;
        const cateringPerPerson = parseFloat(inputs.cateringPerPerson as string) || 0;
        const dressCost = parseFloat(inputs.dressCost as string) || 0;
        const courtAttire = parseFloat(inputs.courtAttire as string) || 0;
        const djBand = parseFloat(inputs.djBand as string) || 0;
        const decorations = parseFloat(inputs.decorations as string) || 0;
        const photography = parseFloat(inputs.photography as string) || 0;
        const cake = parseFloat(inputs.cake as string) || 0;
        const invitations = parseFloat(inputs.invitations as string) || 0;
        const churchCeremony = parseFloat(inputs.churchCeremony as string) || 0;

        if (numGuests <= 0) return null;

        const cateringTotal = numGuests * cateringPerPerson;
        const grandTotal = venueRental + cateringTotal + dressCost + courtAttire + djBand + decorations + photography + cake + invitations + churchCeremony;
        const costPerGuest = grandTotal / numGuests;

        return {
          primary: { label: "Total Quincea\u00f1era Cost", value: `$${formatNumber(grandTotal, 2)}` },
          details: [
            { label: "Catering Total", value: `$${formatNumber(cateringTotal, 2)}` },
            { label: "Venue", value: `$${formatNumber(venueRental, 2)}` },
            { label: "Dress", value: `$${formatNumber(dressCost, 2)}` },
            { label: "Court Attire", value: `$${formatNumber(courtAttire, 2)}` },
            { label: "DJ/Band", value: `$${formatNumber(djBand, 2)}` },
            { label: "Photography/Video", value: `$${formatNumber(photography, 2)}` },
            { label: "Decorations", value: `$${formatNumber(decorations, 2)}` },
            { label: "Cost per Guest", value: `$${formatNumber(costPerGuest, 2)}` },
          ],
        };
      },
    },
    {
      id: "budgetBreakdown",
      name: "Budget Percentage Breakdown",
      description: "See how a fixed budget should be allocated",
      fields: [
        { name: "totalBudget", label: "Total Budget ($)", type: "number", placeholder: "e.g. 15000", defaultValue: 15000 },
        { name: "numGuests", label: "Number of Guests", type: "number", placeholder: "e.g. 200", defaultValue: 200 },
        { name: "priority", label: "Top Priority", type: "select", options: [
          { label: "Food & Drinks", value: "food" },
          { label: "Venue & Decor", value: "venue" },
          { label: "Entertainment", value: "entertainment" },
          { label: "Photography", value: "photography" },
        ], defaultValue: "food" },
      ],
      calculate: (inputs) => {
        const totalBudget = parseFloat(inputs.totalBudget as string) || 0;
        const numGuests = parseFloat(inputs.numGuests as string) || 200;
        const priority = inputs.priority as string;

        if (totalBudget <= 0) return null;

        const allocations: Record<string, Record<string, number>> = {
          food: { catering: 0.40, venue: 0.15, entertainment: 0.10, photography: 0.10, dress: 0.07, decor: 0.08, other: 0.10 },
          venue: { catering: 0.30, venue: 0.20, entertainment: 0.10, photography: 0.10, dress: 0.07, decor: 0.13, other: 0.10 },
          entertainment: { catering: 0.30, venue: 0.15, entertainment: 0.18, photography: 0.10, dress: 0.07, decor: 0.10, other: 0.10 },
          photography: { catering: 0.30, venue: 0.15, entertainment: 0.10, photography: 0.18, dress: 0.07, decor: 0.10, other: 0.10 },
        };

        const a = allocations[priority] || allocations.food;
        const perGuest = (totalBudget * a.catering) / numGuests;

        return {
          primary: { label: "Budget per Guest", value: `$${formatNumber(perGuest, 2)}` },
          details: [
            { label: "Catering", value: `$${formatNumber(totalBudget * a.catering, 2)}` },
            { label: "Venue", value: `$${formatNumber(totalBudget * a.venue, 2)}` },
            { label: "Entertainment", value: `$${formatNumber(totalBudget * a.entertainment, 2)}` },
            { label: "Photography/Video", value: `$${formatNumber(totalBudget * a.photography, 2)}` },
            { label: "Dress & Attire", value: `$${formatNumber(totalBudget * a.dress, 2)}` },
            { label: "Decorations", value: `$${formatNumber(totalBudget * a.decor, 2)}` },
            { label: "Other (cake, invites, church)", value: `$${formatNumber(totalBudget * a.other, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bar-mitzvah-cost-calculator", "destination-wedding-cost-calculator", "party-calculator"],
  faq: [
    {
      question: "How much does a Quincea\u00f1era cost on average?",
      answer:
        "The average Quincea\u00f1era costs $5,000-$20,000, with some elaborate celebrations reaching $30,000-$50,000+. The biggest expenses are typically catering (30-40% of budget) and venue rental (15-20%).",
    },
    {
      question: "Who traditionally pays for a Quincea\u00f1era?",
      answer:
        "Traditionally, the parents host the celebration, but padrinos (godparents and sponsors) often contribute by covering specific items like the cake, dress, DJ, church, or other expenses. This sponsorship system can significantly reduce family costs.",
    },
    {
      question: "How many people attend a typical Quincea\u00f1era?",
      answer:
        "A typical Quincea\u00f1era has 100-300 guests, including extended family and friends. The court of honor (damas and chambelanes) usually consists of 14 members plus the quincea\u00f1era, totaling 15 to represent the 15th birthday.",
    },
  ],
  formula:
    "Total = Venue + (Guests \u00d7 Catering) + Dress + Court Attire + DJ/Band + Decor + Photo + Cake + Invitations + Church",
};
