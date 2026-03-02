import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fleetFuelCostCalculator: CalculatorDefinition = {
  slug: "fleet-fuel-cost-calculator",
  title: "Fleet Fuel Cost Calculator",
  description: "Calculate total fuel cost for a vehicle fleet.",
  category: "Finance",
  categorySlug: "$",
  icon: "DollarSign",
  keywords: ["fleet","fuel","cost","vehicles","mileage"],
  variants: [{
    id: "standard",
    name: "Fleet Fuel Cost",
    description: "Calculate total fuel cost for a vehicle fleet.",
    fields: [
      { name: "vehicleCount", label: "Number of Vehicles", type: "number", min: 1, max: 10000, defaultValue: 20 },
      { name: "milesPerVehicle", label: "Miles Per Vehicle/Month", type: "number", min: 100, max: 50000, defaultValue: 5000 },
      { name: "mpg", label: "Average MPG", type: "number", min: 1, max: 100, defaultValue: 8 },
      { name: "fuelPrice", label: "Fuel Price ($/gal)", type: "number", min: 0.5, max: 15, defaultValue: 3.75 },
    ],
    calculate: (inputs) => {
    const vehicleCount = inputs.vehicleCount as number;
    const milesPerVehicle = inputs.milesPerVehicle as number;
    const mpg = inputs.mpg as number;
    const fuelPrice = inputs.fuelPrice as number;
    const totalMiles = vehicleCount * milesPerVehicle;
    const totalGallons = totalMiles / mpg;
    const totalCost = totalGallons * fuelPrice;
    const costPerVehicle = totalCost / vehicleCount;
    const costPerMile = totalCost / totalMiles;
    return {
      primary: { label: "Total Monthly Fuel Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Cost Per Vehicle", value: "$" + formatNumber(costPerVehicle) },
        { label: "Cost Per Mile", value: "$" + formatNumber(costPerMile) },
        { label: "Total Gallons", value: formatNumber(totalGallons) },
        { label: "Total Fleet Miles", value: formatNumber(totalMiles) }
      ]
    };
  },
  }],
  relatedSlugs: ["fuel-surcharge-calculator","deadhead-miles-calculator","vehicle-depreciation-schedule-calculator"],
  faq: [
    { question: "How do I calculate fleet fuel cost?", answer: "Multiply total miles by fuel price and divide by average miles per gallon." },
    { question: "What is a good MPG for trucks?", answer: "Class 8 trucks average 5 to 8 MPG while delivery vans get 10 to 15 MPG." },
  ],
  formula: "Total Cost = (Vehicles x Miles / MPG) x Fuel Price",
};
