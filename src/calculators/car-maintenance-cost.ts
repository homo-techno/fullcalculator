import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carMaintenanceCostCalculator: CalculatorDefinition = {
  slug: "car-maintenance-cost-calculator",
  title: "Car Maintenance Cost Calculator",
  description: "Free car maintenance cost calculator. Estimate annual and monthly vehicle maintenance expenses including oil changes, tires, brakes, and more.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["car maintenance cost", "vehicle maintenance calculator", "auto repair cost", "car upkeep cost", "maintenance budget calculator"],
  variants: [
    {
      id: "annual",
      name: "Annual Maintenance Cost",
      description: "Estimate total annual car maintenance expenses",
      fields: [
        { name: "oilChanges", label: "Oil Changes per Year", type: "number", placeholder: "e.g. 3" },
        { name: "oilCost", label: "Cost per Oil Change", type: "number", placeholder: "e.g. 75", prefix: "$" },
        { name: "tireRotations", label: "Tire Rotations per Year", type: "number", placeholder: "e.g. 2" },
        { name: "tireCost", label: "Cost per Tire Rotation", type: "number", placeholder: "e.g. 40", prefix: "$" },
        { name: "brakeService", label: "Brake Service (Annual)", type: "number", placeholder: "e.g. 300", prefix: "$" },
        { name: "otherMaintenance", label: "Other Maintenance", type: "number", placeholder: "e.g. 200", prefix: "$" },
        { name: "annualMiles", label: "Annual Miles Driven", type: "number", placeholder: "e.g. 12000" },
      ],
      calculate: (inputs) => {
        const oilChanges = (inputs.oilChanges as number) || 0;
        const oilCost = (inputs.oilCost as number) || 0;
        const tireRotations = (inputs.tireRotations as number) || 0;
        const tireCost = (inputs.tireCost as number) || 0;
        const brakeService = (inputs.brakeService as number) || 0;
        const other = (inputs.otherMaintenance as number) || 0;
        const miles = (inputs.annualMiles as number) || 12000;

        const oilTotal = oilChanges * oilCost;
        const tireTotal = tireRotations * tireCost;
        const annual = oilTotal + tireTotal + brakeService + other;
        const monthly = annual / 12;
        const perMile = miles > 0 ? annual / miles : 0;

        return {
          primary: { label: "Annual Maintenance Cost", value: `$${formatNumber(annual)}` },
          details: [
            { label: "Monthly cost", value: `$${formatNumber(monthly)}` },
            { label: "Cost per mile", value: `$${formatNumber(perMile, 3)}` },
            { label: "Oil changes total", value: `$${formatNumber(oilTotal)}` },
            { label: "Tire rotations total", value: `$${formatNumber(tireTotal)}` },
            { label: "Brake service", value: `$${formatNumber(brakeService)}` },
          ],
        };
      },
    },
    {
      id: "mileage",
      name: "Cost by Mileage",
      description: "Estimate maintenance cost based on mileage intervals",
      fields: [
        { name: "currentMiles", label: "Current Odometer", type: "number", placeholder: "e.g. 45000", suffix: "miles" },
        { name: "annualMiles", label: "Annual Miles Driven", type: "number", placeholder: "e.g. 12000", suffix: "miles" },
        { name: "costPerMile", label: "Avg Maintenance Cost/Mile", type: "number", placeholder: "e.g. 0.09", prefix: "$", step: 0.01 },
      ],
      calculate: (inputs) => {
        const current = inputs.currentMiles as number;
        const annual = inputs.annualMiles as number;
        const cpm = inputs.costPerMile as number;
        if (!current || !annual || !cpm) return null;

        const annualCost = annual * cpm;
        const fiveYearCost = annual * 5 * cpm;
        const milesAtFiveYears = current + annual * 5;

        return {
          primary: { label: "Annual Maintenance Estimate", value: `$${formatNumber(annualCost)}` },
          details: [
            { label: "Monthly estimate", value: `$${formatNumber(annualCost / 12)}` },
            { label: "5-year total", value: `$${formatNumber(fiveYearCost)}` },
            { label: "Odometer in 5 years", value: `${formatNumber(milesAtFiveYears, 0)} miles` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["car-loan-calculator", "fuel-cost-calculator"],
  faq: [
    { question: "How much does car maintenance cost per year?", answer: "Average annual maintenance costs range from $500-$1,000 for newer cars and $1,000-$2,000+ for older vehicles. Costs increase significantly after 100,000 miles." },
    { question: "What is the most expensive car maintenance?", answer: "Transmission repairs ($1,500-$5,000), engine work ($3,000-$7,000), and timing belt replacement ($500-$1,000) are among the most costly. Regular maintenance helps prevent these major repairs." },
  ],
  formula: "Annual Cost = (Oil Changes × Cost) + (Tire Rotations × Cost) + Brake Service + Other",
};
