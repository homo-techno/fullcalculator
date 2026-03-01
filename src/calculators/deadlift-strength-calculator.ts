import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const deadliftStrengthCalculator: CalculatorDefinition = {
  slug: "deadlift-strength-calculator",
  title: "Deadlift Strength Calculator",
  description: "Determine your deadlift performance level by comparing your lift to established strength standards.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["deadlift strength", "deadlift standards", "deadlift performance"],
  variants: [{
    id: "standard",
    name: "Deadlift Strength",
    description: "Determine your deadlift performance level by comparing your lift to established strength standards",
    fields: [
      { name: "bodyWeight", label: "Body Weight", type: "number", suffix: "lbs", min: 80, max: 400, defaultValue: 180 },
      { name: "liftWeight", label: "Weight Lifted", type: "number", suffix: "lbs", min: 20, max: 1500, defaultValue: 275 },
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
        ? { beginner: 0.6, novice: 1.0, intermediate: 1.25, advanced: 1.75 }
        : { beginner: 1.0, novice: 1.5, intermediate: 1.75, advanced: 2.5 };
      let level = "Elite";
      if (ratio < thresholds.beginner) level = "Beginner";
      else if (ratio < thresholds.novice) level = "Novice";
      else if (ratio < thresholds.intermediate) level = "Intermediate";
      else if (ratio < thresholds.advanced) level = "Advanced";
      return {
        primary: { label: "Deadlift Level", value: level },
        details: [
          { label: "Estimated 1-Rep Max", value: formatNumber(oneRepMax) + " lbs" },
          { label: "Strength Ratio", value: ratio.toFixed(2) + "x body weight" },
          { label: "Body Weight", value: formatNumber(bw) + " lbs" },
        ],
      };
    },
  }],
  relatedSlugs: ["squat-strength-calculator", "bench-press-strength-calculator"],
  faq: [
    { question: "What is a good deadlift for beginners?", answer: "Beginner male lifters should aim for at least 1.0 times body weight. Female beginners should target around 0.6 times body weight." },
    { question: "Is deadlift the best strength indicator?", answer: "The deadlift tests overall posterior chain strength and is considered one of the best measures of total body strength." },
  ],
  formula: "One Rep Max = Weight x (1 + Reps / 30)",
};
