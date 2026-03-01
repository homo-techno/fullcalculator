import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pressureWashingBusinessCalculator: CalculatorDefinition = {
  slug: "pressure-washing-business-calculator",
  title: "Pressure Washing Business Calculator",
  description: "Calculate revenue and profit potential for a pressure washing business.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["pressure washing business profit", "power washing revenue", "pressure washing startup"],
  variants: [{
    id: "standard",
    name: "Pressure Washing Business",
    description: "Calculate revenue and profit potential for a pressure washing business",
    fields: [
      { name: "jobsPerWeek", label: "Jobs per Week", type: "number", suffix: "jobs", min: 3, max: 30, defaultValue: 10 },
      { name: "avgPrice", label: "Average Price per Job", type: "number", suffix: "$", min: 100, max: 1000, defaultValue: 250 },
      { name: "weeksPerYear", label: "Working Weeks per Year", type: "number", suffix: "weeks", min: 20, max: 52, defaultValue: 40 },
      { name: "equipmentCost", label: "Equipment Cost", type: "number", suffix: "$", min: 2000, max: 30000, defaultValue: 6000 },
    ],
    calculate: (inputs) => {
      const jobs = inputs.jobsPerWeek as number;
      const price = inputs.avgPrice as number;
      const weeks = inputs.weeksPerYear as number;
      const equipment = inputs.equipmentCost as number;
      if (!jobs || !price || !weeks) return null;
      const annualRevenue = jobs * price * weeks;
      const fuel = jobs * weeks * 10;
      const chemicals = jobs * weeks * 8;
      const insurance = 2400;
      const marketing = 1800;
      const maintenance = equipment * 0.15;
      const annualExpenses = fuel + chemicals + insurance + marketing + maintenance;
      const annualProfit = annualRevenue - annualExpenses;
      const roi = equipment > 0 ? (annualProfit / equipment) * 100 : 0;
      return {
        primary: { label: "Annual Profit", value: "$" + formatNumber(annualProfit) },
        details: [
          { label: "Annual Revenue", value: "$" + formatNumber(annualRevenue) },
          { label: "Fuel Costs", value: "$" + formatNumber(fuel) },
          { label: "Chemical Costs", value: "$" + formatNumber(chemicals) },
          { label: "Insurance", value: "$" + formatNumber(insurance) },
          { label: "Marketing", value: "$" + formatNumber(marketing) },
          { label: "Equipment ROI", value: formatNumber(roi) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["mobile-detailing-calculator", "lawn-care-business-calculator"],
  faq: [
    { question: "How much can you make pressure washing?", answer: "A solo pressure washing operator can earn $40,000 to $80,000 per year. Operators with crews and commercial contracts can exceed $150,000 in annual revenue." },
    { question: "What equipment do you need for pressure washing?", answer: "You need a commercial pressure washer (3,000+ PSI), surface cleaner, hoses, nozzles, chemical injector, and a trailer or truck-mounted setup. Basic startup equipment costs $3,000 to $10,000." },
  ],
  formula: "Annual Profit = (Jobs x Price x Weeks) - Fuel - Chemicals - Insurance - Marketing - Maintenance",
};
