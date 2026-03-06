import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boatTrailerWeightCalculator: CalculatorDefinition = {
  slug: "boat-trailer-weight-calculator",
  title: "Boat Trailer Weight Calculator",
  description: "Calculate the total tow weight of your boat, motor, trailer, and gear to determine if your tow vehicle can safely handle the load.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["boat trailer weight","tow weight calculator","boat towing capacity","trailer gross weight"],
  variants: [{
    id: "standard",
    name: "Boat Trailer Weight",
    description: "Calculate the total tow weight of your boat, motor, trailer, and gear to determine if your tow vehicle can safely handle the load.",
    fields: [
      { name: "boatWeight", label: "Boat Dry Weight (lbs)", type: "number", min: 200, max: 50000, defaultValue: 3500 },
      { name: "motorWeight", label: "Engine Weight (lbs)", type: "number", min: 50, max: 3000, defaultValue: 400 },
      { name: "trailerWeight", label: "Trailer Weight (lbs)", type: "number", min: 200, max: 10000, defaultValue: 1200 },
      { name: "fuelGallons", label: "Fuel on Board (gallons)", type: "number", min: 0, max: 500, defaultValue: 20 },
      { name: "gearWeight", label: "Gear and Equipment (lbs)", type: "number", min: 0, max: 5000, defaultValue: 300 },
      { name: "towCapacity", label: "Tow Vehicle Capacity (lbs)", type: "number", min: 1000, max: 30000, defaultValue: 7500 },
    ],
    calculate: (inputs) => {
    const boat = inputs.boatWeight as number;
    const motor = inputs.motorWeight as number;
    const trailer = inputs.trailerWeight as number;
    const fuel = inputs.fuelGallons as number * 6.3;
    const gear = inputs.gearWeight as number;
    const capacity = inputs.towCapacity as number;
    const totalWeight = boat + motor + trailer + fuel + gear;
    const tongueWeight = totalWeight * 0.1;
    const remaining = capacity - totalWeight;
    const withinCapacity = totalWeight <= capacity;
    return {
      primary: { label: "Total Tow Weight", value: formatNumber(Math.round(totalWeight)) + " lbs" },
      details: [
        { label: "Estimated Tongue Weight (10%)", value: formatNumber(Math.round(tongueWeight)) + " lbs" },
        { label: "Fuel Weight", value: formatNumber(Math.round(fuel)) + " lbs" },
        { label: "Remaining Capacity", value: formatNumber(Math.round(remaining)) + " lbs" },
        { label: "Within Tow Capacity", value: withinCapacity ? "Yes" : "No - Over Limit!" }
      ]
    };
  },
  }],
  relatedSlugs: ["boat-fuel-consumption-calculator","boat-registration-cost-calculator"],
  faq: [
    { question: "How do I calculate total boat tow weight?", answer: "Add the dry weight of the boat, engine weight, trailer weight, fuel weight (about 6.3 pounds per gallon of gasoline), and all gear and equipment on board." },
    { question: "What should tongue weight be for a boat trailer?", answer: "Tongue weight should be 7 to 11 percent of the total trailer weight for proper stability. Too little tongue weight causes trailer sway, while too much can overload the rear axle of the tow vehicle." },
    { question: "Can I tow my boat with an SUV?", answer: "It depends on the SUV towing capacity. Most mid-size SUVs can tow 3,500 to 5,000 pounds, while full-size SUVs and trucks can handle 7,000 to 13,000 pounds or more. Always check your vehicle manual." },
  ],
  formula: "Total Tow Weight = Boat Weight + Engine + Trailer + (Fuel Gallons x 6.3) + Gear
Tongue Weight = Total Weight x 10%
Remaining Capacity = Tow Vehicle Capacity - Total Weight",
};
