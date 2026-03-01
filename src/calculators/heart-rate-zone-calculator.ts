import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const heartRateZoneCalculator: CalculatorDefinition = {
  slug: "heart-rate-zone-calculator",
  title: "Heart Rate Zone Calculator",
  description: "Calculate training heart rate zones based on your max heart rate",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["heart rate zones","training zones","heart rate training"],
  variants: [{
    id: "standard",
    name: "Heart Rate Zone",
    description: "Calculate training heart rate zones based on your max heart rate",
    fields: [
      { name: "age", label: "Age", type: "number", defaultValue: 30, min: 15, max: 80, step: 1 },
      { name: "restingHR", label: "Resting Heart Rate (bpm)", type: "number", defaultValue: 65, min: 30, max: 120, step: 1 },
      { name: "maxHR", label: "Max Heart Rate (bpm, 0=estimate)", type: "number", defaultValue: 0, min: 0, max: 220, step: 1 },
    ],
    calculate: (inputs: Record<string, string | number>) => {
      const age = inputs.age as number || 30;
      const rhr = inputs.restingHR as number || 65;
      let mhr = inputs.maxHR as number || 0;
      if (mhr === 0) mhr = 220 - age;
      const hrr = mhr - rhr;
      const zone1Low = Math.round(rhr + hrr * 0.50);
      const zone1High = Math.round(rhr + hrr * 0.60);
      const zone2Low = Math.round(rhr + hrr * 0.60);
      const zone2High = Math.round(rhr + hrr * 0.70);
      const zone3Low = Math.round(rhr + hrr * 0.70);
      const zone3High = Math.round(rhr + hrr * 0.80);
      const zone4Low = Math.round(rhr + hrr * 0.80);
      const zone4High = Math.round(rhr + hrr * 0.90);
      const zone5Low = Math.round(rhr + hrr * 0.90);
      return {
        primary: { label: "Max Heart Rate", value: mhr + " bpm" },
        details: [
          { label: "Zone 1 (Warm-up)", value: zone1Low + "-" + zone1High + " bpm" },
          { label: "Zone 2 (Fat Burn)", value: zone2Low + "-" + zone2High + " bpm" },
          { label: "Zone 3 (Cardio)", value: zone3Low + "-" + zone3High + " bpm" },
          { label: "Zone 4 (Threshold)", value: zone4Low + "-" + zone4High + " bpm" }
        ]
      };
    },
  }],
  relatedSlugs: ["vo2-max-calculator"],
  faq: [
    { question: "How are heart rate zones calculated?", answer: "Zones use the Karvonen method based on heart rate reserve (max HR minus resting HR)." },
    { question: "Which zone is best for fat burning?", answer: "Zone 2 (60-70% intensity) is optimal for fat burning during longer duration exercise." },
  ],
  formula: "Zone HR = Resting HR + (Max HR - Resting HR) x Zone Percentage",
};
