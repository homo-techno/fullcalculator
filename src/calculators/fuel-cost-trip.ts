import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fuelCostTripCalculator: CalculatorDefinition = {
  slug: "fuel-cost-trip-calculator",
  title: "Fuel Cost for a Trip Calculator",
  description:
    "Free online trip fuel cost calculator. Estimate gas costs for any road trip based on distance, fuel efficiency, and current gas prices.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "fuel cost calculator",
    "trip gas cost",
    "road trip fuel calculator",
    "gas cost calculator",
    "travel fuel cost",
  ],
  variants: [
    {
      id: "trip-cost",
      name: "Trip Fuel Cost",
      description: "Calculate fuel cost for a one-way or round trip",
      fields: [
        { name: "distance", label: "Trip Distance (one way)", type: "number", placeholder: "e.g. 350", suffix: "miles" },
        { name: "mpg", label: "Fuel Efficiency", type: "number", placeholder: "e.g. 28", suffix: "MPG" },
        { name: "fuelPrice", label: "Fuel Price per Gallon", type: "number", placeholder: "e.g. 3.50", prefix: "$" },
        {
          name: "roundTrip",
          label: "Trip Type",
          type: "select",
          options: [
            { label: "One Way", value: "1" },
            { label: "Round Trip", value: "2" },
          ],
          defaultValue: "1",
        },
      ],
      calculate: (inputs) => {
        const distance = parseFloat(inputs.distance as string) || 0;
        const mpg = parseFloat(inputs.mpg as string) || 0;
        const price = parseFloat(inputs.fuelPrice as string) || 0;
        const multiplier = parseInt(inputs.roundTrip as string) || 1;
        if (!distance || !mpg || !price) return null;

        const totalDistance = distance * multiplier;
        const gallonsNeeded = totalDistance / mpg;
        const totalCost = gallonsNeeded * price;
        const costPerMile = price / mpg;

        return {
          primary: { label: "Total Fuel Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Total distance", value: `${formatNumber(totalDistance)} miles` },
            { label: "Gallons needed", value: formatNumber(gallonsNeeded) },
            { label: "Cost per mile", value: `$${formatNumber(costPerMile)}` },
          ],
        };
      },
    },
    {
      id: "split-cost",
      name: "Split Trip Cost",
      description: "Split fuel costs among passengers",
      fields: [
        { name: "distance", label: "Trip Distance (one way)", type: "number", placeholder: "e.g. 350", suffix: "miles" },
        { name: "mpg", label: "Fuel Efficiency", type: "number", placeholder: "e.g. 28", suffix: "MPG" },
        { name: "fuelPrice", label: "Fuel Price per Gallon", type: "number", placeholder: "e.g. 3.50", prefix: "$" },
        { name: "passengers", label: "Number of Passengers", type: "number", placeholder: "e.g. 4", min: 1 },
        {
          name: "roundTrip",
          label: "Trip Type",
          type: "select",
          options: [
            { label: "One Way", value: "1" },
            { label: "Round Trip", value: "2" },
          ],
          defaultValue: "2",
        },
      ],
      calculate: (inputs) => {
        const distance = parseFloat(inputs.distance as string) || 0;
        const mpg = parseFloat(inputs.mpg as string) || 0;
        const price = parseFloat(inputs.fuelPrice as string) || 0;
        const passengers = parseFloat(inputs.passengers as string) || 1;
        const multiplier = parseInt(inputs.roundTrip as string) || 1;
        if (!distance || !mpg || !price) return null;

        const totalDistance = distance * multiplier;
        const gallonsNeeded = totalDistance / mpg;
        const totalCost = gallonsNeeded * price;
        const costPerPerson = totalCost / passengers;

        return {
          primary: { label: "Cost per Person", value: `$${formatNumber(costPerPerson)}` },
          details: [
            { label: "Total fuel cost", value: `$${formatNumber(totalCost)}` },
            { label: "Total distance", value: `${formatNumber(totalDistance)} miles` },
            { label: "Gallons needed", value: formatNumber(gallonsNeeded) },
            { label: "Number of passengers", value: formatNumber(passengers) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fuel-cost-calculator", "speed-calculator"],
  faq: [
    {
      question: "How do I calculate fuel cost for a road trip?",
      answer:
        "Divide your total trip distance by your vehicle's MPG to get gallons needed, then multiply by the price per gallon. For example, a 400-mile trip at 25 MPG with gas at $3.50/gal costs 400/25 x $3.50 = $56.",
    },
    {
      question: "What is the average fuel efficiency of a car?",
      answer:
        "The average fuel efficiency for new cars in the US is about 25-30 MPG. Hybrid vehicles average 45-55 MPG, while SUVs and trucks typically get 18-25 MPG.",
    },
  ],
  formula: "Fuel Cost = (Distance / MPG) x Price per Gallon",
};
