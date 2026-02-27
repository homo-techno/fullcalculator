import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stressScoreCalculator: CalculatorDefinition = {
  slug: "stress-score-calculator",
  title: "Stress Score Calculator",
  description: "Free stress score calculator. Assess and track your stress score with our evidence-based tool.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["stress score calculator", "health calculator", "wellness tool"],
  variants: [
    {
      id: "standard",
      name: "Stress Score",
      description: "Free stress score calculator. Assess and track your stress score with our eviden",
      fields: [
        {
          name: "workStress",
          label: "Work Stress (1-10)",
          type: "number",
          placeholder: "e.g. 7",
          min: 1,
          max: 10,
        },
        {
          name: "sleepHours",
          label: "Hours of Sleep",
          type: "number",
          placeholder: "e.g. 6",
          suffix: "hrs",
          min: 0,
          max: 24,
          step: 0.5,
        },
        {
          name: "exerciseMin",
          label: "Weekly Exercise",
          type: "number",
          placeholder: "e.g. 90",
          suffix: "min",
          min: 0,
        },
        {
          name: "socialScore",
          label: "Social Support (1-10)",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 10,
        },
        {
          name: "anxietyLevel",
          label: "Anxiety Level (1-10)",
          type: "number",
          placeholder: "e.g. 6",
          min: 1,
          max: 10,
        }
      ],
      calculate: (inputs) => {
        const work = inputs.workStress as number;
        const sleep = inputs.sleepHours as number;
        const exercise = inputs.exerciseMin as number;
        const social = inputs.socialScore as number;
        const anxiety = inputs.anxietyLevel as number;
        if (!work || !sleep || !social || !anxiety) return null;
        const sleepScore = sleep >= 7 ? 2 : sleep >= 6 ? 5 : 8;
        const exerciseScore = (exercise || 0) >= 150 ? 2 : (exercise || 0) >= 75 ? 4 : 7;
        const stressScore = Math.round((work + sleepScore + exerciseScore + (10 - social) + anxiety) / 5 * 10);
        const level = stressScore > 70 ? "High" : stressScore > 40 ? "Moderate" : "Low";
        return {
          primary: { label: "Stress Score", value: stressScore + "/100 (" + level + ")" },
          details: [
            { label: "Work stress impact", value: work + "/10" },
            { label: "Sleep quality impact", value: sleepScore + "/10" },
            { label: "Exercise benefit", value: exerciseScore + "/10" },
            { label: "Social support benefit", value: (10 - social) + "/10" },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["bmi-calculator", "calorie-calculator"],
  faq: [
    {
      question: "How is the stress score measured?",
      answer: "This calculator uses multiple factors to provide an overall score. It is meant for educational purposes and is not a medical diagnosis.",
    },
    {
      question: "Should I consult a doctor?",
      answer: "This calculator is for informational purposes only. Always consult healthcare professionals for medical advice and treatment.",
    }
  ],
  formula: "Score based on multiple weighted factors",
};
