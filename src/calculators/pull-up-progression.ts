import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pullUpProgressionCalculator: CalculatorDefinition = {
  slug: "pull-up-progression-calculator",
  title: "Pull-Up Progression Plan Calculator",
  description: "Free pull-up progression plan calculator. Get a personalized plan to increase your pull-up count from zero to your goal, with weekly progressions and training structure.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["pull-up progression", "pull-up plan", "chin-up calculator", "pull-up training", "increase pull-ups"],
  variants: [
    {
      id: "progression",
      name: "Pull-Up Progression Plan",
      description: "Get a personalized plan based on your current max",
      fields: [
        { name: "currentMax", label: "Current Max Pull-ups (strict)", type: "number", placeholder: "e.g. 5", min: 0, max: 50 },
        { name: "goal", label: "Goal Pull-ups", type: "number", placeholder: "e.g. 15", min: 1, max: 50 },
        { name: "daysPerWeek", label: "Training Days Per Week", type: "number", placeholder: "e.g. 3", min: 2, max: 6, defaultValue: 3 },
        { name: "bodyweight", label: "Body Weight (lbs)", type: "number", placeholder: "e.g. 170" },
        { name: "gripType", label: "Preferred Grip", type: "select", options: [
          { label: "Overhand (pull-up)", value: "overhand" },
          { label: "Underhand (chin-up)", value: "underhand" },
          { label: "Neutral grip", value: "neutral" },
        ], defaultValue: "overhand" },
      ],
      calculate: (inputs) => {
        const current = parseFloat(inputs.currentMax as string);
        const goal = parseFloat(inputs.goal as string);
        const days = parseFloat(inputs.daysPerWeek as string);
        const bw = parseFloat(inputs.bodyweight as string);
        if (isNaN(current) || isNaN(goal) || isNaN(days) || isNaN(bw) || goal <= current) return null;

        const diff = goal - current;
        const weeksNeeded = Math.ceil(diff * (current === 0 ? 3 : current < 5 ? 2.5 : current < 10 ? 2 : 1.5));

        let phase = "";
        let setsReps = "";
        let method = "";
        if (current === 0) {
          phase = "Foundation Phase";
          setsReps = "5 x negative pull-ups (5 sec lower), 3 x band-assisted pull-ups";
          method = "Negatives + Band Assist";
        } else if (current < 5) {
          const workingReps = Math.max(1, current - 1);
          phase = "Building Phase";
          setsReps = `5 x ${workingReps} reps (submaximal sets throughout the day)`;
          method = "Grease the Groove (GTG)";
        } else if (current < 10) {
          const set1 = current - 1;
          const set2 = Math.max(1, current - 2);
          const set3 = Math.max(1, current - 3);
          phase = "Volume Phase";
          setsReps = `Sets of ${set1}, ${set2}, ${set3}, ${set3}, ${set3} (pyramid down)`;
          method = "Pyramid Sets";
        } else {
          const weighted = Math.floor(bw * 0.1);
          phase = "Advanced Phase";
          setsReps = `3 x 5 weighted (+${weighted} lbs) + 2 x max bodyweight`;
          method = "Weighted + Burnout";
        }

        const dailyVolume = current === 0 ? 25 : current < 5 ? current * 5 * days : current < 10 ? current * 4 : current * 3 + 15;
        const weeklyVolume = dailyVolume * days;
        const relativeStrength = current > 0 ? bw / current : 0;

        return {
          primary: { label: "Estimated Weeks to Goal", value: `${formatNumber(weeksNeeded, 0)} weeks` },
          details: [
            { label: "Current Phase", value: phase },
            { label: "Training Method", value: method },
            { label: "Workout Structure", value: setsReps },
            { label: "Daily Volume (approx reps)", value: formatNumber(dailyVolume, 0) },
            { label: "Weekly Volume", value: `${formatNumber(weeklyVolume, 0)} reps` },
            { label: "Training Days/Week", value: formatNumber(days, 0) },
            { label: "Strength Ratio (lbs/rep)", value: current > 0 ? formatNumber(relativeStrength, 1) : "N/A" },
            { label: "Progress Rate", value: `~${formatNumber(diff / weeksNeeded, 1)} reps/week` },
          ],
          note: current === 0 ? "Start with negative (eccentric) pull-ups and band-assisted reps. Focus on getting your first strict pull-up within 2-4 weeks." : undefined,
        };
      },
    },
    {
      id: "test-score",
      name: "Pull-Up Fitness Score",
      description: "See how your pull-ups compare to fitness standards",
      fields: [
        { name: "pullups", label: "Max Strict Pull-ups", type: "number", placeholder: "e.g. 10", min: 0, max: 50 },
        { name: "sex", label: "Sex", type: "select", options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ] },
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 30", min: 14, max: 70 },
      ],
      calculate: (inputs) => {
        const pullups = parseFloat(inputs.pullups as string);
        const sex = inputs.sex as string;
        const age = parseFloat(inputs.age as string);
        if (isNaN(pullups) || isNaN(age)) return null;

        const ageFactor = age > 50 ? 1.3 : age > 40 ? 1.15 : age > 30 ? 1.05 : 1.0;
        const adjPullups = pullups * ageFactor;

        let rating = "";
        if (sex === "male") {
          if (adjPullups >= 20) rating = "Elite";
          else if (adjPullups >= 15) rating = "Excellent";
          else if (adjPullups >= 10) rating = "Good";
          else if (adjPullups >= 5) rating = "Average";
          else if (adjPullups >= 1) rating = "Below Average";
          else rating = "Needs Work";
        } else {
          if (adjPullups >= 12) rating = "Elite";
          else if (adjPullups >= 8) rating = "Excellent";
          else if (adjPullups >= 5) rating = "Good";
          else if (adjPullups >= 2) rating = "Average";
          else if (adjPullups >= 1) rating = "Below Average";
          else rating = "Needs Work";
        }

        const percentile = sex === "male"
          ? Math.min(99, Math.round(pullups * 5 + 10))
          : Math.min(99, Math.round(pullups * 8 + 15));

        return {
          primary: { label: "Fitness Rating", value: rating },
          details: [
            { label: "Pull-ups", value: formatNumber(pullups, 0) },
            { label: "Age-Adjusted Score", value: formatNumber(adjPullups, 1) },
            { label: "Approx. Percentile", value: `${formatNumber(percentile, 0)}th` },
            { label: "Military Standard (male)", value: "3 minimum, 20+ max score" },
            { label: "Military Standard (female)", value: "1 minimum, 12+ max score" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["calisthenics-progression-calculator", "plank-progression-calculator", "one-rep-max-calculator"],
  faq: [
    { question: "How do I go from 0 to 1 pull-up?", answer: "Start with negative (eccentric) pull-ups: jump to the top and lower yourself slowly over 5 seconds. Do 3-5 sets of 3-5 negatives, 3x/week. Also use band-assisted pull-ups and dead hangs. Most people can achieve their first pull-up within 2-6 weeks." },
    { question: "What is Grease the Groove?", answer: "GTG is a method where you do multiple submaximal sets throughout the day (50-70% of your max) with long rest between sets. For example, if your max is 6, do sets of 3-4 spread across the day, 5-6 times. This builds neural efficiency without fatiguing muscles." },
    { question: "How many pull-ups should I be able to do?", answer: "For general fitness: men should aim for 8-15, women for 3-8. Athletes may target 15-25. One pull-up per 30 lbs of bodyweight is a reasonable strength standard. Quality (full range of motion, no kipping) matters more than quantity." },
  ],
  formula: "Weeks = (Goal - Current) x Phase Factor | 0 reps: 3 wk/rep, <5: 2.5 wk/rep, <10: 2 wk/rep, 10+: 1.5 wk/rep",
};
