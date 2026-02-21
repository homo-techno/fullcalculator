import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const electricityUsageCalculator: CalculatorDefinition = {
  slug: "electricity-usage-calculator",
  title: "Electricity Usage Calculator",
  description: "Free electricity usage calculator. Calculate the energy consumption and cost of running appliances based on wattage and usage time.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["electricity usage calculator", "appliance cost calculator", "watt calculator", "energy cost", "kwh calculator"],
  variants: [
    {
      id: "appliance",
      name: "Appliance Cost",
      fields: [
        { name: "watts", label: "Wattage (W)", type: "number", placeholder: "e.g. 1500" },
        { name: "hours", label: "Hours Used per Day", type: "number", placeholder: "e.g. 8" },
        { name: "rate", label: "Electricity Rate ($/kWh)", type: "number", prefix: "$", placeholder: "e.g. 0.12", defaultValue: 0.12 },
      ],
      calculate: (inputs) => {
        const watts = inputs.watts as number, hours = inputs.hours as number;
        const rate = (inputs.rate as number) || 0.12;
        if (!watts || !hours) return null;
        const kwhDay = (watts * hours) / 1000;
        const kwhMonth = kwhDay * 30;
        const kwhYear = kwhDay * 365;
        const costDay = kwhDay * rate;
        const costMonth = kwhMonth * rate;
        const costYear = kwhYear * rate;
        return {
          primary: { label: "Monthly Cost", value: `$${formatNumber(costMonth, 2)}` },
          details: [
            { label: "Daily kWh", value: formatNumber(kwhDay, 3) },
            { label: "Monthly kWh", value: formatNumber(kwhMonth, 1) },
            { label: "Yearly kWh", value: formatNumber(kwhYear, 1) },
            { label: "Daily cost", value: `$${formatNumber(costDay, 2)}` },
            { label: "Yearly cost", value: `$${formatNumber(costYear, 2)}` },
          ],
        };
      },
    },
    {
      id: "total",
      name: "Total Bill Estimate",
      fields: [
        { name: "kwh", label: "Monthly kWh Usage", type: "number", placeholder: "e.g. 900" },
        { name: "rate", label: "Rate ($/kWh)", type: "number", prefix: "$", placeholder: "e.g. 0.12", defaultValue: 0.12 },
        { name: "fixed", label: "Fixed Monthly Charges", type: "number", prefix: "$", placeholder: "e.g. 10", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const kwh = inputs.kwh as number, rate = (inputs.rate as number) || 0.12;
        const fixed = (inputs.fixed as number) || 0;
        if (!kwh) return null;
        const energyCost = kwh * rate;
        const total = energyCost + fixed;
        return {
          primary: { label: "Monthly Bill", value: `$${formatNumber(total, 2)}` },
          details: [
            { label: "Energy charges", value: `$${formatNumber(energyCost, 2)}` },
            { label: "Fixed charges", value: `$${formatNumber(fixed, 2)}` },
            { label: "Annual cost", value: `$${formatNumber(total * 12, 2)}` },
            { label: "Daily average", value: `$${formatNumber(total / 30, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["electricity-cost-calculator", "btu-calculator", "carbon-footprint-calculator"],
  faq: [{ question: "How do I calculate electricity cost?", answer: "Cost = (Watts × Hours) / 1000 × Rate. Example: A 1,500W heater running 8 hours/day at $0.12/kWh costs: (1500 × 8) / 1000 × 0.12 = $1.44/day or ~$43/month." }],
  formula: "Cost = (Watts × Hours / 1000) × Rate",
};
