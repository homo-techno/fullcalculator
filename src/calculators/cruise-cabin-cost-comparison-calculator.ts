import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cruiseCabinCostComparisonCalculator: CalculatorDefinition = {
  slug: "cruise-cabin-cost-comparison-calculator",
  title: "Cruise Cabin Cost Comparison Calculator",
  description: "Compare the total cost of different cruise cabin types including per-night rates, gratuities, and onboard expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cruise cabin cost","cruise comparison","cruise budget","cruise fare calculator"],
  variants: [{
    id: "standard",
    name: "Cruise Cabin Cost Comparison",
    description: "Compare the total cost of different cruise cabin types including per-night rates, gratuities, and onboard expenses.",
    fields: [
      { name: "cabinType", label: "Cabin Type", type: "select", options: [{ value: "1", label: "Interior" }, { value: "2", label: "Ocean View" }, { value: "3", label: "Balcony" }, { value: "4", label: "Suite" }], defaultValue: "2" },
      { name: "nightlyRate", label: "Nightly Rate Per Person ($)", type: "number", min: 30, max: 2000, defaultValue: 150 },
      { name: "cruiseNights", label: "Cruise Length (nights)", type: "number", min: 2, max: 30, defaultValue: 7 },
      { name: "passengers", label: "Number of Passengers", type: "number", min: 1, max: 6, defaultValue: 2 },
      { name: "dailyOnboard", label: "Est. Daily Onboard Spending ($)", type: "number", min: 0, max: 500, defaultValue: 75 },
    ],
    calculate: (inputs) => {
    const cabinType = inputs.cabinType as string;
    const nightlyRate = inputs.nightlyRate as number;
    const cruiseNights = inputs.cruiseNights as number;
    const passengers = inputs.passengers as number;
    const dailyOnboard = inputs.dailyOnboard as number;
    const cabinNames: Record<string, string> = { "1": "Interior", "2": "Ocean View", "3": "Balcony", "4": "Suite" };
    const gratPerDay = 16;
    const fareCost = nightlyRate * cruiseNights * passengers;
    const totalGrat = gratPerDay * cruiseNights * passengers;
    const totalOnboard = dailyOnboard * cruiseNights * passengers;
    const portFees = 125 * passengers;
    const grandTotal = fareCost + totalGrat + totalOnboard + portFees;
    const perNightTotal = grandTotal / cruiseNights;
    return {
      primary: { label: "Total Cruise Cost", value: "$" + formatNumber(Math.round(grandTotal)) },
      details: [
        { label: "Cabin Type", value: cabinNames[cabinType] || "Standard" },
        { label: "Fare Total", value: "$" + formatNumber(Math.round(fareCost)) },
        { label: "Gratuities", value: "$" + formatNumber(Math.round(totalGrat)) },
        { label: "Onboard Spending", value: "$" + formatNumber(Math.round(totalOnboard)) },
        { label: "Port Fees & Taxes", value: "$" + formatNumber(portFees) },
        { label: "Cost Per Night (all-in)", value: "$" + formatNumber(Math.round(perNightTotal)) }
      ]
    };
  },
  }],
  relatedSlugs: ["travel-budget-calculator","hotel-vs-airbnb-calculator","travel-insurance-value-calculator"],
  faq: [
    { question: "How much does a cruise really cost per person?", answer: "Beyond the advertised fare, expect to add $100 to $200 per person per day for gratuities, drinks, excursions, and onboard spending." },
    { question: "Are cruise gratuities mandatory?", answer: "Most cruise lines automatically charge $14 to $20 per person per day in gratuities. You can sometimes adjust this amount at guest services." },
    { question: "Which cruise cabin type offers the best value?", answer: "Interior cabins offer the lowest price point. Balcony cabins are often considered the best value since the added cost per night is modest for a significantly better experience." },
  ],
  formula: "Grand Total = (Nightly Rate x Nights x Passengers) + Gratuities + Onboard Spending + Port Fees",
};
