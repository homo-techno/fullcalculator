import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const electricBillDeviceCostCalculator: CalculatorDefinition = {
  slug: "electric-bill-device-cost-calculator",
  title: "Electric Bill Device Cost Calculator",
  description: "Calculate how much any electronic device adds to your monthly electric bill based on wattage, hours of use, and local electricity rate.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["device electricity cost","appliance power cost","device electric bill","watt to dollar","device energy cost calculator"],
  variants: [{
    id: "standard",
    name: "Electric Bill Device Cost",
    description: "Calculate how much any electronic device adds to your monthly electric bill based on wattage, hours of use, and local electricity rate.",
    fields: [
      { name: "deviceWatts", label: "Device Wattage (W)", type: "number", min: 1, max: 5000, defaultValue: 200 },
      { name: "hoursPerDay", label: "Hours Used Per Day", type: "number", min: 0.5, max: 24, defaultValue: 4 },
      { name: "daysPerWeek", label: "Days Used Per Week", type: "number", min: 1, max: 7, defaultValue: 7 },
      { name: "electricRate", label: "Electricity Rate ($/kWh)", type: "number", min: 0.05, max: 0.60, defaultValue: 0.13 },
      { name: "standbyWatts", label: "Standby Power (W)", type: "number", min: 0, max: 50, defaultValue: 2 },
    ],
    calculate: (inputs) => {
    const watts = inputs.deviceWatts as number;
    const hours = inputs.hoursPerDay as number;
    const days = inputs.daysPerWeek as number;
    const rate = inputs.electricRate as number;
    const standby = inputs.standbyWatts as number;
    const activeKwhDay = (watts * hours) / 1000;
    const standbyHours = 24 - hours;
    const standbyKwhDay = (standby * standbyHours) / 1000;
    const dailyKwh = activeKwhDay + standbyKwhDay;
    const weeklyKwh = (activeKwhDay * days) + (standbyKwhDay * 7);
    const monthlyKwh = weeklyKwh * 4.345;
    const monthlyCost = monthlyKwh * rate;
    const annualCost = monthlyCost * 12;
    const annualKwh = monthlyKwh * 12;
    return {
      primary: { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
      details: [
        { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost * 100) / 100) },
        { label: "Monthly Energy Use", value: formatNumber(Math.round(monthlyKwh * 100) / 100) + " kWh" },
        { label: "Annual Energy Use", value: formatNumber(Math.round(annualKwh * 100) / 100) + " kWh" },
        { label: "Daily Active Cost", value: "$" + formatNumber(Math.round(activeKwhDay * rate * 100) / 100) },
        { label: "Monthly Standby Cost", value: "$" + formatNumber(Math.round(standbyKwhDay * 30.44 * rate * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["smart-thermostat-savings-calculator","pc-power-supply-calculator","rgb-led-strip-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Monthly kWh = ((Watts x Hours/Day x Days/Week) + (Standby x Remaining Hours x 7)) x 4.345 / 1000; Monthly Cost = Monthly kWh x Rate; Annual Cost = Monthly Cost x 12",
};
