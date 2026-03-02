import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const deadheadMilesCalculator: CalculatorDefinition = {
  slug: "deadhead-miles-calculator",
  title: "Deadhead Miles Calculator",
  description: "Calculate the cost of empty return miles.",
  category: "Finance",
  categorySlug: "$",
  icon: "DollarSign",
  keywords: ["deadhead","empty","miles","trucking","cost"],
  variants: [{
    id: "standard",
    name: "Deadhead Miles",
    description: "Calculate the cost of empty return miles.",
    fields: [
      { name: "totalMiles", label: "Total Trip Miles", type: "number", min: 1, max: 10000, defaultValue: 800 },
      { name: "loadedMiles", label: "Loaded Miles", type: "number", min: 0, max: 10000, defaultValue: 600 },
      { name: "costPerMile", label: "Operating Cost Per Mile ($)", type: "number", min: 0.5, max: 10, defaultValue: 1.85 },
      { name: "revenuePerLoadedMile", label: "Revenue Per Loaded Mile ($)", type: "number", min: 0.5, max: 20, defaultValue: 3.00 },
    ],
    calculate: (inputs) => {
    const totalMiles = inputs.totalMiles as number;
    const loadedMiles = inputs.loadedMiles as number;
    const costPerMile = inputs.costPerMile as number;
    const revenuePerLoadedMile = inputs.revenuePerLoadedMile as number;
    const deadheadMiles = totalMiles - loadedMiles;
    const deadheadPercent = (deadheadMiles / totalMiles) * 100;
    const deadheadCost = deadheadMiles * costPerMile;
    const revenue = loadedMiles * revenuePerLoadedMile;
    const totalOperatingCost = totalMiles * costPerMile;
    const netProfit = revenue - totalOperatingCost;
    return {
      primary: { label: "Deadhead Cost", value: "$" + formatNumber(deadheadCost) },
      details: [
        { label: "Deadhead Miles", value: formatNumber(deadheadMiles) },
        { label: "Deadhead Percentage", value: formatNumber(deadheadPercent) + "%" },
        { label: "Trip Revenue", value: "$" + formatNumber(revenue) },
        { label: "Net Profit", value: "$" + formatNumber(netProfit) }
      ]
    };
  },
  }],
  relatedSlugs: ["fleet-fuel-cost-calculator","fuel-surcharge-calculator","driver-pay-calculator"],
  faq: [
    { question: "What are deadhead miles?", answer: "Miles driven without any cargo, generating no revenue for the carrier." },
    { question: "What is a good deadhead percentage?", answer: "Most carriers aim to keep deadhead miles below 15 percent of total." },
  ],
  formula: "Deadhead Cost = (Total Miles - Loaded Miles) x Cost Per Mile",
};
