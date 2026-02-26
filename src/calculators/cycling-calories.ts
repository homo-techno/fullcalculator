import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cyclingCaloriesCalculator: CalculatorDefinition = {
  slug: "cycling-calories",
  title: "Cycling Calorie Burn Calculator",
  description: "Free online cycling calorie burn calculator. Estimate how many calories you burn while biking based on speed, duration, and body weight.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["cycling calories", "biking calories", "calories burned cycling", "bike ride calories", "bicycle workout"],
  variants: [
    {
      id: "cycling-calories",
      name: "Cycling Calories Burned",
      fields: [
        { name: "weight", label: "Body Weight (lbs)", type: "number", placeholder: "e.g. 170" },
        { name: "duration", label: "Duration (minutes)", type: "number", placeholder: "e.g. 60" },
        {
          name: "intensity",
          label: "Cycling Intensity / Speed",
          type: "select",
          options: [
            { label: "Leisure (< 10 mph)", value: "4.0" },
            { label: "Light Effort (10-12 mph)", value: "6.8" },
            { label: "Moderate (12-14 mph)", value: "8.0" },
            { label: "Vigorous (14-16 mph)", value: "10.0" },
            { label: "Race (16-19 mph)", value: "12.0" },
            { label: "Elite (> 20 mph)", value: "15.8" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string) || 0;
        const duration = parseFloat(inputs.duration as string) || 0;
        const met = parseFloat(inputs.intensity as string) || 8.0;

        const weightKg = weight * 0.453592;
        const durationHours = duration / 60;

        const calories = met * weightKg * durationHours;
        const calPerMinute = duration > 0 ? calories / duration : 0;
        const calPerHour = met * weightKg;

        const speedEstimate: Record<string, number> = {
          "4.0": 8, "6.8": 11, "8.0": 13, "10.0": 15, "12.0": 17.5, "15.8": 21,
        };
        const speed = speedEstimate[met.toString()] || 13;
        const distanceMiles = speed * durationHours;

        return {
          primary: { label: "Calories Burned", value: formatNumber(Math.round(calories)) },
          details: [
            { label: "Duration (min)", value: formatNumber(duration) },
            { label: "MET Value", value: formatNumber(met) },
            { label: "Calories per Minute", value: formatNumber(calPerMinute) },
            { label: "Calories per Hour", value: formatNumber(Math.round(calPerHour)) },
            { label: "Est. Distance (miles)", value: formatNumber(distanceMiles) },
            { label: "Est. Speed (mph)", value: formatNumber(speed) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["hiking-calories", "steps-to-calories", "swimming-calorie", "jump-rope-calories"],
  faq: [
    {
      question: "How many calories does cycling burn per hour?",
      answer: "Cycling burns 400-1,000 calories per hour depending on speed and body weight. A 170-pound person burns about 500-600 calories per hour at a moderate pace of 12-14 mph.",
    },
    {
      question: "Does cycling burn more calories than walking?",
      answer: "At moderate intensities, cycling burns more calories per hour than walking. However, cycling is lower impact, so many people can sustain it longer. A 30-minute bike ride at 12-14 mph typically burns as much as a 60-minute brisk walk.",
    },
    {
      question: "How does cycling intensity affect calorie burn?",
      answer: "Calorie burn increases significantly with speed. Riding at 14-16 mph burns about 25-50% more calories than riding at 10-12 mph. Wind resistance and hills also increase the effort required.",
    },
  ],
  formula: "Calories = MET x Weight(kg) x Duration(hours); MET values range from 4.0 (leisure) to 15.8 (elite racing)",
};
