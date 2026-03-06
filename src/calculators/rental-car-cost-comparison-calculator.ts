import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rentalCarCostComparisonCalculator: CalculatorDefinition = {
  slug: "rental-car-cost-comparison-calculator",
  title: "Rental Car Cost Comparison Calculator",
  description: "Compare total rental car costs including insurance, fuel, tolls, and fees to find the cheapest option.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["rental car cost","car rental comparison","rental car total cost","rental car calculator"],
  variants: [{
    id: "standard",
    name: "Rental Car Cost Comparison",
    description: "Compare total rental car costs including insurance, fuel, tolls, and fees to find the cheapest option.",
    fields: [
      { name: "dailyRate", label: "Daily Rental Rate ($)", type: "number", min: 10, max: 500, defaultValue: 50 },
      { name: "rentalDays", label: "Rental Days", type: "number", min: 1, max: 60, defaultValue: 5 },
      { name: "insurancePerDay", label: "Insurance Per Day ($)", type: "number", min: 0, max: 60, defaultValue: 20 },
      { name: "estimatedMiles", label: "Estimated Miles Driven", type: "number", min: 10, max: 5000, defaultValue: 300 },
      { name: "carMpg", label: "Car MPG", type: "number", min: 10, max: 60, defaultValue: 30 },
      { name: "gasPrice", label: "Gas Price ($/gallon)", type: "number", min: 2, max: 10, defaultValue: 3.5 },
    ],
    calculate: (inputs) => {
    const dailyRate = inputs.dailyRate as number;
    const rentalDays = inputs.rentalDays as number;
    const insurancePerDay = inputs.insurancePerDay as number;
    const estimatedMiles = inputs.estimatedMiles as number;
    const carMpg = inputs.carMpg as number;
    const gasPrice = inputs.gasPrice as number;
    const rentalCost = dailyRate * rentalDays;
    const insuranceCost = insurancePerDay * rentalDays;
    const fuelCost = (estimatedMiles / carMpg) * gasPrice;
    const taxes = rentalCost * 0.15;
    const totalCost = rentalCost + insuranceCost + fuelCost + taxes;
    const costPerDay = totalCost / rentalDays;
    const costPerMile = totalCost / estimatedMiles;
    return {
      primary: { label: "Total Rental Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
      details: [
        { label: "Rental Fee", value: "$" + formatNumber(Math.round(rentalCost)) },
        { label: "Insurance", value: "$" + formatNumber(Math.round(insuranceCost)) },
        { label: "Fuel Estimate", value: "$" + formatNumber(Math.round(fuelCost * 100) / 100) },
        { label: "Taxes & Fees (~15%)", value: "$" + formatNumber(Math.round(taxes * 100) / 100) },
        { label: "True Cost Per Day", value: "$" + formatNumber(Math.round(costPerDay * 100) / 100) },
        { label: "Cost Per Mile", value: "$" + formatNumber(Math.round(costPerMile * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["road-trip-cost-calculator","travel-budget-calculator","commute-cost-calculator"],
  faq: [
    { question: "Do I need rental car insurance?", answer: "Check if your personal auto insurance or credit card covers rentals. If not, the collision damage waiver at $15 to $30 per day is worth considering for peace of mind." },
    { question: "How can I save money on rental cars?", answer: "Book in advance, compare rates across agencies, decline insurance if already covered, return with a full tank, and avoid airport location surcharges." },
    { question: "What hidden fees should I watch for?", answer: "Airport surcharges, additional driver fees, underage driver fees, GPS rental charges, toll transponder fees, and prepaid fuel options can significantly increase costs." },
  ],
  formula: "Total Cost = (Daily Rate x Days) + (Insurance x Days) + Fuel + Taxes; Fuel = (Miles / MPG) x Gas Price",
};
