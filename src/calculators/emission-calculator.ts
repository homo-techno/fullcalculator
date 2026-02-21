import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const emissionCalculator: CalculatorDefinition = {
  slug: "emission-calculator",
  title: "Vehicle Emission Calculator",
  description: "Free vehicle CO2 emission calculator. Estimate your car's carbon dioxide emissions based on fuel type, mileage, and driving habits.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["vehicle emissions calculator", "CO2 calculator car", "carbon footprint car", "car emissions", "vehicle carbon dioxide"],
  variants: [
    {
      id: "annual",
      name: "Annual CO2 Emissions",
      description: "Calculate your vehicle's annual CO2 emissions",
      fields: [
        { name: "annualMiles", label: "Annual Miles Driven", type: "number", placeholder: "e.g. 12000" },
        { name: "mpg", label: "Vehicle MPG", type: "number", placeholder: "e.g. 28" },
        { name: "fuelType", label: "Fuel Type", type: "select", options: [
          { label: "Regular Gasoline", value: "gasoline" },
          { label: "Diesel", value: "diesel" },
          { label: "E85 (Flex Fuel)", value: "e85" },
          { label: "Hybrid (gasoline)", value: "hybrid" },
        ], defaultValue: "gasoline" },
      ],
      calculate: (inputs) => {
        const annualMiles = inputs.annualMiles as number;
        const mpg = inputs.mpg as number;
        const fuelType = (inputs.fuelType as string) || "gasoline";
        if (!annualMiles || !mpg) return null;

        // CO2 per gallon of fuel (EPA figures)
        const co2PerGallon: Record<string, number> = {
          gasoline: 19.6, // lbs CO2 per gallon
          diesel: 22.4,
          e85: 13.7,
          hybrid: 19.6, // same fuel, just better MPG
        };

        const gallonsPerYear = annualMiles / mpg;
        const co2Lbs = gallonsPerYear * (co2PerGallon[fuelType] || 19.6);
        const co2Tons = co2Lbs / 2000;
        const co2Kg = co2Lbs * 0.4536;
        const co2MetricTons = co2Kg / 1000;

        // Comparison: average US car = ~4.6 metric tons/year (EPA)
        const comparedToAvg = ((co2MetricTons - 4.6) / 4.6) * 100;

        // Trees needed to offset (1 tree absorbs ~48 lbs CO2/year)
        const treesNeeded = Math.ceil(co2Lbs / 48);

        return {
          primary: { label: "Annual CO2 Emissions", value: `${formatNumber(co2MetricTons, 1)} metric tons` },
          details: [
            { label: "CO2 per year", value: `${formatNumber(co2Lbs, 0)} lbs (${formatNumber(co2Kg, 0)} kg)` },
            { label: "CO2 per mile", value: `${formatNumber(co2Lbs / annualMiles, 2)} lbs/mile` },
            { label: "Gallons consumed/year", value: formatNumber(gallonsPerYear, 0) },
            { label: "Compared to US average", value: `${comparedToAvg > 0 ? "+" : ""}${formatNumber(comparedToAvg, 0)}%` },
            { label: "Trees needed to offset", value: `${treesNeeded} trees` },
          ],
        };
      },
    },
    {
      id: "compare",
      name: "Compare Vehicle Emissions",
      description: "Compare CO2 emissions of two vehicles",
      fields: [
        { name: "mpg1", label: "Vehicle 1 MPG", type: "number", placeholder: "e.g. 22" },
        { name: "fuel1", label: "Vehicle 1 Fuel Type", type: "select", options: [
          { label: "Gasoline", value: "gasoline" },
          { label: "Diesel", value: "diesel" },
          { label: "Hybrid", value: "hybrid" },
        ], defaultValue: "gasoline" },
        { name: "mpg2", label: "Vehicle 2 MPG", type: "number", placeholder: "e.g. 45" },
        { name: "fuel2", label: "Vehicle 2 Fuel Type", type: "select", options: [
          { label: "Gasoline", value: "gasoline" },
          { label: "Diesel", value: "diesel" },
          { label: "Hybrid", value: "hybrid" },
        ], defaultValue: "hybrid" },
        { name: "annualMiles", label: "Annual Miles", type: "number", placeholder: "e.g. 12000", defaultValue: 12000 },
      ],
      calculate: (inputs) => {
        const mpg1 = inputs.mpg1 as number;
        const mpg2 = inputs.mpg2 as number;
        const fuel1 = (inputs.fuel1 as string) || "gasoline";
        const fuel2 = (inputs.fuel2 as string) || "gasoline";
        const miles = (inputs.annualMiles as number) || 12000;
        if (!mpg1 || !mpg2) return null;

        const co2PerGal: Record<string, number> = { gasoline: 19.6, diesel: 22.4, hybrid: 19.6 };

        const co2_1 = (miles / mpg1) * (co2PerGal[fuel1] || 19.6);
        const co2_2 = (miles / mpg2) * (co2PerGal[fuel2] || 19.6);
        const diff = Math.abs(co2_1 - co2_2);
        const pctReduction = (diff / Math.max(co2_1, co2_2)) * 100;

        return {
          primary: { label: "Annual CO2 Savings", value: `${formatNumber(diff, 0)} lbs` },
          details: [
            { label: "Vehicle 1 annual CO2", value: `${formatNumber(co2_1, 0)} lbs` },
            { label: "Vehicle 2 annual CO2", value: `${formatNumber(co2_2, 0)} lbs` },
            { label: "Reduction", value: `${formatNumber(pctReduction, 0)}%` },
            { label: "5-year savings", value: `${formatNumber(diff * 5, 0)} lbs CO2` },
            { label: "Cleaner vehicle", value: co2_1 < co2_2 ? "Vehicle 1" : "Vehicle 2" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mpg-calculator", "electric-range-calculator", "fuel-cost-calculator"],
  faq: [
    { question: "How much CO2 does a car produce per gallon?", answer: "Burning one gallon of gasoline produces about 19.6 pounds (8.9 kg) of CO2. Diesel produces about 22.4 pounds (10.2 kg) per gallon. These are direct tailpipe emissions and do not include upstream emissions from fuel production and transport." },
    { question: "What is the average CO2 emission for a car?", answer: "The average passenger vehicle in the US emits about 4.6 metric tons of CO2 per year, based on about 11,500 miles driven at 24 MPG. More fuel-efficient vehicles and hybrids produce significantly less, while trucks and SUVs produce more." },
    { question: "How do electric vehicles compare for emissions?", answer: "EVs produce zero direct (tailpipe) emissions. However, their total emissions depend on the electricity source. On the US average grid, an EV produces about 2.0 metric tons of CO2 per year equivalent, roughly 60% less than an average gas car. In states with clean energy, the difference is even greater." },
  ],
  formula: "Annual CO2 = (Annual Miles / MPG) x CO2 per Gallon; Gasoline: 19.6 lbs CO2/gallon, Diesel: 22.4 lbs CO2/gallon",
};
