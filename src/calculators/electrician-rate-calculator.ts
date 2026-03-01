import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const electricianRateCalculator: CalculatorDefinition = {
  slug: "electrician-rate-calculator",
  title: "Electrician Rate Calculator",
  description: "Calculate electrician service pricing based on job type, hours, and material costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["electrician rate", "electrician hourly cost", "electrical work pricing"],
  variants: [{
    id: "standard",
    name: "Electrician Rate",
    description: "Calculate electrician service pricing based on job type, hours, and material costs",
    fields: [
      { name: "hours", label: "Estimated Hours", type: "number", suffix: "hours", min: 0.5, max: 40, step: 0.5, defaultValue: 3 },
      { name: "hourlyRate", label: "Hourly Rate", type: "number", prefix: "$", min: 30, max: 200, defaultValue: 85 },
      { name: "materialCost", label: "Material Cost", type: "number", prefix: "$", min: 0, max: 10000, defaultValue: 150 },
      { name: "jobType", label: "Job Complexity", type: "select", options: [{value:"simple",label:"Simple (Outlet/Switch)"},{value:"moderate",label:"Moderate (Panel Work)"},{value:"complex",label:"Complex (Rewiring)"}], defaultValue: "moderate" },
    ],
    calculate: (inputs) => {
      const hours = inputs.hours as number;
      const rate = inputs.hourlyRate as number;
      const materials = inputs.materialCost as number;
      const jobType = inputs.jobType as string;
      if (!hours || !rate) return null;
      const complexityMod: Record<string, number> = { simple: 1.0, moderate: 1.2, complex: 1.5 };
      const laborCost = hours * rate * (complexityMod[jobType] || 1.2);
      const serviceFee = 75;
      const total = laborCost + materials + serviceFee;
      return {
        primary: { label: "Total Estimated Cost", value: "$" + formatNumber(Math.round(total * 100) / 100) },
        details: [
          { label: "Labor Cost", value: "$" + formatNumber(Math.round(laborCost * 100) / 100) },
          { label: "Materials", value: "$" + formatNumber(Math.round(materials * 100) / 100) },
          { label: "Service Call Fee", value: "$" + formatNumber(serviceFee) },
        ],
      };
    },
  }],
  relatedSlugs: ["plumber-rate-calculator", "contractor-markup-calculator"],
  faq: [
    { question: "How much does an electrician charge per hour?", answer: "Electricians typically charge $50 to $130 per hour depending on experience, location, and job complexity. Emergency or after-hours calls often carry a premium." },
    { question: "Should I hire a licensed electrician?", answer: "Yes, always hire a licensed electrician for electrical work. Unlicensed work can void your insurance, violate building codes, and create serious safety hazards." },
  ],
  formula: "Total = (Hours x Hourly Rate x Complexity Multiplier) + Materials + Service Fee",
};
