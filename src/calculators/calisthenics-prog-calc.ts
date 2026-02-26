import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const calisthenicsProgCalculator: CalculatorDefinition = {
  slug: "calisthenics-progression-calculator",
  title: "Calisthenics Progression Calculator",
  description: "Free calisthenics progression calculator. Find your current level and get the next progression for push-ups, pull-ups, squats, dips, and core exercises.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["calisthenics calculator", "bodyweight progression", "push-up progression", "calisthenics level", "bodyweight exercises"],
  variants: [
    {
      id: "level-assessment",
      name: "Skill Level Assessment",
      description: "Assess your current calisthenics level based on max reps",
      fields: [
        { name: "pushups", label: "Max Push-ups (in a row)", type: "number", placeholder: "e.g. 25", min: 0, max: 200 },
        { name: "pullups", label: "Max Pull-ups (in a row)", type: "number", placeholder: "e.g. 8", min: 0, max: 50 },
        { name: "dips", label: "Max Dips (in a row)", type: "number", placeholder: "e.g. 12", min: 0, max: 100 },
        { name: "squats", label: "Max Pistol Squats (per leg)", type: "number", placeholder: "e.g. 0", min: 0, max: 50 },
        { name: "lhang", label: "Max L-Sit Hold (seconds)", type: "number", placeholder: "e.g. 10", min: 0, max: 120 },
      ],
      calculate: (inputs) => {
        const pushups = parseFloat(inputs.pushups as string);
        const pullups = parseFloat(inputs.pullups as string);
        const dips = parseFloat(inputs.dips as string);
        const pistols = parseFloat(inputs.squats as string);
        const lsit = parseFloat(inputs.lhang as string);
        if (isNaN(pushups) || isNaN(pullups) || isNaN(dips) || isNaN(pistols) || isNaN(lsit)) return null;

        const scoreExercise = (val: number, thresholds: number[]) => {
          for (let i = thresholds.length - 1; i >= 0; i--) {
            if (val >= thresholds[i]) return i + 1;
          }
          return 0;
        };

        const pushScore = scoreExercise(pushups, [1, 10, 25, 40, 60]);
        const pullScore = scoreExercise(pullups, [1, 5, 10, 15, 20]);
        const dipScore = scoreExercise(dips, [1, 8, 15, 25, 35]);
        const pistolScore = scoreExercise(pistols, [1, 3, 5, 10, 15]);
        const lsitScore = scoreExercise(lsit, [5, 15, 30, 45, 60]);

        const totalScore = pushScore + pullScore + dipScore + pistolScore + lsitScore;
        const levels = ["Absolute Beginner", "Beginner", "Intermediate", "Advanced", "Elite"];
        const avgScore = totalScore / 5;
        const levelIdx = Math.min(Math.floor(avgScore), 4);
        const level = levels[levelIdx];

        const pushNext = pushups < 10 ? "Work to 10 standard push-ups" : pushups < 25 ? "Target 25 push-ups, add diamond push-ups" : pushups < 40 ? "Progress to archer push-ups" : "Work on one-arm push-up progression";
        const pullNext = pullups < 1 ? "Negative pull-ups, band-assisted pull-ups" : pullups < 5 ? "Grease the groove, target 5 strict" : pullups < 10 ? "Add weight or try L-sit pull-ups" : "Muscle-up progression";

        return {
          primary: { label: "Calisthenics Level", value: level },
          details: [
            { label: "Total Score", value: `${formatNumber(totalScore, 0)} / 25` },
            { label: "Push-up Score", value: `${formatNumber(pushScore, 0)} / 5` },
            { label: "Pull-up Score", value: `${formatNumber(pullScore, 0)} / 5` },
            { label: "Dip Score", value: `${formatNumber(dipScore, 0)} / 5` },
            { label: "Pistol Squat Score", value: `${formatNumber(pistolScore, 0)} / 5` },
            { label: "L-Sit Score", value: `${formatNumber(lsitScore, 0)} / 5` },
            { label: "Push-up Next Step", value: pushNext },
            { label: "Pull-up Next Step", value: pullNext },
          ],
        };
      },
    },
    {
      id: "workout-builder",
      name: "Workout Set/Rep Planner",
      description: "Get sets and reps based on your max and training goal",
      fields: [
        { name: "exercise", label: "Exercise", type: "select", options: [
          { label: "Push-ups", value: "pushups" },
          { label: "Pull-ups", value: "pullups" },
          { label: "Dips", value: "dips" },
          { label: "Squats", value: "squats" },
          { label: "Pike Push-ups", value: "pike" },
        ] },
        { name: "maxReps", label: "Max Reps (fresh, strict form)", type: "number", placeholder: "e.g. 20", min: 1, max: 200 },
        { name: "goal", label: "Training Goal", type: "select", options: [
          { label: "Strength (fewer reps, more sets)", value: "strength" },
          { label: "Hypertrophy (moderate)", value: "hypertrophy" },
          { label: "Endurance (higher reps)", value: "endurance" },
        ] },
      ],
      calculate: (inputs) => {
        const exercise = inputs.exercise as string;
        const maxReps = parseFloat(inputs.maxReps as string);
        const goal = inputs.goal as string;
        if (isNaN(maxReps)) return null;

        let sets = 4;
        let repsPerSet = Math.floor(maxReps * 0.6);
        let restSec = 90;

        if (goal === "strength") {
          sets = 5;
          repsPerSet = Math.max(3, Math.floor(maxReps * 0.75));
          restSec = 180;
        } else if (goal === "endurance") {
          sets = 3;
          repsPerSet = Math.floor(maxReps * 0.5);
          restSec = 60;
        }

        const totalReps = sets * repsPerSet;
        const totalTime = sets * (repsPerSet * 3 + restSec) / 60;

        return {
          primary: { label: "Workout Prescription", value: `${formatNumber(sets, 0)} x ${formatNumber(repsPerSet, 0)} reps` },
          details: [
            { label: "Exercise", value: exercise.charAt(0).toUpperCase() + exercise.slice(1) },
            { label: "Total Volume", value: `${formatNumber(totalReps, 0)} reps` },
            { label: "Rest Between Sets", value: `${formatNumber(restSec, 0)} seconds` },
            { label: "Estimated Time", value: `${formatNumber(totalTime, 1)} min` },
            { label: "Goal", value: goal.charAt(0).toUpperCase() + goal.slice(1) },
            { label: "Progression", value: `Add 1-2 reps/set when you can complete all sets` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pull-up-progression-calculator", "plank-progression-calculator", "one-rep-max-calculator"],
  faq: [
    { question: "How do I progress in calisthenics?", answer: "Progress by increasing reps, adding harder variations (e.g., diamond push-ups after regular push-ups), increasing time under tension, or reducing rest. When you can do 3 sets of 12+ reps, move to the next progression." },
    { question: "What is a good calisthenics level?", answer: "Beginners: 10+ push-ups, 1+ pull-ups. Intermediate: 25+ push-ups, 10+ pull-ups, pistol squats. Advanced: one-arm push-ups, muscle-ups, front lever progressions. Most people can reach intermediate in 6-12 months of consistent training." },
    { question: "How often should I train calisthenics?", answer: "Train each movement pattern 2-3 times per week with at least 48 hours between sessions targeting the same muscles. Full-body routines 3x/week or upper/lower splits 4x/week both work well." },
  ],
  formula: "Strength: 5 sets x 75% max reps, 3 min rest | Hypertrophy: 4 sets x 60% max, 90s rest | Endurance: 3 sets x 50% max, 60s rest",
};
