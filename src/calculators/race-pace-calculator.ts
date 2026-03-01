import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const racePaceCalculator: CalculatorDefinition = {
  slug: "race-pace-calculator",
  title: "Race Pace Calculator",
  description: "Calculate your target pace per mile or kilometer for any running race distance.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["race pace", "running pace", "marathon pace", "target pace"],
  variants: [{
    id: "standard",
    name: "Race Pace",
    description: "Calculate your target pace per mile or kilometer for any running race distance",
    fields: [
      { name: "distance", label: "Race Distance", type: "select", options: [{value:"5",label:"5K"},{value:"10",label:"10K"},{value:"21.1",label:"Half Marathon"},{value:"42.2",label:"Marathon"}], defaultValue: "5" },
      { name: "hours", label: "Target Hours", type: "number", min: 0, max: 12, defaultValue: 0 },
      { name: "minutes", label: "Target Minutes", type: "number", min: 0, max: 59, defaultValue: 25 },
      { name: "seconds", label: "Target Seconds", type: "number", min: 0, max: 59, defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const dist = parseFloat(inputs.distance as string);
      const hrs = inputs.hours as number;
      const mins = inputs.minutes as number;
      const secs = inputs.seconds as number;
      const totalSec = (hrs || 0) * 3600 + (mins || 0) * 60 + (secs || 0);
      if (!dist || totalSec <= 0) return null;
      const paceSecPerKm = totalSec / dist;
      const paceSecPerMi = totalSec / (dist / 1.60934);
      const kmMin = Math.floor(paceSecPerKm / 60);
      const kmSec = Math.round(paceSecPerKm % 60);
      const miMin = Math.floor(paceSecPerMi / 60);
      const miSec = Math.round(paceSecPerMi % 60);
      const speed = (dist / (totalSec / 3600)).toFixed(1);
      return {
        primary: { label: "Pace per Mile", value: miMin + ":" + String(miSec).padStart(2, "0") + " /mi" },
        details: [
          { label: "Pace per Kilometer", value: kmMin + ":" + String(kmSec).padStart(2, "0") + " /km" },
          { label: "Average Speed", value: speed + " km/h" },
          { label: "Total Time", value: (hrs || 0) + "h " + (mins || 0) + "m " + (secs || 0) + "s" },
        ],
      };
    },
  }],
  relatedSlugs: ["bench-press-strength-calculator", "rowing-split-calculator"],
  faq: [
    { question: "What is a good race pace for a 5K?", answer: "A good 5K pace varies by fitness level. Beginners often target 10-12 minutes per mile while competitive runners aim for 6-7 minutes per mile." },
    { question: "How do I calculate my race pace?", answer: "Divide your total target time in minutes by the race distance in miles or kilometers to get your pace per unit of distance." },
  ],
  formula: "Pace = Total Time / Race Distance",
};
