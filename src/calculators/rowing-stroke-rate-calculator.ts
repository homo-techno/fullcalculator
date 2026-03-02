import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rowingStrokeRateCalculator: CalculatorDefinition = {
  slug: "rowing-stroke-rate-calculator",
  title: "Rowing Stroke Rate Calculator",
  description: "Calculate rowing metrics including stroke rate, split time, power output, and calories burned.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["rowing stroke rate","rowing pace","rowing split","erg calculator"],
  variants: [{
    id: "standard",
    name: "Rowing Stroke Rate",
    description: "Calculate rowing metrics including stroke rate, split time, power output, and calories burned.",
    fields: [
      { name: "distance", label: "Distance (meters)", type: "number", min: 100, max: 42195, defaultValue: 2000 },
      { name: "minutes", label: "Time Minutes", type: "number", min: 0, max: 120, defaultValue: 7 },
      { name: "seconds", label: "Time Seconds", type: "number", min: 0, max: 59, defaultValue: 30 },
      { name: "weight", label: "Body Weight (lbs)", type: "number", min: 80, max: 350, defaultValue: 175 },
    ],
    calculate: (inputs) => {
    const distance = inputs.distance as number;
    const minutes = inputs.minutes as number;
    const seconds = inputs.seconds as number;
    const weight = inputs.weight as number;
    const totalSeconds = minutes * 60 + seconds;
    const splitSeconds = (totalSeconds / distance) * 500;
    const splitMin = Math.floor(splitSeconds / 60);
    const splitSec = Math.round(splitSeconds % 60);
    const pace = distance / totalSeconds;
    const watts = 2.8 / Math.pow(splitSeconds / 500, 3) * 1000;
    const calPerHour = Math.round((watts * 4 + 0.35 * weight * 0.453592) * 0.86);
    const totalCal = Math.round(calPerHour * (totalSeconds / 3600));
    const strokeRate = Math.round(distance / (totalSeconds / 60) / 10);
    return {
      primary: { label: "500m Split", value: formatNumber(splitMin) + ":" + (splitSec < 10 ? "0" : "") + formatNumber(splitSec) },
      details: [
        { label: "Estimated Watts", value: formatNumber(Math.round(watts)) },
        { label: "Estimated Stroke Rate", value: formatNumber(strokeRate) + " spm" },
        { label: "Calories Burned", value: formatNumber(totalCal) + " cal" }
      ]
    };
  },
  }],
  relatedSlugs: ["swim-pace-calculator","triathlon-transition-time-calculator"],
  faq: [
    { question: "What is a good 2K rowing time?", answer: "For men, sub-7:00 is competitive and sub-6:20 is elite. For women, sub-8:00 is competitive and sub-7:10 is elite." },
    { question: "What stroke rate should I row at?", answer: "Steady-state rows are typically 18 to 22 strokes per minute. Race pace is 28 to 36 strokes per minute." },
    { question: "How many calories does rowing burn?", answer: "Rowing burns approximately 400 to 800 calories per hour depending on intensity and body weight." },
  ],
  formula: "Split = (Total Time / Distance) x 500; Watts = 2.8 / (Split/500)^3 x 1000",
};
