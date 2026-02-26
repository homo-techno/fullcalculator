import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const heartRateZoneCalculator: CalculatorDefinition = {
  slug: "heart-rate-zone",
  title: "Heart Rate Training Zone Calculator",
  description: "Free online heart rate training zone calculator. Find your five heart rate zones for optimal training based on your age and resting heart rate.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["heart rate zones", "training zones", "heart rate calculator", "cardio zones", "karvonen formula", "target heart rate"],
  variants: [
    {
      id: "hr-zones",
      name: "Calculate Heart Rate Zones",
      fields: [
        { name: "age", label: "Age (years)", type: "number", placeholder: "e.g. 30" },
        { name: "restingHR", label: "Resting Heart Rate (bpm)", type: "number", placeholder: "e.g. 65" },
        {
          name: "method",
          label: "Calculation Method",
          type: "select",
          options: [
            { label: "Karvonen (uses resting HR)", value: "karvonen" },
            { label: "Percentage of Max HR", value: "percentage" },
          ],
        },
      ],
      calculate: (inputs) => {
        const age = parseFloat(inputs.age as string) || 0;
        const restingHR = parseFloat(inputs.restingHR as string) || 60;
        const method = inputs.method as string;

        const maxHR = 220 - age;
        const hrReserve = maxHR - restingHR;

        const zones = [
          { name: "Zone 1 - Recovery", low: 0.5, high: 0.6 },
          { name: "Zone 2 - Aerobic Base", low: 0.6, high: 0.7 },
          { name: "Zone 3 - Tempo", low: 0.7, high: 0.8 },
          { name: "Zone 4 - Threshold", low: 0.8, high: 0.9 },
          { name: "Zone 5 - VO2 Max", low: 0.9, high: 1.0 },
        ];

        const details = zones.map((zone) => {
          let low: number;
          let high: number;
          if (method === "karvonen") {
            low = Math.round(hrReserve * zone.low + restingHR);
            high = Math.round(hrReserve * zone.high + restingHR);
          } else {
            low = Math.round(maxHR * zone.low);
            high = Math.round(maxHR * zone.high);
          }
          return { label: zone.name, value: `${formatNumber(low)} - ${formatNumber(high)} bpm` };
        });

        return {
          primary: { label: "Max Heart Rate", value: `${formatNumber(maxHR)} bpm` },
          details: [
            { label: "Resting Heart Rate", value: `${formatNumber(restingHR)} bpm` },
            { label: "Heart Rate Reserve", value: `${formatNumber(hrReserve)} bpm` },
            ...details,
          ],
        };
      },
    },
  ],
  relatedSlugs: ["max-heart-rate", "fat-burning-zone", "cycling-calories"],
  faq: [
    {
      question: "What are the five heart rate training zones?",
      answer: "Zone 1 (50-60% MHR) is recovery, Zone 2 (60-70%) builds aerobic base, Zone 3 (70-80%) is tempo/endurance, Zone 4 (80-90%) is anaerobic threshold, and Zone 5 (90-100%) is VO2 max for peak performance.",
    },
    {
      question: "What is the Karvonen formula?",
      answer: "The Karvonen formula calculates target heart rate using heart rate reserve: Target HR = (HR Reserve x Intensity%) + Resting HR. It is more personalized than simple percentage of max HR because it accounts for your fitness level via resting heart rate.",
    },
    {
      question: "Which heart rate zone is best for fat burning?",
      answer: "Zone 2 (60-70% of max HR) is often called the fat-burning zone because a higher percentage of calories come from fat. However, higher-intensity zones burn more total calories, which can be more effective for overall fat loss.",
    },
  ],
  formula: "Max HR = 220 - Age; Karvonen: Target HR = (HR Reserve x Intensity%) + Resting HR; HR Reserve = Max HR - Resting HR",
};
