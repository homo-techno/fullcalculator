import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const recoveryTimeCalculator: CalculatorDefinition = {
  slug: "recovery-time-calculator",
  title: "Recovery Time Calculator",
  description:
    "Free recovery time calculator. Estimate post-exercise recovery time based on exercise type, duration, and intensity level.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["recovery time", "exercise recovery", "rest day", "workout recovery"],
  variants: [
    {
      id: "recoveryEstimate",
      name: "Recovery Time Estimate",
      fields: [
        {
          name: "exerciseType",
          label: "Exercise Type",
          type: "select",
          options: [
            { label: "Running", value: "running" },
            { label: "Weight Training", value: "weights" },
            { label: "Cycling", value: "cycling" },
            { label: "Swimming", value: "swimming" },
            { label: "HIIT / CrossFit", value: "hiit" },
          ],
        },
        {
          name: "duration",
          label: "Duration (minutes)",
          type: "number",
          placeholder: "e.g. 60",
        },
        {
          name: "intensity",
          label: "Intensity",
          type: "select",
          options: [
            { label: "Light", value: "light" },
            { label: "Moderate", value: "moderate" },
            { label: "Hard", value: "hard" },
          ],
        },
      ],
      calculate: (inputs) => {
        const exerciseType = inputs.exerciseType as string;
        const duration = inputs.duration as number;
        const intensity = inputs.intensity as string;
        if (!exerciseType || !duration || !intensity) return null;

        // Base recovery multipliers (hours per 30 min of exercise)
        const typeMultipliers: Record<string, number> = {
          running: 8,
          weights: 12,
          cycling: 6,
          swimming: 6,
          hiit: 14,
        };

        const intensityMultipliers: Record<string, number> = {
          light: 0.6,
          moderate: 1.0,
          hard: 1.5,
        };

        const baseRecoveryHours = typeMultipliers[exerciseType] || 8;
        const intMult = intensityMultipliers[intensity] || 1.0;
        const durationFactor = duration / 30;

        const recoveryHours = baseRecoveryHours * intMult * Math.sqrt(durationFactor);
        const recoveryDays = recoveryHours / 24;

        const typeNames: Record<string, string> = {
          running: "Running",
          weights: "Weight Training",
          cycling: "Cycling",
          swimming: "Swimming",
          hiit: "HIIT / CrossFit",
        };

        let recommendation: string;
        if (recoveryHours < 12) {
          recommendation = "Light recovery \u2013 active recovery or light exercise next day is fine";
        } else if (recoveryHours < 24) {
          recommendation = "Moderate recovery \u2013 consider a rest day or light activity";
        } else if (recoveryHours < 48) {
          recommendation = "Full recovery \u2013 rest day recommended before next hard session";
        } else {
          recommendation = "Extended recovery \u2013 allow 2+ rest days for full recovery";
        }

        return {
          primary: {
            label: "Estimated Recovery Time",
            value: recoveryHours < 24
              ? `${formatNumber(recoveryHours, 0)} hours`
              : `${formatNumber(recoveryDays, 1)} days`,
          },
          details: [
            { label: "Exercise", value: typeNames[exerciseType] || exerciseType },
            { label: "Duration", value: `${formatNumber(duration, 0)} minutes` },
            { label: "Intensity", value: intensity.charAt(0).toUpperCase() + intensity.slice(1) },
            { label: "Recommendation", value: recommendation },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["exercise-calorie-calculator", "hydration-calculator"],
  faq: [
    {
      question: "How long does muscle recovery take?",
      answer:
        "Muscle recovery typically takes 24\u201372 hours depending on the exercise type, intensity, and duration. Light exercise may only need 12\u201324 hours, while intense weight training can require 48\u201372 hours.",
    },
    {
      question: "What factors affect recovery time?",
      answer:
        "Key factors include exercise intensity and duration, sleep quality, nutrition, hydration, age, fitness level, and stress levels. Proper nutrition and sleep can significantly reduce recovery time.",
    },
  ],
  formula:
    "Recovery Time = Base recovery hours \u00D7 intensity multiplier \u00D7 \u221A(duration / 30 min). Base hours vary by exercise type.",
};
