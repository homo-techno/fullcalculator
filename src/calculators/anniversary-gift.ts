import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const anniversaryGiftCalculator: CalculatorDefinition = {
  slug: "anniversary-gift",
  title: "Anniversary Gift Guide Calculator",
  description: "Free anniversary gift guide calculator. Get gift suggestions and budget guidance based on your anniversary year and relationship.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["anniversary gift", "anniversary year", "wedding anniversary", "gift guide", "anniversary ideas"],
  variants: [
    {
      id: "byYear",
      name: "By Anniversary Year",
      fields: [
        { name: "anniversaryYear", label: "Anniversary Year", type: "number", placeholder: "e.g. 5" },
        { name: "budget", label: "Gift Budget ($)", type: "number", placeholder: "e.g. 200" },
        { name: "giftType", label: "Gift Preference", type: "select", options: [
          { label: "Traditional Theme", value: "traditional" },
          { label: "Modern Theme", value: "modern" },
          { label: "Experience/Activity", value: "experience" },
          { label: "Practical/Useful", value: "practical" },
        ] },
      ],
      calculate: (inputs) => {
        const anniversaryYear = (inputs.anniversaryYear as number) || 0;
        const budget = (inputs.budget as number) || 200;
        const giftType = (inputs.giftType as string) || "traditional";
        if (anniversaryYear <= 0) return null;
        const traditionalThemes: Record<number, string> = {
          1: "Paper", 2: "Cotton", 3: "Leather", 4: "Fruit/Flowers", 5: "Wood",
          10: "Tin/Aluminum", 15: "Crystal", 20: "China", 25: "Silver",
          30: "Pearl", 40: "Ruby", 50: "Gold", 60: "Diamond",
        };
        const modernThemes: Record<number, string> = {
          1: "Clock", 2: "China", 3: "Crystal/Glass", 4: "Appliances", 5: "Silverware",
          10: "Diamond Jewelry", 15: "Watch", 20: "Platinum", 25: "Sterling Silver",
          30: "Diamond", 40: "Ruby", 50: "Gold", 60: "Diamond",
        };
        const traditional = traditionalThemes[anniversaryYear] || "Gift of Choice";
        const modern = modernThemes[anniversaryYear] || "Gift of Choice";
        const milestoneYears = [1, 5, 10, 15, 20, 25, 30, 40, 50, 60];
        const isMilestone = milestoneYears.includes(anniversaryYear);
        const suggestedBudget = isMilestone ? budget * 1.5 : budget;
        const giftWrap = suggestedBudget * 0.05;
        const cardCost = 8;
        return {
          primary: { label: "Year " + formatNumber(anniversaryYear) + " Anniversary", value: "$" + formatNumber(suggestedBudget, 2) + " budget" },
          details: [
            { label: "Traditional Theme", value: traditional },
            { label: "Modern Theme", value: modern },
            { label: "Milestone Anniversary?", value: isMilestone ? "Yes!" : "No" },
            { label: "Suggested Gift Budget", value: "$" + formatNumber(suggestedBudget, 2) },
            { label: "Gift Wrap & Card", value: "$" + formatNumber(giftWrap + cardCost, 2) },
            { label: "Total With Extras", value: "$" + formatNumber(suggestedBudget + giftWrap + cardCost, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wedding-registry", "honeymoon-budget", "engagement-ring-budget"],
  faq: [
    { question: "What are the traditional anniversary gift themes?", answer: "Traditional themes include: 1st-Paper, 2nd-Cotton, 3rd-Leather, 5th-Wood, 10th-Tin, 15th-Crystal, 20th-China, 25th-Silver, 50th-Gold, 60th-Diamond." },
    { question: "How much should you spend on an anniversary gift?", answer: "There is no set rule, but many couples spend $50-$200 for regular years and $200-$500+ for milestone anniversaries (5th, 10th, 25th, 50th)." },
  ],
  formula: "Suggested Budget = Base Budget x (1.5 for milestone years)",
};
