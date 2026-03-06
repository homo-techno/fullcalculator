import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rgbLedStripCalculator: CalculatorDefinition = {
  slug: "rgb-led-strip-calculator",
  title: "RGB LED Strip Calculator",
  description: "Calculate the total power consumption, required power supply, and cost of running RGB LED strips based on strip length, LED density, and usage hours.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["led strip calculator","rgb led power","led strip wattage","led strip power supply","addressable led calculator"],
  variants: [{
    id: "standard",
    name: "RGB LED Strip",
    description: "Calculate the total power consumption, required power supply, and cost of running RGB LED strips based on strip length, LED density, and usage hours.",
    fields: [
      { name: "stripLength", label: "Total Strip Length (meters)", type: "number", min: 0.5, max: 50, defaultValue: 5 },
      { name: "ledDensity", label: "LEDs Per Meter", type: "select", options: [{ value: "30", label: "30 LEDs/m (Standard)" }, { value: "60", label: "60 LEDs/m (High Density)" }, { value: "144", label: "144 LEDs/m (Ultra Dense)" }], defaultValue: "60" },
      { name: "wattsPerLed", label: "Watts Per LED", type: "number", min: 0.05, max: 0.5, defaultValue: 0.2 },
      { name: "hoursPerDay", label: "Hours Used Per Day", type: "number", min: 1, max: 24, defaultValue: 6 },
      { name: "electricRate", label: "Electricity Rate ($/kWh)", type: "number", min: 0.05, max: 0.60, defaultValue: 0.13 },
    ],
    calculate: (inputs) => {
    const length = inputs.stripLength as number;
    const density = inputs.ledDensity as number;
    const wattsPerLed = inputs.wattsPerLed as number;
    const hours = inputs.hoursPerDay as number;
    const rate = inputs.electricRate as number;
    const totalLeds = Math.round(length * density);
    const totalWatts = totalLeds * wattsPerLed;
    const psuWatts = Math.ceil(totalWatts * 1.2 / 10) * 10;
    const psuAmps = Math.round(psuWatts / 12 * 10) / 10;
    const dailyKwh = totalWatts * hours / 1000;
    const monthlyKwh = dailyKwh * 30.44;
    const monthlyCost = monthlyKwh * rate;
    const annualCost = monthlyCost * 12;
    return {
      primary: { label: "Total Power Draw", value: formatNumber(Math.round(totalWatts * 10) / 10) + "W" },
      details: [
        { label: "Total LEDs", value: formatNumber(totalLeds) },
        { label: "Recommended PSU", value: formatNumber(psuWatts) + "W / " + formatNumber(psuAmps) + "A (12V)" },
        { label: "Monthly Energy Use", value: formatNumber(Math.round(monthlyKwh * 100) / 100) + " kWh" },
        { label: "Monthly Electricity Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
        { label: "Annual Electricity Cost", value: "$" + formatNumber(Math.round(annualCost * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["electric-bill-device-cost-calculator","pc-power-supply-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Total Watts = Length x LED Density x Watts Per LED; Recommended PSU = Total Watts x 1.2 (rounded up); Monthly Cost = (Total Watts x Hours/Day x 30.44 / 1000) x Rate",
};
