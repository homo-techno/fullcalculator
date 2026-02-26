import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const squatCalcCalculator: CalculatorDefinition = {
  slug: "squat-calc",
  title: "Squat Calculator",
  description: "Free online squat standards and one-rep max calculator. Estimate your squat 1RM and see how your squat compares to strength standards by body weight.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["squat calculator", "squat max", "1rm squat", "squat standards", "one rep max squat", "back squat"],
  variants: [
    {
      id: "squat-1rm",
      name: "Estimate Squat 1RM",
      fields: [
        { name: "weight", label: "Weight Lifted (lbs)", type: "number", placeholder: "e.g. 225" },
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
          if (ratio < 0.75) level = "Beginner";
          else if (ratio < 1.25) level = "Novice";
          else if (ratio < 1.5) level = "Intermediate";
          else if (ratio < 2.0) level = "Advanced";
          else level = "Elite";
        } else {
          if (ratio < 0.5) level = "Beginner";
          else if (ratio < 0.75) level = "Novice";
          else if (ratio < 1.0) level = "Intermediate";
          else if (ratio < 1.5) level = "Advanced";
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
  relatedSlugs: ["bench-press-calc", "deadlift-calc", "531-calculator"],
  faq: [
    {
      question: "What is a good squat for my body weight?",
      answer: "For men, squatting 1.5x body weight is considered intermediate-to-advanced. A 2x body weight squat is elite level. For women, a 1x body weight squat is intermediate and 1.5x is advanced.",
    },
    {
      question: "How accurate are one-rep max calculators?",
      answer: "1RM calculators are most accurate when using sets of 2-10 reps. Accuracy decreases with higher rep counts. The Epley and Brzycki formulas are within 5-10% for most lifters when using 3-6 rep sets.",
    },
    {
      question: "Should I test my true 1RM squat?",
      answer: "True 1RM testing should be done sparingly (every 8-12 weeks) and with a spotter or safety bars. For programming purposes, an estimated 1RM from a 3-5 rep set is safer and sufficiently accurate.",
    },
  ],
  formula: "Epley: 1RM = Weight x (1 + Reps/30); Brzycki: 1RM = Weight x (36 / (37 - Reps)); Estimated 1RM = Average of both",
};
