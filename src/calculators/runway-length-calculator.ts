import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const runwayLengthCalculator: CalculatorDefinition = {
  slug: "runway-length-calculator",
  title: "Runway Length Calculator",
  description: "Estimate required runway length for takeoff.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["runway","takeoff","distance","aircraft"],
  variants: [{
    id: "standard",
    name: "Runway Length",
    description: "Estimate required runway length for takeoff.",
    fields: [
      { name: "grossWeight", label: "Gross Weight (lbs)", type: "number", min: 1000, max: 100000, defaultValue: 2500 },
      { name: "densityAlt", label: "Density Altitude (ft)", type: "number", min: 0, max: 15000, defaultValue: 3000 },
      { name: "baseRun", label: "Sea Level Takeoff Roll (ft)", type: "number", min: 200, max: 10000, defaultValue: 1200 },
    ],
    calculate: (inputs) => {
    const grossWeight = inputs.grossWeight as number;
    const densityAlt = inputs.densityAlt as number;
    const baseRun = inputs.baseRun as number;
    const altFactor = 1 + densityAlt / 1000 * 0.10;
    const weightFactor = grossWeight / 2500;
    const requiredRun = baseRun * altFactor * weightFactor;
    const safetyMargin = requiredRun * 1.5;
    return {
      primary: { label: "Required Runway", value: formatNumber(requiredRun) + " ft" },
      details: [
        { label: "With 50% Safety Margin", value: formatNumber(safetyMargin) + " ft" },
        { label: "Altitude Factor", value: formatNumber(altFactor) },
        { label: "Weight Factor", value: formatNumber(weightFactor) }
      ]
    };
  },
  }],
  relatedSlugs: ["density-altitude-calculator","aircraft-weight-balance-calculator"],
  faq: [
    { question: "How does altitude affect takeoff distance?", answer: "Takeoff distance increases about 10 percent per 1000 feet." },
    { question: "What safety margin should I use?", answer: "Add at least 50 percent to calculated takeoff distance." },
  ],
  formula: "Required = Base Roll x Altitude Factor x Weight Factor",
};
