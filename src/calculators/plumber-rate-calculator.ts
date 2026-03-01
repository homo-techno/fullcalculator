import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const plumberRateCalculator: CalculatorDefinition = {
  slug: "plumber-rate-calculator",
  title: "Plumber Rate Calculator",
  description: "Estimate plumbing service costs based on job type, duration, and parts needed.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["plumber rate", "plumber cost", "plumbing service pricing"],
  variants: [{
    id: "standard",
    name: "Plumber Rate",
    description: "Estimate plumbing service costs based on job type, duration, and parts needed",
    fields: [
      { name: "hours", label: "Estimated Hours", type: "number", suffix: "hours", min: 0.5, max: 40, step: 0.5, defaultValue: 2 },
      { name: "hourlyRate", label: "Hourly Rate", type: "number", prefix: "$", min: 40, max: 200, defaultValue: 90 },
      { name: "partsCost", label: "Parts and Materials", type: "number", prefix: "$", min: 0, max: 5000, defaultValue: 100 },
      { name: "urgency", label: "Urgency Level", type: "select", options: [{value:"scheduled",label:"Scheduled Visit"},{value:"sameday",label:"Same-Day Service"},{value:"emergency",label:"Emergency Call"}], defaultValue: "scheduled" },
    ],
    calculate: (inputs) => {
      const hours = inputs.hours as number;
      const rate = inputs.hourlyRate as number;
      const parts = inputs.partsCost as number;
      const urgency = inputs.urgency as string;
      if (!hours || !rate) return null;
      const urgencyMod: Record<string, number> = { scheduled: 1.0, sameday: 1.3, emergency: 1.75 };
      const laborCost = hours * rate * (urgencyMod[urgency] || 1.0);
      const tripCharge = 65;
      const total = laborCost + parts + tripCharge;
      return {
        primary: { label: "Total Estimated Cost", value: "$" + formatNumber(Math.round(total * 100) / 100) },
        details: [
          { label: "Labor Cost", value: "$" + formatNumber(Math.round(laborCost * 100) / 100) },
          { label: "Parts and Materials", value: "$" + formatNumber(Math.round(parts * 100) / 100) },
          { label: "Trip Charge", value: "$" + formatNumber(tripCharge) },
        ],
      };
    },
  }],
  relatedSlugs: ["electrician-rate-calculator", "handyman-pricing-calculator"],
  faq: [
    { question: "How much does a plumber cost per hour?", answer: "Plumbers typically charge $60 to $130 per hour for standard work. Emergency and after-hours calls can cost 50 to 100 percent more than regular rates." },
    { question: "When should I call a plumber?", answer: "Call a plumber for persistent leaks, low water pressure, sewage backups, water heater issues, or any plumbing project that requires permits or code compliance." },
  ],
  formula: "Total = (Hours x Hourly Rate x Urgency Multiplier) + Parts + Trip Charge",
};
