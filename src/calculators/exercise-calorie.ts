import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const exerciseCalorieCalculator: CalculatorDefinition = {
  slug: "exercise-calorie-calculator",
  title: "Exercise Calorie Calculator",
  description:
    "Free exercise calorie calculator. Estimate calories burned during walking, running, cycling, and swimming using MET values.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["exercise calories", "calories burned", "MET", "workout calorie calculator"],
  variants: [
    {
      id: "exerciseCalories",
      name: "Calories Burned by Activity",
      fields: [
        {
          name: "activity",
          label: "Activity",
          type: "select",
          options: [
            { label: "Walking (MET 3.5)", value: "3.5" },
            { label: "Running (MET 8.0)", value: "8" },
            { label: "Cycling (MET 6.0)", value: "6" },
            { label: "Swimming (MET 7.0)", value: "7" },
          ],
        },
        {
          name: "weight",
          label: "Body Weight (kg)",
          type: "number",
          placeholder: "e.g. 70",
        },
        {
          name: "duration",
          label: "Duration (minutes)",
          type: "number",
          placeholder: "e.g. 30",
        },
      ],
      calculate: (inputs) => {
        const met = parseFloat(inputs.activity as string);
        const weight = inputs.weight as number;
        const duration = inputs.duration as number;
        if (!met || !weight || !duration) return null;

        const durationHours = duration / 60;
        const caloriesBurned = met * weight * durationHours;

        const activityNames: Record<string, string> = {
          "3.5": "Walking",
          "8": "Running",
          "6": "Cycling",
          "7": "Swimming",
        };

        return {
          primary: {
            label: "Calories Burned",
            value: `${formatNumber(caloriesBurned, 0)} kcal`,
          },
          details: [
            { label: "Activity", value: activityNames[String(met)] || "Unknown" },
            { label: "MET Value", value: `${formatNumber(met, 1)}` },
            { label: "Duration", value: `${formatNumber(duration, 0)} minutes` },
            { label: "Body Weight", value: `${formatNumber(weight, 1)} kg` },
            { label: "Calories per Hour", value: `${formatNumber(met * weight, 0)} kcal/hr` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["hydration-calculator", "heart-rate-reserve-calculator"],
  faq: [
    {
      question: "What is a MET value?",
      answer:
        "MET (Metabolic Equivalent of Task) represents the energy cost of an activity. 1 MET equals the energy spent sitting at rest. Walking is about 3.5 METs, running about 8 METs.",
    },
    {
      question: "How are exercise calories calculated?",
      answer:
        "Calories burned = MET value \u00D7 body weight (kg) \u00D7 duration (hours). This provides an estimate of total energy expenditure during the activity.",
    },
  ],
  formula: "Calories Burned = MET \u00D7 Weight (kg) \u00D7 Duration (hours)",
};
