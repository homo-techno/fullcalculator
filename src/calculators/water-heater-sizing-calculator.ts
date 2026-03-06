import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waterHeaterSizingCalculator: CalculatorDefinition = {
  slug: "water-heater-sizing-calculator",
  title: "Water Heater Sizing Calculator",
  description: "Determine the right water heater size for your household based on number of occupants, usage patterns, and fixture count to ensure adequate hot water supply.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["water heater size","hot water heater calculator","water heater capacity","tankless water heater sizing"],
  variants: [{
    id: "standard",
    name: "Water Heater Sizing",
    description: "Determine the right water heater size for your household based on number of occupants, usage patterns, and fixture count to ensure adequate hot water supply.",
    fields: [
      { name: "occupants", label: "Number of Occupants", type: "number", min: 1, max: 12, defaultValue: 4 },
      { name: "bathrooms", label: "Number of Bathrooms", type: "number", min: 1, max: 6, defaultValue: 2 },
      { name: "heaterType", label: "Heater Type", type: "select", options: [{ value: "1", label: "Tank (Storage)" }, { value: "2", label: "Tankless" }, { value: "3", label: "Heat Pump" }], defaultValue: "1" },
      { name: "usageLevel", label: "Usage Level", type: "select", options: [{ value: "1", label: "Low (quick showers)" }, { value: "2", label: "Medium (average)" }, { value: "3", label: "High (long showers, baths)" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const occupants = inputs.occupants as number;
    const bathrooms = inputs.bathrooms as number;
    const heaterType = parseInt(inputs.heaterType as string);
    const usage = parseInt(inputs.usageLevel as string);
    const gallonsPerPerson = { 1: 15, 2: 20, 3: 30 };
    const dailyGallons = occupants * (gallonsPerPerson[usage] || 20);
    const peakGPM = bathrooms * 2.0 + 1.0;
    const fhr = dailyGallons * 0.7;
    let tankSize = 0;
    if (heaterType === 1) {
      if (fhr <= 40) tankSize = 40;
      else if (fhr <= 55) tankSize = 50;
      else if (fhr <= 70) tankSize = 65;
      else tankSize = 80;
    }
    const tanklessGPM = Math.ceil(peakGPM * 10) / 10;
    const btuNeeded = heaterType === 2 ? Math.round(tanklessGPM * 500 * 60) : Math.round(dailyGallons * 8.33 * 60 * 0.8);
    const annualCostEstimate = heaterType === 3 ? Math.round(dailyGallons * 365 * 0.005) : heaterType === 2 ? Math.round(dailyGallons * 365 * 0.008) : Math.round(dailyGallons * 365 * 0.012);
    return {
      primary: { label: heaterType === 2 ? "Required Flow Rate" : "Recommended Tank Size", value: heaterType === 2 ? formatNumber(tanklessGPM) + " GPM" : formatNumber(tankSize) + " gallons" },
      details: [
        { label: "Daily Hot Water Usage", value: formatNumber(dailyGallons) + " gallons" },
        { label: "First Hour Rating", value: formatNumber(Math.round(fhr)) + " gallons" },
        { label: "Peak Demand", value: formatNumber(Math.round(peakGPM * 10) / 10) + " GPM" },
        { label: "Est. Annual Operating Cost", value: "$" + formatNumber(annualCostEstimate) }
      ]
    };
  },
  }],
  relatedSlugs: ["pipe-flow-rate-calculator","btu-heating-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Daily Usage = Occupants x Gallons Per Person; First Hour Rating = Daily Usage x 0.7; Peak GPM = Bathrooms x 2.0 + 1.0; Tank Size = Based on FHR (40-80 gallons)",
};
