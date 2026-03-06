import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const marineBatterySizingCalculator: CalculatorDefinition = {
  slug: "marine-battery-sizing-calculator",
  title: "Marine Battery Sizing Calculator",
  description: "Size your marine battery bank based on electrical loads, usage hours, and desired reserve capacity to ensure reliable power on the water.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["marine battery sizing","boat battery calculator","battery bank amp hours","marine electrical load"],
  variants: [{
    id: "standard",
    name: "Marine Battery Sizing",
    description: "Size your marine battery bank based on electrical loads, usage hours, and desired reserve capacity to ensure reliable power on the water.",
    fields: [
      { name: "totalLoad", label: "Total Load (amps)", type: "number", min: 1, max: 500, defaultValue: 25 },
      { name: "usageHours", label: "Daily Usage (hours)", type: "number", min: 1, max: 24, defaultValue: 6 },
      { name: "reservePercent", label: "Reserve Capacity (%)", type: "number", min: 10, max: 100, defaultValue: 50 },
      { name: "batteryVoltage", label: "System Voltage", type: "select", options: [{ value: "12", label: "12V" }, { value: "24", label: "24V" }, { value: "48", label: "48V" }], defaultValue: "12" },
      { name: "batteryType", label: "Battery Type", type: "select", options: [{ value: "0.5", label: "Lead Acid (50% DoD)" }, { value: "0.8", label: "AGM (80% DoD)" }, { value: "0.9", label: "Lithium (90% DoD)" }], defaultValue: "0.5" },
    ],
    calculate: (inputs) => {
    const load = inputs.totalLoad as number;
    const hours = inputs.usageHours as number;
    const reserve = inputs.reservePercent as number / 100;
    const voltage = parseFloat(inputs.batteryVoltage as string);
    const dod = parseFloat(inputs.batteryType as string);
    const dailyAh = load * hours;
    const withReserve = dailyAh * (1 + reserve);
    const requiredAh = dod > 0 ? withReserve / dod : withReserve;
    const watts = load * voltage;
    const kwhNeeded = (requiredAh * voltage) / 1000;
    return {
      primary: { label: "Battery Bank Size", value: formatNumber(Math.round(requiredAh)) + " Ah" },
      details: [
        { label: "Daily Consumption", value: formatNumber(Math.round(dailyAh)) + " Ah" },
        { label: "With Reserve", value: formatNumber(Math.round(withReserve)) + " Ah" },
        { label: "Total Load", value: formatNumber(Math.round(watts)) + " watts" },
        { label: "Energy Required", value: formatNumber(Math.round(kwhNeeded * 100) / 100) + " kWh" }
      ]
    };
  },
  }],
  relatedSlugs: ["marine-generator-sizing-calculator","bilge-pump-sizing-calculator"],
  faq: [
    { question: "How do I size a marine battery bank?", answer: "Calculate your total amp-hour consumption per day, add a reserve margin of 25 to 50 percent, then divide by the maximum depth of discharge for your battery type. Lead acid batteries should not be discharged below 50 percent, while lithium can safely go to 80 to 90 percent." },
    { question: "What type of marine battery is best?", answer: "Lithium iron phosphate batteries offer the longest lifespan, lightest weight, and deepest discharge, but cost more upfront. AGM batteries are a good mid-range choice. Flooded lead acid batteries are the most affordable but require maintenance." },
    { question: "How long do marine batteries last?", answer: "Flooded lead acid batteries last 2 to 4 years, AGM batteries 4 to 7 years, and lithium batteries 8 to 15 years depending on charge cycles and maintenance." },
  ],
  formula: "Daily Amp-Hours = Total Load (amps) x Usage Hours
With Reserve = Daily Ah x (1 + Reserve %)
Battery Bank Size = With Reserve / Max Depth of Discharge",
};
