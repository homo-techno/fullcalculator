import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cateringQuantityCalculator: CalculatorDefinition = {
  slug: "catering-quantity",
  title: "Catering Quantity Calculator",
  description: "Free catering quantity calculator. Estimate food and beverage quantities for your event based on guest count, meal type, and service style.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["catering", "food quantity", "wedding food", "event catering", "meal planning", "party food"],
  variants: [
    {
      id: "fullMeal",
      name: "Full Meal Catering",
      fields: [
        { name: "guestCount", label: "Number of Guests", type: "number", placeholder: "e.g. 150" },
        { name: "mealType", label: "Meal Type", type: "select", options: [
          { label: "Plated Dinner", value: "plated" },
          { label: "Buffet", value: "buffet" },
          { label: "Family Style", value: "family" },
          { label: "Cocktail/Appetizers Only", value: "cocktail" },
        ] },
        { name: "courses", label: "Number of Courses", type: "number", placeholder: "e.g. 3" },
        { name: "costPerHead", label: "Cost Per Person ($)", type: "number", placeholder: "e.g. 85" },
      ],
      calculate: (inputs) => {
        const guestCount = (inputs.guestCount as number) || 0;
        const mealType = (inputs.mealType as string) || "plated";
        const courses = (inputs.courses as number) || 3;
        const costPerHead = (inputs.costPerHead as number) || 0;
        if (guestCount <= 0) return null;
        const buf = mealType === "buffet" ? 1.25 : mealType === "family" ? 1.15 : mealType === "cocktail" ? 1.3 : 1.05;
        const portions = Math.ceil(guestCount * buf);
        const totalCost = guestCount * costPerHead;
        const apps = mealType === "cocktail" ? guestCount * 12 : guestCount * 4;
        const meat = Math.ceil(guestCount * 0.5 * buf);
        const sides = Math.ceil(guestCount * 0.33 * courses * buf);
        return {
          primary: { label: "Total Food Portions", value: formatNumber(portions) },
          details: [
            { label: "Total Catering Cost", value: "$" + formatNumber(totalCost, 2) },
            { label: "Appetizer Pieces Needed", value: formatNumber(apps) },
            { label: "Main Protein (lbs)", value: formatNumber(meat) },
            { label: "Side Dishes (lbs)", value: formatNumber(sides) },
            { label: "Buffer Portions", value: formatNumber(portions - guestCount) },
          ],
        };
      },
    },
    {
      id: "appetizersOnly",
      name: "Appetizers Only",
      fields: [
        { name: "guestCount", label: "Number of Guests", type: "number", placeholder: "e.g. 100" },
        { name: "eventDuration", label: "Event Duration (hours)", type: "number", placeholder: "e.g. 3" },
        { name: "varietyCount", label: "Number of Varieties", type: "number", placeholder: "e.g. 6" },
        { name: "costPerPiece", label: "Cost Per Piece ($)", type: "number", placeholder: "e.g. 3" },
      ],
      calculate: (inputs) => {
        const guestCount = (inputs.guestCount as number) || 0;
        const eventDuration = (inputs.eventDuration as number) || 2;
        const varietyCount = (inputs.varietyCount as number) || 6;
        const costPerPiece = (inputs.costPerPiece as number) || 3;
        if (guestCount <= 0) return null;
        const totalPieces = Math.ceil(guestCount * 4 * eventDuration * 1.1);
        const piecesPerVariety = Math.ceil(totalPieces / varietyCount);
        const totalCost = totalPieces * costPerPiece;
        return {
          primary: { label: "Total Pieces Needed", value: formatNumber(totalPieces) },
          details: [
            { label: "Pieces Per Variety", value: formatNumber(piecesPerVariety) },
            { label: "Pieces Per Guest", value: formatNumber(Math.ceil(totalPieces / guestCount)) },
            { label: "Total Estimated Cost", value: "$" + formatNumber(totalCost, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wedding-guest-list", "wedding-drink", "wedding-cake-size"],
  faq: [
    { question: "How much food per person for a buffet?", answer: "For a buffet, plan 1.25 portions per person to account for guests taking larger servings. For protein, plan about 6-8 oz per person, and 4-6 oz per side dish." },
    { question: "How many appetizers per person?", answer: "Plan 4-6 appetizer pieces per person per hour for a cocktail reception. If appetizers precede a full meal, 3-4 pieces per person is sufficient." },
  ],
  formula: "Total Portions = Guest Count x Buffer Multiplier (varies by service style)",
};
