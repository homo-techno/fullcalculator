import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const squatMaxCalculator: CalculatorDefinition = {
  slug: "squat-max-calculator",
  title: "Squat Max Calculator",
  description:
    "Free squat max calculator. Estimate your one-rep max squat from the weight and reps you can perform. Uses Epley and Brzycki formulas with training percentage breakdowns.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "squat max calculator",
    "squat 1rm calculator",
    "squat one rep max",
    "squat calculator",
    "max squat calculator",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Squat 1RM",
      description: "Estimate your squat one-rep max",
      fields: [
        { name: "weight", label: "Weight Lifted", type: "number", placeholder: "e.g. 225", suffix: "lbs" },
        { name: "reps", label: "Reps Completed", type: "number", placeholder: "e.g. 5", min: 1, max: 30 },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const reps = inputs.reps as number;
        if (!weight || !reps) return null;

        if (reps === 1) {
          return {
            primary: { label: "Estimated 1RM", value: `${formatNumber(weight, 0)} lbs` },
            details: [
              { label: "90% (3-4 reps)", value: `${formatNumber(weight * 0.9, 0)} lbs` },
              { label: "80% (7-8 reps)", value: `${formatNumber(weight * 0.8, 0)} lbs` },
              { label: "70% (10-12 reps)", value: `${formatNumber(weight * 0.7, 0)} lbs` },
              { label: "60% (15-20 reps)", value: `${formatNumber(weight * 0.6, 0)} lbs` },
              { label: "50% (warm-up)", value: `${formatNumber(weight * 0.5, 0)} lbs` },
            ],
          };
        }

        const epley = weight * (1 + reps / 30);
        const brzycki = weight * (36 / (37 - reps));
        const avg = (epley + brzycki) / 2;

        return {
          primary: { label: "Estimated 1RM", value: `${formatNumber(avg, 0)} lbs` },
          details: [
            { label: "Epley Formula", value: `${formatNumber(epley, 0)} lbs` },
            { label: "Brzycki Formula", value: `${formatNumber(brzycki, 0)} lbs` },
            { label: "90% (3-4 reps)", value: `${formatNumber(avg * 0.9, 0)} lbs` },
            { label: "80% (7-8 reps)", value: `${formatNumber(avg * 0.8, 0)} lbs` },
            { label: "70% (10-12 reps)", value: `${formatNumber(avg * 0.7, 0)} lbs` },
            { label: "60% (15-20 reps)", value: `${formatNumber(avg * 0.6, 0)} lbs` },
            { label: "50% (warm-up)", value: `${formatNumber(avg * 0.5, 0)} lbs` },
          ],
          note: "Estimates are most accurate with 1-10 reps. Always use proper form and safety equipment when squatting heavy.",
        };
      },
    },
  ],
  relatedSlugs: ["one-rep-max-calculator", "bench-press-calculator", "deadlift-max-calculator"],
  faq: [
    {
      question: "What is a good squat for my bodyweight?",
      answer:
        "Beginner: 0.75x bodyweight, Intermediate: 1.25x bodyweight, Advanced: 2x bodyweight, Elite: 2.5x+ bodyweight. These are general guidelines for back squat and vary by sex, age, and training experience.",
    },
    {
      question: "How do I safely test my squat max?",
      answer:
        "Always use a squat rack with safety pins set at the appropriate height. Have a spotter or two on hand. Warm up progressively (bar, 50%, 70%, 85%, 95%) before attempting a max single. Stop if your form breaks down.",
    },
    {
      question: "Why is my squat max higher than my bench?",
      answer:
        "The squat uses the largest muscles in the body (glutes, quads, hamstrings) while the bench primarily uses chest, shoulders, and triceps. Most lifters squat 1.2-1.5x more than they bench press.",
    },
  ],
  formula:
    "Epley: 1RM = Weight × (1 + Reps / 30) | Brzycki: 1RM = Weight × 36 / (37 - Reps)",
};
