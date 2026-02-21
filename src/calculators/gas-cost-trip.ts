import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gasCostTripCalculator: CalculatorDefinition = {
  slug: "gas-cost-trip-calculator",
  title: "Gas Cost for a Trip Calculator",
  description: "Free gas cost calculator for road trips. Estimate total fuel cost for any trip based on distance, vehicle MPG, and current gas prices.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["gas cost for trip", "road trip gas cost", "trip fuel calculator", "driving cost calculator", "gas money calculator"],
  variants: [
    {
      id: "oneway",
      name: "One-Way Trip Cost",
      description: "Calculate gas cost for a one-way trip",
      fields: [
        { name: "distance", label: "Trip Distance (miles)", type: "number", placeholder: "e.g. 450" },
        { name: "mpg", label: "Vehicle MPG", type: "number", placeholder: "e.g. 28" },
        { name: "gasPrice", label: "Gas Price per Gallon", type: "number", placeholder: "e.g. 3.50", prefix: "$", step: 0.01 },
      ],
      calculate: (inputs) => {
        const distance = inputs.distance as number;
        const mpg = inputs.mpg as number;
        const gasPrice = inputs.gasPrice as number;
        if (!distance || !mpg || !gasPrice) return null;

        const gallons = distance / mpg;
        const cost = gallons * gasPrice;
        const costPerMile = cost / distance;

        return {
          primary: { label: "Trip Gas Cost", value: `$${formatNumber(cost)}` },
          details: [
            { label: "Gallons needed", value: formatNumber(gallons, 1) },
            { label: "Cost per mile", value: `$${formatNumber(costPerMile, 3)}` },
            { label: "Round trip cost", value: `$${formatNumber(cost * 2)}` },
            { label: "Round trip gallons", value: formatNumber(gallons * 2, 1) },
          ],
        };
      },
    },
    {
      id: "split",
      name: "Split Gas Cost",
      description: "Split gas cost among passengers",
      fields: [
        { name: "distance", label: "Total Trip Distance (miles)", type: "number", placeholder: "e.g. 800" },
        { name: "mpg", label: "Vehicle MPG", type: "number", placeholder: "e.g. 28" },
        { name: "gasPrice", label: "Gas Price per Gallon", type: "number", placeholder: "e.g. 3.50", prefix: "$", step: 0.01 },
        { name: "passengers", label: "Number of People", type: "select", options: [
          { label: "2 people", value: "2" },
          { label: "3 people", value: "3" },
          { label: "4 people", value: "4" },
          { label: "5 people", value: "5" },
          { label: "6 people", value: "6" },
        ], defaultValue: "2" },
        { name: "roundTrip", label: "Round Trip?", type: "select", options: [
          { label: "One way", value: "1" },
          { label: "Round trip", value: "2" },
        ], defaultValue: "2" },
      ],
      calculate: (inputs) => {
        const distance = inputs.distance as number;
        const mpg = inputs.mpg as number;
        const gasPrice = inputs.gasPrice as number;
        const passengers = parseInt(inputs.passengers as string) || 2;
        const multiplier = parseInt(inputs.roundTrip as string) || 2;
        if (!distance || !mpg || !gasPrice) return null;

        const totalDistance = distance * multiplier;
        const gallons = totalDistance / mpg;
        const totalCost = gallons * gasPrice;
        const perPerson = totalCost / passengers;

        return {
          primary: { label: "Cost Per Person", value: `$${formatNumber(perPerson)}` },
          details: [
            { label: "Total gas cost", value: `$${formatNumber(totalCost)}` },
            { label: "Total distance", value: `${formatNumber(totalDistance, 0)} miles` },
            { label: "Total gallons needed", value: formatNumber(gallons, 1) },
            { label: "Number of people", value: `${passengers}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fuel-cost-calculator", "mpg-calculator", "rv-fuel-calculator"],
  faq: [
    { question: "How do I estimate gas cost for a road trip?", answer: "Divide total trip distance by your vehicle's MPG to get gallons needed, then multiply by the gas price. For a round trip, double the distance. Example: 500 miles / 28 MPG = 17.9 gallons x $3.50 = $62.50 one way." },
    { question: "What MPG should I use for highway driving?", answer: "Most vehicles get 20-30% better MPG on the highway than in the city. Check your vehicle's EPA highway rating, or use the MPG calculator to find your actual highway fuel efficiency based on a recent highway fill-up." },
    { question: "How can I reduce gas cost on a road trip?", answer: "Drive at or below the speed limit (MPG drops above 50 mph), maintain proper tire pressure, avoid excessive idling, use cruise control on the highway, remove roof racks when not in use, and fill up at cheaper gas stations along the route using apps like GasBuddy." },
  ],
  formula: "Gas Cost = (Distance / MPG) x Gas Price; Per Person = Total Cost / Number of People",
};
