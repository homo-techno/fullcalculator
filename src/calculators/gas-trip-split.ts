import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gasTripSplitCalculator: CalculatorDefinition = {
  slug: "gas-trip-split",
  title: "Gas Trip Split Calculator",
  description: "Calculate and split gas costs for a road trip. Enter distance, fuel efficiency, gas price, and number of passengers.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["gas calculator", "trip cost", "fuel cost", "split gas", "road trip cost", "gas money"],
  variants: [
    {
      id: "calc",
      name: "Calculate Gas Split",
      fields: [
        { name: "distance", label: "Total Distance (miles)", type: "number", placeholder: "e.g. 300", min: 1 },
        { name: "mpg", label: "Fuel Efficiency (MPG)", type: "number", placeholder: "e.g. 25", min: 1, max: 200, step: 0.1 },
        { name: "gasPrice", label: "Gas Price ($/gallon)", type: "number", placeholder: "e.g. 3.50", min: 0.01, step: 0.01 },
        { name: "passengers", label: "Number of People (incl. driver)", type: "number", placeholder: "e.g. 4", min: 1, max: 20 },
        { name: "roundTrip", label: "Round Trip?", type: "select", options: [{ label: "One Way", value: "0" }, { label: "Round Trip", value: "1" }] },
      ],
      calculate: (inputs) => {
        const distance = Number(inputs.distance);
        const mpg = Number(inputs.mpg);
        const gasPrice = Number(inputs.gasPrice);
        const passengers = Number(inputs.passengers);
        const roundTrip = String(inputs.roundTrip) === "1";
        if (!distance || !mpg || !gasPrice || !passengers) return null;

        const totalDistance = roundTrip ? distance * 2 : distance;
        const gallonsNeeded = totalDistance / mpg;
        const totalCost = gallonsNeeded * gasPrice;
        const costPerPerson = totalCost / passengers;
        const costPerMile = totalCost / totalDistance;

        return {
          primary: { label: "Cost Per Person", value: "$" + formatNumber(Math.round(costPerPerson * 100) / 100) },
          details: [
            { label: "Total Gas Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
            { label: "Total Distance", value: formatNumber(totalDistance) + " miles" },
            { label: "Gallons Needed", value: formatNumber(Math.round(gallonsNeeded * 10) / 10) },
            { label: "Cost Per Mile", value: "$" + formatNumber(Math.round(costPerMile * 100) / 100) },
            { label: "Number of People", value: formatNumber(passengers) },
            { label: "Trip Type", value: roundTrip ? "Round Trip" : "One Way" },
          ],
          note: "Actual costs may vary based on driving conditions, traffic, and terrain.",
        };
      },
    },
  ],
  relatedSlugs: ["road-trip-snack-calculator", "carbon-offset-cost-calculator", "walking-distance-calculator"],
  faq: [
    { question: "How is the gas cost calculated?", answer: "Total cost = (distance / MPG) x gas price. This is then divided by the number of passengers for an even split." },
    { question: "Should the driver pay less?", answer: "That depends on your group! Some split evenly, others have passengers cover all gas while the driver covers the car. This calculator splits evenly." },
  ],
  formula: "Cost Per Person = (Distance / MPG x Gas Price) / Number of People",
};
