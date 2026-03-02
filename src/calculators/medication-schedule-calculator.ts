import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const medicationScheduleCalculator: CalculatorDefinition = {
  slug: "medication-schedule-calculator",
  title: "Medication Schedule Calculator",
  description: "Calculate daily medication timing intervals.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["medication schedule","pill timing","medication interval"],
  variants: [{
    id: "standard",
    name: "Medication Schedule",
    description: "Calculate daily medication timing intervals.",
    fields: [
      { name: "medications", label: "Number of Medications", type: "number", min: 1, max: 20, defaultValue: 3 },
      { name: "wakeHour", label: "Wake Time (hour 0-23)", type: "number", min: 0, max: 23, defaultValue: 7 },
      { name: "sleepHour", label: "Sleep Time (hour 0-23)", type: "number", min: 0, max: 23, defaultValue: 22 },
    ],
    calculate: (inputs) => {
      const meds = inputs.medications as number;
      const wake = inputs.wakeHour as number;
      const sleep = inputs.sleepHour as number;
      if (!meds) return null;
      const awakeHours = sleep > wake ? sleep - wake : 24 - wake + sleep;
      const interval = awakeHours / meds;
      const times = [];
      for (let i = 0; i < Math.min(meds, 5); i++) {
        const hr = (wake + Math.round(interval * i)) % 24;
        times.push(hr + ":00");
      }
      return {
        primary: { label: "Interval", value: formatNumber(Math.round(interval * 10) / 10) + " hours" },
        details: [
          { label: "Awake Hours", value: formatNumber(awakeHours) },
          { label: "Medications", value: formatNumber(meds) },
          { label: "First Doses", value: times.join(", ") },
        ],
      };
  },
  }],
  relatedSlugs: ["fall-risk-calculator","elder-care-cost-calculator"],
  faq: [
    { question: "How do I space medications evenly?", answer: "Divide your awake hours by the number of medications." },
    { question: "Should I take meds with food?", answer: "Check each medication label for food requirements." },
  ],
  formula: "Interval = Awake Hours / Number of Medications",
};
