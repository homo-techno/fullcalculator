import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ropeJumpCalorieCalculator: CalculatorDefinition = {
  slug: "rope-jump-calorie-calculator",
  title: "Jump Rope Calorie Calculator",
  description:
    "Free jump rope calorie burn calculator. Estimate calories burned jumping rope based on speed, duration, and body weight. Compare with other cardio exercises.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "jump rope calorie calculator",
    "calories burned jumping rope",
    "skipping rope calories",
    "jump rope workout calories",
    "rope jumping exercise",
  ],
  variants: [
    {
      id: "calc",
      name: "Jump Rope Calorie Burn",
      description: "Calculate calories burned during jump rope exercise",
      fields: [
        { name: "weight", label: "Body Weight (lbs)", type: "number", placeholder: "e.g. 165" },
        { name: "duration", label: "Duration (minutes)", type: "number", placeholder: "e.g. 20", min: 1 },
        {
          name: "speed",
          label: "Jump Speed",
          type: "select",
          options: [
            { label: "Slow (< 100 jumps/min)", value: "8.8" },
            { label: "Moderate (100-120 jumps/min)", value: "11.0" },
            { label: "Fast (120-140 jumps/min)", value: "12.3" },
            { label: "Very Fast / Double Unders (140+ jumps/min)", value: "14.0" },
          ],
          defaultValue: "11.0",
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const duration = inputs.duration as number;
        const met = parseFloat(inputs.speed as string);
        if (!weight || !duration) return null;

        const weightKg = weight * 0.453592;
        const hours = duration / 60;

        const totalCalories = met * weightKg * hours;
        const calPerMinute = totalCalories / duration;

        // Estimate total jumps
        const jumpsPerMin = met < 10 ? 80 : met < 12 ? 110 : met < 13 ? 130 : 150;
        const totalJumps = jumpsPerMin * duration;
        const calPerJump = totalCalories / totalJumps;

        // Comparison with other exercises (MET equivalents for same time)
        const runningCal = 9.8 * weightKg * hours; // Running 6mph MET ~9.8
        const cyclingCal = 7.5 * weightKg * hours; // Cycling moderate MET ~7.5
        const walkingCal = 3.5 * weightKg * hours; // Walking moderate MET ~3.5

        return {
          primary: { label: "Calories Burned", value: formatNumber(totalCalories, 0) },
          details: [
            { label: "MET Value", value: formatNumber(met, 1) },
            { label: "Cal/Minute", value: formatNumber(calPerMinute, 1) },
            { label: "Est. Total Jumps", value: formatNumber(totalJumps, 0) },
            { label: "Cal per Jump", value: formatNumber(calPerJump, 3) },
            { label: "vs. Running (6 mph)", value: `${formatNumber(runningCal, 0)} cal` },
            { label: "vs. Cycling (moderate)", value: `${formatNumber(cyclingCal, 0)} cal` },
            { label: "vs. Walking (3 mph)", value: `${formatNumber(walkingCal, 0)} cal` },
          ],
          note: "Jump rope is one of the most efficient calorie-burning exercises, burning more calories per minute than most forms of cardio. Start with shorter intervals (1-2 min) if you are new to jumping rope.",
        };
      },
    },
    {
      id: "by-jumps",
      name: "By Jump Count",
      description: "Calculate calories from total number of jumps",
      fields: [
        { name: "weight", label: "Body Weight (lbs)", type: "number", placeholder: "e.g. 165" },
        { name: "jumps", label: "Total Jumps", type: "number", placeholder: "e.g. 1000", min: 1 },
        {
          name: "speed",
          label: "Jump Speed",
          type: "select",
          options: [
            { label: "Slow (< 100 jumps/min)", value: "80" },
            { label: "Moderate (100-120 jumps/min)", value: "110" },
            { label: "Fast (120-140 jumps/min)", value: "130" },
            { label: "Very Fast (140+ jumps/min)", value: "150" },
          ],
          defaultValue: "110",
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const jumps = inputs.jumps as number;
        const jumpsPerMin = parseFloat(inputs.speed as string);
        if (!weight || !jumps) return null;

        const weightKg = weight * 0.453592;
        const duration = jumps / jumpsPerMin;
        const hours = duration / 60;

        // MET based on speed
        const met = jumpsPerMin <= 80 ? 8.8 : jumpsPerMin <= 110 ? 11.0 : jumpsPerMin <= 130 ? 12.3 : 14.0;
        const totalCalories = met * weightKg * hours;

        return {
          primary: { label: "Calories Burned", value: formatNumber(totalCalories, 0) },
          details: [
            { label: "Total Jumps", value: formatNumber(jumps, 0) },
            { label: "Duration", value: `${formatNumber(duration, 1)} minutes` },
            { label: "Cal per Jump", value: formatNumber(totalCalories / jumps, 3) },
            { label: "Cal/Minute", value: formatNumber(totalCalories / duration, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["exercise-calorie-calculator", "calorie-calculator", "running-calorie-calculator"],
  faq: [
    {
      question: "How many calories does 10 minutes of jump rope burn?",
      answer:
        "At a moderate pace (110 jumps/min), a 165-lb person burns approximately 140-160 calories in 10 minutes of jump rope. This is more than most other exercises for the same duration, including running, cycling, and swimming.",
    },
    {
      question: "Is jump rope better than running for calories?",
      answer:
        "Yes, in most cases. Moderate jump rope (MET 11.0) burns about 15-20% more calories per minute than running at 6 mph (MET 9.8). Fast jump rope and double unders (MET 12-14) can burn 25-40% more than moderate running.",
    },
    {
      question: "How many jumps equal 1 mile of running?",
      answer:
        "Approximately 800-1000 jump rope jumps at moderate speed burn roughly the same calories as running 1 mile for the average person. This takes about 7-10 minutes of jumping compared to 8-12 minutes of running.",
    },
  ],
  formula: "Calories = MET × Weight (kg) × Duration (hours) | Jump Rope METs: Slow = 8.8, Moderate = 11.0, Fast = 12.3, Very Fast = 14.0",
};
