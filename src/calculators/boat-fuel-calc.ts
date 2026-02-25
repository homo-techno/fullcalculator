import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boatFuelCalcCalculator: CalculatorDefinition = {
  slug: "boat-fuel-calc-calculator",
  title: "Boat Fuel Cost Calculator",
  description: "Free boat fuel cost calculator. Estimate fuel consumption and costs for your boat based on engine size, speed, and trip duration.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["boat fuel cost", "boat fuel calculator", "marine fuel consumption", "boat gas cost", "boat trip fuel"],
  variants: [
    {
      id: "trip",
      name: "Trip Fuel Cost",
      description: "Calculate fuel cost for a boat trip",
      fields: [
        { name: "horsepower", label: "Engine Horsepower", type: "number", placeholder: "e.g. 150", suffix: "HP" },
        { name: "throttle", label: "Average Throttle", type: "select", options: [
          { label: "Idle/trolling (10%)", value: "0.10" },
          { label: "Cruising (50%)", value: "0.50" },
          { label: "Fast cruise (75%)", value: "0.75" },
          { label: "Wide open (100%)", value: "1.00" },
        ], defaultValue: "0.50" },
        { name: "hours", label: "Trip Duration", type: "number", placeholder: "e.g. 4", suffix: "hours" },
        { name: "fuelPrice", label: "Fuel Price per Gallon", type: "number", placeholder: "e.g. 4.50", prefix: "$", step: 0.01 },
        { name: "engines", label: "Number of Engines", type: "number", placeholder: "e.g. 1" },
      ],
      calculate: (inputs) => {
        const hp = inputs.horsepower as number;
        const throttle = parseFloat(inputs.throttle as string) || 0.5;
        const hours = inputs.hours as number;
        const price = inputs.fuelPrice as number;
        const engines = (inputs.engines as number) || 1;
        if (!hp || !hours || !price) return null;

        const gph = (hp * throttle * 0.1) * engines;
        const totalGallons = gph * hours;
        const totalCost = totalGallons * price;
        const costPerHour = totalCost / hours;

        return {
          primary: { label: "Trip Fuel Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Fuel consumption", value: `${formatNumber(gph, 1)} gal/hr` },
            { label: "Total fuel needed", value: `${formatNumber(totalGallons, 1)} gallons` },
            { label: "Cost per hour", value: `$${formatNumber(costPerHour)}` },
            { label: "Engines", value: `${engines}` },
            { label: "Effective throttle", value: `${formatNumber(throttle * 100, 0)}%` },
          ],
        };
      },
    },
    {
      id: "season",
      name: "Seasonal Fuel Budget",
      description: "Estimate fuel costs for the boating season",
      fields: [
        { name: "tripsPerMonth", label: "Trips per Month", type: "number", placeholder: "e.g. 4" },
        { name: "hoursPerTrip", label: "Avg Hours per Trip", type: "number", placeholder: "e.g. 4" },
        { name: "avgGph", label: "Avg Fuel Consumption", type: "number", placeholder: "e.g. 8", suffix: "gal/hr" },
        { name: "fuelPrice", label: "Fuel Price per Gallon", type: "number", placeholder: "e.g. 4.50", prefix: "$", step: 0.01 },
        { name: "seasonMonths", label: "Boating Season Length", type: "number", placeholder: "e.g. 6", suffix: "months" },
      ],
      calculate: (inputs) => {
        const trips = inputs.tripsPerMonth as number;
        const hours = inputs.hoursPerTrip as number;
        const gph = inputs.avgGph as number;
        const price = inputs.fuelPrice as number;
        const months = (inputs.seasonMonths as number) || 6;
        if (!trips || !hours || !gph || !price) return null;

        const monthlyGallons = trips * hours * gph;
        const monthlyCost = monthlyGallons * price;
        const seasonGallons = monthlyGallons * months;
        const seasonCost = monthlyCost * months;

        return {
          primary: { label: "Season Fuel Cost", value: `$${formatNumber(seasonCost)}` },
          details: [
            { label: "Monthly fuel cost", value: `$${formatNumber(monthlyCost)}` },
            { label: "Cost per trip", value: `$${formatNumber(monthlyCost / trips)}` },
            { label: "Monthly gallons", value: `${formatNumber(monthlyGallons, 0)} gal` },
            { label: "Season total gallons", value: `${formatNumber(seasonGallons, 0)} gal` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fuel-cost-calculator", "car-total-cost-calculator"],
  faq: [
    { question: "How much fuel does a boat use per hour?", answer: "A general rule of thumb: gasoline engines burn about 1 gallon per 10 HP per hour at full throttle. A 150 HP engine at cruising speed (50% throttle) uses about 7.5 gallons per hour." },
    { question: "Why is boat fuel so expensive?", answer: "Marina fuel prices are typically 20-50% higher than gas stations due to lower volume, waterfront property costs, and environmental compliance costs. Buying fuel at nearby gas stations and transporting it can save money." },
  ],
  formula: "Fuel per Hour ≈ Horsepower × Throttle % × 0.1 gallons",
};
