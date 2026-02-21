import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const targetHeartRateCalculator: CalculatorDefinition = {
  slug: "target-heart-rate-calculator",
  title: "Target Heart Rate Calculator",
  description: "Free target heart rate calculator. Calculate your target heart rate zones for exercise using the Karvonen formula.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["target heart rate calculator", "heart rate zone calculator", "exercise heart rate", "karvonen formula", "fat burning zone"],
  variants: [
    {
      id: "zones",
      name: "Heart Rate Training Zones",
      fields: [
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 30" },
        { name: "rhr", label: "Resting Heart Rate (optional)", type: "number", placeholder: "e.g. 65", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number, rhr = (inputs.rhr as number) || 0;
        if (!age) return null;
        const mhr = 220 - age;
        const hrr = mhr - rhr;
        const zone = (pct: number) => rhr ? Math.round(hrr * pct + rhr) : Math.round(mhr * pct);
        const zones = [
          { name: "Zone 1 — Warm-up (50-60%)", low: zone(0.5), high: zone(0.6) },
          { name: "Zone 2 — Fat Burn (60-70%)", low: zone(0.6), high: zone(0.7) },
          { name: "Zone 3 — Aerobic (70-80%)", low: zone(0.7), high: zone(0.8) },
          { name: "Zone 4 — Anaerobic (80-90%)", low: zone(0.8), high: zone(0.9) },
          { name: "Zone 5 — Maximum (90-100%)", low: zone(0.9), high: mhr },
        ];
        return {
          primary: { label: "Max Heart Rate", value: `${mhr} bpm` },
          details: [
            ...(rhr ? [{ label: "Heart Rate Reserve", value: `${hrr} bpm` }] : []),
            ...zones.map(z => ({ label: z.name, value: `${z.low}–${z.high} bpm` })),
            { label: "Method", value: rhr ? "Karvonen (HRR)" : "Standard (%MHR)" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["heart-rate-calculator", "bmi-calculator", "calorie-calculator"],
  faq: [{ question: "What is target heart rate?", answer: "Target heart rate is the ideal range for exercise intensity. The simple formula: MHR = 220 - age. For fat burning, aim for 60-70% of MHR. For cardio fitness, 70-80%. The Karvonen method is more accurate and uses resting heart rate: THR = (MHR - RHR) × %intensity + RHR." }],
  formula: "MHR = 220 - age | Karvonen: THR = (MHR - RHR) × % + RHR",
};
