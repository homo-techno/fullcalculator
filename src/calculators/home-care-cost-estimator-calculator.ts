import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeCareCostEstimatorCalculator: CalculatorDefinition = {
  slug: "home-care-cost-estimator-calculator",
  title: "Home Care Cost Estimator Calculator",
  description: "Estimate the monthly and annual cost of in-home care services based on hours needed, care level, and geographic location factors.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["home care cost","in-home care cost","home health aide cost","personal care cost estimator"],
  variants: [{
    id: "standard",
    name: "Home Care Cost Estimator",
    description: "Estimate the monthly and annual cost of in-home care services based on hours needed, care level, and geographic location factors.",
    fields: [
      { name: "hoursPerWeek", label: "Hours of Care Per Week", type: "number", min: 1, max: 168, defaultValue: 20 },
      { name: "hourlyRate", label: "Hourly Rate ($)", type: "number", min: 10, max: 75, defaultValue: 30 },
      { name: "careLevel", label: "Care Level", type: "select", options: [{ value: "1", label: "Companion / Homemaker" }, { value: "2", label: "Personal Care Aide" }, { value: "3", label: "Certified Nursing Assistant" }, { value: "4", label: "Licensed Practical Nurse" }], defaultValue: "2" },
      { name: "locationFactor", label: "Location Cost Factor", type: "select", options: [{ value: "0.85", label: "Rural / Low Cost" }, { value: "1.0", label: "Average / Suburban" }, { value: "1.2", label: "Urban / High Cost" }, { value: "1.4", label: "Major Metro / Very High Cost" }], defaultValue: "1.0" },
      { name: "weeksPerYear", label: "Weeks of Care Per Year", type: "number", min: 1, max: 52, defaultValue: 52 },
    ],
    calculate: (inputs) => {
    const hours = inputs.hoursPerWeek as number;
    const rate = inputs.hourlyRate as number;
    const level = parseInt(inputs.careLevel as string);
    const locFactor = parseFloat(inputs.locationFactor as string);
    const weeks = inputs.weeksPerYear as number;
    const levelMultiplier = { 1: 0.85, 2: 1.0, 3: 1.2, 4: 1.5 };
    const adjRate = rate * (levelMultiplier[level] || 1) * locFactor;
    const weeklyCost = hours * adjRate;
    const monthlyCost = weeklyCost * (weeks / 12);
    const annualCost = weeklyCost * weeks;
    const dailyEquivalent = hours > 0 ? adjRate * (hours / 7) : 0;
    return {
      primary: { label: "Monthly Home Care Cost", value: "$" + formatNumber(Math.round(monthlyCost)) },
      details: [
        { label: "Adjusted Hourly Rate", value: "$" + formatNumber(Math.round(adjRate * 100) / 100) },
        { label: "Weekly Cost", value: "$" + formatNumber(Math.round(weeklyCost)) },
        { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost)) },
        { label: "Daily Equivalent", value: "$" + formatNumber(Math.round(dailyEquivalent)) },
        { label: "Total Hours Per Year", value: formatNumber(Math.round(hours * weeks)) }
      ]
    };
  },
  }],
  relatedSlugs: ["retirement-healthcare-cost-calculator","senior-housing-cost-comparison-calculator"],
  faq: [
    { question: "What is the average cost of home care?", answer: "The national median cost for a home health aide is approximately $30 to $33 per hour. Costs vary significantly by location, ranging from $20 per hour in rural areas to over $40 per hour in major metropolitan areas." },
    { question: "Does Medicare cover home care?", answer: "Medicare covers limited home health services when medically necessary and ordered by a doctor, including skilled nursing and therapy. It does not cover personal care, homemaker services, or around-the-clock care." },
    { question: "What is the difference between home care and home health care?", answer: "Home care refers to non-medical assistance such as help with bathing, dressing, cooking, and housekeeping. Home health care involves medical services like wound care, medication management, and physical therapy, provided by licensed professionals." },
  ],
  formula: "Adjusted Rate = Base Rate x Care Level Multiplier x Location Factor
Weekly Cost = Hours Per Week x Adjusted Rate
Monthly Cost = Weekly Cost x (Weeks Per Year / 12)
Annual Cost = Weekly Cost x Weeks Per Year",
};
