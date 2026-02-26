import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const plankProgressionCalculator: CalculatorDefinition = {
  slug: "plank-progression-calculator",
  title: "Plank Hold Progression Plan",
  description: "Free plank hold progression plan calculator. Get a structured plan to increase your plank hold time with weekly targets and advanced variations.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["plank progression", "plank calculator", "core training", "plank hold time", "plank challenge"],
  variants: [
    {
      id: "progression",
      name: "Plank Progression Plan",
      description: "Build a plan to increase your plank hold time",
      fields: [
        { name: "currentMax", label: "Current Max Plank Hold (seconds)", type: "number", placeholder: "e.g. 30", min: 5, max: 600 },
        { name: "goal", label: "Goal Hold Time (seconds)", type: "number", placeholder: "e.g. 120", min: 10, max: 600 },
        { name: "sessionsPerWeek", label: "Training Sessions/Week", type: "number", placeholder: "e.g. 4", min: 2, max: 7, defaultValue: 4 },
        { name: "plankType", label: "Plank Type", type: "select", options: [
          { label: "Standard Forearm Plank", value: "standard" },
          { label: "High Plank (hands)", value: "high" },
          { label: "Side Plank", value: "side" },
        ], defaultValue: "standard" },
      ],
      calculate: (inputs) => {
        const current = parseFloat(inputs.currentMax as string);
        const goal = parseFloat(inputs.goal as string);
        const sessions = parseFloat(inputs.sessionsPerWeek as string);
        const type = inputs.plankType as string;
        if (isNaN(current) || isNaN(goal) || isNaN(sessions) || goal <= current) return null;

        const diff = goal - current;
        const progressRate = current < 30 ? 10 : current < 60 ? 7 : current < 120 ? 5 : 3;
        const weeksNeeded = Math.ceil(diff / progressRate);

        const workingHold = Math.floor(current * 0.7);
        const sets = current < 30 ? 5 : current < 60 ? 4 : 3;
        const totalVolume = workingHold * sets;

        const week2Hold = Math.min(goal, current + progressRate);
        const week4Hold = Math.min(goal, current + progressRate * 4);

        let nextVariation = "";
        if (current >= 120) nextVariation = "RKC plank, weighted plank, plank with arm/leg raise";
        else if (current >= 60) nextVariation = "Plank shoulder taps, plank to push-up";
        else if (current >= 30) nextVariation = "Add hip dips, plank marches";
        else nextVariation = "Knee plank progressions, wall plank";

        const caloriesPerMin = type === "side" ? 4 : 5;
        const dailyCalories = (totalVolume / 60) * caloriesPerMin;

        return {
          primary: { label: "Weeks to Goal", value: `${formatNumber(weeksNeeded, 0)} weeks` },
          details: [
            { label: "Current Max", value: `${formatNumber(current, 0)} sec` },
            { label: "Goal", value: `${formatNumber(goal, 0)} sec (${formatNumber(goal / 60, 1)} min)` },
            { label: "Workout Structure", value: `${formatNumber(sets, 0)} x ${formatNumber(workingHold, 0)} sec holds` },
            { label: "Rest Between Sets", value: `${formatNumber(workingHold, 0)} sec` },
            { label: "Week 2 Target", value: `${formatNumber(week2Hold, 0)} sec max` },
            { label: "Week 4 Target", value: `${formatNumber(week4Hold, 0)} sec max` },
            { label: "Progress Rate", value: `~${formatNumber(progressRate, 0)} sec/week` },
            { label: "Next Variation", value: nextVariation },
            { label: "Calories per Session", value: formatNumber(dailyCalories, 0) },
          ],
          note: "Hold planks at 70% of your max for training sets. Test your new max every 2 weeks. Focus on proper form: flat back, engaged core, neutral neck.",
        };
      },
    },
    {
      id: "fitness-score",
      name: "Plank Fitness Score",
      description: "See how your plank time compares to fitness standards",
      fields: [
        { name: "holdTime", label: "Max Plank Hold (seconds)", type: "number", placeholder: "e.g. 60", min: 1, max: 600 },
        { name: "sex", label: "Sex", type: "select", options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ] },
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 30", min: 14, max: 70 },
      ],
      calculate: (inputs) => {
        const hold = parseFloat(inputs.holdTime as string);
        const sex = inputs.sex as string;
        const age = parseFloat(inputs.age as string);
        if (isNaN(hold) || isNaN(age)) return null;

        const ageFactor = age > 50 ? 1.2 : age > 40 ? 1.1 : 1.0;
        const adjHold = hold * ageFactor;

        let rating = "Needs Work";
        if (adjHold >= 180) rating = "Elite";
        else if (adjHold >= 120) rating = "Excellent";
        else if (adjHold >= 60) rating = "Good";
        else if (adjHold >= 30) rating = "Average";
        else if (adjHold >= 15) rating = "Below Average";

        const percentile = Math.min(99, Math.round((hold / 180) * 80 + 10));

        return {
          primary: { label: "Core Fitness Rating", value: rating },
          details: [
            { label: "Hold Time", value: `${formatNumber(hold, 0)} sec (${formatNumber(hold / 60, 1)} min)` },
            { label: "Age-Adjusted", value: `${formatNumber(adjHold, 0)} sec` },
            { label: "Approx. Percentile", value: `${formatNumber(percentile, 0)}th` },
            { label: "Average Adult", value: "45-60 seconds" },
            { label: "Fitness Enthusiast", value: "2-3 minutes" },
            { label: "World Record", value: "9+ hours" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pull-up-progression-calculator", "calisthenics-progression-calculator", "calorie-calculator"],
  faq: [
    { question: "How long should I be able to hold a plank?", answer: "A 60-second plank hold indicates decent core strength. For general fitness, aim for 1-2 minutes. Holding longer than 2 minutes provides diminishing returns - at that point, progress to harder variations like weighted or RKC planks." },
    { question: "Is a longer plank better?", answer: "Not necessarily. After 2 minutes, you're training endurance more than strength. For core strength, it's better to progress to harder variations (RKC plank, loaded plank, pallof press) rather than holding a standard plank longer." },
    { question: "How do I progress safely?", answer: "Add 5-10 seconds per week to your working sets. Train at 70% of your max for 3-5 sets. Rest equal to your hold time between sets. Test your max every 2 weeks. Always maintain proper form - a shorter plank with good form beats a longer one with a sagging back." },
  ],
  formula: "Progress Rate: <30s = +10s/week, <60s = +7s/week, <120s = +5s/week, 120s+ = +3s/week | Training Sets = 70% of Max Hold x 3-5 sets",
};
