import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const legalRetainerCalculator: CalculatorDefinition = {
  slug: "legal-retainer-calculator",
  title: "Legal Retainer Calculator",
  description: "Estimate how long a legal retainer will last based on expected hours and billing rate.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["legal retainer","retainer fee","attorney retainer","retainer estimate"],
  variants: [{
    id: "standard",
    name: "Legal Retainer",
    description: "Estimate how long a legal retainer will last based on expected hours and billing rate.",
    fields: [
      { name: "retainerAmount", label: "Retainer Amount ($)", type: "number", min: 500, max: 500000, defaultValue: 5000 },
      { name: "hourlyRate", label: "Hourly Rate ($)", type: "number", min: 50, max: 2000, defaultValue: 300 },
      { name: "monthlyHours", label: "Estimated Monthly Hours Needed", type: "number", min: 1, max: 200, defaultValue: 10 },
      { name: "paraRate", label: "Paralegal Hourly Rate ($)", type: "number", min: 0, max: 500, defaultValue: 100 },
      { name: "paraHours", label: "Paralegal Monthly Hours", type: "number", min: 0, max: 100, defaultValue: 5 },
    ],
    calculate: (inputs) => {
    const retainerAmount = inputs.retainerAmount as number;
    const hourlyRate = inputs.hourlyRate as number;
    const monthlyHours = inputs.monthlyHours as number;
    const paraRate = inputs.paraRate as number;
    const paraHours = inputs.paraHours as number;
    const monthlyAttorneyCost = monthlyHours * hourlyRate;
    const monthlyParaCost = paraHours * paraRate;
    const monthlyCost = monthlyAttorneyCost + monthlyParaCost;
    const monthsLasting = monthlyCost > 0 ? retainerAmount / monthlyCost : 0;
    const totalHoursAvailable = hourlyRate > 0 ? retainerAmount / hourlyRate : 0;
    return {
      primary: { label: "Retainer Lasts Approximately", value: formatNumber(monthsLasting) + " months" },
      details: [
        { label: "Monthly Attorney Cost", value: "$" + formatNumber(monthlyAttorneyCost) },
        { label: "Monthly Paralegal Cost", value: "$" + formatNumber(monthlyParaCost) },
        { label: "Total Monthly Burn Rate", value: "$" + formatNumber(monthlyCost) },
        { label: "Attorney Hours Available", value: formatNumber(totalHoursAvailable) + " hrs" }
      ]
    };
  },
  }],
  relatedSlugs: ["billable-hours-calculator","legal-fee-estimator-calculator","attorney-hourly-rate-comparison-calculator"],
  faq: [
    { question: "What is a legal retainer?", answer: "A retainer is an upfront fee paid to an attorney to secure their services. The attorney bills against the retainer as work is performed." },
    { question: "Is a retainer fee refundable?", answer: "If the retainer is not fully used, most states require attorneys to refund the unused portion. Earned retainers are non-refundable." },
    { question: "How much is a typical retainer?", answer: "Retainers vary widely from $2,000 to $25,000 or more depending on case type, complexity, and the attorney's experience." },
  ],
  formula: "Months Lasting = Retainer Amount / (Attorney Hours x Rate + Paralegal Hours x Rate)",
};
