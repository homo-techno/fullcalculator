import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sunscreenUsageCalculator: CalculatorDefinition = {
  slug: "sunscreen-usage-calculator",
  title: "Sunscreen Usage Calculator",
  description: "Calculate the amount of sunscreen needed for proper protection.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["sunscreen amount","sunscreen usage","spf coverage","sun protection"],
  variants: [{
    id: "standard",
    name: "Sunscreen Usage",
    description: "Calculate the amount of sunscreen needed for proper protection.",
    fields: [
      { name: "bodyAreas", label: "Coverage Area", type: "select", options: [{ value: "1", label: "Face Only" }, { value: "3", label: "Face and Arms" }, { value: "5", label: "Upper Body" }, { value: "9", label: "Full Body" }] },
      { name: "hoursOutdoors", label: "Hours Outdoors", type: "number", min: 1, max: 12, defaultValue: 4 },
      { name: "bottleSize", label: "Bottle Size (oz)", type: "number", min: 1, max: 16, defaultValue: 6 },
      { name: "bottleCost", label: "Bottle Cost ($)", type: "number", min: 5, max: 50, defaultValue: 12 },
    ],
    calculate: (inputs) => {
    const bodyAreas = parseInt(inputs.bodyAreas as string);
    const hoursOutdoors = inputs.hoursOutdoors as number;
    const bottleSize = inputs.bottleSize as number;
    const bottleCost = inputs.bottleCost as number;
    const ozPerApplication = bodyAreas * 0.11;
    const reapplications = Math.ceil(hoursOutdoors / 2);
    const dailyUsage = ozPerApplication * reapplications;
    const daysPerBottle = bottleSize / dailyUsage;
    const costPerDay = bottleCost / daysPerBottle;
    return {
      primary: { label: "Daily Sunscreen Needed", value: formatNumber(dailyUsage) + " oz" },
      details: [
        { label: "Applications Per Day", value: formatNumber(reapplications) },
        { label: "Days Per Bottle", value: formatNumber(daysPerBottle) },
        { label: "Cost Per Day", value: "$" + formatNumber(costPerDay) }
      ]
    };
  },
  }],
  relatedSlugs: ["skin-type-hydration-calculator","skincare-routine-cost-calculator"],
  faq: [
    { question: "How much sunscreen should I apply?", answer: "Use about 1 ounce (a shot glass full) for full body coverage." },
    { question: "How often should you reapply sunscreen?", answer: "Reapply every 2 hours, or immediately after swimming or sweating." },
    { question: "Does higher SPF mean better protection?", answer: "SPF 30 blocks 97 percent of UVB rays. SPF 50 blocks about 98 percent." },
  ],
  formula: "Daily Usage = (Body Areas x 0.11 oz) x (Hours / 2 reapplications)",
};
