import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const electricityCalculator: CalculatorDefinition = {
  slug: "electricity-cost-calculator",
  title: "Electricity Cost Calculator",
  description: "Free electricity cost calculator. Estimate how much an appliance costs to run per day, month, and year based on wattage and electricity rate.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["electricity cost calculator", "energy cost calculator", "power consumption calculator", "kwh calculator", "electricity bill calculator"],
  variants: [
    {
      id: "appliance",
      name: "Appliance Cost",
      description: "Calculate running cost for an appliance",
      fields: [
        { name: "watts", label: "Power Consumption", type: "number", placeholder: "e.g. 1500", suffix: "watts" },
        { name: "hours", label: "Hours Used per Day", type: "number", placeholder: "e.g. 8", suffix: "hrs/day", min: 0, max: 24 },
        { name: "rate", label: "Electricity Rate", type: "number", placeholder: "e.g. 0.12", prefix: "$", suffix: "/kWh", step: 0.01 },
      ],
      calculate: (inputs) => {
        const watts = inputs.watts as number;
        const hours = inputs.hours as number;
        const rate = inputs.rate as number;
        if (!watts || !hours || !rate) return null;
        const kwhPerDay = (watts * hours) / 1000;
        const dailyCost = kwhPerDay * rate;
        const monthlyCost = dailyCost * 30;
        const yearlyCost = dailyCost * 365;
        return {
          primary: { label: "Monthly Cost", value: `$${formatNumber(monthlyCost)}` },
          details: [
            { label: "Daily cost", value: `$${formatNumber(dailyCost)}` },
            { label: "Yearly cost", value: `$${formatNumber(yearlyCost)}` },
            { label: "Daily energy use", value: `${formatNumber(kwhPerDay, 2)} kWh` },
            { label: "Monthly energy use", value: `${formatNumber(kwhPerDay * 30, 1)} kWh` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["salary-calculator", "discount-calculator"],
  faq: [
    { question: "How do I calculate electricity cost?", answer: "Multiply wattage by hours used, divide by 1000 to get kWh, then multiply by your electricity rate. Example: 1500W x 8 hours / 1000 = 12 kWh x $0.12 = $1.44/day." },
    { question: "What is a kWh?", answer: "A kilowatt-hour (kWh) is a unit of energy equal to 1,000 watts used for one hour. It is the standard billing unit for electricity. A typical US household uses 900 kWh per month." },
  ],
  formula: "Cost = (Watts x Hours / 1000) x Rate per kWh",
};
