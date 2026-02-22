import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingCakeSizeCalculator: CalculatorDefinition = {
  slug: "wedding-cake-size",
  title: "Wedding Cake Size Calculator",
  description: "Free wedding cake size calculator. Determine the right cake size and number of tiers based on your guest count and serving preferences.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wedding cake", "cake size", "cake tiers", "cake servings", "wedding dessert"],
  variants: [
    {
      id: "byGuests",
      name: "By Guest Count",
      fields: [
        { name: "guestCount", label: "Number of Guests", type: "number", placeholder: "e.g. 150" },
        { name: "servingSize", label: "Serving Size", type: "select", options: [
          { label: "Wedding (1x2x4 in)", value: "wedding" },
          { label: "Party (2x2x4 in)", value: "party" },
        ] },
        { name: "tiers", label: "Number of Tiers", type: "select", options: [
          { label: "1 tier", value: "1" },
          { label: "2 tiers", value: "2" },
          { label: "3 tiers", value: "3" },
          { label: "4 tiers", value: "4" },
          { label: "5 tiers", value: "5" },
        ] },
        { name: "costPerSlice", label: "Cost Per Slice ($)", type: "number", placeholder: "e.g. 8" },
      ],
      calculate: (inputs) => {
        const guestCount = (inputs.guestCount as number) || 0;
        const servingSize = (inputs.servingSize as string) || "wedding";
        const tiers = parseInt(inputs.tiers as string) || 3;
        const costPerSlice = (inputs.costPerSlice as number) || 8;
        if (guestCount <= 0) return null;
        const servingsNeeded = servingSize === "party" ? guestCount : Math.ceil(guestCount * 1.1);
        const totalCost = servingsNeeded * costPerSlice;
        const tierSizes: Record<number, string> = {
          1: "14-inch round",
          2: "10 + 14-inch rounds",
          3: "8 + 10 + 14-inch rounds",
          4: "6 + 8 + 10 + 14-inch rounds",
          5: "6 + 8 + 10 + 12 + 16-inch rounds",
        };
        const tierServings: Record<number, number> = { 1: 78, 2: 128, 3: 168, 4: 196, 5: 280 };
        const recommended = tierServings[tiers] >= servingsNeeded ? tiers : Math.min(5, tiers + 1);
        return {
          primary: { label: "Servings Needed", value: formatNumber(servingsNeeded) },
          details: [
            { label: "Recommended Tiers", value: formatNumber(recommended) },
            { label: "Tier Configuration", value: tierSizes[recommended] || tierSizes[3] },
            { label: "Tier Capacity", value: formatNumber(tierServings[recommended] || 168) + " servings" },
            { label: "Estimated Cake Cost", value: "$" + formatNumber(totalCost, 2) },
            { label: "Cost Per Slice", value: "$" + formatNumber(costPerSlice, 2) },
            { label: "Extra Slices Buffer", value: formatNumber(servingsNeeded - guestCount) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wedding-guest-list", "catering-quantity", "wedding-drink"],
  faq: [
    { question: "How many servings does a 3-tier cake provide?", answer: "A typical 3-tier cake (8, 10, and 14-inch rounds) provides approximately 150-170 wedding-size servings or about 100 party-size servings." },
    { question: "Should I order more cake than guests?", answer: "Yes, order 10-15% more slices than your guest count to account for seconds, vendor meals, and display portions." },
  ],
  formula: "Servings Needed = Guest Count x 1.1 (10% buffer for wedding servings)",
};
