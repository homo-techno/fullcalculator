import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pointsValueCalculator: CalculatorDefinition = {
  slug: "points-value-calculator",
  title: "Points Value Calculator",
  description: "Calculate the monetary value of credit card or airline reward points and determine the best redemption option.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["points value calculator","reward points value","airline miles value"],
  variants: [{
    id: "standard",
    name: "Points Value",
    description: "Calculate the monetary value of credit card or airline reward points and determine the best redemption option.",
    fields: [
      { name: "totalPoints", label: "Total Points or Miles", type: "number", min: 100, max: 10000000, defaultValue: 50000 },
      { name: "cashValue", label: "Cash Redemption Value", type: "number", prefix: "$", min: 1, max: 100000, defaultValue: 500 },
      { name: "travelValue", label: "Travel Redemption Value", type: "number", prefix: "$", min: 1, max: 100000, defaultValue: 750 },
    ],
    calculate: (inputs) => {
      const points = inputs.totalPoints as number;
      const cashVal = inputs.cashValue as number;
      const travelVal = inputs.travelValue as number;
      if (!points || points <= 0) return null;
      const centsPerPointCash = (cashVal / points) * 100;
      const centsPerPointTravel = (travelVal / points) * 100;
      const betterOption = travelVal > cashVal ? "Travel" : "Cash";
      const bonusValue = Math.abs(travelVal - cashVal);
      return {
        primary: { label: "Best Redemption", value: betterOption + " ($" + formatNumber(Math.round(Math.max(cashVal, travelVal))) + ")" },
        details: [
          { label: "Cash Value Per Point", value: formatNumber(Math.round(centsPerPointCash * 100) / 100) + " cents" },
          { label: "Travel Value Per Point", value: formatNumber(Math.round(centsPerPointTravel * 100) / 100) + " cents" },
          { label: "Bonus for " + betterOption + " Redemption", value: "$" + formatNumber(Math.round(bonusValue)) },
          { label: "Total Points", value: formatNumber(points) },
        ],
      };
    },
  }],
  relatedSlugs: ["currency-exchange-calculator","travel-budget-calculator"],
  faq: [
    { question: "What is a good value per point for credit card rewards?", answer: "Most credit card points are worth 1 to 2 cents each for cash back. Through travel portals or transfer partners, you can often get 1.5 to 3 cents or more per point, making travel redemptions more valuable." },
    { question: "Should I save points or spend them regularly?", answer: "Points can be devalued over time through program changes. It is generally better to use them when you have a specific high-value redemption rather than hoarding indefinitely. Set a target and save toward it." },
  ],
  formula: "Cash Value Per Point = Cash Redemption / Total Points; Travel Value Per Point = Travel Redemption / Total Points",
};
