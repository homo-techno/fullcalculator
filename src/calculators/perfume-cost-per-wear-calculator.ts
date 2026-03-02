import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const perfumeCostPerWearCalculator: CalculatorDefinition = {
  slug: "perfume-cost-per-wear-calculator",
  title: "Perfume Cost Per Wear Calculator",
  description: "Calculate the cost per use of your fragrance collection.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["perfume cost per wear","fragrance cost","perfume value"],
  variants: [{
    id: "standard",
    name: "Perfume Cost Per Wear",
    description: "Calculate the cost per use of your fragrance collection.",
    fields: [
      { name: "bottlePrice", label: "Bottle Price ($)", type: "number", min: 10, max: 1000, defaultValue: 120 },
      { name: "bottleSize", label: "Bottle Size (ml)", type: "number", min: 10, max: 200, defaultValue: 100 },
      { name: "spraysPerUse", label: "Sprays Per Use", type: "number", min: 1, max: 10, defaultValue: 4 },
      { name: "usesPerWeek", label: "Uses Per Week", type: "number", min: 1, max: 7, defaultValue: 5 },
    ],
    calculate: (inputs) => {
    const bottlePrice = inputs.bottlePrice as number;
    const bottleSize = inputs.bottleSize as number;
    const spraysPerUse = inputs.spraysPerUse as number;
    const usesPerWeek = inputs.usesPerWeek as number;
    const mlPerSpray = 0.1;
    const totalSprays = bottleSize / mlPerSpray;
    const totalUses = totalSprays / spraysPerUse;
    const costPerWear = bottlePrice / totalUses;
    const weeksToFinish = totalUses / usesPerWeek;
    return {
      primary: { label: "Cost Per Wear", value: "$" + formatNumber(costPerWear) },
      details: [
        { label: "Total Uses", value: formatNumber(totalUses) },
        { label: "Weeks to Finish", value: formatNumber(weeksToFinish) },
        { label: "Cost Per Month", value: "$" + formatNumber(costPerWear * usesPerWeek * 4.33) }
      ]
    };
  },
  }],
  relatedSlugs: ["skincare-routine-cost-calculator","makeup-expiration-calculator"],
  faq: [
    { question: "How many sprays are in a perfume bottle?", answer: "A 100ml bottle contains about 1000 sprays at 0.1ml per spray." },
    { question: "How many sprays of perfume should you use?", answer: "3 to 5 sprays is typical. More may be needed for lighter scents." },
    { question: "Is expensive perfume worth it?", answer: "Higher-priced perfumes often have better longevity and lower cost per wear." },
  ],
  formula: "Cost Per Wear = Bottle Price / (Total Sprays / Sprays Per Use)",
};
