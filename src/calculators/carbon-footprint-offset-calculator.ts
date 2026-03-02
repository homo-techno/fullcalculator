import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carbonFootprintOffsetCalculator: CalculatorDefinition = {
  slug: "carbon-footprint-offset-calculator",
  title: "Carbon Footprint Offset Calculator",
  description: "Calculate the number of trees or carbon credits needed to offset your annual carbon footprint from driving, flights, and home energy.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["carbon offset","carbon neutrality","tree planting","carbon credits","emissions offset"],
  variants: [{
    id: "standard",
    name: "Carbon Footprint Offset",
    description: "Calculate the number of trees or carbon credits needed to offset your annual carbon footprint from driving, flights, and home energy.",
    fields: [
      { name: "drivingMiles", label: "Annual Driving Miles", type: "number", min: 0, max: 100000, defaultValue: 12000 },
      { name: "flightHours", label: "Annual Flight Hours", type: "number", min: 0, max: 500, defaultValue: 10 },
      { name: "homeKwh", label: "Monthly Home Electricity (kWh)", type: "number", min: 0, max: 5000, defaultValue: 900 },
      { name: "creditCost", label: "Carbon Credit Cost ($/ton)", type: "number", min: 5, max: 100, defaultValue: 15 },
    ],
    calculate: (inputs) => {
    const drivingMiles = inputs.drivingMiles as number;
    const flightHours = inputs.flightHours as number;
    const homeKwh = inputs.homeKwh as number;
    const creditCost = inputs.creditCost as number;
    const drivingCO2 = drivingMiles * 0.000404;
    const flightCO2 = flightHours * 0.255;
    const homeCO2 = homeKwh * 12 * 0.000417;
    const totalCO2 = drivingCO2 + flightCO2 + homeCO2;
    const treesNeeded = Math.ceil(totalCO2 / 0.022);
    const creditsCost = totalCO2 * creditCost;
    return {
      primary: { label: "Total Annual CO2", value: formatNumber(Math.round(totalCO2 * 100) / 100) + " metric tons" },
      details: [
        { label: "Driving Emissions", value: formatNumber(Math.round(drivingCO2 * 100) / 100) + " tons" },
        { label: "Flight Emissions", value: formatNumber(Math.round(flightCO2 * 100) / 100) + " tons" },
        { label: "Home Energy Emissions", value: formatNumber(Math.round(homeCO2 * 100) / 100) + " tons" },
        { label: "Trees Needed to Offset", value: formatNumber(treesNeeded) + " trees" },
        { label: "Carbon Credit Cost", value: "$" + formatNumber(Math.round(creditsCost)) }
      ]
    };
  },
  }],
  relatedSlugs: ["carbon-footprint-calculator","tree-carbon-calculator","solar-panel-payback-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Driving CO2 = Miles x 0.000404 tons/mile
Flight CO2 = Hours x 0.255 tons/hour
Home CO2 = kWh x 12 x 0.000417 tons/kWh
Trees = Total CO2 / 0.022",
};
