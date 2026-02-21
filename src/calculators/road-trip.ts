import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const roadTripCalculator: CalculatorDefinition = {
  slug: "road-trip-calculator",
  title: "Road Trip Cost Calculator",
  description: "Free road trip cost calculator. Estimate fuel cost, travel time, and total trip expenses for your road trip.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["road trip calculator", "trip cost calculator", "driving cost", "fuel cost road trip", "travel cost estimator"],
  variants: [
    {
      id: "cost",
      name: "Trip Cost Estimate",
      fields: [
        { name: "distance", label: "Distance (miles)", type: "number", placeholder: "e.g. 500" },
        { name: "mpg", label: "Fuel Economy (MPG)", type: "number", placeholder: "e.g. 28" },
        { name: "gasPrice", label: "Gas Price ($/gallon)", type: "number", prefix: "$", placeholder: "e.g. 3.50" },
        { name: "speed", label: "Average Speed (mph)", type: "number", placeholder: "e.g. 60", defaultValue: 60 },
        { name: "hotel", label: "Hotel per Night", type: "number", prefix: "$", placeholder: "e.g. 120", defaultValue: 0 },
        { name: "nights", label: "Number of Nights", type: "number", placeholder: "e.g. 1", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const dist = inputs.distance as number, mpg = inputs.mpg as number;
        const gas = inputs.gasPrice as number;
        const speed = (inputs.speed as number) || 60;
        const hotel = (inputs.hotel as number) || 0;
        const nights = (inputs.nights as number) || 0;
        if (!dist || !mpg || !gas) return null;
        const gallons = dist / mpg;
        const fuelCost = gallons * gas;
        const driveTime = dist / speed;
        const hotelCost = hotel * nights;
        const totalCost = fuelCost + hotelCost;
        const costPerMile = fuelCost / dist;
        const h = Math.floor(driveTime), m = Math.round((driveTime - h) * 60);
        return {
          primary: { label: "Fuel Cost", value: `$${formatNumber(fuelCost, 2)}` },
          details: [
            { label: "Gallons needed", value: formatNumber(gallons, 1) },
            { label: "Drive time", value: `${h}h ${m}m` },
            { label: "Cost per mile", value: `$${formatNumber(costPerMile, 3)}` },
            ...(hotelCost > 0 ? [
              { label: "Hotel cost", value: `$${formatNumber(hotelCost, 2)}` },
              { label: "Total trip cost", value: `$${formatNumber(totalCost, 2)}` },
            ] : []),
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fuel-cost-calculator", "gas-mileage-calculator", "speed-calculator"],
  faq: [{ question: "How do I calculate road trip fuel cost?", answer: "Fuel cost = (Distance / MPG) × Gas Price. For a 500-mile trip at 28 MPG with $3.50/gal gas: 500/28 × 3.50 = $62.50. Add hotels, food, and tolls for total trip cost." }],
  formula: "Fuel Cost = (Distance / MPG) × Gas Price",
};
