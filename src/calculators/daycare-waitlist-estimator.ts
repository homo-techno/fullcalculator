import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const daycareWaitlistEstimatorCalculator: CalculatorDefinition = {
  slug: "daycare-waitlist-estimator",
  title: "Daycare Waitlist Time Estimator",
  description: "Estimate how long you may wait for a daycare spot based on facility size, turnover rate, and your position on the waitlist.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["daycare waitlist","daycare wait time","childcare availability","daycare enrollment","preschool waitlist"],
  variants: [{
    id: "standard",
    name: "Daycare Waitlist Time Estimator",
    description: "Estimate how long you may wait for a daycare spot based on facility size, turnover rate, and your position on the waitlist.",
    fields: [
      { name: "capacity", label: "Facility Total Capacity", type: "number", min: 10, max: 200, defaultValue: 60 },
      { name: "annualTurnover", label: "Annual Turnover Rate (%)", type: "number", min: 10, max: 60, defaultValue: 30 },
      { name: "waitlistPosition", label: "Your Position on Waitlist", type: "number", min: 1, max: 100, defaultValue: 8 },
      { name: "ageGroup", label: "Age Group", type: "select", options: [{ value: "0.15", label: "Infant (0-12 mo) - 15% of spots" }, { value: "0.25", label: "Toddler (1-2 yr) - 25% of spots" }, { value: "0.35", label: "Preschool (3-4 yr) - 35% of spots" }, { value: "0.25", label: "Pre-K (4-5 yr) - 25% of spots" }], defaultValue: "0.25" },
    ],
    calculate: (inputs) => {
    const capacity = inputs.capacity as number;
    const annualTurnover = inputs.annualTurnover as number;
    const waitlistPosition = inputs.waitlistPosition as number;
    const ageGroupShare = inputs.ageGroup as number;
    const ageGroupCapacity = Math.round(capacity * ageGroupShare);
    const annualOpenings = ageGroupCapacity * (annualTurnover / 100);
    const monthlyOpenings = annualOpenings / 12;
    const estimatedMonths = monthlyOpenings > 0 ? waitlistPosition / monthlyOpenings : 99;
    const estimatedWeeks = Math.round(estimatedMonths * 4.33);
    return {
      primary: { label: "Estimated Wait Time", value: formatNumber(Math.round(estimatedMonths)) + " months" },
      details: [
        { label: "Estimated Weeks", value: formatNumber(estimatedWeeks) + " weeks" },
        { label: "Age Group Spots", value: formatNumber(ageGroupCapacity) },
        { label: "Estimated Openings Per Year", value: formatNumber(Math.round(annualOpenings)) },
        { label: "Openings Per Month", value: formatNumber(Math.round(monthlyOpenings * 10) / 10) },
        { label: "Your Waitlist Position", value: "#" + formatNumber(waitlistPosition) }
      ]
    };
  },
  }],
  relatedSlugs: ["nanny-share-cost-calculator","babysitting-rate-calculator","au-pair-cost-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Age Group Spots = Capacity x Age Group Share; Monthly Openings = (Age Group Spots x Turnover%) / 12; Wait Time = Waitlist Position / Monthly Openings",
};
