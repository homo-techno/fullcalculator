import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ltlFreightCostCalculator: CalculatorDefinition = {
  slug: "ltl-freight-cost-calculator",
  title: "LTL Freight Cost Calculator",
  description: "Estimate less-than-truckload shipping costs.",
  category: "Finance",
  categorySlug: "$",
  icon: "DollarSign",
  keywords: ["LTL","freight","cost","shipping","trucking"],
  variants: [{
    id: "standard",
    name: "LTL Freight Cost",
    description: "Estimate less-than-truckload shipping costs.",
    fields: [
      { name: "weight", label: "Weight (lbs)", type: "number", min: 1, max: 20000, defaultValue: 1000 },
      { name: "distance", label: "Distance (miles)", type: "number", min: 1, max: 5000, defaultValue: 500 },
      { name: "freightClass", label: "Freight Class", type: "number", min: 50, max: 500, defaultValue: 100 },
      { name: "ratePerCwt", label: "Rate per CWT ($)", type: "number", min: 1, max: 500, defaultValue: 25 },
      { name: "fuelSurchargePercent", label: "Fuel Surcharge (%)", type: "number", min: 0, max: 50, defaultValue: 15 },
    ],
    calculate: (inputs) => {
    const weight = inputs.weight as number;
    const distance = inputs.distance as number;
    const freightClass = inputs.freightClass as number;
    const ratePerCwt = inputs.ratePerCwt as number;
    const fuelSurchargePercent = inputs.fuelSurchargePercent as number;
    const cwt = weight / 100;
    const baseCharge = cwt * ratePerCwt;
    const fuelSurcharge = baseCharge * (fuelSurchargePercent / 100);
    const totalCost = baseCharge + fuelSurcharge;
    const costPerPound = totalCost / weight;
    return {
      primary: { label: "Total LTL Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Base Charge", value: "$" + formatNumber(baseCharge) },
        { label: "Fuel Surcharge", value: "$" + formatNumber(fuelSurcharge) },
        { label: "Cost Per Pound", value: "$" + formatNumber(costPerPound) },
        { label: "CWT (Hundredweight)", value: formatNumber(cwt) }
      ]
    };
  },
  }],
  relatedSlugs: ["freight-class-calculator","fuel-surcharge-calculator","deadhead-miles-calculator"],
  faq: [
    { question: "What is LTL freight?", answer: "Less-than-truckload shipping for loads that do not fill an entire trailer." },
    { question: "What is CWT?", answer: "CWT stands for hundredweight and equals 100 pounds." },
  ],
  formula: "Total = (Weight / 100) x Rate per CWT x (1 + Fuel Surcharge %)",
};
