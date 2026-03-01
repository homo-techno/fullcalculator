import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const supplementCostCalculator: CalculatorDefinition = {
  slug: "supplement-cost-calculator",
  title: "Supplement Cost Calculator",
  description: "Calculate your daily and monthly supplement spending based on your supplement stack.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["supplement cost", "vitamin cost calculator", "supplement budget"],
  variants: [{
    id: "standard",
    name: "Supplement Cost",
    description: "Calculate your daily and monthly supplement spending based on your supplement stack",
    fields: [
      { name: "supplementCount", label: "Number of Supplements", type: "number", suffix: "supplements", min: 1, max: 20, defaultValue: 4 },
      { name: "avgCostPerBottle", label: "Average Cost per Bottle", type: "number", prefix: "$", min: 5, max: 200, defaultValue: 25 },
      { name: "avgServingsPerBottle", label: "Average Servings per Bottle", type: "number", suffix: "servings", min: 10, max: 300, defaultValue: 60 },
      { name: "dosesPerDay", label: "Total Doses per Day", type: "number", suffix: "doses", min: 1, max: 30, defaultValue: 6 },
    ],
    calculate: (inputs) => {
      const count = inputs.supplementCount as number;
      const costPerBottle = inputs.avgCostPerBottle as number;
      const servings = inputs.avgServingsPerBottle as number;
      const doses = inputs.dosesPerDay as number;
      if (!count || !servings || servings <= 0) return null;
      const costPerServing = costPerBottle / servings;
      const dailyCost = costPerServing * doses;
      const monthlyCost = dailyCost * 30;
      const yearlyCost = dailyCost * 365;
      const bottlesPerYear = Math.ceil((doses * 365) / servings);
      return {
        primary: { label: "Monthly Supplement Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
        details: [
          { label: "Daily Cost", value: "$" + formatNumber(Math.round(dailyCost * 100) / 100) },
          { label: "Annual Cost", value: "$" + formatNumber(Math.round(yearlyCost * 100) / 100) },
          { label: "Bottles per Year", value: formatNumber(bottlesPerYear) },
        ],
      };
    },
  }],
  relatedSlugs: ["caffeine-half-life-calculator", "steps-to-distance-calculator"],
  faq: [
    { question: "How much do supplements cost per month?", answer: "The average person taking 3 to 5 supplements spends $30 to $100 per month. Premium brands and specialized supplements can push costs higher." },
    { question: "Are expensive supplements worth the extra cost?", answer: "Not always. Look for third-party testing certifications rather than price as an indicator of quality. Many affordable brands offer excellent products." },
  ],
  formula: "Monthly Cost = (Cost per Bottle / Servings per Bottle) x Daily Doses x 30",
};
