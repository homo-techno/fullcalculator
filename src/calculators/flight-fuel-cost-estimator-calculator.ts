import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flightFuelCostEstimatorCalculator: CalculatorDefinition = {
  slug: "flight-fuel-cost-estimator-calculator",
  title: "Flight Fuel Cost Estimator Calculator",
  description: "Estimate fuel costs for a flight based on distance, aircraft type, and fuel price per gallon.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["flight fuel cost","aviation fuel","jet fuel calculator","airplane fuel expense"],
  variants: [{
    id: "standard",
    name: "Flight Fuel Cost Estimator",
    description: "Estimate fuel costs for a flight based on distance, aircraft type, and fuel price per gallon.",
    fields: [
      { name: "distance", label: "Flight Distance (miles)", type: "number", min: 50, max: 12000, defaultValue: 1500 },
      { name: "aircraftType", label: "Aircraft Type", type: "select", options: [{ value: "1", label: "Small Prop (10 gal/hr)" }, { value: "2", label: "Turboprop (60 gal/hr)" }, { value: "3", label: "Light Jet (150 gal/hr)" }, { value: "4", label: "Mid-Size Jet (250 gal/hr)" }, { value: "5", label: "Heavy Jet (450 gal/hr)" }], defaultValue: "3" },
      { name: "fuelPrice", label: "Fuel Price ($/gallon)", type: "number", min: 2, max: 15, defaultValue: 6.5 },
      { name: "cruiseSpeed", label: "Cruise Speed (mph)", type: "number", min: 100, max: 600, defaultValue: 450 },
    ],
    calculate: (inputs) => {
    const distance = inputs.distance as number;
    const aircraftType = inputs.aircraftType as string;
    const fuelPrice = inputs.fuelPrice as number;
    const cruiseSpeed = inputs.cruiseSpeed as number;
    const burnRates: Record<string, number> = { "1": 10, "2": 60, "3": 150, "4": 250, "5": 450 };
    const burnRate = burnRates[aircraftType] || 150;
    const flightHours = distance / cruiseSpeed;
    const totalGallons = burnRate * flightHours;
    const totalCost = totalGallons * fuelPrice;
    const costPerMile = totalCost / distance;
    return {
      primary: { label: "Total Fuel Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
      details: [
        { label: "Flight Time", value: formatNumber(Math.round(flightHours * 10) / 10) + " hours" },
        { label: "Fuel Burned", value: formatNumber(Math.round(totalGallons)) + " gallons" },
        { label: "Cost Per Mile", value: "$" + formatNumber(Math.round(costPerMile * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["flight-cost-per-mile-calculator","road-trip-cost-calculator","travel-budget-calculator"],
  faq: [
    { question: "How much does jet fuel cost?", answer: "Jet-A fuel typically costs $5 to $8 per gallon at most FBOs, though prices vary by location and volume." },
    { question: "How much fuel does a private jet burn per hour?", answer: "Light jets burn about 100 to 200 gallons per hour, mid-size jets 200 to 300, and heavy jets 350 to 500+ gallons per hour." },
    { question: "What affects flight fuel costs the most?", answer: "Distance, aircraft size, headwinds, altitude, payload weight, and fuel prices at the departure airport all significantly impact fuel costs." },
  ],
  formula: "Total Fuel Cost = (Distance / Cruise Speed) x Burn Rate x Fuel Price
Cost Per Mile = Total Fuel Cost / Distance",
};
