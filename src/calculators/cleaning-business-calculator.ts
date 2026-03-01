import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cleaningBusinessCalculator: CalculatorDefinition = {
  slug: "cleaning-business-calculator",
  title: "Cleaning Business Calculator",
  description: "Estimate startup costs and revenue for a residential or commercial cleaning service.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cleaning business startup", "cleaning service pricing", "janitorial business cost"],
  variants: [{
    id: "standard",
    name: "Cleaning Business",
    description: "Estimate startup costs and revenue for a residential or commercial cleaning service",
    fields: [
      { name: "type", label: "Service Type", type: "select", options: [{value:"residential",label:"Residential"},{value:"commercial",label:"Commercial"},{value:"both",label:"Both"}], defaultValue: "residential" },
      { name: "jobsPerWeek", label: "Jobs per Week", type: "number", suffix: "jobs", min: 3, max: 40, defaultValue: 12 },
      { name: "avgPrice", label: "Average Price per Job", type: "number", suffix: "$", min: 50, max: 500, defaultValue: 130 },
      { name: "employees", label: "Number of Cleaners", type: "number", suffix: "people", min: 1, max: 20, defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const type = inputs.type as string;
      const jobs = inputs.jobsPerWeek as number;
      const price = inputs.avgPrice as number;
      const employees = inputs.employees as number;
      if (!jobs || !price || !employees) return null;
      const annualRevenue = jobs * price * 52;
      const laborCost = employees > 1 ? (employees - 1) * 15 * 25 * 52 : 0;
      const supplies = annualRevenue * 0.05;
      const insurance = 2000 + employees * 500;
      const marketing = 2400;
      const vehicle = 3600;
      const annualExpenses = laborCost + supplies + insurance + marketing + vehicle;
      const annualProfit = annualRevenue - annualExpenses;
      const startupCost = 2000 + employees * 500;
      return {
        primary: { label: "Annual Profit", value: "$" + formatNumber(annualProfit) },
        details: [
          { label: "Annual Revenue", value: "$" + formatNumber(annualRevenue) },
          { label: "Labor Costs", value: "$" + formatNumber(laborCost) },
          { label: "Supplies (5%)", value: "$" + formatNumber(supplies) },
          { label: "Insurance", value: "$" + formatNumber(insurance) },
          { label: "Marketing", value: "$" + formatNumber(marketing) },
          { label: "Vehicle Costs", value: "$" + formatNumber(vehicle) },
          { label: "Estimated Startup Cost", value: "$" + formatNumber(startupCost) },
        ],
      };
    },
  }],
  relatedSlugs: ["pressure-washing-business-calculator", "lawn-care-business-calculator"],
  faq: [
    { question: "How much does it cost to start a cleaning business?", answer: "A basic cleaning business can start for $2,000 to $6,000 covering supplies, insurance, and marketing. Commercial cleaning requires more investment in equipment." },
    { question: "How much do cleaning businesses charge?", answer: "Residential cleaners charge $100 to $250 per home. Commercial cleaning rates vary from $0.05 to $0.20 per square foot depending on frequency and scope." },
  ],
  formula: "Annual Profit = (Jobs x Price x 52) - Labor - Supplies - Insurance - Marketing - Vehicle",
};
