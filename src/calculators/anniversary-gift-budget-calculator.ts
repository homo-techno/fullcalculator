import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const anniversaryGiftBudgetCalculator: CalculatorDefinition = {
  slug: "anniversary-gift-budget-calculator",
  title: "Anniversary Gift Budget Calculator",
  description: "Plan anniversary celebration spending including a traditional or modern gift, dinner, flowers, and a special experience.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["anniversary gift budget","anniversary celebration cost","anniversary planning","wedding anniversary gift"],
  variants: [{
    id: "standard",
    name: "Anniversary Gift Budget",
    description: "Plan anniversary celebration spending including a traditional or modern gift, dinner, flowers, and a special experience.",
    fields: [
      { name: "giftBudget", label: "Gift Budget ($)", type: "number", min: 10, max: 10000, defaultValue: 200 },
      { name: "dinnerBudget", label: "Dinner Budget ($)", type: "number", min: 0, max: 2000, defaultValue: 150 },
      { name: "flowersBudget", label: "Flowers Budget ($)", type: "number", min: 0, max: 500, defaultValue: 75 },
      { name: "experienceBudget", label: "Experience/Activity ($)", type: "number", min: 0, max: 5000, defaultValue: 100 },
      { name: "cardAndExtras", label: "Card and Extras ($)", type: "number", min: 0, max: 200, defaultValue: 25 },
    ],
    calculate: (inputs) => {
    const gift = inputs.giftBudget as number;
    const dinner = inputs.dinnerBudget as number;
    const flowers = inputs.flowersBudget as number;
    const experience = inputs.experienceBudget as number;
    const extras = inputs.cardAndExtras as number;
    const total = gift + dinner + flowers + experience + extras;
    const giftPct = total > 0 ? (gift / total) * 100 : 0;
    return {
      primary: { label: "Total Anniversary Budget", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Gift", value: "$" + formatNumber(gift) },
        { label: "Dinner", value: "$" + formatNumber(dinner) },
        { label: "Flowers", value: "$" + formatNumber(flowers) },
        { label: "Experience/Activity", value: "$" + formatNumber(experience) },
        { label: "Card and Extras", value: "$" + formatNumber(extras) },
        { label: "Gift as % of Total", value: formatNumber(Math.round(giftPct)) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["birthday-milestone-cost-calculator","wedding-budget-calculator","honeymoon-budget-planner-calculator"],
  faq: [
    { question: "How much should you spend on an anniversary gift?", answer: "There is no fixed rule, but common ranges are $50-$150 for early anniversaries and $200-$500 or more for milestone years like 10th, 25th, or 50th." },
    { question: "What are the traditional anniversary gift themes?", answer: "Traditional themes include paper (1st), cotton (2nd), leather (3rd), wood (5th), tin (10th), silver (25th), and gold (50th). Modern alternatives also exist for each year." },
    { question: "Is an experience better than a physical gift?", answer: "Experiences like trips, cooking classes, or spa days create lasting memories and are increasingly popular as anniversary gifts, especially for couples who prefer minimal material possessions." },
  ],
  formula: "Total = Gift + Dinner + Flowers + Experience + Extras
Gift Percentage = (Gift / Total) x 100",
};
