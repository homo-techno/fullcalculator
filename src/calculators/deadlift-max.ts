import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const deadliftMaxCalculator: CalculatorDefinition = {
  slug: "deadlift-max-calculator",
  title: "Deadlift Max Calculator",
  description:
    "Free deadlift max calculator. Estimate your one-rep max deadlift using the Epley formula. See strength standards based on bodyweight ratio from beginner to elite.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "deadlift max calculator",
    "deadlift 1rm calculator",
    "deadlift one rep max",
    "deadlift calculator",
    "deadlift strength standards",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Deadlift 1RM",
      description: "Estimate your deadlift one-rep max and strength level",
      fields: [
        { name: "weight", label: "Weight Lifted", type: "number", placeholder: "e.g. 275", suffix: "lbs" },
        { name: "reps", label: "Reps Completed", type: "number", placeholder: "e.g. 5", min: 1, max: 30 },
        { name: "bodyweight", label: "Your Bodyweight", type: "number", placeholder: "e.g. 180", suffix: "lbs" },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const reps = inputs.reps as number;
        const bodyweight = inputs.bodyweight as number;
        if (!weight || !reps) return null;

        let oneRM: number;
        if (reps === 1) {
          oneRM = weight;
        } else {
          oneRM = weight * (1 + reps / 30);
        }

        const details: { label: string; value: string }[] = [
          { label: "Epley 1RM", value: `${formatNumber(oneRM, 0)} lbs` },
          { label: "90% (3-4 reps)", value: `${formatNumber(oneRM * 0.9, 0)} lbs` },
          { label: "80% (7-8 reps)", value: `${formatNumber(oneRM * 0.8, 0)} lbs` },
          { label: "70% (10-12 reps)", value: `${formatNumber(oneRM * 0.7, 0)} lbs` },
          { label: "60% (15-20 reps)", value: `${formatNumber(oneRM * 0.6, 0)} lbs` },
        ];

        if (bodyweight && bodyweight > 0) {
          const ratio = oneRM / bodyweight;
          let level: string;
          if (ratio < 1.0) level = "Beginner (< 1.0x BW)";
          else if (ratio < 1.5) level = "Novice (1.0 - 1.5x BW)";
          else if (ratio < 2.0) level = "Intermediate (1.5 - 2.0x BW)";
          else if (ratio < 2.5) level = "Advanced (2.0 - 2.5x BW)";
          else level = "Elite (2.5x+ BW)";

          details.push(
            { label: "BW Ratio", value: `${formatNumber(ratio, 2)}x bodyweight` },
            { label: "Strength Level", value: level },
          );
        }

        return {
          primary: { label: "Estimated 1RM", value: `${formatNumber(oneRM, 0)} lbs` },
          details,
          note: "Deadlift standards: Beginner < 1x BW, Novice 1-1.5x, Intermediate 1.5-2x, Advanced 2-2.5x, Elite 2.5x+. Always use proper form and don't round your back.",
        };
      },
    },
  ],
  relatedSlugs: ["one-rep-max-calculator", "bench-press-calculator", "squat-max-calculator", "wilks-score-calculator"],
  faq: [
    {
      question: "What is a good deadlift for my bodyweight?",
      answer:
        "Beginner: 1x bodyweight, Intermediate: 1.5x bodyweight, Advanced: 2x bodyweight, Elite: 2.5x+ bodyweight. The deadlift is typically the strongest of the three powerlifts for most people.",
    },
    {
      question: "Is the deadlift dangerous?",
      answer:
        "When performed with proper form, the deadlift is a safe and effective full-body exercise. The key is to maintain a neutral spine, brace your core, and avoid rounding your lower back. Start light and focus on technique.",
    },
    {
      question: "How often should I deadlift?",
      answer:
        "Most intermediate lifters benefit from deadlifting 1-2 times per week. Recovery is important since the deadlift taxes the central nervous system heavily. Allow at least 48-72 hours between heavy deadlift sessions.",
    },
  ],
  formula:
    "Epley: 1RM = Weight × (1 + Reps / 30) | Strength Ratio = 1RM / Bodyweight",
};
