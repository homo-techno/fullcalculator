import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const squatStrengthCalculator: CalculatorDefinition = {
  slug: "squat-strength-calculator",
  title: "Squat Strength Calculator",
  description: "Assess your squat performance level based on weight lifted, body weight, and training experience.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["squat strength", "squat standards", "squat performance"],
  variants: [{
    id: "standard",
    name: "Squat Strength",
    description: "Assess your squat performance level based on weight lifted, body weight, and training experience",
    fields: [
      { name: "bodyWeight", label: "Body Weight", type: "number", suffix: "lbs", min: 80, max: 400, defaultValue: 180 },
      { name: "liftWeight", label: "Weight Squatted", type: "number", suffix: "lbs", min: 20, max: 1500, defaultValue: 225 },
      { name: "reps", label: "Repetitions", type: "number", min: 1, max: 30, defaultValue: 5 },
      { name: "gender", label: "Gender", type: "select", options: [{value:"male",label:"Male"},{value:"female",label:"Female"}], defaultValue: "male" },
    ],
    calculate: (inputs) => {
      const bw = inputs.bodyWeight as number;
      const lw = inputs.liftWeight as number;
      const reps = inputs.reps as number;
      const gender = inputs.gender as string;
      if (!bw || !lw || !reps) return null;
      const oneRepMax = Math.round(lw * (1 + reps / 30));
      const ratio = oneRepMax / bw;
      const thresholds = gender === "female"
        ? { beginner: 0.5, novice: 0.75, intermediate: 1.0, advanced: 1.5 }
        : { beginner: 0.75, novice: 1.25, intermediate: 1.5, advanced: 2.0 };
      let level = "Elite";
      if (ratio < thresholds.beginner) level = "Beginner";
      else if (ratio < thresholds.novice) level = "Novice";
      else if (ratio < thresholds.intermediate) level = "Intermediate";
      else if (ratio < thresholds.advanced) level = "Advanced";
      return {
        primary: { label: "Squat Level", value: level },
        details: [
          { label: "Estimated 1-Rep Max", value: formatNumber(oneRepMax) + " lbs" },
          { label: "Strength Ratio", value: ratio.toFixed(2) + "x body weight" },
          { label: "Body Weight", value: formatNumber(bw) + " lbs" },
        ],
      };
    },
  }],
  relatedSlugs: ["bench-press-strength-calculator", "deadlift-strength-calculator"],
  faq: [
    { question: "What is a good squat weight?", answer: "An intermediate male lifter should squat about 1.5 times body weight. Females should target about 1.0 times body weight at intermediate level." },
    { question: "How do I improve my squat strength?", answer: "Progressive overload with consistent training, proper form, and adequate recovery will improve squat strength over time." },
  ],
  formula: "One Rep Max = Weight x (1 + Reps / 30)",
};
