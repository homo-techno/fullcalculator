import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aquacultureFeedRateCalculator: CalculatorDefinition = {
  slug: "aquaculture-feed-rate-calculator",
  title: "Aquaculture Feed Rate Calculator",
  description: "Calculate daily feed amounts, feed conversion ratio, and total feed costs for fish farming operations.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["aquaculture feed rate","fish feed calculator","fish farm feed cost"],
  variants: [{
    id: "standard",
    name: "Aquaculture Feed Rate",
    description: "Calculate daily feed amounts, feed conversion ratio, and total feed costs for fish farming operations.",
    fields: [
      { name: "totalBiomass", label: "Total Fish Biomass (lb)", type: "number", min: 10, max: 1000000, defaultValue: 5000 },
      { name: "feedRate", label: "Feed Rate (% body weight/day)", type: "number", min: 0.5, max: 10, defaultValue: 3 },
      { name: "fcr", label: "Feed Conversion Ratio", type: "number", min: 0.8, max: 5, defaultValue: 1.6 },
      { name: "feedCostPerLb", label: "Feed Cost ($/lb)", type: "number", min: 0.1, max: 5, defaultValue: 0.55 },
      { name: "growoutDays", label: "Grow-out Period (days)", type: "number", min: 30, max: 730, defaultValue: 180 },
    ],
    calculate: (inputs) => {
      const tb = inputs.totalBiomass as number;
      const fr = inputs.feedRate as number;
      const fcr = inputs.fcr as number;
      const fcl = inputs.feedCostPerLb as number;
      const days = inputs.growoutDays as number;
      if (!tb || !fr || !fcr || !fcl || !days) return null;
      const dailyFeed = Math.round(tb * fr / 100 * 100) / 100;
      const totalFeed = Math.round(dailyFeed * days);
      const expectedGain = Math.round(totalFeed / fcr);
      const totalFeedCost = Math.round(totalFeed * fcl * 100) / 100;
      const costPerLbGain = Math.round(fcr * fcl * 100) / 100;
      return {
        primary: { label: "Daily Feed Amount", value: formatNumber(dailyFeed) + " lb" },
        details: [
          { label: "Total Feed Needed", value: formatNumber(totalFeed) + " lb" },
          { label: "Expected Weight Gain", value: formatNumber(expectedGain) + " lb" },
          { label: "Total Feed Cost", value: "$" + formatNumber(totalFeedCost) },
          { label: "Feed Cost Per Lb Gain", value: "$" + formatNumber(costPerLbGain) },
        ],
      };
  },
  }],
  relatedSlugs: ["aquaponics-sizing-calculator","livestock-feed-calculator"],
  faq: [
    { question: "What is a good feed conversion ratio for fish?", answer: "Tilapia and catfish typically achieve FCR of 1.4 to 1.8. Salmon and trout can reach 1.0 to 1.3. Lower FCR means more efficient feed use and lower production costs." },
    { question: "How often should fish be fed?", answer: "Most farmed fish are fed 2 to 4 times daily. Young fry may need feeding 4 to 6 times per day. Feeding frequency decreases as fish grow larger." },
  ],
  formula: "Daily Feed = Total Biomass x Feed Rate %
Expected Gain = Total Feed / Feed Conversion Ratio
Feed Cost Per Lb Gain = FCR x Feed Price Per Lb",
};
