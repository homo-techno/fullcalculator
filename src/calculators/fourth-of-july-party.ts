import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fourthOfJulyPartyCalculator: CalculatorDefinition = {
  slug: "fourth-of-july-party-calculator",
  title: "Fourth of July Party Cost Calculator",
  description:
    "Plan your Fourth of July celebration budget. Calculate costs for BBQ, fireworks, drinks, decorations, and activities for an Independence Day party.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "fourth of july",
    "independence day",
    "july 4th party",
    "bbq party",
    "fireworks cost",
  ],
  variants: [
    {
      id: "bbqParty",
      name: "BBQ Party Budget",
      description: "Plan a full 4th of July BBQ celebration",
      fields: [
        { name: "numGuests", label: "Number of Guests", type: "number", placeholder: "e.g. 25", defaultValue: 25 },
        { name: "meatPerPerson", label: "Meat per Person ($)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "sidesPerPerson", label: "Sides & Salads per Person ($)", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
        { name: "drinksPerPerson", label: "Drinks per Person ($)", type: "number", placeholder: "e.g. 5", defaultValue: 5 },
        { name: "dessert", label: "Dessert (watermelon, pie, etc.) ($)", type: "number", placeholder: "e.g. 25", defaultValue: 25 },
        { name: "fireworks", label: "Fireworks/Sparklers ($)", type: "number", placeholder: "e.g. 75", defaultValue: 75 },
        { name: "decorations", label: "Decorations ($)", type: "number", placeholder: "e.g. 30", defaultValue: 30 },
        { name: "charcoalPropane", label: "Charcoal/Propane ($)", type: "number", placeholder: "e.g. 15", defaultValue: 15 },
        { name: "supplies", label: "Plates, Cups, Utensils ($)", type: "number", placeholder: "e.g. 20", defaultValue: 20 },
      ],
      calculate: (inputs) => {
        const numGuests = parseFloat(inputs.numGuests as string) || 0;
        const meatPerPerson = parseFloat(inputs.meatPerPerson as string) || 0;
        const sidesPerPerson = parseFloat(inputs.sidesPerPerson as string) || 0;
        const drinksPerPerson = parseFloat(inputs.drinksPerPerson as string) || 0;
        const dessert = parseFloat(inputs.dessert as string) || 0;
        const fireworks = parseFloat(inputs.fireworks as string) || 0;
        const decorations = parseFloat(inputs.decorations as string) || 0;
        const charcoalPropane = parseFloat(inputs.charcoalPropane as string) || 0;
        const supplies = parseFloat(inputs.supplies as string) || 0;

        if (numGuests <= 0) return null;

        const meatTotal = numGuests * meatPerPerson;
        const sidesTotal = numGuests * sidesPerPerson;
        const drinksTotal = numGuests * drinksPerPerson;
        const foodDrinkTotal = meatTotal + sidesTotal + drinksTotal + dessert;
        const fixedCosts = fireworks + decorations + charcoalPropane + supplies;
        const grandTotal = foodDrinkTotal + fixedCosts;
        const costPerGuest = grandTotal / numGuests;

        return {
          primary: { label: "Total Party Cost", value: `$${formatNumber(grandTotal, 2)}` },
          details: [
            { label: "Meat/Protein", value: `$${formatNumber(meatTotal, 2)}` },
            { label: "Sides & Salads", value: `$${formatNumber(sidesTotal, 2)}` },
            { label: "Drinks", value: `$${formatNumber(drinksTotal, 2)}` },
            { label: "Dessert", value: `$${formatNumber(dessert, 2)}` },
            { label: "Fireworks/Sparklers", value: `$${formatNumber(fireworks, 2)}` },
            { label: "Decorations", value: `$${formatNumber(decorations, 2)}` },
            { label: "Charcoal/Propane", value: `$${formatNumber(charcoalPropane, 2)}` },
            { label: "Cost per Guest", value: `$${formatNumber(costPerGuest, 2)}` },
          ],
        };
      },
    },
    {
      id: "fireworksBudget",
      name: "Fireworks Budget",
      description: "Plan your personal fireworks show budget",
      fields: [
        { name: "showLength", label: "Show Length (minutes)", type: "number", placeholder: "e.g. 15", defaultValue: 15 },
        { name: "showType", label: "Show Type", type: "select", options: [
          { label: "Sparklers & fountains only", value: "basic" },
          { label: "Mix of ground & aerial", value: "mix" },
          { label: "Mostly aerials", value: "aerials" },
          { label: "Premium show", value: "premium" },
        ], defaultValue: "mix" },
        { name: "numSpectators", label: "Number of Spectators", type: "number", placeholder: "e.g. 20", defaultValue: 20 },
        { name: "sparklersPacks", label: "Sparkler Packs ($)", type: "number", placeholder: "e.g. 15", defaultValue: 15 },
      ],
      calculate: (inputs) => {
        const showLength = parseFloat(inputs.showLength as string) || 15;
        const showType = inputs.showType as string;
        const numSpectators = parseFloat(inputs.numSpectators as string) || 0;
        const sparklersPacks = parseFloat(inputs.sparklersPacks as string) || 0;

        const costPerMinute: Record<string, number> = { basic: 3, mix: 10, aerials: 20, premium: 40 };
        const perMin = costPerMinute[showType] || 10;
        const fireworksCost = showLength * perMin;
        const totalCost = fireworksCost + sparklersPacks;
        const costPerSpectator = numSpectators > 0 ? totalCost / numSpectators : 0;

        return {
          primary: { label: "Fireworks Budget", value: `$${formatNumber(totalCost, 2)}` },
          details: [
            { label: "Main Fireworks", value: `$${formatNumber(fireworksCost, 2)}` },
            { label: "Sparklers", value: `$${formatNumber(sparklersPacks, 2)}` },
            { label: "Cost per Minute", value: `$${formatNumber(perMin, 2)}` },
            { label: "Cost per Spectator", value: `$${formatNumber(costPerSpectator, 2)}` },
          ],
          note: "Always check local laws regarding fireworks before purchasing. Many areas restrict or ban consumer fireworks.",
        };
      },
    },
  ],
  relatedSlugs: ["superbowl-party-calculator", "new-years-party-calculator", "family-reunion-cost-calculator"],
  faq: [
    {
      question: "How much does a Fourth of July party cost?",
      answer:
        "A backyard BBQ for 20-30 people typically costs $200-$500. Food and drinks make up about 60-70% of the budget ($8-$15 per person). Fireworks add $50-$300, and decorations/supplies cost $30-$75.",
    },
    {
      question: "How much meat should I buy for a BBQ?",
      answer:
        "Plan for 1/2 pound of cooked meat per adult (about 2/3 to 3/4 pound raw). For a 25-person BBQ, buy about 15-18 pounds of raw meat. Hot dogs: 2 per person. Burgers: 1.5 per person. Mix different proteins for variety.",
    },
    {
      question: "Are consumer fireworks legal?",
      answer:
        "Laws vary widely by state and municipality. Most states allow some consumer fireworks, but many cities and counties restrict or ban them. Always check local ordinances before buying. Sparklers are legal in most areas but can still cause burns.",
    },
  ],
  formula:
    "Total = (Guests x Meat Cost) + (Guests x Sides Cost) + (Guests x Drinks) + Dessert + Fireworks + Decorations + Supplies",
};
