import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gasMileageCalculator: CalculatorDefinition = {
  slug: "gas-mileage-calculator",
  title: "Gas Mileage Calculator",
  description: "Free gas mileage calculator. Calculate your car's MPG, cost per mile, and compare fuel efficiency across fill-ups.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["gas mileage calculator", "mpg calculator", "fuel efficiency calculator", "miles per gallon", "cost per mile"],
  variants: [
    {
      id: "mpg",
      name: "Calculate MPG",
      description: "Calculate fuel efficiency from miles driven and gallons used",
      fields: [
        { name: "miles", label: "Miles Driven", type: "number", placeholder: "e.g. 350" },
        { name: "gallons", label: "Gallons Used", type: "number", placeholder: "e.g. 12.5" },
        { name: "price", label: "Price per Gallon (optional)", type: "number", placeholder: "e.g. 3.50", prefix: "$" },
      ],
      calculate: (inputs) => {
        const miles = inputs.miles as number;
        const gallons = inputs.gallons as number;
        const price = inputs.price as number;
        if (!miles || !gallons) return null;
        const mpg = miles / gallons;
        const lPer100km = 235.215 / mpg;
        const details = [
          { label: "MPG", value: formatNumber(mpg, 1) },
          { label: "L/100km", value: formatNumber(lPer100km, 1) },
          { label: "Miles driven", value: formatNumber(miles) },
          { label: "Gallons used", value: formatNumber(gallons, 2) },
        ];
        if (price) {
          const costPerMile = (gallons * price) / miles;
          const totalCost = gallons * price;
          details.push({ label: "Cost per mile", value: `$${formatNumber(costPerMile, 3)}` });
          details.push({ label: "Total fuel cost", value: `$${formatNumber(totalCost)}` });
        }
        return {
          primary: { label: "Fuel Efficiency", value: `${formatNumber(mpg, 1)} MPG` },
          details,
        };
      },
    },
    {
      id: "annual",
      name: "Annual Fuel Cost",
      description: "Estimate your yearly fuel spending",
      fields: [
        { name: "milesPerYear", label: "Miles per Year", type: "number", placeholder: "e.g. 12000", defaultValue: 12000 },
        { name: "mpg", label: "Your Vehicle MPG", type: "number", placeholder: "e.g. 28" },
        { name: "price", label: "Gas Price per Gallon", type: "number", placeholder: "e.g. 3.50", prefix: "$" },
      ],
      calculate: (inputs) => {
        const miles = (inputs.milesPerYear as number) || 12000;
        const mpg = inputs.mpg as number;
        const price = inputs.price as number;
        if (!mpg || !price) return null;
        const gallonsPerYear = miles / mpg;
        const annualCost = gallonsPerYear * price;
        const monthlyCost = annualCost / 12;
        return {
          primary: { label: "Annual Fuel Cost", value: `$${formatNumber(annualCost)}` },
          details: [
            { label: "Monthly fuel cost", value: `$${formatNumber(monthlyCost)}` },
            { label: "Gallons per year", value: formatNumber(gallonsPerYear, 0) },
            { label: "Cost per mile", value: `$${formatNumber(price / mpg, 3)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fuel-cost-calculator", "speed-distance-time-calculator", "unit-converter"],
  faq: [
    { question: "What is good gas mileage?", answer: "Average new car: ~28 MPG combined. Good: 30-40 MPG. Very good: 40-50 MPG (hybrids). Excellent: 50+ MPG (plug-in hybrids). SUVs average 25-30, trucks 20-25." },
  ],
  formula: "MPG = Miles / Gallons | Cost per Mile = Gas Price / MPG | Annual Cost = (Miles/Year / MPG) × Price",
};
