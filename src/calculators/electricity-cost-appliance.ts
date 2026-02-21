import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const electricityCostApplianceCalculator: CalculatorDefinition = {
  slug: "electricity-cost-appliance-calculator",
  title: "Appliance Electricity Cost Calculator",
  description:
    "Free appliance electricity cost calculator. Find out how much it costs to run any appliance. Calculate daily, monthly, and yearly electricity costs.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "appliance electricity cost",
    "electricity cost calculator",
    "running cost calculator",
    "appliance cost",
    "cost to run appliance",
    "energy cost calculator",
  ],
  variants: [
    {
      id: "by-wattage",
      name: "Cost by Wattage",
      description: "Calculate running cost from device wattage",
      fields: [
        {
          name: "wattage",
          label: "Appliance Wattage (W)",
          type: "number",
          placeholder: "e.g. 1500",
        },
        {
          name: "hoursPerDay",
          label: "Hours Used Per Day",
          type: "number",
          placeholder: "e.g. 4",
        },
        {
          name: "daysPerWeek",
          label: "Days Used Per Week",
          type: "number",
          placeholder: "e.g. 7",
          defaultValue: 7,
        },
        {
          name: "costPerKwh",
          label: "Electricity Rate ($/kWh)",
          type: "number",
          placeholder: "e.g. 0.15",
          defaultValue: 0.15,
        },
      ],
      calculate: (inputs) => {
        const watts = inputs.wattage as number;
        const hours = inputs.hoursPerDay as number;
        const days = (inputs.daysPerWeek as number) || 7;
        const rate = (inputs.costPerKwh as number) || 0.15;
        if (!watts || !hours) return null;

        const dailyKwh = (watts * hours) / 1000;
        const weeklyKwh = dailyKwh * days;
        const monthlyKwh = weeklyKwh * 4.345; // avg weeks per month
        const yearlyKwh = weeklyKwh * 52;

        const dailyCost = dailyKwh * rate;
        const weeklyCost = weeklyKwh * rate;
        const monthlyCost = monthlyKwh * rate;
        const yearlyCost = yearlyKwh * rate;

        return {
          primary: {
            label: "Monthly Cost",
            value: `$${formatNumber(monthlyCost, 2)}`,
          },
          details: [
            { label: "Daily Cost", value: `$${formatNumber(dailyCost, 2)} (${formatNumber(dailyKwh, 3)} kWh)` },
            { label: "Weekly Cost", value: `$${formatNumber(weeklyCost, 2)} (${formatNumber(weeklyKwh, 2)} kWh)` },
            { label: "Monthly Cost", value: `$${formatNumber(monthlyCost, 2)} (${formatNumber(monthlyKwh, 2)} kWh)` },
            { label: "Yearly Cost", value: `$${formatNumber(yearlyCost, 2)} (${formatNumber(yearlyKwh, 2)} kWh)` },
            { label: "Current Draw", value: `${formatNumber(watts / 120, 2)} A @ 120V` },
          ],
        };
      },
    },
    {
      id: "common-appliances",
      name: "Common Appliance Lookup",
      description: "Estimate cost for common household appliances",
      fields: [
        {
          name: "appliance",
          label: "Appliance",
          type: "select",
          options: [
            { label: "Space Heater (1500W)", value: "1500" },
            { label: "Window A/C (1200W)", value: "1200" },
            { label: "Central A/C (3500W)", value: "3500" },
            { label: "Refrigerator (150W avg)", value: "150" },
            { label: "Electric Oven (2500W)", value: "2500" },
            { label: "Microwave (1200W)", value: "1200" },
            { label: "Dishwasher (1800W)", value: "1800" },
            { label: "Clothes Dryer (5000W)", value: "5000" },
            { label: "Washing Machine (500W)", value: "500" },
            { label: "Water Heater (4500W)", value: "4500" },
            { label: "LED TV 55\" (100W)", value: "100" },
            { label: "Desktop Computer (300W)", value: "300" },
            { label: "Laptop (65W)", value: "65" },
            { label: "Gaming Console (200W)", value: "200" },
            { label: "Hair Dryer (1800W)", value: "1800" },
            { label: "Vacuum Cleaner (1400W)", value: "1400" },
            { label: "EV Charger Level 2 (7200W)", value: "7200" },
            { label: "Pool Pump (1500W)", value: "1500" },
          ],
          defaultValue: "1500",
        },
        {
          name: "hoursPerDay",
          label: "Hours Used Per Day",
          type: "number",
          placeholder: "e.g. 4",
        },
        {
          name: "costPerKwh",
          label: "Electricity Rate ($/kWh)",
          type: "number",
          placeholder: "e.g. 0.15",
          defaultValue: 0.15,
        },
      ],
      calculate: (inputs) => {
        const watts = Number(inputs.appliance);
        const hours = inputs.hoursPerDay as number;
        const rate = (inputs.costPerKwh as number) || 0.15;
        if (!watts || !hours) return null;

        const dailyKwh = (watts * hours) / 1000;
        const monthlyKwh = dailyKwh * 30;
        const yearlyKwh = dailyKwh * 365;

        return {
          primary: {
            label: "Monthly Cost",
            value: `$${formatNumber(monthlyKwh * rate, 2)}`,
          },
          details: [
            { label: "Wattage", value: `${watts} W` },
            { label: "Daily Cost", value: `$${formatNumber(dailyKwh * rate, 2)}` },
            { label: "Monthly Cost", value: `$${formatNumber(monthlyKwh * rate, 2)}` },
            { label: "Yearly Cost", value: `$${formatNumber(yearlyKwh * rate, 2)}` },
            { label: "Monthly Energy", value: `${formatNumber(monthlyKwh, 2)} kWh` },
            { label: "Yearly Energy", value: `${formatNumber(yearlyKwh, 2)} kWh` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["power-consumption-calculator", "electricity-cost-calculator", "watts-to-amps-calculator"],
  faq: [
    {
      question: "How do I calculate the electricity cost of an appliance?",
      answer:
        "Multiply the wattage by hours of use, divide by 1000 to get kWh, then multiply by your electricity rate. For example: 1500W heater × 8 hours = 12,000 Wh = 12 kWh × $0.15/kWh = $1.80 per day, or about $54/month.",
    },
    {
      question: "What is the average electricity rate in the US?",
      answer:
        "The US average residential rate is approximately $0.12-0.16/kWh, but varies widely by state. Hawaii is the highest (~$0.35/kWh), while states like Louisiana and Idaho are among the lowest (~$0.09-0.10/kWh). Check your utility bill for your exact rate.",
    },
    {
      question: "How much does it cost to run a space heater?",
      answer:
        "A typical 1500W space heater running 8 hours per day costs about $1.20-1.80/day ($36-54/month) depending on your electricity rate. Electric heating is expensive compared to gas. Consider using it to supplement, not replace, central heating.",
    },
  ],
  formula:
    "Cost = (Watts × Hours / 1000) × Rate per kWh | Monthly = Daily × 30 | Yearly = Daily × 365",
};
