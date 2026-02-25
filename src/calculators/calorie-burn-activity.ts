import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const activityOptions = [
  { label: "Walking (3 mph)", value: "3.5" },
  { label: "Jogging (5 mph)", value: "7.0" },
  { label: "Running (8 mph)", value: "11.8" },
  { label: "Cycling (moderate)", value: "8.0" },
  { label: "Swimming (moderate)", value: "7.0" },
  { label: "Hiking", value: "6.0" },
  { label: "Dancing", value: "5.0" },
  { label: "Yoga", value: "3.0" },
  { label: "Weight Training", value: "5.0" },
  { label: "Jump Rope", value: "12.0" },
  { label: "Tennis", value: "7.3" },
  { label: "Basketball", value: "6.5" },
  { label: "Soccer", value: "7.0" },
  { label: "Gardening", value: "3.8" },
  { label: "Housework", value: "3.0" },
  { label: "Sitting (office work)", value: "1.3" },
  { label: "Sleeping", value: "0.95" },
];

export const calorieBurnActivityCalculator: CalculatorDefinition = {
  slug: "calorie-burn-activity-calculator",
  title: "Calorie Burn by Activity Calculator",
  description:
    "Free calorie burn by activity calculator. See how many calories you burn doing different activities based on your weight and duration.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "calorie burn",
    "calories burned",
    "activity calories",
    "exercise calories",
    "MET calculator",
    "calories per activity",
  ],
  variants: [
    {
      id: "calorie-burn",
      name: "Calories Burned",
      description: "Calculate calories burned for a specific activity",
      fields: [
        {
          name: "activity",
          label: "Activity",
          type: "select",
          options: activityOptions,
        },
        {
          name: "weight",
          label: "Body Weight",
          type: "number",
          placeholder: "e.g. 150",
          min: 50,
          max: 500,
        },
        {
          name: "weightUnit",
          label: "Weight Unit",
          type: "select",
          options: [
            { label: "Pounds (lbs)", value: "lbs" },
            { label: "Kilograms (kg)", value: "kg" },
          ],
        },
        {
          name: "duration",
          label: "Duration (minutes)",
          type: "number",
          placeholder: "e.g. 30",
          min: 1,
          max: 600,
        },
      ],
      calculate: (inputs) => {
        const metStr = (inputs.activity as string) || "3.5";
        const weight = inputs.weight as number;
        const weightUnit = (inputs.weightUnit as string) || "lbs";
        const duration = inputs.duration as number;

        if (!weight || !duration) return null;

        const met = parseFloat(metStr);
        const weightKg = weightUnit === "lbs" ? weight * 0.453592 : weight;

        // Calories = MET x weight(kg) x time(hours)
        const timeHours = duration / 60;
        const calories = met * weightKg * timeHours;
        const caloriesPerMinute = calories / duration;
        const caloriesPerHour = calories / timeHours;

        // Equivalent food burned
        const slicesOfPizza = calories / 285;
        const cansOfSoda = calories / 140;
        const milesWalking = calories / (3.5 * weightKg * (1 / 3.0));

        const activityLabel =
          activityOptions.find((o) => o.value === metStr)?.label ?? "Activity";

        return {
          primary: {
            label: "Calories Burned",
            value: formatNumber(calories, 0),
            suffix: "cal",
          },
          details: [
            { label: "Activity", value: activityLabel },
            { label: "MET value", value: formatNumber(met, 1) },
            { label: "Duration", value: `${formatNumber(duration)} min` },
            { label: "Calories per minute", value: formatNumber(caloriesPerMinute, 1) },
            { label: "Calories per hour", value: formatNumber(caloriesPerHour, 0) },
            { label: "Equivalent pizza slices", value: formatNumber(slicesOfPizza, 1) },
            { label: "Equivalent cans of soda", value: formatNumber(cansOfSoda, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "exercise-calorie-calculator",
    "walking-calorie-calculator",
    "running-calorie-calculator",
  ],
  faq: [
    {
      question: "What is a MET value?",
      answer:
        "MET (Metabolic Equivalent of Task) is a measure of activity intensity. 1 MET equals the energy cost of sitting quietly. Walking is about 3.5 METs, running about 8-12 METs.",
    },
    {
      question: "How are calories burned calculated?",
      answer:
        "Calories burned = MET x body weight in kg x duration in hours. This formula provides a good estimate, though individual metabolism can vary by 10-15%.",
    },
  ],
  formula:
    "Calories = MET x Weight (kg) x Duration (hours). MET values sourced from the Compendium of Physical Activities.",
};
