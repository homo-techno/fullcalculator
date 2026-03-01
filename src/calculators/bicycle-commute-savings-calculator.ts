import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bicycleCommuteSavingsCalculator: CalculatorDefinition = {
  slug: "bicycle-commute-savings-calculator",
  title: "Bicycle Commute Savings Calculator",
  description: "Calculate how much money you save by commuting by bicycle instead of driving a car.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["bicycle commute savings", "bike vs car commute", "cycling savings calculator"],
  variants: [{
    id: "standard",
    name: "Bicycle Commute Savings",
    description: "Calculate how much money you save by commuting by bicycle instead of driving a car",
    fields: [
      { name: "commuteDistance", label: "One-Way Commute Distance", type: "number", suffix: "miles", min: 0.5, max: 50, step: 0.5, defaultValue: 8 },
      { name: "daysPerWeek", label: "Commute Days per Week", type: "number", suffix: "days", min: 1, max: 7, defaultValue: 5 },
      { name: "gasPrice", label: "Gas Price per Gallon", type: "number", prefix: "$", min: 1, max: 10, step: 0.01, defaultValue: 3.50 },
      { name: "carMpg", label: "Car Fuel Efficiency", type: "number", suffix: "mpg", min: 10, max: 60, defaultValue: 28 },
    ],
    calculate: (inputs) => {
      const distance = inputs.commuteDistance as number;
      const days = inputs.daysPerWeek as number;
      const gas = inputs.gasPrice as number;
      const mpg = inputs.carMpg as number;
      if (!distance || !days || !mpg) return null;
      const weeklyMiles = distance * 2 * days;
      const yearlyMiles = weeklyMiles * 50;
      const yearlyGasCost = (yearlyMiles / mpg) * gas;
      const yearlyCarCosts = yearlyMiles * 0.20;
      const totalCarCost = yearlyGasCost + yearlyCarCosts;
      const bikeCostPerYear = 200;
      const savings = totalCarCost - bikeCostPerYear;
      const co2Saved = yearlyMiles * 0.89;
      return {
        primary: { label: "Annual Savings", value: "$" + formatNumber(Math.round(savings)) },
        details: [
          { label: "Annual Car Commute Cost", value: "$" + formatNumber(Math.round(totalCarCost)) },
          { label: "Annual Bike Cost (Maintenance)", value: "$" + formatNumber(bikeCostPerYear) },
          { label: "CO2 Emissions Avoided", value: formatNumber(Math.round(co2Saved)) + " lbs" },
        ],
      };
    },
  }],
  relatedSlugs: ["led-conversion-savings-calculator", "zero-waste-savings-calculator"],
  faq: [
    { question: "How much can I save by biking to work?", answer: "Depending on your commute distance, most cyclists save between $2,000 and $5,000 per year compared to driving, including fuel, maintenance, and wear costs." },
    { question: "Is bicycle commuting practical year-round?", answer: "With proper rain gear, lights, and layered clothing, many cyclists commute year-round. Studded tires can help in icy conditions." },
  ],
  formula: "Savings = (Yearly Miles / MPG x Gas Price + Yearly Miles x Wear Cost) - Bike Maintenance",
};
