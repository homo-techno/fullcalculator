import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const towingMpgCalculator: CalculatorDefinition = {
  slug: "towing-mpg-calculator",
  title: "Towing MPG Calculator",
  description: "Free towing MPG calculator. Estimate fuel efficiency loss and fuel costs when towing a trailer, boat, or camper.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["towing mpg calculator", "towing fuel economy", "towing gas mileage", "trailer mpg", "towing fuel cost"],
  variants: [
    {
      id: "mpg",
      name: "Towing MPG Estimate",
      description: "Estimate fuel economy reduction while towing",
      fields: [
        { name: "normalMpg", label: "Normal MPG (no towing)", type: "number", placeholder: "e.g. 20", suffix: "MPG" },
        { name: "vehicleWeight", label: "Vehicle Weight", type: "number", placeholder: "e.g. 5500", suffix: "lbs" },
        { name: "towWeight", label: "Towing Weight", type: "number", placeholder: "e.g. 4000", suffix: "lbs" },
        { name: "tripDistance", label: "Trip Distance", type: "number", placeholder: "e.g. 500", suffix: "miles" },
        { name: "gasPrice", label: "Gas Price", type: "number", placeholder: "e.g. 3.50", prefix: "$", step: 0.01 },
      ],
      calculate: (inputs) => {
        const normalMpg = inputs.normalMpg as number;
        const vehicleWeight = inputs.vehicleWeight as number;
        const towWeight = inputs.towWeight as number;
        const distance = (inputs.tripDistance as number) || 0;
        const gasPrice = (inputs.gasPrice as number) || 0;
        if (!normalMpg || !vehicleWeight || !towWeight) return null;

        const weightRatio = towWeight / vehicleWeight;
        const mpgReduction = weightRatio * 0.5;
        const towingMpg = normalMpg * (1 - mpgReduction);
        const mpgLoss = normalMpg - towingMpg;

        const details: { label: string; value: string }[] = [
          { label: "Normal MPG", value: `${formatNumber(normalMpg, 1)} MPG` },
          { label: "MPG reduction", value: `${formatNumber(mpgLoss, 1)} MPG (${formatNumber(mpgReduction * 100, 0)}%)` },
          { label: "Weight ratio", value: `${formatNumber(weightRatio * 100, 0)}%` },
        ];

        if (distance > 0 && gasPrice > 0) {
          const normalCost = (distance / normalMpg) * gasPrice;
          const towingCost = (distance / towingMpg) * gasPrice;
          const extraCost = towingCost - normalCost;
          details.push(
            { label: "Trip fuel cost (towing)", value: `$${formatNumber(towingCost)}` },
            { label: "Trip fuel cost (normal)", value: `$${formatNumber(normalCost)}` },
            { label: "Extra fuel cost", value: `$${formatNumber(extraCost)}` },
          );
        }

        return {
          primary: { label: "Estimated Towing MPG", value: `${formatNumber(towingMpg, 1)} MPG` },
          details,
        };
      },
    },
    {
      id: "actual",
      name: "Actual Towing MPG",
      description: "Calculate actual MPG from a towing trip",
      fields: [
        { name: "miles", label: "Miles Driven", type: "number", placeholder: "e.g. 300", suffix: "miles" },
        { name: "gallons", label: "Gallons Used", type: "number", placeholder: "e.g. 25", suffix: "gallons" },
        { name: "gasPrice", label: "Gas Price Paid", type: "number", placeholder: "e.g. 3.50", prefix: "$", step: 0.01 },
      ],
      calculate: (inputs) => {
        const miles = inputs.miles as number;
        const gallons = inputs.gallons as number;
        const price = (inputs.gasPrice as number) || 0;
        if (!miles || !gallons) return null;

        const mpg = miles / gallons;
        const costPerMile = price > 0 ? (gallons * price) / miles : 0;
        const totalCost = gallons * price;

        return {
          primary: { label: "Actual Towing MPG", value: `${formatNumber(mpg, 1)} MPG` },
          details: [
            { label: "Total fuel used", value: `${formatNumber(gallons, 1)} gallons` },
            { label: "Total fuel cost", value: price > 0 ? `$${formatNumber(totalCost)}` : "N/A" },
            { label: "Cost per mile", value: price > 0 ? `$${formatNumber(costPerMile, 3)}` : "N/A" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fuel-cost-calculator", "car-total-cost-calculator"],
  faq: [
    { question: "How much does towing reduce MPG?", answer: "Towing typically reduces fuel economy by 20-40%, depending on the weight being towed, trailer aerodynamics, terrain, and speed. A heavy trailer can cut MPG nearly in half." },
    { question: "How can I improve towing fuel economy?", answer: "Drive slower (55-60 mph), maintain proper tire pressure, use a streamlined trailer, avoid rapid acceleration, use cruise control on flat roads, and minimize unnecessary weight." },
  ],
  formula: "Towing MPG ≈ Normal MPG × (1 - (Tow Weight / Vehicle Weight × 0.5))",
};
