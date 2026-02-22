import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waterHeaterSizeCalculator: CalculatorDefinition = {
  slug: "water-heater-size-calculator",
  title: "Water Heater Sizing Calculator",
  description: "Free water heater sizing calculator. Determine the right water heater capacity based on household size and usage patterns.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["water heater size calculator", "water heater capacity", "hot water demand", "tankless sizing", "water heater gallon"],
  variants: [
    {
      id: "tank-sizing",
      name: "Tank Water Heater Size",
      description: "Calculate tank capacity based on peak hour demand",
      fields: [
        { name: "occupants", label: "Number of Occupants", type: "number", placeholder: "e.g. 4" },
        { name: "bathrooms", label: "Number of Bathrooms", type: "number", placeholder: "e.g. 2" },
        { name: "usage", label: "Usage Level", type: "select", options: [
          { label: "Low (quick showers)", value: "low" },
          { label: "Average", value: "average" },
          { label: "High (long showers, baths)", value: "high" },
        ], defaultValue: "average" },
        { name: "fuelType", label: "Fuel Type", type: "select", options: [
          { label: "Gas", value: "gas" },
          { label: "Electric", value: "electric" },
          { label: "Heat Pump", value: "heatpump" },
        ], defaultValue: "gas" },
      ],
      calculate: (inputs) => {
        const occupants = inputs.occupants as number;
        const bathrooms = inputs.bathrooms as number;
        const usage = inputs.usage as string;
        const fuelType = inputs.fuelType as string;
        if (!occupants || !bathrooms) return null;
        const gallonsPerPerson: Record<string, number> = { low: 10, average: 15, high: 20 };
        const gpd = occupants * (gallonsPerPerson[usage] || 15);
        const peakHourDemand = gpd * 0.7;
        const recoveryRate: Record<string, number> = { gas: 40, electric: 20, heatpump: 15 };
        const recovery = recoveryRate[fuelType] || 40;
        const tankSize = peakHourDemand;
        const standardSizes = [30, 40, 50, 65, 75, 80, 100];
        const recommended = standardSizes.find(s => s >= tankSize) || 100;
        const firstHourRating = recommended * 0.7 + recovery;
        return {
          primary: { label: "Recommended Tank Size", value: `${formatNumber(recommended, 0)}` + " gallons" },
          details: [
            { label: "Peak Hour Demand", value: `${formatNumber(peakHourDemand, 0)}` + " gal" },
            { label: "Daily Hot Water Use", value: `${formatNumber(gpd, 0)}` + " gal" },
            { label: "First Hour Rating", value: `${formatNumber(firstHourRating, 0)}` + " gal/hr" },
            { label: "Recovery Rate", value: `${formatNumber(recovery, 0)}` + " gal/hr" },
            { label: "Fuel Type", value: fuelType },
          ],
        };
      },
    },
    {
      id: "tankless-sizing",
      name: "Tankless Water Heater Size",
      description: "Calculate flow rate needed for tankless unit",
      fields: [
        { name: "fixtures", label: "Max Simultaneous Fixtures", type: "number", placeholder: "e.g. 2" },
        { name: "inletTemp", label: "Inlet Water Temp (F)", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
        { name: "outletTemp", label: "Desired Hot Water Temp (F)", type: "number", placeholder: "e.g. 120", defaultValue: 120 },
      ],
      calculate: (inputs) => {
        const fixtures = inputs.fixtures as number;
        const inletTemp = inputs.inletTemp as number;
        const outletTemp = inputs.outletTemp as number;
        if (!fixtures || !inletTemp || !outletTemp) return null;
        const flowPerFixture = 2.0;
        const totalFlow = fixtures * flowPerFixture;
        const tempRise = outletTemp - inletTemp;
        const btuNeeded = totalFlow * 500 * tempRise / 60 * 60;
        const kw = btuNeeded / 3412;
        return {
          primary: { label: "Required Flow Rate", value: `${formatNumber(totalFlow, 1)}` + " GPM" },
          details: [
            { label: "Temperature Rise", value: `${formatNumber(tempRise, 0)}` + " F" },
            { label: "BTU Required", value: `${formatNumber(btuNeeded, 0)}` + " BTU/hr" },
            { label: "kW Equivalent", value: `${formatNumber(kw, 1)}` + " kW" },
            { label: "Simultaneous Fixtures", value: `${formatNumber(fixtures, 0)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["boiler-size-calculator", "water-supply-demand-calculator", "heat-loss-calculator"],
  faq: [
    { question: "What size water heater do I need?", answer: "For 1-2 people, 30-40 gallons. For 3-4 people, 40-50 gallons. For 5+ people, 50-80 gallons. This varies by usage habits and fuel type." },
    { question: "Tank vs tankless water heater?", answer: "Tank heaters store hot water and are cheaper upfront. Tankless heaters heat on demand, are more efficient, but cost more. Tankless is sized by flow rate (GPM) and temperature rise." },
  ],
  formula: "Peak Hour Demand = Daily Use x 0.7 | First Hour Rating = Tank x 0.7 + Recovery Rate",
};