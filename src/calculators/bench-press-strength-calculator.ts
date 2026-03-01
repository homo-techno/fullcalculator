import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const benchPressStrengthCalculator: CalculatorDefinition = {
  slug: "bench-press-strength-calculator",
  title: "Bench Press Strength Calculator",
  description: "Evaluate your bench press performance level based on body weight, weight lifted, and experience.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["bench press strength", "bench press standards", "bench press level"],
  variants: [{
    id: "standard",
    name: "Bench Press Strength",
    description: "Evaluate your bench press performance level based on body weight, weight lifted, and experience",
    fields: [
      { name: "bodyWeight", label: "Body Weight", type: "number", suffix: "lbs", min: 80, max: 400, defaultValue: 180 },
      { name: "liftWeight", label: "Weight Lifted", type: "number", suffix: "lbs", min: 20, max: 1000, defaultValue: 185 },
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
        ? { beginner: 0.4, novice: 0.65, intermediate: 0.85, advanced: 1.15 }
        : { beginner: 0.6, novice: 1.0, intermediate: 1.25, advanced: 1.75 };
      let level = "Elite";
      if (ratio < thresholds.beginner) level = "Beginner";
      else if (ratio < thresholds.novice) level = "Novice";
      else if (ratio < thresholds.intermediate) level = "Intermediate";
      else if (ratio < thresholds.advanced) level = "Advanced";
      return {
        primary: { label: "Strength Level", value: level },
        details: [
          { label: "Estimated 1-Rep Max", value: formatNumber(oneRepMax) + " lbs" },
          { label: "Strength Ratio", value: ratio.toFixed(2) + "x body weight" },
          { label: "Body Weight", value: formatNumber(bw) + " lbs" },
        ],
      };
    },
  }],
  relatedSlugs: ["squat-strength-calculator", "deadlift-strength-calculator"],
  faq: [
    { question: "What is a good bench press for my weight?", answer: "An intermediate male lifter should bench about 1.25 times body weight. For females the intermediate standard is about 0.85 times body weight." },
    { question: "How is one rep max calculated?", answer: "One rep max is estimated by multiplying the weight lifted by (1 + reps / 30), known as the Epley formula." },
  ],
  formula: "One Rep Max = Weight x (1 + Reps / 30)",
};
