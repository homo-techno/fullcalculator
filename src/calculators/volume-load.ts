import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const volumeLoadCalculator: CalculatorDefinition = {
  slug: "volume-load-calculator",
  title: "Training Volume Load Calculator",
  description: "Free training volume load calculator. Calculate total volume load (sets x reps x weight) for individual exercises and full workouts.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["volume load", "training volume", "workout volume", "sets reps weight", "tonnage calculator", "training load"],
  variants: [
    {
      id: "single-exercise",
      name: "Single Exercise Volume",
      description: "Calculate volume load for one exercise",
      fields: [
        { name: "weight", label: "Weight per Set", type: "number", placeholder: "e.g. 100" },
        { name: "reps", label: "Reps per Set", type: "number", placeholder: "e.g. 8" },
        { name: "sets", label: "Number of Sets", type: "number", placeholder: "e.g. 4" },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "kg", value: "kg" }, { label: "lbs", value: "lbs" },
        ], defaultValue: "kg" },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const reps = inputs.reps as number;
        const sets = inputs.sets as number;
        const unit = inputs.unit as string;
        if (!weight || !reps || !sets) return null;
        const volumeLoad = weight * reps * sets;
        const totalReps = reps * sets;
        const e1rm = weight * (36 / (37 - reps));
        const relativeIntensity = (weight / e1rm) * 100;
        return {
          primary: { label: "Volume Load", value: `${formatNumber(volumeLoad, 0)} ${unit}` },
          details: [
            { label: "Total Reps", value: `${totalReps}` },
            { label: "Weight per Set", value: `${formatNumber(weight, 1)} ${unit}` },
            { label: "Estimated 1RM", value: `${formatNumber(e1rm, 1)} ${unit}` },
            { label: "Relative Intensity", value: `${formatNumber(relativeIntensity, 1)}%` },
            { label: "Avg Volume per Set", value: `${formatNumber(volumeLoad / sets, 0)} ${unit}` },
          ],
        };
      },
    },
    {
      id: "weekly-volume",
      name: "Weekly Volume per Muscle",
      description: "Calculate weekly training volume sets for a muscle group",
      fields: [
        { name: "setsPerSession", label: "Sets per Session", type: "number", placeholder: "e.g. 4" },
        { name: "frequency", label: "Sessions per Week", type: "select", options: [
          { label: "1x per week", value: "1" },
          { label: "2x per week", value: "2" },
          { label: "3x per week", value: "3" },
          { label: "4x per week", value: "4" },
        ], defaultValue: "2" },
        { name: "reps", label: "Avg Reps per Set", type: "number", placeholder: "e.g. 10" },
        { name: "weight", label: "Avg Weight", type: "number", placeholder: "e.g. 80" },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "kg", value: "kg" }, { label: "lbs", value: "lbs" },
        ], defaultValue: "kg" },
      ],
      calculate: (inputs) => {
        const setsPerSession = inputs.setsPerSession as number;
        const frequency = parseInt(inputs.frequency as string);
        const reps = inputs.reps as number;
        const weight = inputs.weight as number;
        const unit = inputs.unit as string;
        if (!setsPerSession || !frequency || !reps || !weight) return null;
        const weeklySets = setsPerSession * frequency;
        const weeklyVolume = weeklySets * reps * weight;
        let recommendation: string;
        if (weeklySets < 10) recommendation = "Below minimum effective volume (MEV). Consider adding sets.";
        else if (weeklySets <= 15) recommendation = "Near minimum effective volume. Good for maintenance.";
        else if (weeklySets <= 20) recommendation = "Optimal range for most lifters (MAV).";
        else if (weeklySets <= 25) recommendation = "High volume. Ensure adequate recovery.";
        else recommendation = "May exceed maximum recoverable volume (MRV). Risk of overtraining.";
        return {
          primary: { label: "Weekly Sets", value: `${weeklySets} sets` },
          details: [
            { label: "Weekly Volume Load", value: `${formatNumber(weeklyVolume, 0)} ${unit}` },
            { label: "Weekly Total Reps", value: `${formatNumber(weeklySets * reps, 0)}` },
            { label: "Recommendation", value: recommendation },
            { label: "Sets per Session", value: `${setsPerSession}` },
            { label: "Frequency", value: `${frequency}x per week` },
          ],
          note: "Research suggests 10-20 sets per muscle group per week is optimal for hypertrophy. Beginners need fewer sets; advanced lifters may benefit from more.",
        };
      },
    },
  ],
  relatedSlugs: ["one-rep-max-calculator", "rep-max-calculator", "calorie-calculator"],
  faq: [
    { question: "What is training volume load?", answer: "Volume load (or tonnage) is the total weight lifted in a workout, calculated as sets x reps x weight. For example, 4 sets of 8 reps at 100 kg = 3,200 kg volume load. It's a key metric for tracking progressive overload." },
    { question: "How many sets per week should I do?", answer: "For hypertrophy, research suggests 10-20 sets per muscle group per week. Beginners: 10-12 sets. Intermediate: 12-18 sets. Advanced: 18-25+ sets. More is not always better; recovery capacity matters." },
  ],
  formula: "Volume Load = Sets x Reps x Weight | Weekly Volume = Sets/session x Frequency x Reps x Weight",
};
