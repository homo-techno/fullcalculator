import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const applianceEnergyCalculator: CalculatorDefinition = {
  slug: "appliance-energy-calculator",
  title: "Appliance Energy Rating Calculator",
  description:
    "Free appliance energy rating calculator. Estimate annual energy consumption and cost for household appliances by wattage and usage hours.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "appliance energy",
    "energy rating",
    "appliance wattage",
    "energy star",
    "appliance electricity cost",
    "energy consumption",
  ],
  variants: [
    {
      id: "single",
      name: "Single Appliance Energy Cost",
      fields: [
        {
          name: "appliance",
          label: "Appliance Type",
          type: "select",
          options: [
            { label: "Refrigerator (150W avg)", value: "150" },
            { label: "Washing Machine (500W)", value: "500" },
            { label: "Dryer (3000W)", value: "3000" },
            { label: "Dishwasher (1800W)", value: "1800" },
            { label: "Air Conditioner (1500W)", value: "1500" },
            { label: "Space Heater (1500W)", value: "1500" },
            { label: "Microwave (1000W)", value: "1000" },
            { label: "TV (100W)", value: "100" },
            { label: "Computer (200W)", value: "200" },
            { label: "Custom Wattage", value: "custom" },
          ],
        },
        {
          name: "customWatts",
          label: "Custom Wattage (if applicable)",
          type: "number",
          placeholder: "e.g. 500",
        },
        {
          name: "hoursPerDay",
          label: "Hours Used per Day",
          type: "number",
          placeholder: "e.g. 4",
        },
        {
          name: "electricRate",
          label: "Electricity Rate ($/kWh)",
          type: "number",
          placeholder: "e.g. 0.13",
          defaultValue: 0.13,
        },
      ],
      calculate: (inputs) => {
        const applianceVal = (inputs.appliance as string) || "150";
        const customWatts = inputs.customWatts as number;
        const hoursPerDay = inputs.hoursPerDay as number;
        const rate = (inputs.electricRate as number) || 0.13;
        if (!hoursPerDay) return null;

        const watts = applianceVal === "custom" ? (customWatts || 0) : parseFloat(applianceVal);
        if (!watts) return null;

        const dailyKwh = (watts * hoursPerDay) / 1000;
        const monthlyKwh = dailyKwh * 30;
        const annualKwh = dailyKwh * 365;
        const dailyCost = dailyKwh * rate;
        const monthlyCost = monthlyKwh * rate;
        const annualCost = annualKwh * rate;
        const co2Lbs = annualKwh * 0.92;

        // Energy Star comparison (typically 10-50% more efficient)
        const energyStarSavings = annualCost * 0.25;

        return {
          primary: {
            label: "Annual Energy Cost",
            value: "$" + formatNumber(annualCost, 2),
          },
          details: [
            { label: "Daily Consumption", value: formatNumber(dailyKwh, 3) + " kWh" },
            { label: "Monthly Consumption", value: formatNumber(monthlyKwh, 1) + " kWh" },
            { label: "Annual Consumption", value: formatNumber(annualKwh, 0) + " kWh" },
            { label: "Daily Cost", value: "$" + formatNumber(dailyCost, 3) },
            { label: "Monthly Cost", value: "$" + formatNumber(monthlyCost, 2) },
            { label: "Annual CO2 Emissions", value: formatNumber(co2Lbs, 0) + " lbs" },
            { label: "Energy Star Potential Savings", value: "$" + formatNumber(energyStarSavings, 2) + "/yr" },
          ],
          note: "Energy Star certified appliances use 10-50% less energy than standard models. Unplugging appliances when not in use also reduces phantom power draw.",
        };
      },
    },
  ],
  relatedSlugs: ["electricity-cost-calculator", "led-savings-calculator"],
  faq: [
    {
      question: "What is an EnergyGuide label?",
      answer:
        "The EnergyGuide label is required on most appliances in the US. It shows the estimated annual energy consumption in kWh and operating cost, allowing you to compare efficiency between models.",
    },
    {
      question: "Which appliances use the most energy?",
      answer:
        "The largest energy consumers in most homes are HVAC systems (46%), water heaters (14%), washers/dryers (13%), lighting (9%), and refrigerators (7%). Switching to efficient models in these categories yields the biggest savings.",
    },
  ],
  formula:
    "Annual Cost = (Watts x Hours/Day x 365 / 1000) x $/kWh. Annual CO2 = Annual kWh x 0.92 lbs CO2/kWh.",
};
