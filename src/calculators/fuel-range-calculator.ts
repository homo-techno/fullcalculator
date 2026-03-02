import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fuelRangeCalculator: CalculatorDefinition = {
  slug: "fuel-range-calculator",
  title: "Fuel Range Calculator",
  description: "Estimate how far a boat can travel on available fuel.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["fuel","range","boat","marine"],
  variants: [{
    id: "standard",
    name: "Fuel Range",
    description: "Estimate how far a boat can travel on available fuel.",
    fields: [
      { name: "fuelCapacity", label: "Fuel Capacity (gal)", type: "number", min: 1, max: 10000, defaultValue: 150 },
      { name: "burnRate", label: "Fuel Burn Rate (gal/hr)", type: "number", min: 0.5, max: 500, defaultValue: 12 },
      { name: "cruiseSpeed", label: "Cruise Speed (kts)", type: "number", min: 1, max: 50, defaultValue: 18 },
      { name: "reserve", label: "Reserve Fuel (%)", type: "number", min: 0, max: 50, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const fuelCapacity = inputs.fuelCapacity as number;
    const burnRate = inputs.burnRate as number;
    const cruiseSpeed = inputs.cruiseSpeed as number;
    const reserve = inputs.reserve as number;
    const usableFuel = fuelCapacity * (1 - reserve / 100);
    const endurance = usableFuel / burnRate;
    const rangeNM = endurance * cruiseSpeed;
    return {
      primary: { label: "Maximum Range", value: formatNumber(rangeNM) + " NM" },
      details: [
        { label: "Usable Fuel", value: formatNumber(usableFuel) + " gal" },
        { label: "Endurance", value: formatNumber(endurance) + " hours" },
        { label: "Reserve Fuel", value: formatNumber(fuelCapacity - usableFuel) + " gal" }
      ]
    };
  },
  }],
  relatedSlugs: ["fuel-burn-rate-calculator","nautical-mile-converter-calculator"],
  faq: [
    { question: "How much fuel reserve should a boat carry?", answer: "The rule of thirds says one third for out, one third back, one third reserve." },
    { question: "How is boat range calculated?", answer: "Range equals endurance hours multiplied by cruise speed." },
  ],
  formula: "Usable = Capacity x (1 - Reserve%); Range = (Usable / Burn Rate) x Speed",
};
