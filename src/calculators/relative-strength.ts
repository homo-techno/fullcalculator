import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const relativeStrengthCalculator: CalculatorDefinition = {
  slug: "relative-strength-calculator",
  title: "Relative Strength Index Calculator",
  description: "Free relative strength calculator. Measure your strength relative to your bodyweight for key lifts including squat, bench press, and deadlift.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["relative strength", "strength to bodyweight ratio", "strength standards", "bodyweight ratio", "strength index"],
  variants: [
    {
      id: "single-lift",
      name: "Single Lift Ratio",
      description: "Calculate your strength-to-bodyweight ratio for a single lift",
      fields: [
        { name: "liftWeight", label: "Weight Lifted (1RM)", type: "number", placeholder: "e.g. 225" },
        { name: "bodyWeight", label: "Body Weight", type: "number", placeholder: "e.g. 180" },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "lbs", value: "lbs" }, { label: "kg", value: "kg" },
        ], defaultValue: "lbs" },
        { name: "lift", label: "Lift Type", type: "select", options: [
          { label: "Squat", value: "squat" },
          { label: "Bench Press", value: "bench" },
          { label: "Deadlift", value: "deadlift" },
          { label: "Overhead Press", value: "ohp" },
          { label: "Other", value: "other" },
        ], defaultValue: "squat" },
      ],
      calculate: (inputs) => {
        const liftWeight = inputs.liftWeight as number;
        const bodyWeight = inputs.bodyWeight as number;
        const unit = inputs.unit as string;
        const lift = inputs.lift as string;
        if (!liftWeight || !bodyWeight) return null;
        const ratio = liftWeight / bodyWeight;
        const standards: Record<string, number[]> = {
          squat: [1.0, 1.5, 2.0, 2.5],
          bench: [0.75, 1.0, 1.5, 2.0],
          deadlift: [1.25, 1.75, 2.5, 3.0],
          ohp: [0.5, 0.75, 1.0, 1.25],
          other: [0.5, 1.0, 1.5, 2.0],
        };
        const s = standards[lift] || standards.other;
        let level: string;
        if (ratio < s[0]) level = "Beginner";
        else if (ratio < s[1]) level = "Intermediate";
        else if (ratio < s[2]) level = "Advanced";
        else if (ratio < s[3]) level = "Elite";
        else level = "World-class";
        return {
          primary: { label: "Strength Ratio", value: `${formatNumber(ratio, 2)}x BW` },
          details: [
            { label: "Level", value: level },
            { label: "Weight Lifted", value: `${formatNumber(liftWeight, 0)} ${unit}` },
            { label: "Body Weight", value: `${formatNumber(bodyWeight, 0)} ${unit}` },
            { label: "Beginner Threshold", value: `${formatNumber(s[0], 2)}x BW` },
            { label: "Intermediate Threshold", value: `${formatNumber(s[1], 2)}x BW` },
            { label: "Advanced Threshold", value: `${formatNumber(s[2], 2)}x BW` },
            { label: "Elite Threshold", value: `${formatNumber(s[3], 2)}x BW` },
          ],
        };
      },
    },
    {
      id: "total",
      name: "Total Relative Strength (SBD)",
      description: "Combined squat, bench, and deadlift relative to bodyweight",
      fields: [
        { name: "squat", label: "Squat 1RM", type: "number", placeholder: "e.g. 315" },
        { name: "bench", label: "Bench Press 1RM", type: "number", placeholder: "e.g. 225" },
        { name: "deadlift", label: "Deadlift 1RM", type: "number", placeholder: "e.g. 405" },
        { name: "bodyWeight", label: "Body Weight", type: "number", placeholder: "e.g. 180" },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "lbs", value: "lbs" }, { label: "kg", value: "kg" },
        ], defaultValue: "lbs" },
      ],
      calculate: (inputs) => {
        const squat = inputs.squat as number;
        const bench = inputs.bench as number;
        const deadlift = inputs.deadlift as number;
        const bw = inputs.bodyWeight as number;
        const unit = inputs.unit as string;
        if (!squat || !bench || !deadlift || !bw) return null;
        const total = squat + bench + deadlift;
        const ratio = total / bw;
        let level: string;
        if (ratio < 4) level = "Beginner";
        else if (ratio < 5.5) level = "Intermediate";
        else if (ratio < 7) level = "Advanced";
        else if (ratio < 8.5) level = "Elite";
        else level = "World-class";
        return {
          primary: { label: "Total Ratio", value: `${formatNumber(ratio, 2)}x BW` },
          details: [
            { label: "Level", value: level },
            { label: "Total", value: `${formatNumber(total, 0)} ${unit}` },
            { label: "Squat Ratio", value: `${formatNumber(squat / bw, 2)}x BW` },
            { label: "Bench Ratio", value: `${formatNumber(bench / bw, 2)}x BW` },
            { label: "Deadlift Ratio", value: `${formatNumber(deadlift / bw, 2)}x BW` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["one-rep-max-calculator", "bmi-calculator", "dots-calculator"],
  faq: [
    { question: "What is relative strength?", answer: "Relative strength is the ratio of weight lifted to your bodyweight. A 200 lb person benching 300 lbs has a 1.5x BW bench. It normalizes strength across different body sizes and is used in strength sports for comparison." },
    { question: "What is a good relative strength level?", answer: "For squat: 1.5x BW is intermediate, 2x BW is advanced. For bench: 1x BW is intermediate, 1.5x BW is advanced. For deadlift: 1.75x BW is intermediate, 2.5x BW is advanced. A combined SBD total of 5.5x+ BW is intermediate." },
  ],
  formula: "Relative Strength = Weight Lifted / Body Weight",
};
