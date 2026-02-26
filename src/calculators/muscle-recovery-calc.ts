import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const muscleRecoveryCalculator: CalculatorDefinition = {
  slug: "muscle-recovery-calculator",
  title: "Muscle Recovery Time Estimator",
  description: "Free muscle recovery time calculator. Estimate recovery periods after workouts based on intensity, muscle groups, training experience, and recovery factors.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["muscle recovery calculator", "recovery time", "workout recovery", "rest day calculator", "muscle repair time"],
  variants: [
    {
      id: "recovery-time",
      name: "Recovery Time Estimator",
      description: "Estimate how long a muscle group needs to recover before training again",
      fields: [
        { name: "muscleGroup", label: "Muscle Group", type: "select", options: [
          { label: "Chest", value: "chest" },
          { label: "Back", value: "back" },
          { label: "Legs (Quads/Hams)", value: "legs" },
          { label: "Shoulders", value: "shoulders" },
          { label: "Arms (Biceps/Triceps)", value: "arms" },
          { label: "Core / Abs", value: "core" },
          { label: "Glutes", value: "glutes" },
          { label: "Calves", value: "calves" },
        ] },
        { name: "intensity", label: "Workout Intensity", type: "select", options: [
          { label: "Light (low weight, high reps)", value: "light" },
          { label: "Moderate (medium weight)", value: "moderate" },
          { label: "Heavy (near max)", value: "heavy" },
          { label: "Very Heavy (1-3 RM)", value: "veryheavy" },
        ] },
        { name: "sets", label: "Total Working Sets", type: "number", placeholder: "e.g. 12", min: 1, max: 40 },
        { name: "experience", label: "Training Experience", type: "select", options: [
          { label: "Beginner (< 1 year)", value: "beginner" },
          { label: "Intermediate (1-3 years)", value: "intermediate" },
          { label: "Advanced (3+ years)", value: "advanced" },
        ] },
        { name: "sleep", label: "Sleep Quality", type: "select", options: [
          { label: "Poor (< 6 hrs)", value: "poor" },
          { label: "Average (6-7 hrs)", value: "average" },
          { label: "Good (7-9 hrs)", value: "good" },
        ], defaultValue: "average" },
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 30", min: 14, max: 80 },
      ],
      calculate: (inputs) => {
        const muscle = inputs.muscleGroup as string;
        const intensity = inputs.intensity as string;
        const sets = parseFloat(inputs.sets as string);
        const exp = inputs.experience as string;
        const sleep = inputs.sleep as string;
        const age = parseFloat(inputs.age as string);
        if (isNaN(sets) || isNaN(age)) return null;

        const baseRecovery: Record<string, number> = {
          chest: 48, back: 48, legs: 72, shoulders: 48, arms: 36, core: 24, glutes: 48, calves: 36,
        };
        const intensityMult: Record<string, number> = { light: 0.7, moderate: 1.0, heavy: 1.3, veryheavy: 1.6 };
        const volumeMult = sets > 20 ? 1.3 : sets > 12 ? 1.1 : 1.0;
        const expMult: Record<string, number> = { beginner: 1.3, intermediate: 1.0, advanced: 0.85 };
        const sleepMult: Record<string, number> = { poor: 1.4, average: 1.1, good: 1.0 };
        const ageMult = age > 50 ? 1.35 : age > 40 ? 1.2 : age > 30 ? 1.1 : 1.0;

        const base = baseRecovery[muscle] || 48;
        const totalHours = base * (intensityMult[intensity] || 1) * volumeMult * (expMult[exp] || 1) * (sleepMult[sleep] || 1) * ageMult;
        const days = totalHours / 24;

        let readiness = "Fully Recovered";
        const partialHours = totalHours * 0.7;

        let soreness = "None";
        if (totalHours > 72) soreness = "May experience 2-3 days DOMS";
        else if (totalHours > 48) soreness = "Moderate soreness for 1-2 days";
        else soreness = "Mild soreness expected";

        return {
          primary: { label: "Recovery Time", value: `${formatNumber(totalHours, 0)} hours (~${formatNumber(days, 1)} days)` },
          details: [
            { label: "Partial Recovery (70%)", value: `${formatNumber(partialHours, 0)} hours` },
            { label: "Muscle Group", value: muscle.charAt(0).toUpperCase() + muscle.slice(1) },
            { label: "Expected Soreness", value: soreness },
            { label: "Base Recovery", value: `${formatNumber(base, 0)} hours` },
            { label: "Volume Factor", value: `${formatNumber(volumeMult * 100, 0)}%` },
            { label: "Age Factor", value: `${formatNumber(ageMult * 100, 0)}%` },
            { label: "Sleep Factor", value: `${formatNumber((sleepMult[sleep] || 1) * 100, 0)}%` },
          ],
          note: "These are estimates. If you feel recovered and strong, you can train again. Persistent soreness or declining performance suggests more rest.",
        };
      },
    },
  ],
  relatedSlugs: ["training-load-calculator", "one-rep-max-calculator", "protein-calculator"],
  faq: [
    { question: "How long does muscle recovery take?", answer: "Small muscles (arms, calves) recover in 24-48 hours, while large muscles (legs, back) need 48-72+ hours. Intensity, volume, sleep, nutrition, and age all affect recovery time. Most people can train a muscle group again within 2-3 days." },
    { question: "Does age affect recovery?", answer: "Yes, recovery slows with age due to decreased hormone levels and protein synthesis rates. People over 40 may need 20-35% more recovery time. Good sleep, nutrition, and stress management can partially offset this." },
    { question: "How do I know if I'm recovered?", answer: "Signs of recovery include no residual soreness, full range of motion, ability to match or exceed previous performance, and feeling energized. If your strength is declining week to week, you likely need more recovery time." },
  ],
  formula: "Recovery Hours = Base x Intensity x Volume x Experience x Sleep x Age | Base: Legs=72h, Chest/Back=48h, Arms=36h, Core=24h",
};
