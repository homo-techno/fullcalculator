import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const valentinesDateCostCalculator: CalculatorDefinition = {
  slug: "valentines-date-cost-calculator",
  title: "Valentine's Day Date Budget Calculator",
  description:
    "Plan your Valentine's Day date budget. Calculate total costs for dinner, gifts, flowers, and activities to create a memorable evening without overspending.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "valentines day",
    "date budget",
    "valentines cost",
    "romantic dinner",
    "valentines planner",
  ],
  variants: [
    {
      id: "dinnerDate",
      name: "Dinner Date Planner",
      description: "Plan the costs for a Valentine's dinner date",
      fields: [
        { name: "dinnerCost", label: "Dinner for Two ($)", type: "number", placeholder: "e.g. 100", defaultValue: 100 },
        { name: "tipPercent", label: "Tip Percentage (%)", type: "number", placeholder: "e.g. 20", defaultValue: 20 },
        { name: "flowersCost", label: "Flowers ($)", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
        { name: "giftCost", label: "Gift ($)", type: "number", placeholder: "e.g. 60", defaultValue: 60 },
        { name: "activityCost", label: "Activity/Entertainment ($)", type: "number", placeholder: "e.g. 30", defaultValue: 30 },
        { name: "transportCost", label: "Transportation ($)", type: "number", placeholder: "e.g. 25", defaultValue: 25 },
        { name: "cardCost", label: "Card ($)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
      ],
      calculate: (inputs) => {
        const dinnerCost = parseFloat(inputs.dinnerCost as string);
        const tipPercent = parseFloat(inputs.tipPercent as string);
        const flowersCost = parseFloat(inputs.flowersCost as string);
        const giftCost = parseFloat(inputs.giftCost as string);
        const activityCost = parseFloat(inputs.activityCost as string);
        const transportCost = parseFloat(inputs.transportCost as string);
        const cardCost = parseFloat(inputs.cardCost as string);

        if (isNaN(dinnerCost)) return null;

        const tip = (dinnerCost || 0) * ((tipPercent || 0) / 100);
        const dinnerTotal = (dinnerCost || 0) + tip;
        const grandTotal = dinnerTotal + (flowersCost || 0) + (giftCost || 0) + (activityCost || 0) + (transportCost || 0) + (cardCost || 0);

        return {
          primary: { label: "Total Date Cost", value: `$${formatNumber(grandTotal, 2)}` },
          details: [
            { label: "Dinner + Tip", value: `$${formatNumber(dinnerTotal, 2)}` },
            { label: "Tip Amount", value: `$${formatNumber(tip, 2)}` },
            { label: "Flowers", value: `$${formatNumber(flowersCost || 0, 2)}` },
            { label: "Gift", value: `$${formatNumber(giftCost || 0, 2)}` },
            { label: "Activity/Entertainment", value: `$${formatNumber(activityCost || 0, 2)}` },
            { label: "Transportation", value: `$${formatNumber(transportCost || 0, 2)}` },
            { label: "Card", value: `$${formatNumber(cardCost || 0, 2)}` },
          ],
        };
      },
    },
    {
      id: "budgetFriendly",
      name: "Budget-Friendly Options",
      description: "Compare different date tiers from budget to luxury",
      fields: [
        { name: "dateTier", label: "Date Tier", type: "select", options: [
          { label: "Budget ($50-$75)", value: "budget" },
          { label: "Mid-Range ($100-$200)", value: "mid" },
          { label: "Upscale ($200-$400)", value: "upscale" },
          { label: "Luxury ($400+)", value: "luxury" },
        ], defaultValue: "mid" },
        { name: "includeFlowers", label: "Include Flowers?", type: "select", options: [
          { label: "No flowers", value: "0" },
          { label: "Simple bouquet ($20)", value: "20" },
          { label: "Dozen roses ($50)", value: "50" },
          { label: "Premium arrangement ($100)", value: "100" },
        ], defaultValue: "50" },
        { name: "includeGift", label: "Include Gift?", type: "select", options: [
          { label: "No gift", value: "0" },
          { label: "Small gift ($25)", value: "25" },
          { label: "Medium gift ($75)", value: "75" },
          { label: "Large gift ($150+)", value: "150" },
        ], defaultValue: "75" },
      ],
      calculate: (inputs) => {
        const dateTier = inputs.dateTier as string;
        const includeFlowers = parseFloat(inputs.includeFlowers as string);
        const includeGift = parseFloat(inputs.includeGift as string);

        const tierCosts: Record<string, { dinner: number; activity: number; transport: number }> = {
          budget: { dinner: 40, activity: 10, transport: 10 },
          mid: { dinner: 90, activity: 30, transport: 20 },
          upscale: { dinner: 180, activity: 60, transport: 40 },
          luxury: { dinner: 350, activity: 100, transport: 60 },
        };

        const tier = tierCosts[dateTier] || tierCosts.mid;
        const tipAmount = tier.dinner * 0.2;
        const dinnerTotal = tier.dinner + tipAmount;
        const flowers = includeFlowers || 0;
        const gift = includeGift || 0;
        const grandTotal = dinnerTotal + tier.activity + tier.transport + flowers + gift + 8;

        return {
          primary: { label: "Estimated Total", value: `$${formatNumber(grandTotal, 2)}` },
          details: [
            { label: "Dinner + 20% Tip", value: `$${formatNumber(dinnerTotal, 2)}` },
            { label: "Activity/Entertainment", value: `$${formatNumber(tier.activity, 2)}` },
            { label: "Transportation", value: `$${formatNumber(tier.transport, 2)}` },
            { label: "Flowers", value: `$${formatNumber(flowers, 2)}` },
            { label: "Gift", value: `$${formatNumber(gift, 2)}` },
            { label: "Card", value: `$${formatNumber(8, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["christmas-budget-calculator", "budget-calculator", "dinner-party-calculator"],
  faq: [
    {
      question: "How much should I spend on Valentine's Day?",
      answer:
        "The average American spends about $175 on Valentine's Day. However, the right amount depends on your relationship, financial situation, and what's meaningful to your partner. A heartfelt homemade gesture can be more valued than an expensive gift.",
    },
    {
      question: "Why are flowers more expensive on Valentine's Day?",
      answer:
        "Demand spikes dramatically around February 14th. Red roses can cost 2-3x more than usual. To save, consider ordering a week early, choosing alternative flowers like tulips or lilies, or buying from a local farmer's market.",
    },
    {
      question: "What are affordable Valentine's Day date ideas?",
      answer:
        "Cook a nice dinner at home, have a movie marathon with homemade popcorn, take a scenic walk or hike, visit a free museum, stargaze, or write each other love letters. Thoughtful beats expensive.",
    },
  ],
  formula:
    "Total Cost = Dinner + Tip + Flowers + Gift + Activity + Transportation + Card",
};
