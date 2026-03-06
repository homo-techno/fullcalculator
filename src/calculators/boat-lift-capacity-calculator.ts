import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boatLiftCapacityCalculator: CalculatorDefinition = {
  slug: "boat-lift-capacity-calculator",
  title: "Boat Lift Capacity Calculator",
  description: "Determine the required boat lift capacity based on your boat weight, engine, fuel, and gear to choose the right lift for safe storage.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["boat lift capacity","boat lift size","boat hoist calculator","boat lift weight rating"],
  variants: [{
    id: "standard",
    name: "Boat Lift Capacity",
    description: "Determine the required boat lift capacity based on your boat weight, engine, fuel, and gear to choose the right lift for safe storage.",
    fields: [
      { name: "boatWeight", label: "Boat Dry Weight (lbs)", type: "number", min: 500, max: 50000, defaultValue: 4500 },
      { name: "engineWeight", label: "Engine Weight (lbs)", type: "number", min: 50, max: 3000, defaultValue: 500 },
      { name: "fuelCapacity", label: "Fuel Capacity (gallons)", type: "number", min: 5, max: 500, defaultValue: 60 },
      { name: "gearWeight", label: "Gear and Accessories (lbs)", type: "number", min: 0, max: 5000, defaultValue: 300 },
      { name: "safetyFactor", label: "Safety Factor (%)", type: "number", min: 10, max: 50, defaultValue: 25 },
    ],
    calculate: (inputs) => {
    const boat = inputs.boatWeight as number;
    const engine = inputs.engineWeight as number;
    const fuel = inputs.fuelCapacity as number * 6.3;
    const gear = inputs.gearWeight as number;
    const safety = inputs.safetyFactor as number / 100;
    const totalWeight = boat + engine + fuel + gear;
    const requiredCapacity = totalWeight * (1 + safety);
    const standardSizes = [3000, 4000, 5000, 6000, 7000, 8000, 10000, 12000, 15000, 20000, 25000];
    let recommended = 25000;
    for (let i = 0; i < standardSizes.length; i++) {
      if (standardSizes[i] >= requiredCapacity) { recommended = standardSizes[i]; break; }
    }
    const liftCostEst = recommended * 1.5;
    return {
      primary: { label: "Minimum Lift Capacity", value: formatNumber(Math.round(requiredCapacity)) + " lbs" },
      details: [
        { label: "Total Boat Weight", value: formatNumber(Math.round(totalWeight)) + " lbs" },
        { label: "Fuel Weight", value: formatNumber(Math.round(fuel)) + " lbs" },
        { label: "Recommended Lift Size", value: formatNumber(recommended) + " lbs" },
        { label: "Estimated Lift Cost", value: "$" + formatNumber(Math.round(liftCostEst)) },
        { label: "Remaining Capacity", value: formatNumber(recommended - Math.round(totalWeight)) + " lbs" }
      ]
    };
  },
  }],
  relatedSlugs: ["dock-building-cost-calculator","boat-trailer-weight-calculator"],
  faq: [
    { question: "How do I choose the right boat lift capacity?", answer: "Add up the total weight of your boat including engine, full fuel, gear, and accessories. Then add a 20 to 25 percent safety margin. Always round up to the next available lift size." },
    { question: "How much does a boat lift cost?", answer: "Boat lifts range from $2,000 for small PWC lifts to over $30,000 for large cradle lifts. A standard 5,000-pound capacity lift costs approximately $5,000 to $8,000 installed." },
    { question: "What types of boat lifts are available?", answer: "Common types include vertical lifts (most popular), cantilever lifts (shallow water), floating lifts, hydraulic lifts, and elevator lifts. The best choice depends on water depth, bottom type, and boat weight." },
  ],
  formula: "Total Weight = Boat + Engine + (Fuel Gallons x 6.3 lbs) + Gear; Minimum Capacity = Total Weight x (1 + Safety Factor %); Select the standard lift size that meets or exceeds the minimum capacity",
};
