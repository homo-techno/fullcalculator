import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const buffetQuantityCalculator: CalculatorDefinition = {
  slug: "buffet-quantity-calculator",
  title: "Buffet Quantity Calculator",
  description: "Calculate how much food to prepare for a buffet event based on guest count, event duration, and number of menu items to avoid shortages and waste.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["buffet quantity","buffet food amount","event food quantity","how much food for buffet"],
  variants: [{
    id: "standard",
    name: "Buffet Quantity",
    description: "Calculate how much food to prepare for a buffet event based on guest count, event duration, and number of menu items to avoid shortages and waste.",
    fields: [
      { name: "guestCount", label: "Number of Guests", type: "number", min: 10, max: 2000, defaultValue: 100 },
      { name: "eventDuration", label: "Event Duration (hours)", type: "number", min: 1, max: 12, defaultValue: 3 },
      { name: "mealType", label: "Meal Type", type: "select", options: [{ value: "1", label: "Light Appetizers" }, { value: "2", label: "Heavy Appetizers / Cocktail" }, { value: "3", label: "Full Lunch Buffet" }, { value: "4", label: "Full Dinner Buffet" }], defaultValue: "4" },
      { name: "numEntrees", label: "Number of Entree Options", type: "number", min: 1, max: 10, defaultValue: 3 },
      { name: "numSides", label: "Number of Side Options", type: "number", min: 1, max: 10, defaultValue: 4 },
    ],
    calculate: (inputs) => {
    const guests = inputs.guestCount as number;
    const hours = inputs.eventDuration as number;
    const meal = parseInt(inputs.mealType as string);
    const entrees = inputs.numEntrees as number;
    const sides = inputs.numSides as number;
    const proteinOzPerGuest = { 1: 2, 2: 4, 3: 5, 4: 6 };
    const starchOzPerGuest = { 1: 1, 2: 3, 3: 4, 4: 5 };
    const proteinOz = (proteinOzPerGuest[meal] || 6) * guests;
    const starchOz = (starchOzPerGuest[meal] || 5) * guests;
    const veggieOz = guests * 4;
    const saladOz = guests * 2;
    const overage = 1.1;
    const totalProteinLbs = Math.ceil((proteinOz * overage) / 16);
    const totalStarchLbs = Math.ceil((starchOz * overage) / 16);
    const totalVegLbs = Math.ceil((veggieOz * overage) / 16);
    const totalSaladLbs = Math.ceil((saladOz * overage) / 16);
    const proteinPerEntree = Math.ceil(totalProteinLbs / entrees);
    const starchPerSide = Math.ceil(totalStarchLbs / sides);
    return {
      primary: { label: "Total Protein Needed", value: formatNumber(totalProteinLbs) + " lbs" },
      details: [
        { label: "Protein Per Entree Option", value: formatNumber(proteinPerEntree) + " lbs" },
        { label: "Total Starch/Grain", value: formatNumber(totalStarchLbs) + " lbs" },
        { label: "Starch Per Side Option", value: formatNumber(starchPerSide) + " lbs" },
        { label: "Total Vegetables", value: formatNumber(totalVegLbs) + " lbs" },
        { label: "Total Salad", value: formatNumber(totalSaladLbs) + " lbs" }
      ]
    };
  },
  }],
  relatedSlugs: ["catering-cost-per-head-calculator","banquet-hall-rental-cost-calculator"],
  faq: [
    { question: "How much food do I need per person for a buffet?", answer: "For a full dinner buffet, plan 6 ounces of protein, 5 ounces of starch, and 4 ounces of vegetables per person. For lighter events plan 3 to 4 ounces of protein. Always add 10 percent overage." },
    { question: "How do multiple entree options affect quantity?", answer: "With multiple entrees, divide total protein needed by the number of options. Guests tend to take smaller portions of each when there are more choices. Three entree options is the sweet spot for variety without waste." },
    { question: "How do I reduce buffet food waste?", answer: "Use smaller serving vessels and replenish frequently, offer fewer but well-chosen options, use action stations where food is prepared to order, and have take-away containers for guests at the end of the event." },
  ],
  formula: "Total Protein (lbs) = (Oz Per Guest x Guest Count x 1.10 overage) / 16; Per Entree Option = Total Protein / Number of Entrees; Total Starch (lbs) = (Oz Per Guest x Guest Count x 1.10) / 16",
};
