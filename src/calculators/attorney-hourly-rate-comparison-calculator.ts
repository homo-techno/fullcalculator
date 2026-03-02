import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const attorneyHourlyRateComparisonCalculator: CalculatorDefinition = {
  slug: "attorney-hourly-rate-comparison-calculator",
  title: "Attorney Hourly Rate Comparison Calculator",
  description: "Compare attorney costs by experience level, practice area, and geographic region.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["attorney rates","lawyer hourly rate","attorney cost comparison","legal rate comparison"],
  variants: [{
    id: "standard",
    name: "Attorney Hourly Rate Comparison",
    description: "Compare attorney costs by experience level, practice area, and geographic region.",
    fields: [
      { name: "practiceArea", label: "Practice Area", type: "select", options: [{ value: "1", label: "General Practice" }, { value: "2", label: "Family Law" }, { value: "3", label: "Criminal Defense" }, { value: "4", label: "Corporate/Business" }, { value: "5", label: "Intellectual Property" }, { value: "6", label: "Real Estate" }], defaultValue: "1" },
      { name: "experience", label: "Experience Level", type: "select", options: [{ value: "1", label: "Junior (1-3 years)" }, { value: "2", label: "Mid-Level (4-9 years)" }, { value: "3", label: "Senior (10-19 years)" }, { value: "4", label: "Partner (20+ years)" }], defaultValue: "2" },
      { name: "region", label: "Region", type: "select", options: [{ value: "1", label: "Rural" }, { value: "2", label: "Suburban" }, { value: "3", label: "Mid-Size City" }, { value: "4", label: "Major Metro" }], defaultValue: "3" },
      { name: "hoursNeeded", label: "Estimated Hours Needed", type: "number", min: 1, max: 1000, defaultValue: 20 },
    ],
    calculate: (inputs) => {
    const practiceArea = parseInt(inputs.practiceArea as string);
    const experience = parseInt(inputs.experience as string);
    const region = parseInt(inputs.region as string);
    const hoursNeeded = inputs.hoursNeeded as number;
    const areaNames = ["", "General Practice", "Family Law", "Criminal Defense", "Corporate/Business", "Intellectual Property", "Real Estate"];
    const baseRates = [0, 200, 250, 275, 350, 400, 225];
    const expMultipliers = [0, 0.7, 1, 1.4, 1.9];
    const regionMultipliers = [0, 0.75, 0.9, 1.1, 1.45];
    const rate = (baseRates[practiceArea] || 200) * (expMultipliers[experience] || 1) * (regionMultipliers[region] || 1);
    const totalCost = rate * hoursNeeded;
    const paraRate = rate * 0.35;
    const paraTotalCost = paraRate * hoursNeeded;
    return {
      primary: { label: "Estimated Hourly Rate", value: "$" + formatNumber(rate) },
      details: [
        { label: "Practice Area", value: areaNames[practiceArea] || "General" },
        { label: "Total Cost for " + hoursNeeded + " Hours", value: "$" + formatNumber(totalCost) },
        { label: "Comparable Paralegal Rate", value: "$" + formatNumber(paraRate) },
        { label: "Paralegal Cost for Same Hours", value: "$" + formatNumber(paraTotalCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["legal-fee-estimator-calculator","billable-hours-calculator","legal-retainer-calculator"],
  faq: [
    { question: "What is the average hourly rate for a lawyer?", answer: "The national average is approximately $250 to $350 per hour, but rates range from $150 in rural areas to $1,000+ for top partners in major cities." },
    { question: "Why do IP lawyers charge more?", answer: "Intellectual property attorneys often have specialized technical degrees in addition to law degrees, and the subject matter requires highly specialized knowledge." },
    { question: "Should I hire a cheaper lawyer to save money?", answer: "Not necessarily. An experienced attorney may resolve your case faster and more effectively, potentially costing less overall than a cheaper but less efficient attorney." },
  ],
  formula: "Hourly Rate = Base Rate x Experience Multiplier x Region Multiplier",
};
