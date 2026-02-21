import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const walkingCalorieCalculator: CalculatorDefinition = {
  slug: "walking-calorie-calculator",
  title: "Walking Calorie Calculator",
  description:
    "Free walking calorie calculator. Estimate how many calories you burn walking based on your weight, duration, and pace. Uses MET values for accurate results.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "walking calorie calculator",
    "calories burned walking",
    "walking calories",
    "steps calories burned",
    "walking exercise calculator",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Calories Burned",
      description: "Estimate calories burned while walking",
      fields: [
        { name: "weight", label: "Weight", type: "number", placeholder: "e.g. 160", suffix: "lbs" },
        { name: "duration", label: "Duration", type: "number", placeholder: "e.g. 30", suffix: "minutes" },
        {
          name: "pace",
          label: "Walking Pace",
          type: "select",
          options: [
            { label: "Slow (2 mph / strolling)", value: "2.0" },
            { label: "Moderate (3 mph / normal)", value: "3.5" },
            { label: "Brisk (3.5-4 mph / exercise walking)", value: "4.3" },
            { label: "Very Brisk (4.5+ mph / power walking)", value: "5.0" },
          ],
          defaultValue: "3.5",
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const duration = inputs.duration as number;
        const met = parseFloat(inputs.pace as string);
        if (!weight || !duration) return null;

        const weightKg = weight * 0.453592;
        const hours = duration / 60;
        const calories = met * weightKg * hours;
        const caloriesPerMile = calories / (met > 4 ? hours * 4 : met > 3 ? hours * 3 : hours * 2);
        const estSteps = duration * (met > 4 ? 140 : met > 3 ? 120 : 100);

        return {
          primary: { label: "Calories Burned", value: formatNumber(calories, 0) },
          details: [
            { label: "MET Value", value: formatNumber(met, 1) },
            { label: "Duration", value: `${formatNumber(duration, 0)} min` },
            { label: "Cal/Minute", value: formatNumber(calories / duration, 1) },
            { label: "Estimated Steps", value: formatNumber(estSteps, 0) },
          ],
          note: "Calorie burn varies by terrain, body composition, and fitness level. MET values are averages for level ground.",
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "steps-miles-calculator", "exercise-calorie-calculator", "running-calorie-calculator"],
  faq: [
    {
      question: "How many calories does walking burn?",
      answer:
        "A 160-lb person burns approximately 200-300 calories per hour of moderate walking (3 mph). The exact amount depends on your weight, speed, incline, and fitness level.",
    },
    {
      question: "What is a MET value?",
      answer:
        "MET (Metabolic Equivalent of Task) measures the energy cost of an activity. 1 MET equals resting metabolic rate. Walking at moderate pace is about 3.5 METs, meaning it burns 3.5 times more energy than sitting still.",
    },
    {
      question: "Is walking good for weight loss?",
      answer:
        "Yes. Walking is one of the most accessible forms of exercise for weight loss. A brisk 30-minute walk daily can burn 150-250 calories, contributing to a weekly deficit of 1,000-1,750 calories.",
    },
  ],
  formula:
    "Calories = MET × Weight (kg) × Duration (hours) | Walking METs: Slow = 2.0, Moderate = 3.5, Brisk = 4.3, Very Brisk = 5.0",
};
