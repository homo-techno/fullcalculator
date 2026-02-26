import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const swimmingCalorieCalculator: CalculatorDefinition = {
  slug: "swimming-calorie",
  title: "Swimming Calorie Burn Calculator",
  description: "Free online swimming calorie burn calculator. Estimate how many calories you burn swimming based on stroke type, intensity, duration, and body weight.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["swimming calories", "calories burned swimming", "pool workout calories", "lap swimming", "swim workout"],
  variants: [
    {
      id: "swimming-calories",
      name: "Swimming Calories Burned",
      fields: [
        { name: "weight", label: "Body Weight (lbs)", type: "number", placeholder: "e.g. 170" },
        { name: "duration", label: "Duration (minutes)", type: "number", placeholder: "e.g. 45" },
        {
          name: "stroke",
          label: "Stroke Type",
          type: "select",
          options: [
            { label: "Freestyle (moderate)", value: "5.8" },
            { label: "Freestyle (vigorous)", value: "9.8" },
            { label: "Backstroke", value: "4.8" },
            { label: "Breaststroke", value: "5.3" },
            { label: "Butterfly", value: "13.8" },
            { label: "Treading Water (moderate)", value: "3.5" },
            { label: "Leisure / General", value: "3.5" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string) || 0;
        const duration = parseFloat(inputs.duration as string) || 0;
        const met = parseFloat(inputs.stroke as string) || 5.8;

        const weightKg = weight * 0.453592;
        const durationHours = duration / 60;

        const calories = met * weightKg * durationHours;
        const calPerMinute = duration > 0 ? calories / duration : 0;
        const calPerHour = met * weightKg;

        const lapsEstimate = (duration / 2) * (met > 8 ? 1.5 : met > 5 ? 1.2 : 0.8);

        return {
          primary: { label: "Calories Burned", value: formatNumber(Math.round(calories)) },
          details: [
            { label: "Duration (min)", value: formatNumber(duration) },
            { label: "MET Value", value: formatNumber(met) },
            { label: "Calories per Minute", value: formatNumber(calPerMinute) },
            { label: "Calories per Hour", value: formatNumber(Math.round(calPerHour)) },
            { label: "Est. Laps (25m pool)", value: formatNumber(Math.round(lapsEstimate)) },
            { label: "Weight (lbs)", value: formatNumber(weight) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cycling-calories", "hiking-calories", "jump-rope-calories", "steps-to-calories"],
  faq: [
    {
      question: "How many calories does swimming burn per hour?",
      answer: "Swimming burns 400-700 calories per hour for a 170-pound person depending on the stroke and intensity. Butterfly is the most calorie-intensive stroke (up to 900 cal/hr), while leisurely swimming burns about 250-350 cal/hr.",
    },
    {
      question: "Which swimming stroke burns the most calories?",
      answer: "Butterfly burns the most calories (MET 13.8), followed by vigorous freestyle (MET 9.8), breaststroke (MET 5.3), backstroke (MET 4.8), and moderate freestyle (MET 5.8). However, most people cannot sustain butterfly for long periods.",
    },
    {
      question: "Is swimming a good exercise for weight loss?",
      answer: "Yes. Swimming is an excellent low-impact full-body workout that burns significant calories while being easy on joints. It builds cardiovascular fitness and muscle endurance. The water resistance provides a natural form of strength training.",
    },
  ],
  formula: "Calories = MET x Weight(kg) x Duration(hours); MET values vary by stroke: Butterfly=13.8, Freestyle(vigorous)=9.8, Freestyle(moderate)=5.8, Breaststroke=5.3, Backstroke=4.8",
};
