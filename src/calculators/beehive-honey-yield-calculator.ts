import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const beehiveHoneyYieldCalculator: CalculatorDefinition = {
  slug: "beehive-honey-yield-calculator",
  title: "Beehive Honey Yield Calculator",
  description: "Estimate annual honey production and revenue from your apiary based on hive count, local conditions, and harvest frequency.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["honey yield calculator","beekeeping calculator","apiary production estimator"],
  variants: [{
    id: "standard",
    name: "Beehive Honey Yield",
    description: "Estimate annual honey production and revenue from your apiary based on hive count, local conditions, and harvest frequency.",
    fields: [
      { name: "numHives", label: "Number of Hives", type: "number", min: 1, max: 5000, defaultValue: 10 },
      { name: "yieldPerHive", label: "Yield Per Hive (lb/year)", type: "number", min: 10, max: 200, defaultValue: 60 },
      { name: "honeyPrice", label: "Honey Price ($/lb)", type: "number", min: 2, max: 30, defaultValue: 8 },
      { name: "lossPct", label: "Colony Loss Rate (%)", type: "number", min: 0, max: 80, defaultValue: 20 },
      { name: "costPerHive", label: "Annual Cost Per Hive ($)", type: "number", min: 10, max: 500, defaultValue: 75 },
    ],
    calculate: (inputs) => {
      const nh = inputs.numHives as number;
      const yph = inputs.yieldPerHive as number;
      const hp = inputs.honeyPrice as number;
      const lp = inputs.lossPct as number;
      const cph = inputs.costPerHive as number;
      if (!nh || !yph || !hp || !cph) return null;
      const effectiveHives = Math.round(nh * (1 - lp / 100) * 10) / 10;
      const totalHoney = Math.round(effectiveHives * yph);
      const revenue = Math.round(totalHoney * hp * 100) / 100;
      const totalCost = Math.round(nh * cph);
      const profit = Math.round((revenue - totalCost) * 100) / 100;
      return {
        primary: { label: "Total Honey Yield", value: formatNumber(totalHoney) + " lb" },
        details: [
          { label: "Effective Hives", value: formatNumber(effectiveHives) },
          { label: "Revenue", value: "$" + formatNumber(revenue) },
          { label: "Total Costs", value: "$" + formatNumber(totalCost) },
          { label: "Net Profit", value: "$" + formatNumber(profit) },
        ],
      };
  },
  }],
  relatedSlugs: ["poultry-egg-production-calculator","farm-profit-margin-calculator"],
  faq: [
    { question: "How much honey does one hive produce?", answer: "An average hive produces 30 to 80 pounds of surplus honey per year depending on location, forage availability, weather, and colony strength. Exceptional hives can produce over 100 pounds." },
    { question: "What is the average colony loss rate?", answer: "US beekeepers experience an average annual colony loss of 30 to 45 percent. Good management practices can reduce losses to 15 to 20 percent." },
  ],
  formula: "Effective Hives = Total Hives x (1 - Loss Rate)
Total Honey = Effective Hives x Yield Per Hive
Profit = (Honey x Price) - (Hives x Cost Per Hive)",
};
