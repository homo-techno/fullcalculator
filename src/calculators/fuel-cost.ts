import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fuelCostCalculator: CalculatorDefinition = {
  slug: "fuel-cost-calculator",
  title: "Fuel Cost Calculator",
  description: "Free fuel cost calculator. Estimate gas cost for a trip based on distance, fuel efficiency, and gas price.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["fuel cost calculator", "gas cost calculator", "trip fuel cost", "gas mileage calculator", "mpg calculator"],
  variants: [
    {
      id: "trip",
      name: "Trip Fuel Cost",
      description: "Calculate fuel cost for a trip",
      fields: [
        { name: "distance", label: "Trip Distance", type: "number", placeholder: "e.g. 300", suffix: "miles" },
        { name: "mpg", label: "Fuel Efficiency", type: "number", placeholder: "e.g. 28", suffix: "MPG" },
        { name: "price", label: "Gas Price", type: "number", placeholder: "e.g. 3.50", prefix: "$", step: 0.01, suffix: "/gal" },
      ],
      calculate: (inputs) => {
        const dist = inputs.distance as number;
        const mpg = inputs.mpg as number;
        const price = inputs.price as number;
        if (!dist || !mpg || !price) return null;
        const gallons = dist / mpg;
        const cost = gallons * price;
        return {
          primary: { label: "Trip Cost", value: `$${formatNumber(cost)}` },
          details: [
            { label: "Fuel needed", value: `${formatNumber(gallons, 1)} gallons` },
            { label: "Cost per mile", value: `$${formatNumber(cost / dist, 2)}` },
          ],
        };
      },
    },
    {
      id: "mpg",
      name: "Calculate MPG",
      description: "Calculate fuel efficiency from miles driven and gallons used",
      fields: [
        { name: "miles", label: "Miles Driven", type: "number", placeholder: "e.g. 350" },
        { name: "gallons", label: "Gallons Used", type: "number", placeholder: "e.g. 12.5" },
      ],
      calculate: (inputs) => {
        const miles = inputs.miles as number;
        const gal = inputs.gallons as number;
        if (!miles || !gal) return null;
        const mpg = miles / gal;
        const lper100km = 235.215 / mpg;
        return {
          primary: { label: "Fuel Efficiency", value: formatNumber(mpg, 1), suffix: "MPG" },
          details: [{ label: "Metric equivalent", value: `${formatNumber(lper100km, 1)} L/100km` }],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "discount-calculator"],
  faq: [
    { question: "How do I calculate gas cost for a trip?", answer: "Divide trip distance by your car's MPG to get gallons needed, then multiply by gas price. Example: 300 miles / 28 MPG = 10.7 gallons x $3.50 = $37.50." },
  ],
  formula: "Cost = (Distance / MPG) x Price per Gallon",
};
