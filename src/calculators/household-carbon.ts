import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const householdCarbonCalculator: CalculatorDefinition = {
  slug: "household-carbon-calculator",
  title: "Household Carbon Footprint Calculator",
  description:
    "Free household carbon footprint calculator. Estimate your home's annual CO2 emissions from electricity, natural gas, heating oil, and waste.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "household carbon",
    "home emissions",
    "household carbon footprint",
    "home co2",
    "energy emissions",
    "residential carbon",
  ],
  variants: [
    {
      id: "household",
      name: "Household Emissions",
      fields: [
        {
          name: "electricityKwh",
          label: "Monthly Electricity (kWh)",
          type: "number",
          placeholder: "e.g. 900",
        },
        {
          name: "naturalGasTherms",
          label: "Monthly Natural Gas (therms)",
          type: "number",
          placeholder: "e.g. 50",
        },
        {
          name: "heatingFuel",
          label: "Heating Fuel Type",
          type: "select",
          options: [
            { label: "None / Electric Only", value: "none" },
            { label: "Heating Oil", value: "oil" },
            { label: "Propane", value: "propane" },
            { label: "Wood", value: "wood" },
          ],
        },
        {
          name: "heatingGallons",
          label: "Monthly Heating Fuel (gallons)",
          type: "number",
          placeholder: "e.g. 0",
          defaultValue: 0,
        },
        {
          name: "occupants",
          label: "Number of Occupants",
          type: "number",
          placeholder: "e.g. 3",
          defaultValue: 1,
        },
      ],
      calculate: (inputs) => {
        const electricityKwh = (inputs.electricityKwh as number) || 0;
        const naturalGasTherms = (inputs.naturalGasTherms as number) || 0;
        const heatingFuel = (inputs.heatingFuel as string) || "none";
        const heatingGallons = (inputs.heatingGallons as number) || 0;
        const occupants = (inputs.occupants as number) || 1;
        if (!electricityKwh && !naturalGasTherms && !heatingGallons) return null;

        const electricityCO2 = electricityKwh * 12 * 0.417; // kg CO2 per kWh US avg
        const gasCO2 = naturalGasTherms * 12 * 5.3; // kg CO2 per therm

        const fuelFactors: Record<string, number> = {
          none: 0,
          oil: 10.16,
          propane: 5.74,
          wood: 1.9,
        };
        const fuelCO2 = heatingGallons * 12 * (fuelFactors[heatingFuel] || 0);

        const totalCO2 = electricityCO2 + gasCO2 + fuelCO2;
        const totalTons = totalCO2 / 1000;
        const perCapita = totalCO2 / occupants;
        const usAvg = 7500; // kg CO2 per household per year

        return {
          primary: {
            label: "Annual Household CO2",
            value: formatNumber(totalTons, 2) + " metric tons",
          },
          details: [
            { label: "Electricity Emissions", value: formatNumber(electricityCO2, 0) + " kg/yr" },
            { label: "Natural Gas Emissions", value: formatNumber(gasCO2, 0) + " kg/yr" },
            { label: "Heating Fuel Emissions", value: formatNumber(fuelCO2, 0) + " kg/yr" },
            { label: "Per Occupant", value: formatNumber(perCapita, 0) + " kg/yr" },
            { label: "vs US Average Household", value: formatNumber((totalCO2 / usAvg) * 100, 0) + "%" },
          ],
          note: "The average US household produces about 7.5 metric tons of CO2 per year from energy use alone. Switching to renewable energy and improving insulation are the most impactful changes.",
        };
      },
    },
  ],
  relatedSlugs: ["carbon-footprint-calculator", "energy-audit-calculator"],
  faq: [
    {
      question: "What contributes most to household carbon emissions?",
      answer:
        "Heating and cooling typically account for 40-50% of household energy use. Electricity for appliances and lighting makes up another 30-40%. Water heating accounts for about 15%.",
    },
    {
      question: "How can I reduce my household carbon footprint?",
      answer:
        "Switch to renewable energy, improve insulation, use LED lighting, upgrade to Energy Star appliances, lower your thermostat in winter, and consider a heat pump for heating and cooling.",
    },
  ],
  formula:
    "Total CO2 = (Monthly kWh x 12 x 0.417) + (Monthly therms x 12 x 5.3) + (Monthly fuel gallons x 12 x fuel factor). Fuel factors: Oil 10.16, Propane 5.74, Wood 1.9 kg CO2/gallon.",
};
