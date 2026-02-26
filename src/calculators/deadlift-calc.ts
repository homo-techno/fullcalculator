import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const deadliftCalcCalculator: CalculatorDefinition = {
  slug: "deadlift-calc",
  title: "Deadlift Calculator",
  description: "Free online deadlift standards and one-rep max calculator. Estimate your deadlift 1RM and compare your strength to standards by body weight and experience.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["deadlift calculator", "deadlift max", "1rm deadlift", "deadlift standards", "one rep max deadlift"],
  variants: [
    {
      id: "deadlift-1rm",
      name: "Estimate Deadlift 1RM",
      fields: [
        { name: "weight", label: "Weight Lifted (lbs)", type: "number", placeholder: "e.g. 315" },
        { name: "reps", label: "Reps Completed", type: "number", placeholder: "e.g. 5" },
        { name: "bodyweight", label: "Your Body Weight (lbs)", type: "number", placeholder: "e.g. 180" },
        {
          name: "gender",
          label: "Gender",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string) || 0;
        const reps = parseFloat(inputs.reps as string) || 1;
        const bodyweight = parseFloat(inputs.bodyweight as string) || 0;
        const gender = inputs.gender as string;

        const epley1RM = reps === 1 ? weight : weight * (1 + reps / 30);
        const brzycki1RM = reps === 1 ? weight : weight * (36 / (37 - reps));
        const estimated1RM = (epley1RM + brzycki1RM) / 2;

        const ratio = bodyweight > 0 ? estimated1RM / bodyweight : 0;

        let level: string;
        if (gender === "male") {
          if (ratio < 1.0) level = "Beginner";
          else if (ratio < 1.5) level = "Novice";
          else if (ratio < 2.0) level = "Intermediate";
          else if (ratio < 2.5) level = "Advanced";
          else level = "Elite";
        } else {
          if (ratio < 0.5) level = "Beginner";
          else if (ratio < 1.0) level = "Novice";
          else if (ratio < 1.25) level = "Intermediate";
          else if (ratio < 1.75) level = "Advanced";
          else level = "Elite";
        }

        const pct95 = estimated1RM * 0.95;
        const pct90 = estimated1RM * 0.9;
        const pct85 = estimated1RM * 0.85;
        const pct80 = estimated1RM * 0.8;
        const pct75 = estimated1RM * 0.75;

        return {
          primary: { label: "Estimated 1RM", value: `${formatNumber(Math.round(estimated1RM))} lbs` },
          details: [
            { label: "Epley Formula", value: `${formatNumber(Math.round(epley1RM))} lbs` },
            { label: "Brzycki Formula", value: `${formatNumber(Math.round(brzycki1RM))} lbs` },
            { label: "Strength-to-Weight Ratio", value: formatNumber(ratio) },
            { label: "Strength Level", value: level },
            { label: "95% (2 reps)", value: `${formatNumber(Math.round(pct95))} lbs` },
            { label: "90% (3-4 reps)", value: `${formatNumber(Math.round(pct90))} lbs` },
            { label: "85% (5-6 reps)", value: `${formatNumber(Math.round(pct85))} lbs` },
            { label: "80% (7-8 reps)", value: `${formatNumber(Math.round(pct80))} lbs` },
            { label: "75% (10 reps)", value: `${formatNumber(Math.round(pct75))} lbs` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["squat-calc", "bench-press-calc", "531-calculator"],
  faq: [
    {
      question: "What is a good deadlift for my body weight?",
      answer: "For men, deadlifting 2x body weight is considered intermediate-to-advanced. A 2.5x body weight deadlift is elite level. For women, a 1.25x body weight deadlift is intermediate and 1.75x is advanced.",
    },
    {
      question: "Is the deadlift the best measure of overall strength?",
      answer: "The deadlift is often considered the truest test of raw strength because it involves the most total muscle mass and has minimal technique advantage compared to the squat or bench press. It is a staple in powerlifting competitions.",
    },
    {
      question: "How often should I deadlift?",
      answer: "Most lifters benefit from deadlifting 1-2 times per week. Heavy deadlifts are very taxing on the central nervous system, so adequate recovery (48-72 hours) between sessions is important for progress and injury prevention.",
    },
  ],
  formula: "Epley: 1RM = Weight x (1 + Reps/30); Brzycki: 1RM = Weight x (36 / (37 - Reps)); Estimated 1RM = Average of both",
};
