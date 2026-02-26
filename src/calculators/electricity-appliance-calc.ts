import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const electricityApplianceCalculator: CalculatorDefinition = {
  slug: "electricity-appliance-calculator",
  title: "Appliance Electricity Cost Calculator",
  description:
    "Free appliance electricity cost calculator. Calculate how much it costs to run any individual appliance based on wattage, usage hours, and your electricity rate.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "appliance electricity cost",
    "appliance energy calculator",
    "electricity cost calculator",
    "power consumption calculator",
    "energy cost per appliance",
  ],
  variants: [
    {
      id: "single-appliance",
      name: "Single Appliance",
      description: "Calculate the cost to run one appliance",
      fields: [
        {
          name: "wattage",
          label: "Appliance Wattage",
          type: "number",
          placeholder: "e.g. 1500",
          suffix: "watts",
          min: 1,
          max: 15000,
          step: 1,
        },
        {
          name: "hoursPerDay",
          label: "Hours Used per Day",
          type: "number",
          placeholder: "e.g. 4",
          suffix: "hours",
          min: 0.1,
          max: 24,
          step: 0.5,
        },
        {
          name: "electricityRate",
          label: "Electricity Rate",
          type: "number",
          placeholder: "e.g. 0.15",
          prefix: "$",
          suffix: "/kWh",
          min: 0.01,
          max: 1,
          step: 0.01,
          defaultValue: 0.15,
        },
      ],
      calculate: (inputs) => {
        const wattage = parseFloat(inputs.wattage as string);
        const hours = parseFloat(inputs.hoursPerDay as string);
        const rate = parseFloat(inputs.electricityRate as string);
        if (!wattage || !hours || !rate) return null;

        const kWh = wattage / 1000;
        const dailyKwh = kWh * hours;
        const dailyCost = dailyKwh * rate;
        const monthlyCost = dailyCost * 30;
        const yearlyCost = dailyCost * 365;

        return {
          primary: { label: "Monthly Cost", value: `$${formatNumber(monthlyCost)}` },
          details: [
            { label: "Daily Cost", value: `$${formatNumber(dailyCost)}` },
            { label: "Yearly Cost", value: `$${formatNumber(yearlyCost)}` },
            { label: "Daily kWh", value: `${formatNumber(dailyKwh, 2)} kWh` },
            { label: "Monthly kWh", value: `${formatNumber(dailyKwh * 30, 1)} kWh` },
            { label: "Wattage", value: `${formatNumber(wattage, 0)} W (${formatNumber(kWh, 2)} kW)` },
          ],
        };
      },
    },
    {
      id: "common-appliance",
      name: "Common Appliances",
      description: "Select a common appliance to see its cost",
      fields: [
        {
          name: "appliance",
          label: "Appliance",
          type: "select",
          options: [
            { label: "Space Heater (1500W)", value: "1500" },
            { label: "Window AC Unit (1200W)", value: "1200" },
            { label: "Refrigerator (150W avg)", value: "150" },
            { label: "Washing Machine (500W)", value: "500" },
            { label: "Clothes Dryer (3000W)", value: "3000" },
            { label: "Dishwasher (1800W)", value: "1800" },
            { label: "Microwave (1100W)", value: "1100" },
            { label: "Desktop Computer (200W)", value: "200" },
            { label: "Laptop (50W)", value: "50" },
            { label: "LED TV 55\" (80W)", value: "80" },
            { label: "Gaming Console (150W)", value: "150" },
            { label: "Hair Dryer (1800W)", value: "1800" },
            { label: "LED Light Bulb (10W)", value: "10" },
            { label: "Ceiling Fan (75W)", value: "75" },
            { label: "Coffee Maker (900W)", value: "900" },
          ],
          defaultValue: "1500",
        },
        {
          name: "hoursPerDay",
          label: "Hours Used per Day",
          type: "number",
          placeholder: "e.g. 4",
          suffix: "hours",
          min: 0.1,
          max: 24,
          step: 0.5,
          defaultValue: 4,
        },
        {
          name: "electricityRate",
          label: "Electricity Rate",
          type: "number",
          placeholder: "e.g. 0.15",
          prefix: "$",
          suffix: "/kWh",
          min: 0.01,
          max: 1,
          step: 0.01,
          defaultValue: 0.15,
        },
      ],
      calculate: (inputs) => {
        const wattage = parseFloat(inputs.appliance as string);
        const hours = parseFloat(inputs.hoursPerDay as string);
        const rate = parseFloat(inputs.electricityRate as string);
        if (!wattage || !hours || !rate) return null;

        const kWh = wattage / 1000;
        const dailyKwh = kWh * hours;
        const dailyCost = dailyKwh * rate;
        const monthlyCost = dailyCost * 30;
        const yearlyCost = dailyCost * 365;

        return {
          primary: { label: "Monthly Cost", value: `$${formatNumber(monthlyCost)}` },
          details: [
            { label: "Daily Cost", value: `$${formatNumber(dailyCost)}` },
            { label: "Yearly Cost", value: `$${formatNumber(yearlyCost)}` },
            { label: "Daily kWh", value: `${formatNumber(dailyKwh, 2)} kWh` },
            { label: "Yearly kWh", value: `${formatNumber(dailyKwh * 365, 1)} kWh` },
            { label: "Appliance Wattage", value: `${formatNumber(wattage, 0)} watts` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["electricity-calculator", "laundry-cost-calculator"],
  faq: [
    {
      question: "How do I find the wattage of my appliance?",
      answer:
        "Check the label on the back or bottom of the appliance for a wattage (W) rating. You can also check the owner's manual or look up the model online. If only amps are listed, multiply amps by voltage (usually 120V in the US) to get watts.",
    },
    {
      question: "What appliances use the most electricity?",
      answer:
        "The biggest energy consumers are HVAC systems, water heaters, clothes dryers, and electric ovens. Among common appliances, space heaters (1500W), dryers (3000W), and window AC units (1200W) are the costliest to run.",
    },
  ],
  formula:
    "Daily Cost = (Wattage / 1000) x Hours per Day x Rate per kWh | Monthly Cost = Daily Cost x 30",
};
