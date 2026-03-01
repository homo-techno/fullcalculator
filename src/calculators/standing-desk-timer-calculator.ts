import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const standingDeskTimerCalculator: CalculatorDefinition = {
  slug: "standing-desk-timer-calculator",
  title: "Standing Desk Timer Calculator",
  description: "Calculate optimal sit and stand intervals for your standing desk throughout the workday.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["standing desk timer", "sit stand intervals", "standing desk schedule"],
  variants: [{
    id: "standard",
    name: "Standing Desk Timer",
    description: "Calculate optimal sit and stand intervals for your standing desk throughout the workday",
    fields: [
      { name: "workHours", label: "Work Hours per Day", type: "number", suffix: "hours", min: 4, max: 12, defaultValue: 8 },
      { name: "experience", label: "Standing Desk Experience", type: "select", options: [{value:"new",label:"New User (Under 1 Month)"},{value:"moderate",label:"Some Experience (1-6 Months)"},{value:"experienced",label:"Experienced (6+ Months)"}], defaultValue: "moderate" },
      { name: "fitnessLevel", label: "Fitness Level", type: "select", options: [{value:"low",label:"Low (Mostly Sedentary)"},{value:"moderate",label:"Moderate (Some Exercise)"},{value:"high",label:"High (Regular Exercise)"}], defaultValue: "moderate" },
    ],
    calculate: (inputs) => {
      const workHours = inputs.workHours as number;
      const exp = inputs.experience as string;
      const fitness = inputs.fitnessLevel as string;
      if (!workHours || workHours <= 0) return null;
      const standRatio: Record<string, number> = { new: 0.25, moderate: 0.40, experienced: 0.50 };
      const fitMod: Record<string, number> = { low: 0.8, moderate: 1.0, high: 1.2 };
      const ratio = Math.min((standRatio[exp] || 0.40) * (fitMod[fitness] || 1.0), 0.60);
      const standMinutes = Math.round(workHours * 60 * ratio);
      const sitMinutes = (workHours * 60) - standMinutes;
      const standInterval = exp === "new" ? 15 : exp === "moderate" ? 25 : 30;
      const sitInterval = exp === "new" ? 45 : exp === "moderate" ? 35 : 30;
      const transitions = Math.round((workHours * 60) / (standInterval + sitInterval));
      return {
        primary: { label: "Daily Standing Time", value: formatNumber(standMinutes) + " minutes" },
        details: [
          { label: "Daily Sitting Time", value: formatNumber(sitMinutes) + " minutes" },
          { label: "Recommended Cycle", value: formatNumber(standInterval) + " min stand / " + formatNumber(sitInterval) + " min sit" },
          { label: "Daily Transitions", value: formatNumber(transitions) },
        ],
      };
    },
  }],
  relatedSlugs: ["eye-strain-break-calculator", "stretching-routine-calculator"],
  faq: [
    { question: "How long should I stand at a standing desk?", answer: "Start with 15 to 30 minutes of standing per hour and gradually increase. Most experts recommend a 1:1 to 1:2 standing to sitting ratio throughout the day." },
    { question: "Is a standing desk better than sitting all day?", answer: "Alternating between sitting and standing reduces back pain, improves posture, and increases energy. Standing all day is not recommended either, so regular transitions are key." },
  ],
  formula: "Standing Time = Work Hours x Stand Ratio x Fitness Modifier",
};
