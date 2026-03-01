import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dailyStepGoalCalculator: CalculatorDefinition = {
  slug: "daily-step-goal-calculator",
  title: "Daily Step Goal Calculator",
  description: "Calculate calories burned from daily steps walked",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["daily steps","step counter calories","walking calories"],
  variants: [{
    id: "standard",
    name: "Daily Step Goal",
    description: "Calculate calories burned from daily steps walked",
    fields: [
      { name: "steps", label: "Daily Steps", type: "number", defaultValue: 10000, min: 0, max: 50000, step: 500 },
      { name: "weight", label: "Body Weight (lbs)", type: "number", defaultValue: 170, min: 50, max: 400, step: 1 },
      { name: "strideLength", label: "Stride Length (inches)", type: "number", defaultValue: 30, min: 20, max: 40, step: 1 },
      { name: "calorieGoal", label: "Daily Calorie Burn Goal", type: "number", defaultValue: 400, min: 100, max: 2000, step: 50 },
    ],
    calculate: (inputs: Record<string, string | number>) => {
      const steps = inputs.steps as number || 10000;
      const weight = inputs.weight as number || 170;
      const stride = inputs.strideLength as number || 30;
      const calGoal = inputs.calorieGoal as number || 400;
      const distanceMiles = (steps * stride) / 63360;
      const caloriesBurned = Math.round(distanceMiles * weight * 0.57);
      const stepsNeeded = calGoal > 0 ? Math.round((calGoal / (weight * 0.57)) * 63360 / stride) : 0;
      const minutesWalking = Math.round(steps / 100);
      return {
        primary: { label: "Calories Burned", value: formatNumber(caloriesBurned) + " cal" },
        details: [
          { label: "Distance Walked", value: formatNumber(Math.round(distanceMiles * 100) / 100) + " miles" },
          { label: "Walking Time", value: minutesWalking + " minutes" },
          { label: "Steps for Calorie Goal", value: formatNumber(stepsNeeded) },
          { label: "Calories Per 1000 Steps", value: formatNumber(Math.round(caloriesBurned / steps * 1000)) }
        ]
      };
    },
  }],
  relatedSlugs: ["calorie-deficit-calculator"],
  faq: [
    { question: "How many steps should I walk daily?", answer: "10000 steps per day is a popular goal. Studies show health benefits start at around 7000 steps." },
    { question: "How many calories does walking burn?", answer: "Walking burns roughly 0.04-0.06 calories per step depending on body weight and walking speed." },
  ],
  formula: "Calories = Distance(miles) x Weight(lbs) x 0.57. Distance = Steps x Stride / 63360.",
};
