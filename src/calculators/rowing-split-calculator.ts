import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rowingSplitCalculator: CalculatorDefinition = {
  slug: "rowing-split-calculator",
  title: "Rowing Split Calculator",
  description: "Estimate your rowing ergometer split time based on target distance, watts, or total workout time.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["rowing split", "erg split time", "rowing pace"],
  variants: [{
    id: "standard",
    name: "Rowing Split",
    description: "Estimate your rowing ergometer split time based on target distance, watts, or total workout time",
    fields: [
      { name: "distance", label: "Total Distance", type: "number", suffix: "meters", min: 100, max: 50000, defaultValue: 2000 },
      { name: "minutes", label: "Target Minutes", type: "number", min: 0, max: 120, defaultValue: 7 },
      { name: "seconds", label: "Target Seconds", type: "number", min: 0, max: 59, defaultValue: 30 },
      { name: "weight", label: "Rower Weight", type: "number", suffix: "lbs", min: 80, max: 400, defaultValue: 180 },
    ],
    calculate: (inputs) => {
      const dist = inputs.distance as number;
      const mins = inputs.minutes as number;
      const secs = inputs.seconds as number;
      const weight = inputs.weight as number;
      const totalSec = (mins || 0) * 60 + (secs || 0);
      if (!dist || totalSec <= 0) return null;
      const splitSec = (totalSec / dist) * 500;
      const splitMin = Math.floor(splitSec / 60);
      const splitRemSec = Math.round(splitSec % 60);
      const pace = dist / totalSec;
      const watts = Math.round(2.8 / Math.pow(splitSec / 500, 3));
      const calPerHour = Math.round(watts * 3.6 * (weight / 180) * 0.86);
      return {
        primary: { label: "Split per 500m", value: splitMin + ":" + String(splitRemSec).padStart(2, "0") },
        details: [
          { label: "Estimated Watts", value: formatNumber(watts) + " W" },
          { label: "Speed", value: pace.toFixed(2) + " m/s" },
          { label: "Est. Calories per Hour", value: formatNumber(calPerHour) },
        ],
      };
    },
  }],
  relatedSlugs: ["race-pace-calculator", "bench-press-strength-calculator"],
  faq: [
    { question: "What is a good 2K rowing split?", answer: "A competitive male rower targets a split under 1:45 per 500m. Recreational rowers typically see splits between 2:00 and 2:30." },
    { question: "How are rowing watts calculated?", answer: "Watts on a rowing ergometer are derived from the formula: Watts = 2.8 / (split per 500m in seconds) cubed." },
  ],
  formula: "Split (per 500m) = (Total Time / Distance) x 500",
};
