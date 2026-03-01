import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const storageUnitInvestmentCalculator: CalculatorDefinition = {
  slug: "storage-unit-investment-calculator",
  title: "Storage Unit Investment Calculator",
  description: "Estimate investment returns for a self-storage facility based on unit count, size mix, and occupancy.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["storage unit investment", "self storage ROI", "storage facility profit"],
  variants: [{
    id: "standard",
    name: "Storage Unit Investment",
    description: "Estimate investment returns for a self-storage facility based on unit count, size mix, and occupancy",
    fields: [
      { name: "units", label: "Number of Units", type: "number", suffix: "units", min: 10, max: 500, defaultValue: 50 },
      { name: "avgRent", label: "Average Monthly Rent per Unit", type: "number", suffix: "$", min: 30, max: 500, defaultValue: 120 },
      { name: "occupancy", label: "Occupancy Rate", type: "number", suffix: "%", min: 50, max: 100, defaultValue: 85 },
      { name: "totalInvestment", label: "Total Investment", type: "number", suffix: "$", min: 50000, max: 5000000, defaultValue: 500000 },
    ],
    calculate: (inputs) => {
      const units = inputs.units as number;
      const avgRent = inputs.avgRent as number;
      const occ = inputs.occupancy as number;
      const investment = inputs.totalInvestment as number;
      if (!units || !avgRent || !occ || !investment) return null;
      const occRate = occ / 100;
      const monthlyGross = units * avgRent * occRate;
      const annualGross = monthlyGross * 12;
      const opex = annualGross * 0.35;
      const noi = annualGross - opex;
      const capRate = investment > 0 ? (noi / investment) * 100 : 0;
      return {
        primary: { label: "Net Operating Income", value: "$" + formatNumber(noi) },
        details: [
          { label: "Monthly Gross Revenue", value: "$" + formatNumber(monthlyGross) },
          { label: "Annual Gross Revenue", value: "$" + formatNumber(annualGross) },
          { label: "Annual Operating Expenses (35%)", value: "$" + formatNumber(opex) },
          { label: "Cap Rate", value: formatNumber(capRate) + "%" },
          { label: "Occupied Units", value: formatNumber(Math.round(units * occRate)) },
        ],
      };
    },
  }],
  relatedSlugs: ["rental-yield-calculator", "cap-rate-comparison-calculator"],
  faq: [
    { question: "Is self-storage a good investment?", answer: "Self-storage facilities often produce cap rates of 6 to 10 percent and have lower operating costs than many other real estate investments. Occupancy rates typically range from 85 to 95 percent." },
    { question: "How much does it cost to build a storage facility?", answer: "Building a self-storage facility costs $25 to $70 per square foot. A 50-unit facility can cost $250,000 to $1 million or more depending on location and construction type." },
  ],
  formula: "NOI = (Units x Avg Rent x Occupancy x 12) - Operating Expenses; Cap Rate = NOI / Investment x 100",
};
