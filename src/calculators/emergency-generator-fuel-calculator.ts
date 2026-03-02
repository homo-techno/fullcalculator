import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const emergencyGeneratorFuelCalculator: CalculatorDefinition = {
  slug: "emergency-generator-fuel-calculator",
  title: "Emergency Generator Fuel Calculator",
  description: "Estimate fuel needed to run a generator during outages.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["generator fuel","generator runtime calculator"],
  variants: [{
    id: "standard",
    name: "Emergency Generator Fuel",
    description: "Estimate fuel needed to run a generator during outages.",
    fields: [
      { name: "wattage", label: "Generator Wattage (W)", type: "number", min: 500, max: 20000, defaultValue: 5000 },
      { name: "loadPct", label: "Average Load (%)", type: "number", min: 10, max: 100, defaultValue: 50 },
      { name: "hours", label: "Hours of Use Per Day", type: "number", min: 1, max: 24, defaultValue: 12 },
      { name: "days", label: "Number of Days", type: "number", min: 1, max: 30, defaultValue: 3 },
      { name: "fuelRate", label: "Fuel Rate (gal/hr at full)", type: "number", min: 0.2, max: 5, defaultValue: 0.75 },
    ],
    calculate: (inputs) => {
      const watt = inputs.wattage as number;
      const load = inputs.loadPct as number;
      const hrs = inputs.hours as number;
      const days = inputs.days as number;
      const rate = inputs.fuelRate as number;
      if (!watt || !load || !hrs || !days || !rate) return null;
      const actualRate = rate * (load / 100);
      const dailyFuel = Math.round(actualRate * hrs * 100) / 100;
      const totalFuel = Math.round(dailyFuel * days * 100) / 100;
      return {
        primary: { label: "Total Fuel Needed", value: formatNumber(totalFuel) + " gallons" },
        details: [
          { label: "Daily Consumption", value: formatNumber(dailyFuel) + " gal/day" },
          { label: "Hourly Rate at Load", value: formatNumber(Math.round(actualRate * 100) / 100) + " gal/hr" },
          { label: "Total Runtime", value: formatNumber(hrs * days) + " hours" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How much fuel does a generator use per hour?", answer: "A 5000W generator uses about 0.5 to 0.75 gallons per hour at half load." },
    { question: "How should I store generator fuel?", answer: "Use approved containers in a ventilated area and add stabilizer for long storage." },
  ],
  formula: "Total Fuel = Fuel Rate x (Load/100) x Hours/Day x Days",
};
