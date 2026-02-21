import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const towingCapacityCalculator: CalculatorDefinition = {
  slug: "towing-capacity-calculator",
  title: "Towing Capacity Calculator",
  description:
    "Free towing capacity calculator. Determine how much your vehicle can safely tow by subtracting curb weight and cargo from GCVWR.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "towing capacity",
    "tow rating",
    "GCVWR",
    "trailer weight",
    "towing calculator",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Towing Capacity",
      fields: [
        {
          name: "gcvwr",
          label: "GCVWR (lbs)",
          type: "number",
          placeholder: "e.g. 15000",
        },
        {
          name: "curbWeight",
          label: "Vehicle Curb Weight (lbs)",
          type: "number",
          placeholder: "e.g. 5500",
        },
        {
          name: "cargoWeight",
          label: "Passengers & Cargo Weight (lbs)",
          type: "number",
          placeholder: "e.g. 500",
        },
      ],
      calculate: (inputs) => {
        const gcvwr = inputs.gcvwr as number;
        const curbWeight = inputs.curbWeight as number;
        const cargoWeight = inputs.cargoWeight as number;

        if (!gcvwr || !curbWeight) return null;
        if (gcvwr <= 0 || curbWeight <= 0) return null;

        const cargo = cargoWeight || 0;
        const towingCapacity = gcvwr - curbWeight - cargo;
        const totalVehicleWeight = curbWeight + cargo;
        const utilizationPct = (totalVehicleWeight / gcvwr) * 100;
        const remainingCapacityPct = ((gcvwr - totalVehicleWeight) / gcvwr) * 100;

        // Convert to kg
        const towingCapacityKg = towingCapacity * 0.453592;

        let safetyNote = "";
        if (towingCapacity <= 0) {
          safetyNote = "Warning: Vehicle is at or over GCVWR with current load. Cannot tow safely.";
        } else if (remainingCapacityPct < 10) {
          safetyNote = "Caution: Very limited towing capacity remaining.";
        } else {
          safetyNote = "Within safe towing limits.";
        }

        return {
          primary: {
            label: "Max Towing Capacity",
            value: `${formatNumber(Math.max(towingCapacity, 0), 0)} lbs`,
          },
          details: [
            {
              label: "GCVWR",
              value: `${formatNumber(gcvwr, 0)} lbs`,
            },
            {
              label: "Vehicle Curb Weight",
              value: `${formatNumber(curbWeight, 0)} lbs`,
            },
            {
              label: "Passengers & Cargo",
              value: `${formatNumber(cargo, 0)} lbs`,
            },
            {
              label: "Total Vehicle Weight (loaded)",
              value: `${formatNumber(totalVehicleWeight, 0)} lbs`,
            },
            {
              label: "Max Towing Capacity",
              value: `${formatNumber(Math.max(towingCapacity, 0), 0)} lbs (${formatNumber(Math.max(towingCapacityKg, 0), 0)} kg)`,
            },
            {
              label: "GCVWR Utilization",
              value: `${formatNumber(utilizationPct, 1)}%`,
            },
            { label: "Safety Note", value: safetyNote },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["tire-size-calculator", "car-depreciation-calculator"],
  faq: [
    {
      question: "What is GCVWR?",
      answer:
        "GCVWR (Gross Combined Vehicle Weight Rating) is the maximum allowable weight of the vehicle, passengers, cargo, and trailer combined. It is set by the manufacturer.",
    },
    {
      question: "How is towing capacity calculated?",
      answer:
        "Towing Capacity = GCVWR - Vehicle Curb Weight - Passengers and Cargo Weight. This gives the maximum weight you can safely tow.",
    },
  ],
  formula:
    "Towing Capacity = GCVWR - Curb Weight - Cargo/Passenger Weight.",
};
