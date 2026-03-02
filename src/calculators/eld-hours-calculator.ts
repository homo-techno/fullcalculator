import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eldHoursCalculator: CalculatorDefinition = {
  slug: "eld-hours-calculator",
  title: "ELD Hours of Service Calculator",
  description: "Calculate remaining ELD hours of service.",
  category: "Everyday",
  categorySlug: "~",
  icon: "Clock",
  keywords: ["ELD","hours","service","driving","HOS"],
  variants: [{
    id: "standard",
    name: "ELD Hours of Service",
    description: "Calculate remaining ELD hours of service.",
    fields: [
      { name: "drivingUsed", label: "Driving Hours Used Today", type: "number", min: 0, max: 11, defaultValue: 6 },
      { name: "onDutyUsed", label: "On-Duty Hours Used Today", type: "number", min: 0, max: 14, defaultValue: 8 },
      { name: "cycleUsed", label: "70-Hr Cycle Hours Used", type: "number", min: 0, max: 70, defaultValue: 45 },
      { name: "avgSpeed", label: "Average Speed (mph)", type: "number", min: 10, max: 80, defaultValue: 55 },
    ],
    calculate: (inputs) => {
    const drivingUsed = inputs.drivingUsed as number;
    const onDutyUsed = inputs.onDutyUsed as number;
    const cycleUsed = inputs.cycleUsed as number;
    const avgSpeed = inputs.avgSpeed as number;
    const drivingRemain = 11 - drivingUsed;
    const onDutyRemain = 14 - onDutyUsed;
    const cycleRemain = 70 - cycleUsed;
    const effectiveRemain = Math.min(drivingRemain, onDutyRemain, cycleRemain);
    const milesRemaining = effectiveRemain * avgSpeed;
    return {
      primary: { label: "Effective Hours Remaining", value: formatNumber(effectiveRemain) + " hrs" },
      details: [
        { label: "Driving Hours Left (11-hr)", value: formatNumber(drivingRemain) },
        { label: "On-Duty Hours Left (14-hr)", value: formatNumber(onDutyRemain) },
        { label: "Cycle Hours Left (70-hr)", value: formatNumber(cycleRemain) },
        { label: "Estimated Miles Remaining", value: formatNumber(milesRemaining) }
      ]
    };
  },
  }],
  relatedSlugs: ["driver-pay-calculator","deadhead-miles-calculator","fleet-fuel-cost-calculator"],
  faq: [
    { question: "What are ELD hours of service rules?", answer: "Drivers may drive 11 hours within a 14-hour on-duty window after 10 hours off." },
    { question: "What is the 70-hour rule?", answer: "Drivers cannot exceed 70 hours of on-duty time in 8 consecutive days." },
  ],
  formula: "Effective Remaining = min(11 - Driving, 14 - OnDuty, 70 - Cycle)",
};
