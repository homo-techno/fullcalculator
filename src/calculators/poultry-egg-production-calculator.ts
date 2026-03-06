import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const poultryEggProductionCalculator: CalculatorDefinition = {
  slug: "poultry-egg-production-calculator",
  title: "Poultry Egg Production Calculator",
  description: "Calculate expected egg production, revenue, and feed costs for a laying flock over a production cycle.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["egg production calculator","laying hen calculator","poultry farm production"],
  variants: [{
    id: "standard",
    name: "Poultry Egg Production",
    description: "Calculate expected egg production, revenue, and feed costs for a laying flock over a production cycle.",
    fields: [
      { name: "numHens", label: "Number of Laying Hens", type: "number", min: 1, max: 100000, defaultValue: 200 },
      { name: "layRate", label: "Laying Rate (%)", type: "number", min: 30, max: 100, defaultValue: 75 },
      { name: "eggPrice", label: "Price Per Dozen ($)", type: "number", min: 0.5, max: 20, defaultValue: 3.5 },
      { name: "feedCostPerBag", label: "Feed Cost Per 50lb Bag ($)", type: "number", min: 5, max: 100, defaultValue: 18 },
      { name: "weeks", label: "Production Period (weeks)", type: "number", min: 1, max: 104, defaultValue: 52 },
    ],
    calculate: (inputs) => {
      const hens = inputs.numHens as number;
      const rate = inputs.layRate as number;
      const price = inputs.eggPrice as number;
      const feedCost = inputs.feedCostPerBag as number;
      const weeks = inputs.weeks as number;
      if (!hens || !rate || !price || !feedCost || !weeks) return null;
      const days = weeks * 7;
      const totalEggs = Math.round(hens * (rate / 100) * days);
      const dozens = Math.round(totalEggs / 12);
      const revenue = Math.round(dozens * price * 100) / 100;
      const feedLbPerHenDay = 0.25;
      const totalFeedLbs = Math.round(hens * feedLbPerHenDay * days);
      const totalFeedCost = Math.round(totalFeedLbs / 50 * feedCost * 100) / 100;
      const profit = Math.round((revenue - totalFeedCost) * 100) / 100;
      return {
        primary: { label: "Total Eggs Produced", value: formatNumber(totalEggs) },
        details: [
          { label: "Dozens", value: formatNumber(dozens) },
          { label: "Egg Revenue", value: "$" + formatNumber(revenue) },
          { label: "Feed Cost", value: "$" + formatNumber(totalFeedCost) },
          { label: "Net Profit", value: "$" + formatNumber(profit) },
        ],
      };
  },
  }],
  relatedSlugs: ["livestock-feed-calculator","cattle-weight-gain-calculator"],
  faq: [
    { question: "How many eggs does a hen lay per year?", answer: "A productive laying hen produces approximately 250 to 300 eggs per year, which translates to a 70 to 82 percent lay rate." },
    { question: "When do hens stop laying eggs?", answer: "Hens produce the most eggs in their first two years. Production drops by about 10 to 15 percent each year after that." },
  ],
  formula: "Total Eggs = Number of Hens x Lay Rate x Days; Revenue = (Total Eggs / 12) x Price Per Dozen; Feed Cost = Hens x 0.25 lb/day x Days / 50 x Bag Price",
};
