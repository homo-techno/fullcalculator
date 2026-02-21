import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boatFuelCalculator: CalculatorDefinition = {
  slug: "boat-fuel-calculator",
  title: "Boat Fuel Consumption Calculator",
  description: "Free boat fuel consumption calculator. Estimate fuel usage and cost for boating trips based on engine size, speed, and trip duration.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["boat fuel calculator", "boat gas consumption", "marine fuel cost", "boat fuel usage", "boating trip cost"],
  variants: [
    {
      id: "trip",
      name: "Boat Trip Fuel Cost",
      description: "Estimate fuel usage and cost for a boat trip",
      fields: [
        { name: "engineHp", label: "Engine Horsepower (HP)", type: "number", placeholder: "e.g. 150" },
        { name: "hours", label: "Trip Duration (hours)", type: "number", placeholder: "e.g. 4" },
        { name: "throttle", label: "Average Throttle (%)", type: "select", options: [
          { label: "Idle / Trolling (10%)", value: "10" },
          { label: "Slow Cruise (25%)", value: "25" },
          { label: "Cruise (50%)", value: "50" },
          { label: "Fast Cruise (75%)", value: "75" },
          { label: "Wide Open Throttle (100%)", value: "100" },
        ], defaultValue: "50" },
        { name: "fuelType", label: "Fuel Type", type: "select", options: [
          { label: "Gasoline", value: "gas" },
          { label: "Diesel", value: "diesel" },
        ], defaultValue: "gas" },
        { name: "fuelPrice", label: "Fuel Price per Gallon", type: "number", placeholder: "e.g. 4.50", prefix: "$", step: 0.01 },
        { name: "numEngines", label: "Number of Engines", type: "select", options: [
          { label: "1 (single)", value: "1" },
          { label: "2 (twin)", value: "2" },
          { label: "3 (triple)", value: "3" },
        ], defaultValue: "1" },
      ],
      calculate: (inputs) => {
        const hp = inputs.engineHp as number;
        const hours = inputs.hours as number;
        const throttle = parseInt(inputs.throttle as string) || 50;
        const fuelType = (inputs.fuelType as string) || "gas";
        const fuelPrice = (inputs.fuelPrice as number) || 4.50;
        const numEngines = parseInt(inputs.numEngines as string) || 1;
        if (!hp || !hours) return null;

        // Rule of thumb: gasoline engines burn ~0.1 gallons per HP per hour at WOT
        // Diesel engines burn ~0.055 gallons per HP per hour at WOT
        const burnRatePerHpHour = fuelType === "diesel" ? 0.055 : 0.1;

        // Fuel consumption scales roughly with throttle percentage
        // But not linearly - it's approximately throttle^1.5 due to prop curves
        const throttleDecimal = throttle / 100;
        const effectiveLoad = Math.pow(throttleDecimal, 1.5);

        const gphPerEngine = hp * burnRatePerHpHour * effectiveLoad;
        const totalGph = gphPerEngine * numEngines;
        const totalGallons = totalGph * hours;
        const totalCost = totalGallons * fuelPrice;

        return {
          primary: { label: "Total Fuel Needed", value: `${formatNumber(totalGallons, 1)} gallons` },
          details: [
            { label: "Fuel burn rate", value: `${formatNumber(totalGph, 1)} gal/hour` },
            { label: "Per engine burn rate", value: `${formatNumber(gphPerEngine, 1)} gal/hour` },
            { label: "Total fuel cost", value: `$${formatNumber(totalCost)}` },
            { label: "Cost per hour", value: `$${formatNumber(totalCost / hours)}` },
            { label: "Effective engine load", value: `${formatNumber(effectiveLoad * 100, 0)}%` },
          ],
          note: "Actual fuel consumption varies by hull type, water conditions, load, and engine efficiency. Add a 10-20% safety margin for your fuel supply.",
        };
      },
    },
    {
      id: "range",
      name: "Boat Range Estimator",
      description: "Estimate how far you can go on a tank of fuel",
      fields: [
        { name: "tankSize", label: "Fuel Tank Size (gallons)", type: "number", placeholder: "e.g. 50" },
        { name: "engineHp", label: "Engine Horsepower", type: "number", placeholder: "e.g. 150" },
        { name: "cruiseSpeed", label: "Cruise Speed (mph)", type: "number", placeholder: "e.g. 25" },
        { name: "fuelType", label: "Fuel Type", type: "select", options: [
          { label: "Gasoline", value: "gas" },
          { label: "Diesel", value: "diesel" },
        ], defaultValue: "gas" },
      ],
      calculate: (inputs) => {
        const tankSize = inputs.tankSize as number;
        const hp = inputs.engineHp as number;
        const cruiseSpeed = (inputs.cruiseSpeed as number) || 25;
        const fuelType = (inputs.fuelType as string) || "gas";
        if (!tankSize || !hp) return null;

        const burnRate = fuelType === "diesel" ? 0.055 : 0.1;
        // Assume cruise = 50% throttle = ~35% fuel load
        const cruiseGph = hp * burnRate * 0.35;
        const safeTank = tankSize * 0.667; // 1/3 rule: 1/3 out, 1/3 back, 1/3 reserve
        const rangeHours = safeTank / cruiseGph;
        const rangeMiles = rangeHours * cruiseSpeed;
        const maxRangeHours = tankSize / cruiseGph;
        const maxRangeMiles = maxRangeHours * cruiseSpeed;

        return {
          primary: { label: "Safe Cruising Range", value: `${formatNumber(rangeMiles, 0)} miles` },
          details: [
            { label: "Safe cruising time", value: `${formatNumber(rangeHours, 1)} hours` },
            { label: "Maximum range (full tank)", value: `${formatNumber(maxRangeMiles, 0)} miles` },
            { label: "Fuel burn at cruise", value: `${formatNumber(cruiseGph, 1)} gal/hour` },
            { label: "Usable fuel (1/3 rule)", value: `${formatNumber(safeTank, 0)} gallons` },
          ],
          note: "Uses the 1/3 rule: 1/3 of fuel to go out, 1/3 to return, 1/3 in reserve. Never run your tank below the reserve.",
        };
      },
    },
  ],
  relatedSlugs: ["fuel-cost-calculator", "rv-fuel-calculator", "gas-cost-trip-calculator"],
  faq: [
    { question: "How much fuel does a boat use per hour?", answer: "A general rule of thumb: gasoline engines burn about 0.1 gallons per horsepower per hour at wide open throttle (WOT). A 200HP outboard at WOT burns about 20 GPH. At a typical cruise (50% throttle), it may burn 7-10 GPH. Diesel engines are about 45% more efficient." },
    { question: "What is the 1/3 fuel rule for boating?", answer: "The 1/3 rule is a boating safety guideline: use 1/3 of your fuel going out, 1/3 coming back, and keep 1/3 in reserve for emergencies, adverse conditions, or navigation changes. This means you should plan trips based on 2/3 of your tank capacity." },
    { question: "Why does throttle position matter so much?", answer: "Fuel consumption does not scale linearly with throttle. Due to propeller load curves, going from 50% to 100% throttle roughly triples fuel consumption while only increasing speed by 30-40%. Cruising at moderate throttle is much more fuel efficient." },
  ],
  formula: "GPH = Engine HP x Burn Rate x Throttle Load Factor; Burn Rate: Gas = 0.1 gal/HP/hr, Diesel = 0.055 gal/HP/hr at WOT",
};
