import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mobileDetailingCalculator: CalculatorDefinition = {
  slug: "mobile-detailing-calculator",
  title: "Mobile Detailing Calculator",
  description: "Estimate revenue and costs for a mobile auto detailing business based on services and volume.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["mobile detailing profit", "auto detailing business", "car detailing revenue"],
  variants: [{
    id: "standard",
    name: "Mobile Detailing",
    description: "Estimate revenue and costs for a mobile auto detailing business based on services and volume",
    fields: [
      { name: "jobsPerWeek", label: "Jobs per Week", type: "number", suffix: "jobs", min: 1, max: 40, defaultValue: 15 },
      { name: "avgPrice", label: "Average Price per Job", type: "number", suffix: "$", min: 50, max: 500, defaultValue: 150 },
      { name: "supplyCostPct", label: "Supply Cost Percentage", type: "number", suffix: "%", min: 5, max: 30, defaultValue: 10 },
      { name: "startupCost", label: "Startup Equipment Cost", type: "number", suffix: "$", min: 1000, max: 30000, defaultValue: 5000 },
    ],
    calculate: (inputs) => {
      const jobs = inputs.jobsPerWeek as number;
      const price = inputs.avgPrice as number;
      const supplyPct = inputs.supplyCostPct as number;
      const startup = inputs.startupCost as number;
      if (!jobs || !price) return null;
      const weeklyRevenue = jobs * price;
      const monthlyRevenue = weeklyRevenue * 4.33;
      const annualRevenue = monthlyRevenue * 12;
      const supplyCost = annualRevenue * (supplyPct / 100);
      const fuel = jobs * 52 * 8;
      const insurance = 2400;
      const annualProfit = annualRevenue - supplyCost - fuel - insurance;
      const payback = annualProfit > 0 ? Math.ceil(startup / (annualProfit / 12)) : 0;
      return {
        primary: { label: "Annual Profit", value: "$" + formatNumber(annualProfit) },
        details: [
          { label: "Weekly Revenue", value: "$" + formatNumber(weeklyRevenue) },
          { label: "Annual Revenue", value: "$" + formatNumber(annualRevenue) },
          { label: "Supply Costs", value: "$" + formatNumber(supplyCost) },
          { label: "Fuel Costs", value: "$" + formatNumber(fuel) },
          { label: "Insurance", value: "$" + formatNumber(insurance) },
          { label: "Payback Period", value: payback + " months" },
        ],
      };
    },
  }],
  relatedSlugs: ["car-wash-startup-calculator", "pressure-washing-business-calculator"],
  faq: [
    { question: "How much can you make with mobile detailing?", answer: "A mobile detailing business owner can earn $50,000 to $100,000 per year working solo. Revenue depends on pricing, volume, and services offered." },
    { question: "How much does it cost to start a mobile detailing business?", answer: "Startup costs range from $3,000 to $15,000 for equipment, supplies, and marketing. A pressure washer, buffer, and basic supplies are the minimum requirements." },
  ],
  formula: "Annual Profit = (Jobs x Price x 52) - Supply Costs - Fuel - Insurance",
};
