import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const benchPressCalculator: CalculatorDefinition = {
  slug: "bench-press-calculator",
  title: "Bench Press Calculator",
  description:
    "Free bench press max calculator. Estimate your one-rep max (1RM) from the weight and reps you can perform. Uses Epley and Brzycki formulas with training percentage tables.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "bench press calculator",
    "bench press max calculator",
    "1rm bench press",
    "bench press one rep max",
    "bench max calculator",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate 1RM",
      description: "Estimate your bench press one-rep max",
      fields: [
        { name: "weight", label: "Weight Lifted", type: "number", placeholder: "e.g. 185", suffix: "lbs" },
        { name: "reps", label: "Reps Completed", type: "number", placeholder: "e.g. 8", min: 1, max: 30 },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const reps = inputs.reps as number;
        if (!weight || !reps) return null;

        if (reps === 1) {
          return {
            primary: { label: "Estimated 1RM", value: `${formatNumber(weight, 0)} lbs` },
            details: [
              { label: "95% (2 reps)", value: `${formatNumber(weight * 0.95, 0)} lbs` },
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
            { label: "95% (2 reps)", value: `${formatNumber(avg * 0.95, 0)} lbs` },
            { label: "90% (3-4 reps)", value: `${formatNumber(avg * 0.9, 0)} lbs` },
            { label: "80% (7-8 reps)", value: `${formatNumber(avg * 0.8, 0)} lbs` },
            { label: "70% (10-12 reps)", value: `${formatNumber(avg * 0.7, 0)} lbs` },
            { label: "60% (15-20 reps)", value: `${formatNumber(avg * 0.6, 0)} lbs` },
            { label: "50% (warm-up)", value: `${formatNumber(avg * 0.5, 0)} lbs` },
          ],
          note: "Estimates are most accurate with 1-10 reps. Higher rep counts reduce accuracy. Always use a spotter when testing maxes.",
        };
      },
    },
  ],
  relatedSlugs: ["one-rep-max-calculator", "squat-max-calculator", "deadlift-max-calculator"],
  faq: [
    {
      question: "How accurate are bench press max calculators?",
      answer:
        "1RM calculators are most accurate when using sets of 1-10 reps. Accuracy decreases with higher rep counts. The Epley and Brzycki formulas are typically accurate within 5% for low rep ranges.",
    },
    {
      question: "What is a good bench press for my weight?",
      answer:
        "Beginner: 0.5x bodyweight, Intermediate: 1x bodyweight, Advanced: 1.5x bodyweight, Elite: 2x bodyweight. These are general guidelines and vary by age, sex, and training experience.",
    },
    {
      question: "What is the difference between Epley and Brzycki?",
      answer:
        "The Epley formula (1RM = weight x (1 + reps/30)) tends to estimate slightly higher for more reps. The Brzycki formula (1RM = weight x 36/(37-reps)) is more conservative. Both are well-validated for lower rep ranges.",
    },
  ],
  formula:
    "Epley: 1RM = Weight × (1 + Reps / 30) | Brzycki: 1RM = Weight × 36 / (37 - Reps)",
};
