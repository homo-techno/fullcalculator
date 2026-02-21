import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gripStrengthCalculator: CalculatorDefinition = {
  slug: "grip-strength-calculator",
  title: "Grip Strength Calculator",
  description:
    "Free grip strength assessment calculator. Evaluate your grip strength against age and gender norms using hand dynamometer readings.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "grip strength calculator",
    "hand grip test",
    "grip strength norms",
    "dynamometer test",
    "grip strength assessment",
  ],
  variants: [
    {
      id: "assess",
      name: "Grip Strength Assessment",
      description: "Evaluate your grip strength against population norms",
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
        {
          name: "age",
          label: "Age Group",
          type: "select",
          options: [
            { label: "20-29", value: "20" },
            { label: "30-39", value: "30" },
            { label: "40-49", value: "40" },
            { label: "50-59", value: "50" },
            { label: "60-69", value: "60" },
            { label: "70+", value: "70" },
          ],
        },
        { name: "rightHand", label: "Right Hand (kg)", type: "number", placeholder: "e.g. 45", step: 0.1 },
        { name: "leftHand", label: "Left Hand (kg)", type: "number", placeholder: "e.g. 42", step: 0.1 },
      ],
      calculate: (inputs) => {
        const gender = inputs.gender as string;
        const age = parseInt(inputs.age as string);
        const right = inputs.rightHand as number;
        const left = inputs.leftHand as number;
        if (!right && !left) return null;

        // Normative data (kg) - approximate averages by age and gender
        const maleNorms: Record<number, number[]> = {
          20: [36, 44, 51, 57, 65],
          30: [36, 43, 50, 56, 64],
          40: [34, 41, 48, 54, 62],
          50: [30, 38, 45, 51, 59],
          60: [26, 34, 41, 47, 55],
          70: [22, 29, 36, 42, 49],
        };
        const femaleNorms: Record<number, number[]> = {
          20: [20, 26, 31, 36, 42],
          30: [20, 26, 31, 36, 42],
          40: [18, 24, 29, 34, 40],
          50: [16, 22, 27, 32, 38],
          60: [14, 19, 24, 29, 35],
          70: [12, 17, 21, 26, 31],
        };

        const norms = gender === "male" ? maleNorms[age] : femaleNorms[age];
        const best = Math.max(right || 0, left || 0);
        const combined = (right || 0) + (left || 0);

        let rating = "Needs Improvement";
        if (norms) {
          if (best >= norms[4]) rating = "Excellent";
          else if (best >= norms[3]) rating = "Very Good";
          else if (best >= norms[2]) rating = "Good (Average)";
          else if (best >= norms[1]) rating = "Below Average";
          else rating = "Needs Improvement";
        }

        const dominanceRatio = right && left ? ((Math.max(right, left) - Math.min(right, left)) / Math.max(right, left)) * 100 : 0;

        return {
          primary: { label: "Best Grip", value: formatNumber(best, 1), suffix: "kg" },
          details: [
            { label: "Right Hand", value: `${formatNumber(right || 0, 1)} kg (${formatNumber((right || 0) * 2.20462, 1)} lbs)` },
            { label: "Left Hand", value: `${formatNumber(left || 0, 1)} kg (${formatNumber((left || 0) * 2.20462, 1)} lbs)` },
            { label: "Combined", value: `${formatNumber(combined, 1)} kg` },
            { label: "Hand Imbalance", value: `${formatNumber(dominanceRatio, 1)}%` },
            { label: "Rating", value: rating },
          ],
          note: "Norms based on published population data. A 10% or less difference between hands is considered normal.",
        };
      },
    },
  ],
  relatedSlugs: ["body-fat-calculator", "bmi-calculator", "one-rep-max-calculator"],
  faq: [
    {
      question: "What is a good grip strength?",
      answer:
        "For adult males (aged 20-40), average grip strength is about 45-55 kg. For adult females, average is about 25-35 kg. Grip strength naturally declines with age. Values above the 75th percentile for your age/gender group are considered good.",
    },
    {
      question: "Why is grip strength important?",
      answer:
        "Grip strength is a strong predictor of overall health and mortality. Research shows it correlates with cardiovascular health, bone density, cognitive function, and functional independence. It's also essential for many sports and daily activities.",
    },
    {
      question: "How do I measure grip strength?",
      answer:
        "Use a hand dynamometer. Stand with your arm at your side, elbow at 90 degrees. Squeeze the dynamometer as hard as possible for 3-5 seconds. Take the best of 3 attempts for each hand with 30-60 seconds rest between tries.",
    },
  ],
  formula: "Rating based on age/gender normative percentile tables | Hand Imbalance = (Stronger - Weaker) / Stronger × 100",
};
