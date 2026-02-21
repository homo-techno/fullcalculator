import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mpgCalculator: CalculatorDefinition = {
  slug: "mpg-calculator",
  title: "MPG Calculator",
  description: "Free MPG calculator. Calculate your vehicle's miles per gallon fuel efficiency from distance driven and fuel used. Compare with EPA estimates.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["mpg calculator", "miles per gallon", "fuel efficiency calculator", "gas mileage calculator", "fuel economy"],
  variants: [
    {
      id: "mpg",
      name: "Calculate MPG",
      description: "Calculate miles per gallon from distance and fuel",
      fields: [
        { name: "miles", label: "Miles Driven", type: "number", placeholder: "e.g. 350" },
        { name: "gallons", label: "Gallons Used", type: "number", placeholder: "e.g. 12.5" },
      ],
      calculate: (inputs) => {
        const miles = inputs.miles as number;
        const gallons = inputs.gallons as number;
        if (!miles || !gallons) return null;

        const mpg = miles / gallons;
        const lPer100km = 235.215 / mpg;
        const kmPerL = 1.60934 * mpg / 3.78541;
        const costPerMile = 3.50 / mpg; // assume $3.50/gal

        let rating = "Below average";
        if (mpg >= 40) rating = "Excellent";
        else if (mpg >= 30) rating = "Good";
        else if (mpg >= 25) rating = "Average";

        return {
          primary: { label: "Fuel Efficiency", value: `${formatNumber(mpg, 1)} MPG` },
          details: [
            { label: "Liters per 100 km", value: formatNumber(lPer100km, 1) },
            { label: "km per liter", value: formatNumber(kmPerL, 1) },
            { label: "Cost per mile (at $3.50/gal)", value: `$${formatNumber(costPerMile, 2)}` },
            { label: "Efficiency rating", value: rating },
          ],
        };
      },
    },
    {
      id: "compare",
      name: "Compare Two Vehicles",
      description: "Compare fuel costs between two vehicles",
      fields: [
        { name: "mpg1", label: "Vehicle 1 MPG", type: "number", placeholder: "e.g. 25" },
        { name: "mpg2", label: "Vehicle 2 MPG", type: "number", placeholder: "e.g. 35" },
        { name: "annualMiles", label: "Annual Miles Driven", type: "number", placeholder: "e.g. 12000" },
        { name: "gasPrice", label: "Gas Price ($/gallon)", type: "number", placeholder: "e.g. 3.50", prefix: "$" },
      ],
      calculate: (inputs) => {
        const mpg1 = inputs.mpg1 as number;
        const mpg2 = inputs.mpg2 as number;
        const annualMiles = (inputs.annualMiles as number) || 12000;
        const gasPrice = (inputs.gasPrice as number) || 3.50;
        if (!mpg1 || !mpg2) return null;

        const gallons1 = annualMiles / mpg1;
        const gallons2 = annualMiles / mpg2;
        const cost1 = gallons1 * gasPrice;
        const cost2 = gallons2 * gasPrice;
        const savings = Math.abs(cost1 - cost2);
        const fiveYearSavings = savings * 5;

        return {
          primary: { label: "Annual Savings", value: `$${formatNumber(savings)}` },
          details: [
            { label: "Vehicle 1 annual fuel cost", value: `$${formatNumber(cost1)}` },
            { label: "Vehicle 2 annual fuel cost", value: `$${formatNumber(cost2)}` },
            { label: "Vehicle 1 gallons/year", value: formatNumber(gallons1, 0) },
            { label: "Vehicle 2 gallons/year", value: formatNumber(gallons2, 0) },
            { label: "5-year savings", value: `$${formatNumber(fiveYearSavings)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fuel-cost-calculator", "gas-cost-trip-calculator", "emission-calculator"],
  faq: [
    { question: "How do I calculate MPG?", answer: "Fill your tank completely, reset your trip odometer, drive normally, then fill up again. Divide miles driven by gallons added: MPG = Miles Driven / Gallons Used. For accuracy, do this over several fill-ups." },
    { question: "What is good MPG for a car?", answer: "As of 2024, the average new car gets about 27 MPG combined. Over 30 MPG is considered good, over 40 MPG is excellent. Hybrids often achieve 45-60 MPG and electric vehicles have MPGe ratings of 90-130+." },
    { question: "Why is my actual MPG different from the EPA rating?", answer: "EPA tests are done under controlled conditions. Real-world MPG varies based on driving habits (aggressive driving lowers MPG 15-30%), weather, terrain, tire pressure, vehicle load, and air conditioning use. City driving is less efficient than highway." },
  ],
  formula: "MPG = Miles Driven / Gallons Used; L/100km = 235.215 / MPG",
};
