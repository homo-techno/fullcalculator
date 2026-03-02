import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const maidServiceCostCalculator: CalculatorDefinition = {
  slug: "maid-service-cost-calculator",
  title: "Maid Service Cost Calculator",
  description: "Estimate the cost of recurring maid service.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["maid","service","cost","housekeeping"],
  variants: [{
    id: "standard",
    name: "Maid Service Cost",
    description: "Estimate the cost of recurring maid service.",
    fields: [
      { name: "sqft", label: "Home Size (sq ft)", type: "number", min: 500, max: 5000, defaultValue: 1500 },
      { name: "frequency", label: "Visits Per Month", type: "number", min: 1, max: 8, defaultValue: 2 },
      { name: "serviceType", label: "Service Level", type: "select", options: [{ value: "0.08", label: "Basic" }, { value: "0.12", label: "Standard" }, { value: "0.18", label: "Deep Clean" }] },
    ],
    calculate: (inputs) => {
    const sqft = inputs.sqft as number;
    const frequency = inputs.frequency as number;
    const serviceType = inputs.serviceType as number;
    const perVisitCost = sqft * serviceType;
    const monthlyCost = perVisitCost * frequency;
    const yearlyCost = monthlyCost * 12;
    return { primary: { label: "Monthly Maid Service Cost", value: "$" + formatNumber(monthlyCost) }, details: [{ label: "Per Visit Cost", value: "$" + formatNumber(perVisitCost) }, { label: "Visits Per Month", value: formatNumber(frequency) }, { label: "Annual Cost", value: "$" + formatNumber(yearlyCost) }] };
  },
  }],
  relatedSlugs: ["house-cleaning-time-calculator","cleaning-supply-calculator","deep-cleaning-checklist-calculator"],
  faq: [
    { question: "How much does a maid service cost?", answer: "About $100 to $250 per visit for an average home." },
    { question: "How often should I hire a maid?", answer: "Bi-weekly is the most popular schedule." },
    { question: "What does basic maid service include?", answer: "Vacuuming, dusting, mopping, and bathroom cleaning." },
  ],
  formula: "Monthly = SqFt * Rate * Frequency",
};
