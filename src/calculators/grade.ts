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

export const gradeCalculator: CalculatorDefinition = {
  slug: "grade-calculator",
  title: "Grade Calculator",
  description: "Free grade calculator. Calculate your weighted grade, find what you need on a final exam, and convert between grade formats.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["grade calculator", "final grade calculator", "weighted grade calculator", "what grade do I need", "test grade calculator"],
  variants: [
    {
      id: "weighted",
      name: "Weighted Grade Calculator",
      description: "Calculate weighted average grade from up to 6 categories (assignments, exams, etc.)",
      fields: [
        { name: "grade1", label: "Category 1 Grade (%)", type: "number", placeholder: "e.g. 92" },
        { name: "weight1", label: "Category 1 Weight (%)", type: "number", placeholder: "e.g. 30" },
        { name: "grade2", label: "Category 2 Grade (%)", type: "number", placeholder: "e.g. 85" },
        { name: "weight2", label: "Category 2 Weight (%)", type: "number", placeholder: "e.g. 30" },
        { name: "grade3", label: "Category 3 Grade (%)", type: "number", placeholder: "e.g. 78" },
        { name: "weight3", label: "Category 3 Weight (%)", type: "number", placeholder: "e.g. 25" },
        { name: "grade4", label: "Category 4 Grade (%)", type: "number", placeholder: "e.g. 95" },
        { name: "weight4", label: "Category 4 Weight (%)", type: "number", placeholder: "e.g. 15" },
      ],
      calculate: (inputs) => {
        let totalWeight = 0;
        let weightedSum = 0;
        for (let i = 1; i <= 4; i++) {
          const grade = inputs[`grade${i}`] as number;
          const weight = inputs[`weight${i}`] as number;
          if (grade !== undefined && weight !== undefined && weight > 0) {
            weightedSum += grade * weight;
            totalWeight += weight;
          }
        }
        if (totalWeight === 0) return null;
        const avg = weightedSum / totalWeight;
        return {
          primary: { label: "Weighted Grade", value: `${formatNumber(avg)}%` },
          details: [
            { label: "Letter grade", value: getLetterGrade(avg) },
            { label: "Total weight used", value: `${formatNumber(totalWeight)}%` },
            ...(totalWeight < 100 ? [{ label: "Remaining weight", value: `${formatNumber(100 - totalWeight)}%` }] : []),
          ],
          note: totalWeight !== 100 ? `Weights sum to ${formatNumber(totalWeight)}%, not 100%. Grade is calculated proportionally.` : undefined,
        };
      },
    },
    {
      id: "final",
      name: "Final Exam Grade Needed",
      description: "Calculate the grade you need on the final to get your desired course grade",
      fields: [
        { name: "currentGrade", label: "Current Grade (%)", type: "number", placeholder: "e.g. 85" },
        { name: "desiredGrade", label: "Desired Final Grade (%)", type: "number", placeholder: "e.g. 90" },
        { name: "finalWeight", label: "Final Exam Weight (%)", type: "number", placeholder: "e.g. 30" },
      ],
      calculate: (inputs) => {
        const current = inputs.currentGrade as number;
        const desired = inputs.desiredGrade as number;
        const weight = inputs.finalWeight as number;
        if (current === undefined || desired === undefined || !weight) return null;

        const currentWeight = 100 - weight;
        const needed = (desired * 100 - current * currentWeight) / weight;

        let note: string | undefined;
        if (needed > 100) note = "You would need above 100% on the final. Consider adjusting your target grade.";
        else if (needed < 0) note = "You've already secured this grade even with a 0 on the final!";

        return {
          primary: { label: "Grade Needed on Final", value: `${formatNumber(needed)}%` },
          details: [
            { label: "Current grade", value: `${current}% (${getLetterGrade(current)})` },
            { label: "Desired grade", value: `${desired}% (${getLetterGrade(desired)})` },
            { label: "Final exam weight", value: `${weight}%` },
          ],
          note,
        };
      },
    },
  ],
  relatedSlugs: ["gpa-calculator", "percentage-calculator"],
  faq: [
    { question: "How do weighted grades work?", answer: "Weighted grades assign different importance to categories. If homework (30% weight) = 95% and exams (70% weight) = 80%, weighted grade = 95×0.30 + 80×0.70 = 84.5%. Categories with higher weights matter more." },
    { question: "How do I calculate what I need on my final?", answer: "Formula: Needed = (Desired Grade × 100 - Current Grade × (100 - Final Weight)) / Final Weight. If your current grade is 85%, you want 90%, and the final is 30% of the grade, you need (90×100 - 85×70) / 30 = 96.7%." },
  ],
  formula: "Weighted Avg = Σ(grade × weight) / Σ(weight) | Final Needed = (desired × 100 - current × (100 - w)) / w",
};
