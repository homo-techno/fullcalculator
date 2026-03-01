import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const travelInsuranceValueCalculator: CalculatorDefinition = {
  slug: "travel-insurance-value-calculator",
  title: "Travel Insurance Value Calculator",
  description: "Determine whether travel insurance is worth purchasing based on trip cost and potential risk factors.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["travel insurance value","travel insurance calculator","trip insurance worth it"],
  variants: [{
    id: "standard",
    name: "Travel Insurance Value",
    description: "Determine whether travel insurance is worth purchasing based on trip cost and potential risk factors.",
    fields: [
      { name: "tripCost", label: "Total Trip Cost", type: "number", prefix: "$", min: 100, max: 500000, defaultValue: 5000 },
      { name: "insuranceCost", label: "Insurance Premium", type: "number", prefix: "$", min: 10, max: 10000, defaultValue: 350 },
      { name: "cancellationRisk", label: "Cancellation Risk (%)", type: "number", suffix: "%", min: 1, max: 50, defaultValue: 10 },
      { name: "medicalCoverage", label: "Medical Coverage Amount", type: "number", prefix: "$", min: 0, max: 1000000, defaultValue: 100000 },
    ],
    calculate: (inputs) => {
      const tripCost = inputs.tripCost as number;
      const premium = inputs.insuranceCost as number;
      const risk = (inputs.cancellationRisk as number) / 100;
      const medical = inputs.medicalCoverage as number;
      if (!tripCost || !premium) return null;
      const expectedLoss = tripCost * risk;
      const netValue = expectedLoss - premium;
      const breakEvenRisk = (premium / tripCost) * 100;
      const premiumPercent = (premium / tripCost) * 100;
      const worthIt = netValue > 0;
      return {
        primary: { label: "Insurance Value Assessment", value: worthIt ? "Recommended" : "Optional" },
        details: [
          { label: "Expected Loss Without Insurance", value: "$" + formatNumber(Math.round(expectedLoss)) },
          { label: "Net Expected Value", value: "$" + formatNumber(Math.round(netValue)) },
          { label: "Premium as % of Trip Cost", value: formatNumber(Math.round(premiumPercent * 10) / 10) + "%" },
          { label: "Break-Even Cancellation Risk", value: formatNumber(Math.round(breakEvenRisk * 10) / 10) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["travel-budget-calculator","flight-cost-per-mile-calculator"],
  faq: [
    { question: "How much does travel insurance typically cost?", answer: "Travel insurance typically costs 5% to 10% of the total trip cost. Comprehensive plans covering medical, cancellation, and baggage may cost more, while basic cancellation-only plans cost less." },
    { question: "When is travel insurance most worth it?", answer: "Travel insurance provides the most value for expensive trips, international travel, trips with non-refundable bookings, travelers with health concerns, and trips during hurricane or weather-risk seasons." },
  ],
  formula: "Expected Loss = Trip Cost x Cancellation Risk; Net Value = Expected Loss - Premium; Break-Even Risk = Premium / Trip Cost",
};
