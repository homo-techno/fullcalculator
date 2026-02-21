import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const strengthStandardsCalculator: CalculatorDefinition = {
  slug: "strength-standards-calculator",
  title: "Strength Standards Calculator",
  description:
    "Free strength standards calculator. See how your bench press, squat, deadlift, and overhead press compare to your body weight and experience level.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "strength standards",
    "strength level calculator",
    "bench press standards",
    "squat standards by bodyweight",
    "how strong am I",
  ],
  variants: [
    {
      id: "assess",
      name: "Strength Assessment",
      description: "Compare your lifts against bodyweight-based standards",
      fields: [
        {
          name: "gender",
          label: "Gender",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
        { name: "bodyweight", label: "Body Weight (lbs)", type: "number", placeholder: "e.g. 180", min: 1 },
        {
          name: "lift",
          label: "Lift",
          type: "select",
          options: [
            { label: "Bench Press", value: "bench" },
            { label: "Back Squat", value: "squat" },
            { label: "Deadlift", value: "deadlift" },
            { label: "Overhead Press", value: "ohp" },
          ],
          defaultValue: "bench",
        },
        { name: "weight", label: "Weight Lifted (lbs)", type: "number", placeholder: "e.g. 225", min: 0 },
      ],
      calculate: (inputs) => {
        const gender = inputs.gender as string;
        const bw = inputs.bodyweight as number;
        const lift = inputs.lift as string;
        const weight = inputs.weight as number;
        if (!bw || !weight) return null;

        const ratio = weight / bw;

        // Strength standards as multiplier of bodyweight
        // [beginner, novice, intermediate, advanced, elite]
        const maleStandards: Record<string, number[]> = {
          bench: [0.50, 0.75, 1.00, 1.50, 2.00],
          squat: [0.75, 1.00, 1.50, 2.00, 2.50],
          deadlift: [1.00, 1.25, 1.75, 2.50, 3.00],
          ohp: [0.35, 0.55, 0.75, 1.00, 1.40],
        };
        const femaleStandards: Record<string, number[]> = {
          bench: [0.25, 0.50, 0.75, 1.00, 1.50],
          squat: [0.50, 0.75, 1.00, 1.50, 2.00],
          deadlift: [0.75, 1.00, 1.25, 1.75, 2.50],
          ohp: [0.20, 0.35, 0.50, 0.75, 1.00],
        };

        const standards = gender === "male" ? maleStandards[lift] : femaleStandards[lift];
        if (!standards) return null;

        let level = "Untrained";
        if (ratio >= standards[4]) level = "Elite (Top 5%)";
        else if (ratio >= standards[3]) level = "Advanced (Top 15%)";
        else if (ratio >= standards[2]) level = "Intermediate (Top 40%)";
        else if (ratio >= standards[1]) level = "Novice";
        else if (ratio >= standards[0]) level = "Beginner";

        const liftNames: Record<string, string> = {
          bench: "Bench Press",
          squat: "Back Squat",
          deadlift: "Deadlift",
          ohp: "Overhead Press",
        };

        const nextLevel = standards.findIndex(s => ratio < s);
        const nextTarget = nextLevel >= 0 ? standards[nextLevel] * bw : null;

        return {
          primary: { label: "Strength Level", value: level },
          details: [
            { label: liftNames[lift], value: `${formatNumber(weight, 0)} lbs` },
            { label: "Body Weight", value: `${formatNumber(bw, 0)} lbs` },
            { label: "Strength Ratio", value: `${formatNumber(ratio, 2)}x bodyweight` },
            { label: "Beginner", value: `${formatNumber(standards[0] * bw, 0)} lbs (${standards[0]}x)` },
            { label: "Intermediate", value: `${formatNumber(standards[2] * bw, 0)} lbs (${standards[2]}x)` },
            { label: "Advanced", value: `${formatNumber(standards[3] * bw, 0)} lbs (${standards[3]}x)` },
            { label: "Elite", value: `${formatNumber(standards[4] * bw, 0)} lbs (${standards[4]}x)` },
            ...(nextTarget ? [{ label: "Next Milestone", value: `${formatNumber(nextTarget, 0)} lbs` }] : []),
          ],
        };
      },
    },
  ],
  relatedSlugs: ["one-rep-max-calculator", "bench-press-calculator", "wilks-score-calculator"],
  faq: [
    {
      question: "What are good strength standards?",
      answer:
        "For males, intermediate standards (with 1+ year of training) are roughly: Bench Press 1x bodyweight, Squat 1.5x, Deadlift 1.75x, Overhead Press 0.75x. Advanced lifters (3-5 years) aim for: Bench 1.5x, Squat 2x, Deadlift 2.5x, OHP 1x.",
    },
    {
      question: "How is strength level determined?",
      answer:
        "Strength level is based on the ratio of weight lifted to body weight. This normalizes strength across different body sizes. Standards vary by lift, gender, and experience level, drawn from large databases of lifter performance.",
    },
    {
      question: "Is a 2x bodyweight bench press achievable?",
      answer:
        "A 2x bodyweight bench press is achievable for dedicated male lifters after several years of consistent training. It places you in the top ~5% of all lifters. For females, a 1.5x bodyweight bench press is an equivalent elite achievement.",
    },
  ],
  formula: "Strength Ratio = Weight Lifted / Body Weight | Level based on ratio compared to gender-specific standards",
};
