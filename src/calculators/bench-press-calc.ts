import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const benchPressCalcCalculator: CalculatorDefinition = {
  slug: "bench-press-calc",
  title: "Bench Press Calculator",
  description: "Free online bench press standards and one-rep max calculator. Estimate your 1RM and see how your bench press compares to strength standards.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["bench press calculator", "bench press max", "1rm bench", "bench press standards", "one rep max bench"],
  variants: [
    {
      id: "bench-1rm",
      name: "Estimate Bench Press 1RM",
      fields: [
        { name: "weight", label: "Weight Lifted (lbs)", type: "number", placeholder: "e.g. 185" },
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
          if (ratio < 0.65) level = "Beginner";
          else if (ratio < 1.0) level = "Novice";
          else if (ratio < 1.25) level = "Intermediate";
          else if (ratio < 1.75) level = "Advanced";
          else level = "Elite";
        } else {
          if (ratio < 0.35) level = "Beginner";
          else if (ratio < 0.6) level = "Novice";
          else if (ratio < 0.8) level = "Intermediate";
          else if (ratio < 1.1) level = "Advanced";
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
  relatedSlugs: ["squat-calc", "deadlift-calc", "531-calculator"],
  faq: [
    {
      question: "How do I calculate my bench press one-rep max?",
      answer: "Use a weight you can lift for multiple reps and apply a formula. The Epley formula is: 1RM = Weight x (1 + Reps/30). The Brzycki formula is: 1RM = Weight x (36 / (37 - Reps)). These are most accurate for 2-10 reps.",
    },
    {
      question: "What is a good bench press for my weight?",
      answer: "For men, pressing your body weight (1x BW) is considered intermediate. A 1.5x body weight bench is advanced. For women, a 0.75x body weight bench is intermediate and 1x body weight is advanced.",
    },
    {
      question: "How often should I test my bench press max?",
      answer: "Test your true 1RM no more than once every 8-12 weeks. Frequent maximal attempts increase injury risk. Instead, use submaximal estimates (3-5 rep sets) to track progress more safely.",
    },
  ],
  formula: "Epley: 1RM = Weight x (1 + Reps/30); Brzycki: 1RM = Weight x (36 / (37 - Reps)); Estimated 1RM = Average of both",
};
