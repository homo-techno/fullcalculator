import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const visaProcessingTimeCalculator: CalculatorDefinition = {
  slug: "visa-processing-time-calculator",
  title: "Visa Processing Time Calculator",
  description: "Estimate visa processing times and costs based on destination, visa type, and application method.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["visa processing time","visa application","visa cost estimator","visa timeline"],
  variants: [{
    id: "standard",
    name: "Visa Processing Time",
    description: "Estimate visa processing times and costs based on destination, visa type, and application method.",
    fields: [
      { name: "visaType", label: "Visa Type", type: "select", options: [{ value: "1", label: "Tourist/Visitor" }, { value: "2", label: "Business" }, { value: "3", label: "Student" }, { value: "4", label: "Work/Employment" }, { value: "5", label: "Transit" }], defaultValue: "1" },
      { name: "processing", label: "Processing Speed", type: "select", options: [{ value: "1", label: "Standard" }, { value: "2", label: "Expedited" }, { value: "3", label: "Rush/Premium" }], defaultValue: "1" },
      { name: "complexity", label: "Application Complexity", type: "select", options: [{ value: "1", label: "Simple (e-Visa available)" }, { value: "2", label: "Moderate (embassy required)" }, { value: "3", label: "Complex (interview required)" }], defaultValue: "2" },
      { name: "daysUntilTrip", label: "Days Until Trip", type: "number", min: 1, max: 365, defaultValue: 45 },
    ],
    calculate: (inputs) => {
    const visaType = parseInt(inputs.visaType as string);
    const processing = parseInt(inputs.processing as string);
    const complexity = parseInt(inputs.complexity as string);
    const daysUntilTrip = inputs.daysUntilTrip as number;
    const baseWeeks = [[2, 4], [3, 6], [4, 8], [6, 16], [1, 2]];
    const range = baseWeeks[visaType - 1] || [2, 4];
    const speedMult = [1, 0.6, 0.3][processing - 1] || 1;
    const complexMult = [0.5, 1, 1.5][complexity - 1] || 1;
    const minWeeks = Math.max(Math.round(range[0] * speedMult * complexMult * 10) / 10, 0.5);
    const maxWeeks = Math.round(range[1] * speedMult * complexMult * 10) / 10;
    const baseFee = [50, 80, 100, 200, 30][visaType - 1] || 50;
    const expediteFee = processing === 2 ? 50 : processing === 3 ? 150 : 0;
    const totalFee = baseFee + expediteFee;
    const enoughTime = daysUntilTrip >= minWeeks * 7;
    return {
      primary: { label: "Estimated Processing Time", value: formatNumber(minWeeks) + " - " + formatNumber(maxWeeks) + " weeks" },
      details: [
        { label: "Application Fee", value: "$" + formatNumber(totalFee) },
        { label: "Expedite Fee", value: "$" + formatNumber(expediteFee) },
        { label: "Apply By Date", value: "At least " + formatNumber(Math.round(maxWeeks * 7)) + " days before travel" },
        { label: "Enough Time?", value: enoughTime ? "Yes" : "Apply immediately or expedite" }
      ]
    };
  },
  }],
  relatedSlugs: ["passport-renewal-timeline-calculator","travel-budget-calculator","travel-insurance-value-calculator"],
  faq: [
    { question: "How long does a tourist visa take to process?", answer: "Tourist visas typically take 2 to 6 weeks for standard processing. E-visas for many countries can be processed in 1 to 5 business days." },
    { question: "How much does a visa application cost?", answer: "Tourist visas range from $20 to $200 depending on the destination. US B1/B2 visas cost $185, Schengen visas cost about 80 euros." },
    { question: "Can I expedite my visa application?", answer: "Many countries offer expedited processing for an additional fee, typically cutting processing time in half. Some premium services guarantee processing within days." },
  ],
  formula: "Processing Time = Base Weeks x Speed Multiplier x Complexity Factor
Total Cost = Base Fee + Expedite Fee",
};
