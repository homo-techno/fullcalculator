import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const jetLagRecoveryTimeCalculator: CalculatorDefinition = {
  slug: "jet-lag-recovery-time-calculator",
  title: "Jet Lag Recovery Time Calculator",
  description: "Estimate how many days it takes to recover from jet lag based on time zones crossed, travel direction, and personal factors.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["jet lag recovery","time zone adjustment","circadian rhythm recovery","travel fatigue"],
  variants: [{
    id: "standard",
    name: "Jet Lag Recovery Time",
    description: "Estimate how many days it takes to recover from jet lag based on time zones crossed, travel direction, and personal factors.",
    fields: [
      { name: "timeZonesCrossed", label: "Time Zones Crossed", type: "number", min: 1, max: 12, defaultValue: 6 },
      { name: "direction", label: "Travel Direction", type: "select", options: [{ value: "1", label: "Eastbound" }, { value: "2", label: "Westbound" }], defaultValue: "1" },
      { name: "age", label: "Your Age", type: "number", min: 10, max: 100, defaultValue: 35 },
      { name: "sleepQuality", label: "Usual Sleep Quality", type: "select", options: [{ value: "1", label: "Poor" }, { value: "2", label: "Average" }, { value: "3", label: "Good" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const zones = inputs.timeZonesCrossed as number;
    const direction = inputs.direction as string;
    const age = inputs.age as number;
    const sleepQuality = parseInt(inputs.sleepQuality as string);
    const baseDaysPerZone = direction === "1" ? 1.5 : 1.0;
    const baseDays = zones * baseDaysPerZone;
    const ageFactor = age > 50 ? 1.3 : age > 35 ? 1.1 : 1.0;
    const sleepFactor = [1.3, 1.0, 0.8][sleepQuality - 1] || 1.0;
    const recoveryDays = Math.round(baseDays * ageFactor * sleepFactor * 10) / 10;
    const peakSymptomDay = Math.min(Math.round(recoveryDays * 0.3), zones);
    const melatoninStartDay = direction === "1" ? 1 : 0;
    return {
      primary: { label: "Estimated Recovery Time", value: formatNumber(recoveryDays) + " days" },
      details: [
        { label: "Direction", value: direction === "1" ? "Eastbound (harder)" : "Westbound (easier)" },
        { label: "Peak Symptom Day", value: "Day " + formatNumber(peakSymptomDay) },
        { label: "Start Melatonin", value: "Day " + formatNumber(melatoninStartDay) + " at destination" },
        { label: "Age Adjustment", value: ageFactor > 1 ? "+" + formatNumber(Math.round((ageFactor - 1) * 100)) + "%" : "None" }
      ]
    };
  },
  }],
  relatedSlugs: ["jet-lag-calculator","travel-budget-calculator","time-zone-meeting-calculator"],
  faq: [
    { question: "Why is eastbound jet lag worse?", answer: "Traveling east shortens your day, requiring you to fall asleep earlier. The body naturally runs on a cycle slightly longer than 24 hours, making it easier to stay up later (westbound) than to sleep earlier." },
    { question: "How long does jet lag last per time zone?", answer: "A common rule of thumb is 1 day per time zone crossed going east, and about two-thirds of a day per zone going west." },
    { question: "What helps jet lag recovery?", answer: "Sunlight exposure at the right times, melatonin supplements, staying hydrated, avoiding alcohol, and gradually shifting sleep times before departure all help." },
  ],
  formula: "Recovery Days (East) = Zones x 1.5 x Age Factor x Sleep Factor; Recovery Days (West) = Zones x 1.0 x Age Factor x Sleep Factor",
};
