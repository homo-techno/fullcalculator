import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const roadTripFuelPlannerCalculator: CalculatorDefinition = {
  slug: "road-trip-fuel-planner-calculator",
  title: "Road Trip Fuel Planner Calculator",
  description: "Plan fuel stops and total fuel costs for a road trip based on distance, vehicle efficiency, and tank size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["road trip fuel planner","gas stop planner","fuel stop calculator","road trip gas cost"],
  variants: [{
    id: "standard",
    name: "Road Trip Fuel Planner",
    description: "Plan fuel stops and total fuel costs for a road trip based on distance, vehicle efficiency, and tank size.",
    fields: [
      { name: "totalDistance", label: "Total Trip Distance (miles)", type: "number", min: 10, max: 10000, defaultValue: 500 },
      { name: "mpg", label: "Vehicle MPG", type: "number", min: 5, max: 100, defaultValue: 28 },
      { name: "tankSize", label: "Tank Size (gallons)", type: "number", min: 5, max: 50, defaultValue: 14 },
      { name: "gasPrice", label: "Avg Gas Price ($/gallon)", type: "number", min: 1, max: 10, defaultValue: 3.5 },
      { name: "refillAt", label: "Refill at % Tank Remaining", type: "number", min: 5, max: 50, defaultValue: 15 },
    ],
    calculate: (inputs) => {
    const totalDistance = inputs.totalDistance as number;
    const mpg = inputs.mpg as number;
    const tankSize = inputs.tankSize as number;
    const gasPrice = inputs.gasPrice as number;
    const refillAt = inputs.refillAt as number;
    const rangePerTank = mpg * tankSize;
    const usableRange = rangePerTank * (1 - refillAt / 100);
    const totalGallons = totalDistance / mpg;
    const totalFuelCost = totalGallons * gasPrice;
    const numStops = Math.max(Math.ceil(totalDistance / usableRange) - 1, 0);
    const milesPerStop = numStops > 0 ? Math.round(totalDistance / (numStops + 1)) : totalDistance;
    return {
      primary: { label: "Total Fuel Cost", value: "$" + formatNumber(Math.round(totalFuelCost * 100) / 100) },
      details: [
        { label: "Total Gallons Needed", value: formatNumber(Math.round(totalGallons * 10) / 10) },
        { label: "Range Per Tank", value: formatNumber(Math.round(rangePerTank)) + " miles" },
        { label: "Fuel Stops Needed", value: formatNumber(numStops) },
        { label: "Avg Miles Between Stops", value: formatNumber(milesPerStop) + " miles" },
        { label: "Cost Per Mile", value: "$" + formatNumber(Math.round(gasPrice / mpg * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["road-trip-cost-calculator","commute-cost-calculator","travel-budget-calculator"],
  faq: [
    { question: "How do I calculate fuel cost for a road trip?", answer: "Divide total distance by your vehicle MPG to get gallons needed, then multiply by the average gas price along your route." },
    { question: "How often should I stop for gas on a road trip?", answer: "Plan stops when your tank reaches about a quarter full. In remote areas, fill up whenever possible as stations may be far apart." },
    { question: "Does highway driving use more or less fuel?", answer: "Most vehicles are most efficient at 45 to 65 mph. Highway driving at moderate speeds is typically more fuel efficient than city driving, but speeds above 65 mph reduce efficiency." },
  ],
  formula: "Total Gallons = Distance / MPG
Total Fuel Cost = Total Gallons x Gas Price
Stops = ceil(Distance / Usable Range) - 1",
};
