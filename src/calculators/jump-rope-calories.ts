import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const jumpRopeCaloriesCalculator: CalculatorDefinition = {
  slug: "jump-rope-calories",
  title: "Jump Rope Calories Calculator",
  description: "Free online jump rope calories burned calculator. Estimate how many calories you burn during a jump rope workout based on duration, intensity, and body weight.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["jump rope calories", "skipping rope", "calories burned jumping rope", "jump rope workout", "cardio calories"],
  variants: [
    {
      id: "jump-rope",
      name: "Jump Rope Calories Burned",
      fields: [
        { name: "weight", label: "Body Weight (lbs)", type: "number", placeholder: "e.g. 160" },
        { name: "duration", label: "Duration (minutes)", type: "number", placeholder: "e.g. 30" },
        {
          name: "intensity",
          label: "Intensity",
          type: "select",
          options: [
            { label: "Slow (< 100 jumps/min)", value: "8.8" },
            { label: "Moderate (100-120 jumps/min)", value: "11.8" },
            { label: "Fast (120-160 jumps/min)", value: "12.3" },
            { label: "Very Fast / Double Unders", value: "14.0" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string) || 0;
        const duration = parseFloat(inputs.duration as string) || 0;
        const met = parseFloat(inputs.intensity as string) || 11.8;

        const weightKg = weight * 0.453592;
        const durationHours = duration / 60;
        const calories = met * weightKg * durationHours;
        const calPerMinute = duration > 0 ? calories / duration : 0;
        const equivalentRunMiles = calories / (weightKg * 1.036);

        return {
          primary: { label: "Calories Burned", value: formatNumber(Math.round(calories)) },
          details: [
            { label: "Duration (min)", value: formatNumber(duration) },
            { label: "MET Value", value: formatNumber(met) },
            { label: "Calories per Minute", value: formatNumber(calPerMinute) },
            { label: "Equivalent Running (miles)", value: formatNumber(equivalentRunMiles) },
            { label: "Weight (lbs)", value: formatNumber(weight) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["steps-to-calories", "cycling-calories", "hiking-calories", "swimming-calorie"],
  faq: [
    {
      question: "How many calories does jump rope burn per minute?",
      answer: "Jump rope burns approximately 10-16 calories per minute depending on your weight and intensity. A 160-pound person burns about 12-13 calories per minute at a moderate pace, making it one of the most efficient cardio exercises.",
    },
    {
      question: "Is jump rope better than running for burning calories?",
      answer: "Jump rope generally burns slightly more calories per minute than running at a moderate pace. Ten minutes of jump rope is roughly equivalent to running an 8-minute mile. However, jump rope is harder to sustain for long periods.",
    },
    {
      question: "How long should I jump rope for a good workout?",
      answer: "For beginners, start with 5-10 minutes and gradually increase. A 15-20 minute session is an excellent cardio workout. Advanced users can aim for 30 minutes or incorporate intervals with rest periods.",
    },
  ],
  formula: "Calories = MET x Weight(kg) x Duration(hours); MET values: Slow=8.8, Moderate=11.8, Fast=12.3, Very Fast=14.0",
};
