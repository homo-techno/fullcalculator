import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flightLayoverOptimizerCalculator: CalculatorDefinition = {
  slug: "flight-layover-optimizer-calculator",
  title: "Flight Layover Optimizer Calculator",
  description: "Evaluate whether a layover is worth it by comparing total travel time and savings against a direct flight.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["layover optimizer","flight connection","layover worth it","flight savings layover"],
  variants: [{
    id: "standard",
    name: "Flight Layover Optimizer",
    description: "Evaluate whether a layover is worth it by comparing total travel time and savings against a direct flight.",
    fields: [
      { name: "directPrice", label: "Direct Flight Price ($)", type: "number", min: 50, max: 20000, defaultValue: 600 },
      { name: "layoverPrice", label: "Layover Flight Price ($)", type: "number", min: 50, max: 20000, defaultValue: 350 },
      { name: "directHours", label: "Direct Flight Time (hours)", type: "number", min: 0.5, max: 24, defaultValue: 5 },
      { name: "layoverTotalHours", label: "Layover Total Travel Time (hours)", type: "number", min: 1, max: 48, defaultValue: 10 },
      { name: "hourlyValue", label: "Value of Your Time ($/hour)", type: "number", min: 10, max: 500, defaultValue: 40 },
    ],
    calculate: (inputs) => {
    const directPrice = inputs.directPrice as number;
    const layoverPrice = inputs.layoverPrice as number;
    const directHours = inputs.directHours as number;
    const layoverTotalHours = inputs.layoverTotalHours as number;
    const hourlyValue = inputs.hourlyValue as number;
    const priceSavings = directPrice - layoverPrice;
    const extraHours = layoverTotalHours - directHours;
    const timeCost = extraHours * hourlyValue;
    const netSavings = priceSavings - timeCost;
    const worthIt = netSavings > 0;
    const breakEvenHourlyValue = extraHours > 0 ? priceSavings / extraHours : 0;
    return {
      primary: { label: "Net Savings", value: "$" + formatNumber(Math.round(netSavings)) },
      details: [
        { label: "Price Savings", value: "$" + formatNumber(Math.round(priceSavings)) },
        { label: "Extra Travel Time", value: formatNumber(Math.round(extraHours * 10) / 10) + " hours" },
        { label: "Time Cost", value: "$" + formatNumber(Math.round(timeCost)) },
        { label: "Worth It?", value: worthIt ? "Yes - Take the Layover" : "No - Take the Direct Flight" },
        { label: "Break-Even Time Value", value: "$" + formatNumber(Math.round(breakEvenHourlyValue)) + "/hour" }
      ]
    };
  },
  }],
  relatedSlugs: ["flight-cost-per-mile-calculator","travel-budget-calculator","airline-miles-value-calculator"],
  faq: [
    { question: "When is a layover worth the savings?", answer: "A layover is worth it when the ticket savings exceed the value of your extra time spent traveling. Consider fatigue, missed connection risk, and stress in your calculation." },
    { question: "What is a good layover length?", answer: "Domestic layovers of 1 to 2 hours are ideal. International layovers should be at least 2 to 3 hours for customs and terminal changes." },
    { question: "What happens if I miss a connection?", answer: "If booked on one ticket, the airline will rebook you on the next available flight. If on separate tickets, you bear the cost and risk of rebooking." },
  ],
  formula: "Net Savings = (Direct Price - Layover Price) - (Extra Hours x Hourly Value)
Break-Even Value = Price Savings / Extra Hours",
};
