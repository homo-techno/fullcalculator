import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carFuelTankRangeCalculator: CalculatorDefinition = {
  slug: "car-fuel-tank-range-calculator",
  title: "Car Fuel Tank Range Calculator",
  description: "Calculate your vehicle total driving range, cost per mile, and remaining range based on fuel tank size, MPG, and current fuel level.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["fuel tank range","driving range calculator","miles per tank","fuel range estimator"],
  variants: [{
    id: "standard",
    name: "Car Fuel Tank Range",
    description: "Calculate your vehicle total driving range, cost per mile, and remaining range based on fuel tank size, MPG, and current fuel level.",
    fields: [
      { name: "tankSize", label: "Fuel Tank Size (gallons)", type: "number", min: 5, max: 50, defaultValue: 14 },
      { name: "mpgCity", label: "City MPG", type: "number", min: 5, max: 100, defaultValue: 28 },
      { name: "mpgHighway", label: "Highway MPG", type: "number", min: 5, max: 100, defaultValue: 36 },
      { name: "cityPercent", label: "City Driving (%)", type: "number", min: 0, max: 100, defaultValue: 60 },
      { name: "fuelLevel", label: "Current Fuel Level (%)", type: "number", min: 0, max: 100, defaultValue: 50 },
      { name: "fuelPrice", label: "Fuel Price Per Gallon ($)", type: "number", min: 1, max: 10, defaultValue: 3.50 },
    ],
    calculate: (inputs) => {
    const tankSize = inputs.tankSize as number;
    const mpgCity = inputs.mpgCity as number;
    const mpgHighway = inputs.mpgHighway as number;
    const cityPct = inputs.cityPercent as number / 100;
    const fuelLevel = inputs.fuelLevel as number / 100;
    const fuelPrice = inputs.fuelPrice as number;
    const combinedMPG = 1 / (cityPct / mpgCity + (1 - cityPct) / mpgHighway);
    const totalRange = Math.round(tankSize * combinedMPG);
    const remainingGallons = tankSize * fuelLevel;
    const remainingRange = Math.round(remainingGallons * combinedMPG);
    const costPerMile = fuelPrice / combinedMPG;
    const costToFill = (tankSize - remainingGallons) * fuelPrice;
    return {
      primary: { label: "Total Range (Full Tank)", value: formatNumber(totalRange) + " miles" },
      details: [
        { label: "Combined MPG", value: formatNumber(Math.round(combinedMPG * 10) / 10) },
        { label: "Remaining Range", value: formatNumber(remainingRange) + " miles" },
        { label: "Remaining Fuel", value: formatNumber(Math.round(remainingGallons * 10) / 10) + " gallons" },
        { label: "Cost Per Mile", value: "$" + formatNumber(Math.round(costPerMile * 1000) / 1000) },
        { label: "Cost to Fill Up", value: "$" + formatNumber(Math.round(costToFill * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["car-annual-maintenance-cost-calculator","dash-cam-storage-calculator"],
  faq: [
    { question: "How is combined MPG calculated?", answer: "Combined MPG uses a harmonic mean weighted by driving mix. For 60 percent city and 40 percent highway, it accounts for the lower efficiency of city driving proportionally." },
    { question: "How far can I drive on empty?", answer: "Most vehicles can travel 30 to 50 miles after the fuel light turns on, but this varies widely by vehicle. Running on empty can damage the fuel pump and should be avoided." },
    { question: "Does driving style affect range?", answer: "Aggressive acceleration, high speeds, and frequent braking can reduce fuel economy by 15 to 33 percent. Smooth, steady driving at moderate speeds maximizes your range." },
  ],
  formula: "Combined MPG = 1 / (City% / City MPG + Highway% / Highway MPG); Total Range = Tank Size x Combined MPG; Cost Per Mile = Fuel Price / Combined MPG",
};
