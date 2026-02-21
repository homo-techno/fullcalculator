import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function getLetterGrade(pct: number): string {
  if (pct >= 93) return "A";
  if (pct >= 90) return "A-";
  if (pct >= 87) return "B+";
  if (pct >= 83) return "B";
  if (pct >= 80) return "B-";
  if (pct >= 77) return "C+";
  if (pct >= 73) return "C";
  if (pct >= 70) return "C-";
  if (pct >= 67) return "D+";
  if (pct >= 63) return "D";
  if (pct >= 60) return "D-";
  return "F";
}

export const finalGradeCalculator: CalculatorDefinition = {
  slug: "final-grade-calculator",
  title: "Final Grade Calculator",
  description:
    "Free final grade calculator. Find out what score you need on your final exam to get your desired course grade.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "final grade calculator",
    "what do I need on my final",
    "final exam grade calculator",
    "what grade do I need on my final",
    "final exam calculator",
  ],
  variants: [
    {
      id: "required",
      name: "Calculate Required Final Grade",
      description: "Find out the minimum score you need on your final exam",
      fields: [
        { name: "currentGrade", label: "Current Grade (%)", type: "number", placeholder: "e.g. 85" },
        { name: "desiredGrade", label: "Desired Grade (%)", type: "number", placeholder: "e.g. 90" },
        { name: "finalWeight", label: "Final Exam Weight (%)", type: "number", placeholder: "e.g. 30" },
      ],
      calculate: (inputs) => {
        const current = inputs.currentGrade as number;
        const desired = inputs.desiredGrade as number;
        const weight = inputs.finalWeight as number;
        if (current === undefined || desired === undefined || !weight) return null;

        const needed = (desired - current * (1 - weight / 100)) / (weight / 100);

        let note: string | undefined;
        if (needed > 100) note = "You need above 100% on the final. Consider adjusting your target grade or seeking extra credit opportunities.";
        else if (needed < 0) note = "You have already secured this grade even with a 0% on the final. Great work!";

        return {
          primary: { label: "Required Final Grade", value: `${formatNumber(needed, 1)}%` },
          details: [
            { label: "Current grade", value: `${formatNumber(current, 1)}% (${getLetterGrade(current)})` },
            { label: "Desired grade", value: `${formatNumber(desired, 1)}% (${getLetterGrade(desired)})` },
            { label: "Final exam weight", value: `${formatNumber(weight, 0)}%` },
            { label: "Non-final weight", value: `${formatNumber(100 - weight, 0)}%` },
            { label: "Letter grade needed", value: getLetterGrade(needed) },
          ],
          note,
        };
      },
    },
    {
      id: "scenarios",
      name: "Final Grade Scenarios",
      description: "See what your final course grade will be for different final exam scores",
      fields: [
        { name: "currentGrade", label: "Current Grade (%)", type: "number", placeholder: "e.g. 85" },
        { name: "finalWeight", label: "Final Exam Weight (%)", type: "number", placeholder: "e.g. 30" },
        { name: "finalScore", label: "Expected Final Score (%)", type: "number", placeholder: "e.g. 80" },
      ],
      calculate: (inputs) => {
        const current = inputs.currentGrade as number;
        const weight = inputs.finalWeight as number;
        const finalScore = inputs.finalScore as number;
        if (current === undefined || !weight || finalScore === undefined) return null;

        const courseGrade = current * (1 - weight / 100) + finalScore * (weight / 100);

        return {
          primary: { label: "Final Course Grade", value: `${formatNumber(courseGrade, 1)}%` },
          details: [
            { label: "Letter grade", value: getLetterGrade(courseGrade) },
            { label: "If you score 100%", value: `${formatNumber(current * (1 - weight / 100) + 100 * (weight / 100), 1)}% (${getLetterGrade(current * (1 - weight / 100) + 100 * (weight / 100))})` },
            { label: "If you score 90%", value: `${formatNumber(current * (1 - weight / 100) + 90 * (weight / 100), 1)}% (${getLetterGrade(current * (1 - weight / 100) + 90 * (weight / 100))})` },
            { label: "If you score 80%", value: `${formatNumber(current * (1 - weight / 100) + 80 * (weight / 100), 1)}% (${getLetterGrade(current * (1 - weight / 100) + 80 * (weight / 100))})` },
            { label: "If you score 70%", value: `${formatNumber(current * (1 - weight / 100) + 70 * (weight / 100), 1)}% (${getLetterGrade(current * (1 - weight / 100) + 70 * (weight / 100))})` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["grade-calculator", "gpa-calculator", "weighted-grade-calculator"],
  faq: [
    {
      question: "How do I calculate what I need on my final?",
      answer:
        "Use the formula: Required Final Grade = (Desired Grade - Current Grade x (1 - Final Weight)) / Final Weight. For example, if your current grade is 85%, you want a 90%, and the final is worth 30%, you need (90 - 85 x 0.70) / 0.30 = 101.7%.",
    },
    {
      question: "What if I need more than 100% on the final?",
      answer:
        "If the calculator shows you need more than 100%, it means your desired grade may not be achievable through the final alone. Consider asking about extra credit, or adjust your target grade to something more realistic.",
    },
    {
      question: "Does this account for weighted categories?",
      answer:
        "This calculator assumes the final exam is one weighted component of your overall grade. If your class uses multiple weighted categories, use the weighted grade calculator to determine your current grade first, then use this tool.",
    },
  ],
  formula: "Required Final = (Desired - Current x (1 - Weight)) / Weight",
};
