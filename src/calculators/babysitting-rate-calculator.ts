import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const babysittingRateCalculator: CalculatorDefinition = {
  slug: "babysitting-rate-calculator",
  title: "Babysitting Rate Calculator",
  description: "Calculate a fair hourly babysitting rate based on number of children and experience.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["babysitting","rate","childcare","hourly","pay"],
  variants: [{
    id: "standard",
    name: "Babysitting Rate",
    description: "Calculate a fair hourly babysitting rate based on number of children and experience.",
    fields: [
      { name: "numChildren", label: "Number of Children", type: "number", min: 1, max: 10, step: 1, defaultValue: 2 },
      { name: "baseRate", label: "Base Hourly Rate ($)", type: "number", min: 5, max: 50, step: 0.5, defaultValue: 15 },
      { name: "hours", label: "Hours Per Session", type: "number", min: 1, max: 24, step: 0.5, defaultValue: 4 },
      { name: "experience", label: "Experience Level", type: "select", options: [{ value: "1", label: "Beginner" }, { value: "1.1", label: "Intermediate" }, { value: "1.25", label: "Experienced" }] },
    ],
    calculate: (inputs) => {
    const numChildren = inputs.numChildren as number;
    const baseRate = inputs.baseRate as number;
    const hours = inputs.hours as number;
    const experience = inputs.experience as number;
    const extraChildRate = (numChildren - 1) * 2;
    const hourlyRate = (baseRate + extraChildRate) * experience;
    const sessionTotal = hourlyRate * hours;
    return {
      primary: { label: "Hourly Rate", value: "$" + formatNumber(hourlyRate) },
      details: [
        { label: "Extra Child Premium", value: "$" + formatNumber(extraChildRate) + "/hr" },
        { label: "Session Total", value: "$" + formatNumber(sessionTotal) },
        { label: "Monthly (4 sessions)", value: "$" + formatNumber(sessionTotal * 4) }
      ]
    };
  },
  }],
  relatedSlugs: ["au-pair-cost-calculator","after-school-program-cost-calculator","tutoring-cost-calculator"],
  faq: [
    { question: "How much should I pay a babysitter?", answer: "Typical rates range from $15 to $25 per hour depending on location and experience." },
    { question: "Should I pay more for multiple children?", answer: "Yes, adding $1 to $3 per additional child is standard practice." },
  ],
  formula: "Hourly Rate = (Base Rate + Extra Child Premium) x Experience Multiplier",
};
