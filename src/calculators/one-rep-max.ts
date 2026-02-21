import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const oneRepMaxCalculator: CalculatorDefinition = {
  slug: "one-rep-max-calculator",
  title: "One Rep Max Calculator",
  description: "Free one rep max (1RM) calculator. Estimate your max lift for bench press, squat, or deadlift based on weight and reps performed.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["one rep max calculator", "1rm calculator", "max lift calculator", "bench press max", "squat max calculator"],
  variants: [
    {
      id: "orm",
      name: "Estimate 1RM",
      description: "Enter the weight lifted and reps completed (2-12 reps for best accuracy)",
      fields: [
        { name: "weight", label: "Weight Lifted", type: "number", placeholder: "e.g. 185" },
        { name: "reps", label: "Reps Completed", type: "number", placeholder: "e.g. 5", min: 1, max: 15 },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "lbs", value: "lbs" }, { label: "kg", value: "kg" },
        ], defaultValue: "lbs" },
      ],
      calculate: (inputs) => {
        const w = inputs.weight as number;
        const r = inputs.reps as number;
        const unit = inputs.unit as string;
        if (!w || !r) return null;
        if (r === 1) return { primary: { label: "1RM", value: `${w} ${unit}` }, details: [] };
        const brzycki = w * (36 / (37 - r));
        const epley = w * (1 + r / 30);
        const avg = (brzycki + epley) / 2;
        const pcts = [95, 90, 85, 80, 75, 70, 65, 60];
        const repRanges = [2, 3, 5, 8, 10, 12, 15, 20];
        return {
          primary: { label: "Estimated 1RM", value: `${formatNumber(avg, 0)} ${unit}` },
          details: [
            { label: "Brzycki formula", value: `${formatNumber(brzycki, 0)} ${unit}` },
            { label: "Epley formula", value: `${formatNumber(epley, 0)} ${unit}` },
            ...pcts.map((p, i) => ({
              label: `${p}% (~${repRanges[i]} reps)`,
              value: `${formatNumber(avg * p / 100, 0)} ${unit}`,
            })),
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "calorie-calculator", "protein-calculator"],
  faq: [
    { question: "What is a one rep max?", answer: "Your 1RM is the maximum weight you can lift for a single repetition with proper form. It's used to program training percentages. You can estimate it from a set of multiple reps instead of actually maxing out." },
    { question: "Which 1RM formula is best?", answer: "Brzycki and Epley are most common. Both are accurate for 2-10 reps. Above 10 reps, accuracy decreases. This calculator averages both formulas for a better estimate." },
  ],
  formula: "Brzycki: 1RM = W × 36/(37-R) | Epley: 1RM = W × (1 + R/30)",
};
