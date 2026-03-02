import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fuelSurchargeCalculator: CalculatorDefinition = {
  slug: "fuel-surcharge-calculator",
  title: "Fuel Surcharge Calculator",
  description: "Calculate the fuel surcharge percentage for freight.",
  category: "Finance",
  categorySlug: "$",
  icon: "DollarSign",
  keywords: ["fuel","surcharge","freight","shipping","diesel"],
  variants: [{
    id: "standard",
    name: "Fuel Surcharge",
    description: "Calculate the fuel surcharge percentage for freight.",
    fields: [
      { name: "currentFuelPrice", label: "Current Fuel Price ($/gal)", type: "number", min: 1, max: 15, defaultValue: 4.25 },
      { name: "baseFuelPrice", label: "Base Fuel Price ($/gal)", type: "number", min: 1, max: 10, defaultValue: 1.25 },
      { name: "mpg", label: "Vehicle MPG", type: "number", min: 1, max: 50, defaultValue: 6 },
      { name: "lineHaul", label: "Line Haul Charge ($)", type: "number", min: 100, max: 100000, defaultValue: 2500 },
    ],
    calculate: (inputs) => {
    const currentFuelPrice = inputs.currentFuelPrice as number;
    const baseFuelPrice = inputs.baseFuelPrice as number;
    const mpg = inputs.mpg as number;
    const lineHaul = inputs.lineHaul as number;
    const priceDiff = currentFuelPrice - baseFuelPrice;
    const surchargePercent = (priceDiff / mpg) / (baseFuelPrice / mpg) * 100;
    const surchargeAmount = lineHaul * (surchargePercent / 100);
    const totalCharge = lineHaul + surchargeAmount;
    return {
      primary: { label: "Fuel Surcharge", value: formatNumber(surchargePercent) + "%" },
      details: [
        { label: "Surcharge Amount", value: "$" + formatNumber(surchargeAmount) },
        { label: "Total with Surcharge", value: "$" + formatNumber(totalCharge) },
        { label: "Fuel Price Difference", value: "$" + formatNumber(priceDiff) },
        { label: "Line Haul Charge", value: "$" + formatNumber(lineHaul) }
      ]
    };
  },
  }],
  relatedSlugs: ["fleet-fuel-cost-calculator","ltl-freight-cost-calculator","deadhead-miles-calculator"],
  faq: [
    { question: "How is fuel surcharge calculated?", answer: "It is based on the difference between current and base fuel prices." },
    { question: "What is the base fuel price?", answer: "A threshold price set by the carrier below which no surcharge applies." },
  ],
  formula: "Surcharge % = ((Current - Base Fuel Price) / Base Price) x 100",
};
