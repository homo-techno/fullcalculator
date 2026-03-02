import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const passportRenewalTimelineCalculator: CalculatorDefinition = {
  slug: "passport-renewal-timeline-calculator",
  title: "Passport Renewal Timeline Calculator",
  description: "Estimate passport processing time and costs based on processing speed, application type, and expediting options.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["passport renewal","passport processing time","passport timeline","passport expedite"],
  variants: [{
    id: "standard",
    name: "Passport Renewal Timeline",
    description: "Estimate passport processing time and costs based on processing speed, application type, and expediting options.",
    fields: [
      { name: "processingType", label: "Processing Speed", type: "select", options: [{ value: "1", label: "Routine (8-11 weeks)" }, { value: "2", label: "Expedited (5-7 weeks)" }, { value: "3", label: "Urgent/Agency (same day-2 weeks)" }], defaultValue: "1" },
      { name: "applicationType", label: "Application Type", type: "select", options: [{ value: "1", label: "Adult Renewal (mail)" }, { value: "2", label: "First-Time Adult" }, { value: "3", label: "Child Under 16" }, { value: "4", label: "Lost/Stolen Replacement" }], defaultValue: "1" },
      { name: "needPassportCard", label: "Add Passport Card?", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes (+$30)" }], defaultValue: "0" },
      { name: "travelDate", label: "Days Until Travel", type: "number", min: 0, max: 365, defaultValue: 60 },
    ],
    calculate: (inputs) => {
    const processingType = parseInt(inputs.processingType as string);
    const applicationType = parseInt(inputs.applicationType as string);
    const needCard = inputs.needPassportCard as string;
    const travelDate = inputs.travelDate as number;
    const processingWeeks = [[8, 11], [5, 7], [0, 2]];
    const range = processingWeeks[processingType - 1] || [8, 11];
    const minDays = range[0] * 7;
    const maxDays = range[1] * 7;
    const baseFee = applicationType === 3 ? 100 : 130;
    const executionFee = applicationType === 1 ? 0 : 35;
    const expediteFee = processingType >= 2 ? 60 : 0;
    const cardFee = needCard === "1" ? 30 : 0;
    const totalCost = baseFee + executionFee + expediteFee + cardFee;
    const willArrive = travelDate >= minDays;
    return {
      primary: { label: "Total Passport Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Processing Time", value: formatNumber(range[0]) + " - " + formatNumber(range[1]) + " weeks" },
        { label: "Application Fee", value: "$" + formatNumber(baseFee) },
        { label: "Execution Fee", value: "$" + formatNumber(executionFee) },
        { label: "Expedite Fee", value: "$" + formatNumber(expediteFee) },
        { label: "Ready Before Travel?", value: willArrive ? "Likely Yes" : "Cutting It Close - Consider Faster Option" }
      ]
    };
  },
  }],
  relatedSlugs: ["travel-budget-calculator","travel-insurance-value-calculator","currency-exchange-calculator"],
  faq: [
    { question: "How long does a passport renewal take?", answer: "Routine processing takes 8 to 11 weeks. Expedited processing takes 5 to 7 weeks. Urgent processing at a passport agency can be done in 1 to 2 business days." },
    { question: "How much does a passport cost?", answer: "An adult passport book costs $130 for renewal by mail, plus $35 execution fee for first-time applicants. Expediting adds $60." },
    { question: "Can I renew my passport if it expired over 5 years ago?", answer: "If your passport expired more than 5 years ago, you must apply in person as a first-time applicant with new photos and documentation." },
  ],
  formula: "Total Cost = Application Fee + Execution Fee + Expedite Fee + Card Fee
Processing Range varies by speed selected",
};
