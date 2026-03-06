import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const feedConversionRatioCalculator: CalculatorDefinition = {
  slug: "feed-conversion-ratio-calculator",
  title: "Feed Conversion Ratio Calculator",
  description: "Calculate feed conversion ratio and cost of gain for livestock to evaluate feeding efficiency and compare diets.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["feed conversion ratio","FCR calculator","cost of gain livestock"],
  variants: [{
    id: "standard",
    name: "Feed Conversion Ratio",
    description: "Calculate feed conversion ratio and cost of gain for livestock to evaluate feeding efficiency and compare diets.",
    fields: [
      { name: "totalFeedConsumed", label: "Total Feed Consumed (lb)", type: "number", min: 10, max: 10000000, defaultValue: 15000 },
      { name: "totalWeightGain", label: "Total Weight Gain (lb)", type: "number", min: 1, max: 5000000, defaultValue: 9000 },
      { name: "feedCostPerTon", label: "Feed Cost ($/ton)", type: "number", min: 50, max: 2000, defaultValue: 300 },
      { name: "numHead", label: "Number of Head", type: "number", min: 1, max: 50000, defaultValue: 100 },
      { name: "daysOnFeed", label: "Days on Feed", type: "number", min: 1, max: 365, defaultValue: 150 },
    ],
    calculate: (inputs) => {
      const tfc = inputs.totalFeedConsumed as number;
      const twg = inputs.totalWeightGain as number;
      const fcpt = inputs.feedCostPerTon as number;
      const nh = inputs.numHead as number;
      const dof = inputs.daysOnFeed as number;
      if (!tfc || !twg || !fcpt || !nh || !dof) return null;
      const fcr = Math.round(tfc / twg * 100) / 100;
      const costOfGain = Math.round(fcr * fcpt / 2000 * 100) / 100;
      const dailyGainPerHead = Math.round(twg / nh / dof * 100) / 100;
      const dailyFeedPerHead = Math.round(tfc / nh / dof * 100) / 100;
      const totalFeedCost = Math.round(tfc / 2000 * fcpt);
      return {
        primary: { label: "Feed Conversion Ratio", value: formatNumber(fcr) + ":1" },
        details: [
          { label: "Cost of Gain", value: "$" + formatNumber(costOfGain) + "/lb" },
          { label: "Daily Gain Per Head", value: formatNumber(dailyGainPerHead) + " lb" },
          { label: "Daily Feed Per Head", value: formatNumber(dailyFeedPerHead) + " lb" },
          { label: "Total Feed Cost", value: "$" + formatNumber(totalFeedCost) },
        ],
      };
  },
  }],
  relatedSlugs: ["livestock-feed-calculator","cattle-weight-gain-calculator"],
  faq: [
    { question: "What is a good feed conversion ratio for cattle?", answer: "Feedlot cattle typically achieve an FCR of 5.5:1 to 7:1, meaning 5.5 to 7 pounds of feed per pound of gain. Poultry has the best FCR at 1.6:1 to 2:1, and swine averages 2.5:1 to 3.5:1." },
    { question: "How can I improve feed conversion?", answer: "Improve FCR through better genetics, optimized rations, proper feed processing, managing animal health, maintaining comfortable housing temperatures, and minimizing feed waste." },
  ],
  formula: "FCR = Total Feed Consumed / Total Weight Gain; Cost of Gain = FCR x Feed Cost Per Pound; Daily Gain = Total Gain / Head / Days",
};
