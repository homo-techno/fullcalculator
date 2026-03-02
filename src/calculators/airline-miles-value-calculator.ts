import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const airlineMilesValueCalculator: CalculatorDefinition = {
  slug: "airline-miles-value-calculator",
  title: "Airline Miles Value Calculator",
  description: "Calculate the monetary value of your airline miles and whether redeeming for a flight is worth it versus paying cash.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["airline miles value","frequent flyer points","miles redemption","miles worth calculator"],
  variants: [{
    id: "standard",
    name: "Airline Miles Value",
    description: "Calculate the monetary value of your airline miles and whether redeeming for a flight is worth it versus paying cash.",
    fields: [
      { name: "milesRequired", label: "Miles Required for Redemption", type: "number", min: 1000, max: 500000, defaultValue: 25000 },
      { name: "cashPrice", label: "Cash Price of Same Flight ($)", type: "number", min: 50, max: 20000, defaultValue: 350 },
      { name: "taxesOnAward", label: "Taxes/Fees on Award Ticket ($)", type: "number", min: 0, max: 1000, defaultValue: 25 },
      { name: "totalMilesBalance", label: "Your Total Miles Balance", type: "number", min: 0, max: 5000000, defaultValue: 50000 },
    ],
    calculate: (inputs) => {
    const milesRequired = inputs.milesRequired as number;
    const cashPrice = inputs.cashPrice as number;
    const taxesOnAward = inputs.taxesOnAward as number;
    const totalMilesBalance = inputs.totalMilesBalance as number;
    const netCashSavings = cashPrice - taxesOnAward;
    const centsPerMile = (netCashSavings / milesRequired) * 100;
    const remainingMiles = totalMilesBalance - milesRequired;
    const worthIt = centsPerMile >= 1.2;
    return {
      primary: { label: "Value Per Mile", value: formatNumber(Math.round(centsPerMile * 100) / 100) + " cents" },
      details: [
        { label: "Cash Savings", value: "$" + formatNumber(Math.round(netCashSavings)) },
        { label: "Redemption Worth It?", value: worthIt ? "Yes (above 1.2 cpp)" : "Below average value" },
        { label: "Remaining Miles", value: formatNumber(remainingMiles) },
        { label: "Miles Balance After", value: remainingMiles >= 0 ? formatNumber(remainingMiles) : "Not enough miles" }
      ]
    };
  },
  }],
  relatedSlugs: ["points-value-calculator","flight-cost-per-mile-calculator","travel-budget-calculator"],
  faq: [
    { question: "How much is an airline mile worth?", answer: "On average, airline miles are worth 1 to 2 cents each, though premium cabin international redemptions can yield 3 to 10 cents per mile." },
    { question: "When should I use miles instead of cash?", answer: "Use miles when the redemption value exceeds 1.2 cents per mile, especially for premium cabin tickets or expensive routes where cash prices are high." },
    { question: "Do airline miles expire?", answer: "Many programs no longer expire miles, but some still do after 18 to 24 months of account inactivity. Check your specific program rules." },
  ],
  formula: "Value Per Mile (cents) = ((Cash Price - Award Taxes) / Miles Required) x 100",
};
