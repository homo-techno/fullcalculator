import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flightCarbonCalculator: CalculatorDefinition = {
  slug: "flight-carbon-calculator",
  title: "Flight Carbon Footprint Calculator",
  description:
    "Free flight carbon footprint calculator. Estimate CO2 emissions from air travel based on distance, class, and number of passengers.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "flight carbon",
    "air travel emissions",
    "aviation co2",
    "flight footprint",
    "airplane emissions",
    "flying carbon",
  ],
  variants: [
    {
      id: "flight",
      name: "Flight Emissions",
      fields: [
        {
          name: "distance",
          label: "Flight Distance (miles, one way)",
          type: "number",
          placeholder: "e.g. 2500",
        },
        {
          name: "flightClass",
          label: "Cabin Class",
          type: "select",
          options: [
            { label: "Economy", value: "economy" },
            { label: "Premium Economy", value: "premium" },
            { label: "Business", value: "business" },
            { label: "First Class", value: "first" },
          ],
        },
        {
          name: "roundTrip",
          label: "Round Trip?",
          type: "select",
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
        },
        {
          name: "passengers",
          label: "Number of Passengers",
          type: "number",
          placeholder: "e.g. 1",
          defaultValue: 1,
        },
      ],
      calculate: (inputs) => {
        const distance = inputs.distance as number;
        const flightClass = (inputs.flightClass as string) || "economy";
        const roundTrip = (inputs.roundTrip as string) || "yes";
        const passengers = (inputs.passengers as number) || 1;
        if (!distance) return null;

        const classMultiplier: Record<string, number> = {
          economy: 1,
          premium: 1.6,
          business: 2.9,
          first: 4.0,
        };

        const baseCO2PerMile = 0.255; // kg CO2 per passenger-mile (economy)
        const multiplier = classMultiplier[flightClass] || 1;
        const tripMultiplier = roundTrip === "yes" ? 2 : 1;
        const totalMiles = distance * tripMultiplier;
        const co2Kg = totalMiles * baseCO2PerMile * multiplier * passengers;
        const co2Tons = co2Kg / 1000;
        const treesNeeded = Math.ceil(co2Kg / 21);
        const drivingEquiv = co2Kg / 0.404;

        return {
          primary: {
            label: "Total Flight CO2",
            value: formatNumber(co2Tons, 3) + " metric tons",
          },
          details: [
            { label: "CO2 Emissions", value: formatNumber(co2Kg, 1) + " kg" },
            { label: "Total Distance", value: formatNumber(totalMiles, 0) + " miles" },
            { label: "Class Multiplier", value: multiplier + "x" },
            { label: "Per Passenger", value: formatNumber(co2Kg / passengers, 1) + " kg" },
            { label: "Trees to Offset", value: formatNumber(treesNeeded, 0) },
            { label: "Equivalent Driving Miles", value: formatNumber(drivingEquiv, 0) + " mi" },
          ],
          note: "Business and first class have higher emissions because fewer seats means each passenger is responsible for more of the plane's fuel burn.",
        };
      },
    },
  ],
  relatedSlugs: ["carbon-footprint-calculator", "flight-distance-calculator"],
  faq: [
    {
      question: "Why does cabin class affect carbon emissions?",
      answer:
        "Business and first class seats take up more space, meaning fewer passengers share the fuel cost. A business class seat can produce nearly 3x the emissions of an economy seat on the same flight.",
    },
    {
      question: "How does flying compare to driving?",
      answer:
        "For short trips, driving is often more carbon-efficient, especially with multiple passengers. For long distances, flying can be comparable to a single-occupancy car on a per-mile basis, but the total distance is usually much greater.",
    },
  ],
  formula:
    "CO2 = Distance x Trip Multiplier x 0.255 kg/mile x Class Multiplier x Passengers. Class multipliers: Economy 1x, Premium 1.6x, Business 2.9x, First 4x.",
};
