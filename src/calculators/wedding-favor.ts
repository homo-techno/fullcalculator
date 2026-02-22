import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingFavorCalculator: CalculatorDefinition = {
  slug: "wedding-favor",
  title: "Wedding Favor Quantity Calculator",
  description: "Free wedding favor quantity calculator. Determine how many favors to order based on guest count, packaging, and budget.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wedding favors", "party favors", "guest favors", "favor quantity", "favor budget"],
  variants: [
    {
      id: "standard",
      name: "Standard Favor Calculation",
      fields: [
        { name: "guestCount", label: "Number of Guests", type: "number", placeholder: "e.g. 120" },
        { name: "favorType", label: "Favor Type", type: "select", options: [
          { label: "Individual (1 per guest)", value: "individual" },
          { label: "Per Couple (1 per 2 guests)", value: "couple" },
          { label: "Per Table", value: "table" },
        ] },
        { name: "tableCount", label: "Number of Tables", type: "number", placeholder: "e.g. 15" },
        { name: "costPerFavor", label: "Cost Per Favor ($)", type: "number", placeholder: "e.g. 3" },
        { name: "bufferPercent", label: "Extra Buffer (%)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const guestCount = (inputs.guestCount as number) || 0;
        const favorType = (inputs.favorType as string) || "individual";
        const tableCount = (inputs.tableCount as number) || 15;
        const costPerFavor = (inputs.costPerFavor as number) || 3;
        const bufferPercent = (inputs.bufferPercent as number) || 10;
        if (guestCount <= 0) return null;
        const baseFavors = favorType === "couple" ? Math.ceil(guestCount / 2) : favorType === "table" ? tableCount : guestCount;
        const buffer = Math.ceil(baseFavors * (bufferPercent / 100));
        const totalFavors = baseFavors + buffer;
        const totalCost = totalFavors * costPerFavor;
        const costPerGuest = totalCost / guestCount;
        return {
          primary: { label: "Total Favors to Order", value: formatNumber(totalFavors) },
          details: [
            { label: "Base Favors Needed", value: formatNumber(baseFavors) },
            { label: "Buffer Favors", value: formatNumber(buffer) },
            { label: "Total Favor Cost", value: "$" + formatNumber(totalCost, 2) },
            { label: "Cost Per Guest", value: "$" + formatNumber(costPerGuest, 2) },
            { label: "Favor Type", value: favorType.charAt(0).toUpperCase() + favorType.slice(1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wedding-guest-list", "wedding-invitation", "wedding-seating"],
  faq: [
    { question: "How many wedding favors should I order?", answer: "Order 10% more favors than your base count. For individual favors, that means 110% of your guest count. Some couples skip favors and donate to charity instead." },
    { question: "What is a good budget for wedding favors?", answer: "Most couples spend $2-$5 per favor. Edible favors (cookies, candy, mini bottles) are popular and cost-effective options." },
  ],
  formula: "Total Favors = Base Count x (1 + Buffer % / 100)",
};
