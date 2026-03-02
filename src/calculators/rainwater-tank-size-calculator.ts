import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rainwaterTankSizeCalculator: CalculatorDefinition = {
  slug: "rainwater-tank-size-calculator",
  title: "Rainwater Tank Size Calculator",
  description: "Determine the optimal rainwater storage tank size based on roof area, rainfall patterns, and daily water usage requirements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["rainwater tank","water tank sizing","cistern calculator","rain storage","water storage tank"],
  variants: [{
    id: "standard",
    name: "Rainwater Tank Size",
    description: "Determine the optimal rainwater storage tank size based on roof area, rainfall patterns, and daily water usage requirements.",
    fields: [
      { name: "roofArea", label: "Roof Area (sq ft)", type: "number", min: 100, max: 10000, defaultValue: 2000 },
      { name: "monthlyRainfall", label: "Average Monthly Rainfall (inches)", type: "number", min: 0.5, max: 15, defaultValue: 3 },
      { name: "dailyUsage", label: "Daily Water Usage (gallons)", type: "number", min: 1, max: 200, defaultValue: 50 },
      { name: "dryDays", label: "Longest Dry Spell (days)", type: "number", min: 1, max: 120, defaultValue: 30 },
    ],
    calculate: (inputs) => {
    const roofArea = inputs.roofArea as number;
    const monthlyRainfall = inputs.monthlyRainfall as number;
    const dailyUsage = inputs.dailyUsage as number;
    const dryDays = inputs.dryDays as number;
    const monthlyCollection = roofArea * monthlyRainfall * 0.623 * 0.8;
    const dailyCollection = monthlyCollection / 30;
    const reserveNeeded = dailyUsage * dryDays;
    const recommendedTank = Math.ceil(reserveNeeded / 50) * 50;
    const surplusDeficit = dailyCollection - dailyUsage;
    const daysAutonomy = recommendedTank / dailyUsage;
    return {
      primary: { label: "Recommended Tank Size", value: formatNumber(recommendedTank) + " gallons" },
      details: [
        { label: "Daily Collection Potential", value: formatNumber(Math.round(dailyCollection)) + " gallons" },
        { label: "Daily Usage", value: formatNumber(dailyUsage) + " gallons" },
        { label: "Daily Surplus/Deficit", value: formatNumber(Math.round(surplusDeficit)) + " gallons" },
        { label: "Reserve for Dry Spell", value: formatNumber(reserveNeeded) + " gallons" },
        { label: "Days of Autonomy", value: formatNumber(Math.round(daysAutonomy)) + " days" }
      ]
    };
  },
  }],
  relatedSlugs: ["rainfall-collection-calculator","rainwater-harvesting-calculator","solar-panel-payback-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Monthly Collection = Roof Area x Rainfall x 0.623 x 0.8
Reserve = Daily Usage x Dry Days
Recommended Tank = Reserve rounded up to nearest 50 gallons",
};
