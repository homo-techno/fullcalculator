import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const solarBatterySizingCalculator: CalculatorDefinition = {
  slug: "solar-battery-sizing-calculator",
  title: "Solar Battery Sizing Calculator",
  description: "Size a solar battery bank for off-grid use.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["solar battery size","battery bank calculator"],
  variants: [{
    id: "standard",
    name: "Solar Battery Sizing",
    description: "Size a solar battery bank for off-grid use.",
    fields: [
      { name: "dailyUsage", label: "Daily Usage (Wh)", type: "number", min: 1, max: 100000, defaultValue: 5000 },
      { name: "autonomyDays", label: "Autonomy Days", type: "number", min: 1, max: 14, defaultValue: 2 },
      { name: "batteryVoltage", label: "Battery Voltage (V)", type: "number", min: 6, max: 48, defaultValue: 12 },
      { name: "depthOfDischarge", label: "Depth of Discharge (%)", type: "number", min: 10, max: 100, defaultValue: 50 },
    ],
    calculate: (inputs) => {
      const daily = inputs.dailyUsage as number;
      const days = inputs.autonomyDays as number;
      const voltage = inputs.batteryVoltage as number;
      const dod = inputs.depthOfDischarge as number;
      if (!daily || !days || !voltage || !dod) return null;
      const totalWh = daily * days;
      const requiredWh = totalWh / (dod / 100);
      const ah = Math.round(requiredWh / voltage);
      return {
        primary: { label: "Battery Bank Size", value: formatNumber(ah) + " Ah" },
        details: [
          { label: "Total Energy Needed", value: formatNumber(totalWh) + " Wh" },
          { label: "Required Capacity (Wh)", value: formatNumber(Math.round(requiredWh)) },
          { label: "System Voltage", value: voltage + " V" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is depth of discharge?", answer: "The percentage of battery capacity that is used before recharging." },
    { question: "How many autonomy days should I plan?", answer: "Two to three days is typical for most residential solar setups." },
  ],
  formula: "Ah = (Daily Wh x Autonomy Days) / (DoD x Voltage)",
};
