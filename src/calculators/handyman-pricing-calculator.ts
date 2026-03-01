import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const handymanPricingCalculator: CalculatorDefinition = {
  slug: "handyman-pricing-calculator",
  title: "Handyman Pricing Calculator",
  description: "Estimate handyman service costs for common home repairs and maintenance tasks.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["handyman pricing", "handyman rate", "home repair cost"],
  variants: [{
    id: "standard",
    name: "Handyman Pricing",
    description: "Estimate handyman service costs for common home repairs and maintenance tasks",
    fields: [
      { name: "hours", label: "Estimated Hours", type: "number", suffix: "hours", min: 1, max: 24, defaultValue: 3 },
      { name: "hourlyRate", label: "Hourly Rate", type: "number", prefix: "$", min: 30, max: 150, defaultValue: 65 },
      { name: "materialCost", label: "Material Cost", type: "number", prefix: "$", min: 0, max: 5000, defaultValue: 50 },
      { name: "jobCount", label: "Number of Tasks", type: "number", suffix: "tasks", min: 1, max: 10, defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const hours = inputs.hours as number;
      const rate = inputs.hourlyRate as number;
      const materials = inputs.materialCost as number;
      const jobs = inputs.jobCount as number;
      if (!hours || !rate) return null;
      const laborCost = hours * rate;
      const minimumCharge = Math.max(laborCost, 150);
      const total = minimumCharge + materials;
      const perTask = total / jobs;
      return {
        primary: { label: "Total Estimated Cost", value: "$" + formatNumber(Math.round(total * 100) / 100) },
        details: [
          { label: "Labor (Minimum $150)", value: "$" + formatNumber(Math.round(minimumCharge * 100) / 100) },
          { label: "Materials", value: "$" + formatNumber(Math.round(materials * 100) / 100) },
          { label: "Average per Task", value: "$" + formatNumber(Math.round(perTask * 100) / 100) },
        ],
      };
    },
  }],
  relatedSlugs: ["plumber-rate-calculator", "contractor-markup-calculator"],
  faq: [
    { question: "How much does a handyman charge?", answer: "Handyman rates typically range from $50 to $100 per hour, with most charging a minimum of 1 to 2 hours. Some handymen offer flat rates for common tasks." },
    { question: "What tasks can a handyman do?", answer: "Handymen handle minor repairs, furniture assembly, painting, drywall patching, fixture installation, caulking, and other small to medium home maintenance tasks." },
  ],
  formula: "Total = Max(Hours x Rate, Minimum Charge) + Materials",
};
