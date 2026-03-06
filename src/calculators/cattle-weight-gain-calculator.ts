import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cattleWeightGainCalculator: CalculatorDefinition = {
  slug: "cattle-weight-gain-calculator",
  title: "Cattle Weight Gain Calculator",
  description: "Estimate average daily gain and total weight gain for cattle over a feeding period based on intake and feed efficiency.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cattle weight gain","average daily gain calculator","beef cattle growth"],
  variants: [{
    id: "standard",
    name: "Cattle Weight Gain",
    description: "Estimate average daily gain and total weight gain for cattle over a feeding period based on intake and feed efficiency.",
    fields: [
      { name: "startWeight", label: "Starting Weight (lb)", type: "number", min: 200, max: 2000, defaultValue: 550 },
      { name: "targetWeight", label: "Target Weight (lb)", type: "number", min: 300, max: 2500, defaultValue: 1300 },
      { name: "adg", label: "Average Daily Gain (lb/day)", type: "number", min: 0.5, max: 5, defaultValue: 2.8 },
      { name: "numHead", label: "Number of Head", type: "number", min: 1, max: 10000, defaultValue: 50 },
    ],
    calculate: (inputs) => {
      const sw = inputs.startWeight as number;
      const tw = inputs.targetWeight as number;
      const adg = inputs.adg as number;
      const nh = inputs.numHead as number;
      if (!sw || !tw || !adg || !nh || tw <= sw) return null;
      const gainPerHead = tw - sw;
      const daysOnFeed = Math.ceil(gainPerHead / adg);
      const totalGain = gainPerHead * nh;
      const weeksOnFeed = Math.round(daysOnFeed / 7 * 10) / 10;
      return {
        primary: { label: "Days on Feed", value: formatNumber(daysOnFeed) + " days" },
        details: [
          { label: "Gain Per Head", value: formatNumber(gainPerHead) + " lb" },
          { label: "Total Herd Gain", value: formatNumber(totalGain) + " lb" },
          { label: "Weeks on Feed", value: formatNumber(weeksOnFeed) },
        ],
      };
  },
  }],
  relatedSlugs: ["livestock-feed-calculator","hay-bale-calculator"],
  faq: [
    { question: "What is a good average daily gain for beef cattle?", answer: "Feedlot cattle typically gain 2.5 to 4 pounds per day depending on breed, diet, and management. Pasture-raised cattle average 1.5 to 2.5 pounds per day." },
    { question: "How does feed quality affect weight gain?", answer: "Higher energy feeds like grain produce faster gains. Cattle on a high-concentrate diet can gain 3 to 4 lb per day, while forage-only diets produce slower gains of 1 to 2 lb per day." },
  ],
  formula: "Average Daily Gain (ADG) = Total Weight Gain / Days on Feed; Days on Feed = (Target Weight - Start Weight) / ADG; Total Herd Gain = Gain Per Head x Number of Head",
};
