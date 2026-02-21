import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fiberIntakeCalculator: CalculatorDefinition = {
  slug: "fiber-intake-calculator",
  title: "Fiber Intake Calculator",
  description:
    "Free fiber intake calculator. Find your recommended daily fiber intake based on age and sex. See how your current intake compares and how to close the gap.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "fiber intake calculator",
    "daily fiber calculator",
    "how much fiber do I need",
    "fiber calculator",
    "dietary fiber recommendation",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Fiber Needs",
      description: "Find your recommended daily fiber and see your gap",
      fields: [
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 35" },
        {
          name: "sex",
          label: "Sex",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
          defaultValue: "male",
        },
        { name: "currentIntake", label: "Current Daily Fiber Intake (optional)", type: "number", placeholder: "e.g. 15", suffix: "g" },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const sex = inputs.sex as string;
        const currentIntake = inputs.currentIntake as number;
        if (!age) return null;

        let target: number;
        if (age <= 3) target = 14;
        else if (age <= 8) target = sex === "male" ? 20 : 22;
        else if (age <= 13) target = sex === "male" ? 25 : 22;
        else if (age <= 18) target = sex === "male" ? 31 : 26;
        else if (age <= 50) target = sex === "male" ? 38 : 25;
        else target = sex === "male" ? 30 : 21;

        const details: { label: string; value: string }[] = [
          { label: "Daily Target", value: `${target}g` },
        ];

        if (currentIntake !== undefined && currentIntake !== null && currentIntake > 0) {
          const gap = target - currentIntake;
          const pctOfTarget = (currentIntake / target) * 100;
          details.push(
            { label: "Current Intake", value: `${formatNumber(currentIntake, 0)}g` },
            { label: "Gap", value: gap > 0 ? `${formatNumber(gap, 0)}g short` : "You're meeting your target!" },
            { label: "% of Target", value: `${formatNumber(pctOfTarget, 0)}%` },
          );
        }

        details.push(
          { label: "High-Fiber Foods", value: "Lentils (15g/cup), Black beans (15g/cup), Avocado (10g), Pear (6g), Oats (4g/cup)" },
          { label: "Average American Intake", value: "~15g/day (well below recommendations)" },
        );

        return {
          primary: { label: "Recommended Daily Fiber", value: `${target}g` },
          details,
          note: "Increase fiber gradually (5g per week) and drink plenty of water to avoid digestive discomfort. Both soluble and insoluble fiber are important.",
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "iron-intake-calculator", "sugar-intake-calculator", "macro-calculator"],
  faq: [
    {
      question: "How much fiber do I need per day?",
      answer:
        "Adult men need 30-38g per day, and adult women need 21-25g per day. Most Americans only get about 15g per day, roughly half the recommended amount.",
    },
    {
      question: "What happens if I don't eat enough fiber?",
      answer:
        "Low fiber intake is associated with constipation, increased risk of heart disease, type 2 diabetes, and colorectal cancer. Fiber also helps with weight management by increasing satiety.",
    },
    {
      question: "What is the difference between soluble and insoluble fiber?",
      answer:
        "Soluble fiber dissolves in water and forms a gel (oats, beans, apples) — it helps lower cholesterol and blood sugar. Insoluble fiber adds bulk to stool (whole wheat, vegetables, nuts) — it helps prevent constipation. Both types are important.",
    },
  ],
  formula:
    "Recommended Fiber: Men (19-50) = 38g, Men (51+) = 30g, Women (19-50) = 25g, Women (51+) = 21g",
};
