import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const spaDayCostCalculator: CalculatorDefinition = {
  slug: "spa-day-cost-calculator",
  title: "Spa Day Cost Calculator",
  description: "Calculate the total cost of a full spa day package.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["spa day cost","spa package price","spa visit cost"],
  variants: [{
    id: "standard",
    name: "Spa Day Cost",
    description: "Calculate the total cost of a full spa day package.",
    fields: [
      { name: "massage", label: "Massage ($)", type: "number", min: 0, max: 500, defaultValue: 120 },
      { name: "facial", label: "Facial ($)", type: "number", min: 0, max: 400, defaultValue: 100 },
      { name: "bodyTreatment", label: "Body Treatment ($)", type: "number", min: 0, max: 300, defaultValue: 80 },
      { name: "nailService", label: "Nail Service ($)", type: "number", min: 0, max: 200, defaultValue: 60 },
      { name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 },
      { name: "guests", label: "Number of Guests", type: "number", min: 1, max: 10, defaultValue: 1 },
    ],
    calculate: (inputs) => {
    const massage = inputs.massage as number;
    const facial = inputs.facial as number;
    const bodyTreatment = inputs.bodyTreatment as number;
    const nailService = inputs.nailService as number;
    const tip = inputs.tip as number;
    const guests = inputs.guests as number;
    const perPersonSubtotal = massage + facial + bodyTreatment + nailService;
    const tipAmount = perPersonSubtotal * (tip / 100);
    const perPersonTotal = perPersonSubtotal + tipAmount;
    const grandTotal = perPersonTotal * guests;
    return {
      primary: { label: "Total Spa Day Cost", value: "$" + formatNumber(grandTotal) },
      details: [
        { label: "Per Person Subtotal", value: "$" + formatNumber(perPersonSubtotal) },
        { label: "Tip Per Person", value: "$" + formatNumber(tipAmount) },
        { label: "Per Person Total", value: "$" + formatNumber(perPersonTotal) }
      ]
    };
  },
  }],
  relatedSlugs: ["massage-cost-calculator","facial-treatment-cost-calculator"],
  faq: [
    { question: "How much does a spa day cost?", answer: "A full spa day typically costs $200 to $500 per person." },
    { question: "What is included in a spa day?", answer: "Packages usually include a massage, facial, and access to amenities." },
    { question: "How much should you tip at a spa?", answer: "15 to 20 percent per service is customary at most spas." },
  ],
  formula: "Total = (Massage + Facial + Body + Nails) x (1 + Tip%) x Guests",
};
