import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const heartRateCalculator: CalculatorDefinition = {
  slug: "heart-rate-calculator",
  title: "Heart Rate Zone Calculator",
  description: "Free heart rate zone calculator. Find your target heart rate zones for fat burn, cardio, and peak performance based on age and resting heart rate.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["heart rate calculator", "heart rate zone calculator", "target heart rate", "max heart rate calculator", "fat burning zone"],
  variants: [
    {
      id: "zones",
      name: "Heart Rate Training Zones",
      description: "Calculate your 5 training zones using the Karvonen method",
      fields: [
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 30", min: 10, max: 100 },
        { name: "restingHR", label: "Resting Heart Rate (bpm)", type: "number", placeholder: "e.g. 65", min: 30, max: 120 },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const rhr = (inputs.restingHR as number) || 70;
        if (!age) return null;

        const maxHR = 220 - age;
        const hrReserve = maxHR - rhr;

        const zone = (low: number, high: number) => ({
          low: Math.round(hrReserve * low + rhr),
          high: Math.round(hrReserve * high + rhr),
        });

        const z1 = zone(0.50, 0.60);
        const z2 = zone(0.60, 0.70);
        const z3 = zone(0.70, 0.80);
        const z4 = zone(0.80, 0.90);
        const z5 = zone(0.90, 1.0);

        return {
          primary: { label: "Max Heart Rate", value: `${maxHR} bpm` },
          details: [
            { label: "Zone 1 (Warm Up, 50-60%)", value: `${z1.low}-${z1.high} bpm` },
            { label: "Zone 2 (Fat Burn, 60-70%)", value: `${z2.low}-${z2.high} bpm` },
            { label: "Zone 3 (Cardio, 70-80%)", value: `${z3.low}-${z3.high} bpm` },
            { label: "Zone 4 (Hard, 80-90%)", value: `${z4.low}-${z4.high} bpm` },
            { label: "Zone 5 (Max, 90-100%)", value: `${z5.low}-${z5.high} bpm` },
            { label: "Heart rate reserve", value: `${hrReserve} bpm` },
          ],
          note: "Uses the Karvonen method (% of heart rate reserve + resting HR). Max HR estimated as 220 - age. For more accuracy, use a measured max HR from a stress test.",
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "bmi-calculator", "pace-calculator"],
  faq: [
    { question: "What is the fat burning heart rate zone?", answer: "Zone 2 (60-70% of max HR) burns the highest percentage of calories from fat. However, higher intensity zones burn more total calories. For weight loss, total calorie burn matters more than the percentage from fat." },
    { question: "How do I measure resting heart rate?", answer: "Measure first thing in the morning before getting out of bed. Count your pulse for 60 seconds, or for 15 seconds and multiply by 4. Average over 3-5 days for accuracy. Normal resting HR is 60-100 bpm; fit athletes may be 40-60." },
  ],
  formula: "Max HR = 220 - Age | Target HR = (Max HR - Resting HR) × %Intensity + Resting HR",
};
