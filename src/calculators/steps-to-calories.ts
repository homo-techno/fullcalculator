import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stepsToCaloriesCalculator: CalculatorDefinition = {
  slug: "steps-to-calories-calculator",
  title: "Steps to Calories Calculator",
  description:
    "Free steps to calories burned calculator. Convert your daily step count into calories burned based on your weight, pace, and terrain.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "steps to calories",
    "calories per step",
    "10000 steps calories",
    "step counter calories",
    "walking steps calories burned",
  ],
  variants: [
    {
      id: "calc",
      name: "Steps to Calories",
      description: "Calculate calories burned from step count",
      fields: [
        { name: "steps", label: "Number of Steps", type: "number", placeholder: "e.g. 10000", min: 1 },
        { name: "weight", label: "Body Weight (lbs)", type: "number", placeholder: "e.g. 160" },
        {
          name: "pace",
          label: "Walking Pace",
          type: "select",
          options: [
            { label: "Casual (2 mph)", value: "2.0" },
            { label: "Moderate (3 mph)", value: "3.5" },
            { label: "Brisk (3.5-4 mph)", value: "4.3" },
            { label: "Very Brisk / Jogging (4.5+ mph)", value: "5.0" },
          ],
          defaultValue: "3.5",
        },
        {
          name: "terrain",
          label: "Terrain",
          type: "select",
          options: [
            { label: "Flat (sidewalk, treadmill)", value: "1.0" },
            { label: "Slight Incline", value: "1.1" },
            { label: "Hilly", value: "1.25" },
            { label: "Stairs/Steep", value: "1.5" },
          ],
          defaultValue: "1.0",
        },
      ],
      calculate: (inputs) => {
        const steps = inputs.steps as number;
        const weight = inputs.weight as number;
        const met = parseFloat(inputs.pace as string);
        const terrainMult = parseFloat(inputs.terrain as string);
        if (!steps || !weight) return null;

        const weightKg = weight * 0.453592;

        // Average stride length: ~2.5 feet for an average person
        const strideLength = 2.5; // feet
        const distanceFeet = steps * strideLength;
        const distanceMiles = distanceFeet / 5280;
        const distanceKm = distanceMiles * 1.60934;

        // Estimate duration from pace
        const speedMph = met > 4 ? 4 : met > 3 ? 3 : 2;
        const durationHours = distanceMiles / speedMph;

        // Calories = MET × weight(kg) × duration(hours) × terrain multiplier
        const calories = met * weightKg * durationHours * terrainMult;
        const calPerStep = calories / steps;

        return {
          primary: { label: "Calories Burned", value: formatNumber(calories, 0) },
          details: [
            { label: "Steps", value: formatNumber(steps, 0) },
            { label: "Distance", value: `${formatNumber(distanceMiles, 2)} mi (${formatNumber(distanceKm, 2)} km)` },
            { label: "Est. Duration", value: `${formatNumber(durationHours * 60, 0)} min` },
            { label: "Calories per Step", value: formatNumber(calPerStep, 3) },
            { label: "Calories per Mile", value: formatNumber(calories / distanceMiles, 0) },
            { label: "MET Value", value: formatNumber(met * terrainMult, 1) },
          ],
          note: "Calculations use average stride length (2.5 ft). Actual calorie burn varies based on individual stride, fitness level, and walking efficiency.",
        };
      },
    },
  ],
  relatedSlugs: ["steps-miles-calculator", "walking-calorie-calculator", "calorie-calculator"],
  faq: [
    {
      question: "How many calories does 10,000 steps burn?",
      answer:
        "For a 160-lb person walking at moderate pace on flat ground, 10,000 steps burns approximately 400-500 calories. The exact amount depends on weight, speed, stride length, and terrain. Heavier individuals burn more calories per step.",
    },
    {
      question: "How many steps to burn 500 calories?",
      answer:
        "For a 160-lb person at moderate pace, approximately 10,000-12,000 steps burns about 500 calories. To be more precise, a lighter person (130 lbs) may need 13,000-14,000 steps, while a heavier person (200 lbs) may only need 8,000-9,000 steps.",
    },
    {
      question: "Does walking speed affect calories burned?",
      answer:
        "Yes. Walking at a brisk pace (3.5-4 mph) burns 40-50% more calories per mile than a slow pace (2 mph). However, you cover the same distance in less time, so the calories per mile difference is more modest than the calories per hour difference.",
    },
  ],
  formula: "Calories = MET × Weight (kg) × Duration (hours) × Terrain Multiplier | Distance = Steps × Stride Length",
};
