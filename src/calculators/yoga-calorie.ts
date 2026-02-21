import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const yogaCalorieCalculator: CalculatorDefinition = {
  slug: "yoga-calorie-calculator",
  title: "Yoga Calorie Calculator",
  description:
    "Free yoga calorie burn calculator. Estimate how many calories you burn during different types of yoga sessions based on style, duration, and body weight.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "yoga calorie calculator",
    "calories burned yoga",
    "hot yoga calories",
    "vinyasa yoga calories",
    "yoga calorie burn",
  ],
  variants: [
    {
      id: "calc",
      name: "Yoga Calorie Burn",
      description: "Estimate calories burned during a yoga session",
      fields: [
        { name: "weight", label: "Body Weight (lbs)", type: "number", placeholder: "e.g. 150" },
        { name: "duration", label: "Duration (minutes)", type: "number", placeholder: "e.g. 60", min: 1 },
        {
          name: "style",
          label: "Yoga Style",
          type: "select",
          options: [
            { label: "Hatha (gentle, restorative)", value: "2.5" },
            { label: "Yin / Restorative", value: "2.0" },
            { label: "Iyengar (alignment-focused)", value: "3.0" },
            { label: "Vinyasa / Flow", value: "4.0" },
            { label: "Ashtanga (primary series)", value: "5.0" },
            { label: "Power Yoga", value: "5.5" },
            { label: "Hot Yoga / Bikram", value: "5.0" },
            { label: "Kundalini", value: "3.0" },
          ],
          defaultValue: "4.0",
        },
        {
          name: "intensity",
          label: "Your Intensity Level",
          type: "select",
          options: [
            { label: "Light (taking it easy)", value: "0.85" },
            { label: "Moderate (normal effort)", value: "1.0" },
            { label: "Vigorous (pushing hard)", value: "1.15" },
          ],
          defaultValue: "1.0",
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const duration = inputs.duration as number;
        const baseMet = parseFloat(inputs.style as string);
        const intensityMult = parseFloat(inputs.intensity as string);
        if (!weight || !duration) return null;

        const weightKg = weight * 0.453592;
        const effectiveMet = baseMet * intensityMult;
        const hours = duration / 60;

        const calories = effectiveMet * weightKg * hours;
        const calPerMinute = calories / duration;

        // Weekly projection
        const weekly3x = calories * 3;
        const weekly5x = calories * 5;

        const styleNames: Record<string, string> = {
          "2.5": "Hatha",
          "2.0": "Yin/Restorative",
          "3.0": "Iyengar/Kundalini",
          "4.0": "Vinyasa/Flow",
          "5.0": "Ashtanga/Hot Yoga",
          "5.5": "Power Yoga",
        };

        return {
          primary: { label: "Calories Burned", value: formatNumber(calories, 0) },
          details: [
            { label: "Style", value: styleNames[String(baseMet)] || "Yoga" },
            { label: "Effective MET", value: formatNumber(effectiveMet, 1) },
            { label: "Duration", value: `${formatNumber(duration, 0)} minutes` },
            { label: "Cal/Minute", value: formatNumber(calPerMinute, 1) },
            { label: "Weekly (3x)", value: `${formatNumber(weekly3x, 0)} cal` },
            { label: "Weekly (5x)", value: `${formatNumber(weekly5x, 0)} cal` },
          ],
          note: "Hot yoga does not necessarily burn more calories than other vigorous styles. The heat increases heart rate and sweating but not necessarily energy expenditure.",
        };
      },
    },
  ],
  relatedSlugs: ["exercise-calorie-calculator", "calorie-calculator", "walking-calorie-calculator"],
  faq: [
    {
      question: "How many calories does yoga burn?",
      answer:
        "A 150-lb person burns approximately 150-200 calories per hour of Hatha yoga, 300-400 for Vinyasa/Flow, and 400-500 for Power or Ashtanga yoga. Hot yoga burns similar calories to Ashtanga (the heat does not significantly increase calorie burn).",
    },
    {
      question: "Which type of yoga burns the most calories?",
      answer:
        "Power Yoga and Ashtanga burn the most calories (5-6 METs) due to their physically demanding nature. Vinyasa/Flow is next (4 METs). Gentle styles like Hatha and Yin focus on flexibility and relaxation rather than calorie burn (2-3 METs).",
    },
    {
      question: "Is yoga good for weight loss?",
      answer:
        "While yoga burns fewer calories than high-intensity exercise, it supports weight loss through stress reduction (lowering cortisol), improved body awareness, better sleep, and mindful eating habits. Vigorous styles like Vinyasa and Power Yoga provide the highest calorie burn.",
    },
  ],
  formula: "Calories = MET × Weight (kg) × Duration (hours) × Intensity Multiplier",
};
