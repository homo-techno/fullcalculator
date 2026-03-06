import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const marineGeneratorSizingCalculator: CalculatorDefinition = {
  slug: "marine-generator-sizing-calculator",
  title: "Marine Generator Sizing Calculator",
  description: "Size your marine generator based on onboard electrical loads including air conditioning, appliances, and electronics to ensure adequate power output.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["marine generator sizing","boat generator calculator","onboard power","marine genset size"],
  variants: [{
    id: "standard",
    name: "Marine Generator Sizing",
    description: "Size your marine generator based on onboard electrical loads including air conditioning, appliances, and electronics to ensure adequate power output.",
    fields: [
      { name: "acLoad", label: "Air Conditioning (watts)", type: "number", min: 0, max: 30000, defaultValue: 5000 },
      { name: "waterHeater", label: "Water Heater (watts)", type: "number", min: 0, max: 5000, defaultValue: 1500 },
      { name: "appliances", label: "Kitchen Appliances (watts)", type: "number", min: 0, max: 5000, defaultValue: 1200 },
      { name: "electronics", label: "Electronics and Lighting (watts)", type: "number", min: 50, max: 3000, defaultValue: 500 },
      { name: "batteryCharger", label: "Battery Charger (watts)", type: "number", min: 0, max: 5000, defaultValue: 800 },
      { name: "safetyMargin", label: "Safety Margin (%)", type: "number", min: 10, max: 50, defaultValue: 25 },
    ],
    calculate: (inputs) => {
    const ac = inputs.acLoad as number;
    const heater = inputs.waterHeater as number;
    const appliances = inputs.appliances as number;
    const electronics = inputs.electronics as number;
    const charger = inputs.batteryCharger as number;
    const margin = inputs.safetyMargin as number / 100;
    const totalLoad = ac + heater + appliances + electronics + charger;
    const withMargin = totalLoad * (1 + margin);
    const kw = withMargin / 1000;
    const fuelPerHour = kw * 0.08;
    const amps120 = withMargin / 120;
    return {
      primary: { label: "Minimum Generator Size", value: formatNumber(Math.round(kw * 10) / 10) + " kW" },
      details: [
        { label: "Total Electrical Load", value: formatNumber(Math.round(totalLoad)) + " watts" },
        { label: "With Safety Margin", value: formatNumber(Math.round(withMargin)) + " watts" },
        { label: "Estimated Current Draw", value: formatNumber(Math.round(amps120 * 10) / 10) + " amps at 120V" },
        { label: "Estimated Fuel Usage", value: formatNumber(Math.round(fuelPerHour * 100) / 100) + " gal/hr" }
      ]
    };
  },
  }],
  relatedSlugs: ["marine-battery-sizing-calculator","bilge-pump-sizing-calculator"],
  faq: [
    { question: "How do I size a marine generator?", answer: "Add up the wattage of all electrical loads that may run simultaneously, then add a 20 to 25 percent safety margin. Generator size is rated in kilowatts, so divide the total watts by 1,000." },
    { question: "Can a generator run air conditioning on a boat?", answer: "Yes, but air conditioning is typically the largest load on a boat. A single 12,000 BTU marine AC unit draws about 1,200 to 1,500 watts. Most boats with AC need a generator of 5 kW or larger." },
    { question: "How much fuel does a marine generator use?", answer: "Marine generators typically consume 0.06 to 0.1 gallons per kilowatt hour. A 6 kW generator running at 50 percent load uses roughly 0.25 to 0.3 gallons per hour." },
  ],
  formula: "Total Load = AC + Water Heater + Appliances + Electronics + Battery Charger
With Safety Margin = Total Load x (1 + Safety Margin %)
Generator Size (kW) = Total Load with Margin / 1000",
};
