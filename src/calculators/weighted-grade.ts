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

export const weightedGradeCalculator: CalculatorDefinition = {
  slug: "weighted-grade-calculator",
  title: "Weighted Grade Calculator",
  description:
    "Free weighted grade calculator. Calculate your weighted average grade from multiple categories like homework, quizzes, exams, and projects.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "weighted grade calculator",
    "weighted average grade",
    "class grade calculator",
    "course grade calculator",
    "weighted score calculator",
  ],
  variants: [
    {
      id: "categories",
      name: "Weighted Grade by Category",
      description: "Enter up to 6 grade categories with their weights",
      fields: [
        { name: "grade1", label: "Category 1 Grade (%)", type: "number", placeholder: "e.g. Homework: 92" },
        { name: "weight1", label: "Category 1 Weight (%)", type: "number", placeholder: "e.g. 20" },
        { name: "grade2", label: "Category 2 Grade (%)", type: "number", placeholder: "e.g. Quizzes: 88" },
        { name: "weight2", label: "Category 2 Weight (%)", type: "number", placeholder: "e.g. 15" },
        { name: "grade3", label: "Category 3 Grade (%)", type: "number", placeholder: "e.g. Midterm: 85" },
        { name: "weight3", label: "Category 3 Weight (%)", type: "number", placeholder: "e.g. 25" },
        { name: "grade4", label: "Category 4 Grade (%)", type: "number", placeholder: "e.g. Final: 78" },
        { name: "weight4", label: "Category 4 Weight (%)", type: "number", placeholder: "e.g. 30" },
        { name: "grade5", label: "Category 5 Grade (%)", type: "number", placeholder: "e.g. Participation: 95" },
        { name: "weight5", label: "Category 5 Weight (%)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        let totalWeight = 0;
        let weightedSum = 0;
        let categoryCount = 0;

        for (let i = 1; i <= 5; i++) {
          const grade = inputs[`grade${i}`] as number;
          const weight = inputs[`weight${i}`] as number;
          if (grade !== undefined && grade >= 0 && weight !== undefined && weight > 0) {
            weightedSum += grade * (weight / 100);
            totalWeight += weight;
            categoryCount++;
          }
        }

        if (totalWeight === 0 || categoryCount === 0) return null;

        const avg = (weightedSum / totalWeight) * 100;

        return {
          primary: { label: "Weighted Grade", value: `${formatNumber(avg, 1)}%` },
          details: [
            { label: "Letter grade", value: getLetterGrade(avg) },
            { label: "Categories used", value: `${categoryCount}` },
            { label: "Total weight", value: `${formatNumber(totalWeight, 0)}%` },
            ...(totalWeight < 100 ? [{ label: "Remaining weight", value: `${formatNumber(100 - totalWeight, 0)}%` }] : []),
            { label: "Points earned", value: `${formatNumber(weightedSum, 2)} / ${formatNumber(totalWeight, 0)}` },
          ],
          note: totalWeight !== 100 ? `Weights sum to ${formatNumber(totalWeight, 0)}%, not 100%. Grade is calculated proportionally.` : undefined,
        };
      },
    },
    {
      id: "assignments",
      name: "Weighted Grade by Assignments",
      description: "Calculate weighted grade from individual assignment scores and point values",
      fields: [
        { name: "earned1", label: "Assignment 1 Points Earned", type: "number", placeholder: "e.g. 45" },
        { name: "possible1", label: "Assignment 1 Points Possible", type: "number", placeholder: "e.g. 50" },
        { name: "earned2", label: "Assignment 2 Points Earned", type: "number", placeholder: "e.g. 82" },
        { name: "possible2", label: "Assignment 2 Points Possible", type: "number", placeholder: "e.g. 100" },
        { name: "earned3", label: "Assignment 3 Points Earned", type: "number", placeholder: "e.g. 27" },
        { name: "possible3", label: "Assignment 3 Points Possible", type: "number", placeholder: "e.g. 30" },
        { name: "earned4", label: "Assignment 4 Points Earned", type: "number", placeholder: "e.g. 90" },
        { name: "possible4", label: "Assignment 4 Points Possible", type: "number", placeholder: "e.g. 100" },
      ],
      calculate: (inputs) => {
        let totalEarned = 0;
        let totalPossible = 0;
        let count = 0;

        for (let i = 1; i <= 4; i++) {
          const earned = inputs[`earned${i}`] as number;
          const possible = inputs[`possible${i}`] as number;
          if (earned !== undefined && earned >= 0 && possible !== undefined && possible > 0) {
            totalEarned += earned;
            totalPossible += possible;
            count++;
          }
        }

        if (totalPossible === 0) return null;

        const percentage = (totalEarned / totalPossible) * 100;

        return {
          primary: { label: "Overall Grade", value: `${formatNumber(percentage, 1)}%` },
          details: [
            { label: "Letter grade", value: getLetterGrade(percentage) },
            { label: "Total points earned", value: formatNumber(totalEarned, 0) },
            { label: "Total points possible", value: formatNumber(totalPossible, 0) },
            { label: "Assignments counted", value: `${count}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["grade-calculator", "final-grade-calculator", "gpa-calculator"],
  faq: [
    {
      question: "How do weighted grades work?",
      answer:
        "Weighted grades assign different levels of importance to different categories. For example, if exams are worth 40% of your grade and homework is worth 20%, a score of 90% on exams contributes more to your final grade (36 points) than a 90% on homework (18 points).",
    },
    {
      question: "What if my weights don't add up to 100%?",
      answer:
        "The calculator will still work by proportionally scaling your grades. However, most syllabi have weights that sum to 100%. If yours don't, double-check with your instructor.",
    },
    {
      question: "How do I convert a weighted grade to a letter grade?",
      answer:
        "Standard letter grade scales: A = 93-100%, A- = 90-92%, B+ = 87-89%, B = 83-86%, B- = 80-82%, C+ = 77-79%, C = 73-76%, C- = 70-72%, D = 60-69%, F = below 60%. Note that some schools use different scales.",
    },
  ],
  formula: "Weighted Grade = Sum(Grade_i x Weight_i) / Sum(Weight_i)",
};
