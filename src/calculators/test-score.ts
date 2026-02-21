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

export const testScoreCalculator: CalculatorDefinition = {
  slug: "test-score-calculator",
  title: "Test Score Calculator",
  description:
    "Free test score percentage calculator. Calculate your test grade from points earned, find how many questions you can miss, and convert to a letter grade.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "test score calculator",
    "test grade calculator",
    "test percentage calculator",
    "quiz grade calculator",
    "exam score calculator",
  ],
  variants: [
    {
      id: "percentage",
      name: "Test Score Percentage",
      description: "Calculate your test percentage from points or questions correct",
      fields: [
        { name: "earned", label: "Points / Questions Correct", type: "number", placeholder: "e.g. 42" },
        { name: "total", label: "Total Points / Questions", type: "number", placeholder: "e.g. 50" },
      ],
      calculate: (inputs) => {
        const earned = inputs.earned as number;
        const total = inputs.total as number;
        if (earned === undefined || !total || total <= 0) return null;

        const percentage = (earned / total) * 100;
        const missed = total - earned;
        const letter = getLetterGrade(percentage);

        // GPA equivalent
        let gpa: number;
        if (percentage >= 93) gpa = 4.0;
        else if (percentage >= 90) gpa = 3.7;
        else if (percentage >= 87) gpa = 3.3;
        else if (percentage >= 83) gpa = 3.0;
        else if (percentage >= 80) gpa = 2.7;
        else if (percentage >= 77) gpa = 2.3;
        else if (percentage >= 73) gpa = 2.0;
        else if (percentage >= 70) gpa = 1.7;
        else if (percentage >= 67) gpa = 1.3;
        else if (percentage >= 63) gpa = 1.0;
        else if (percentage >= 60) gpa = 0.7;
        else gpa = 0.0;

        return {
          primary: { label: "Test Score", value: `${formatNumber(percentage, 1)}%` },
          details: [
            { label: "Letter grade", value: letter },
            { label: "GPA equivalent", value: formatNumber(gpa, 1) },
            { label: "Points earned", value: `${formatNumber(earned, 0)} / ${formatNumber(total, 0)}` },
            { label: "Points missed", value: formatNumber(missed, 0) },
            { label: "Passing (60%+)", value: percentage >= 60 ? "Yes" : "No" },
          ],
        };
      },
    },
    {
      id: "missable",
      name: "How Many Can I Miss?",
      description: "Find out how many questions you can miss and still get your target grade",
      fields: [
        { name: "totalQuestions", label: "Total Questions", type: "number", placeholder: "e.g. 50" },
        { name: "targetGrade", label: "Target Grade (%)", type: "number", placeholder: "e.g. 90" },
      ],
      calculate: (inputs) => {
        const total = inputs.totalQuestions as number;
        const target = inputs.targetGrade as number;
        if (!total || !target) return null;

        const minCorrect = Math.ceil(total * (target / 100));
        const canMiss = total - minCorrect;

        return {
          primary: { label: "Questions You Can Miss", value: formatNumber(canMiss, 0) },
          details: [
            { label: "Minimum correct answers", value: formatNumber(minCorrect, 0) },
            { label: "Total questions", value: formatNumber(total, 0) },
            { label: "Target grade", value: `${formatNumber(target, 0)}% (${getLetterGrade(target)})` },
            { label: "For an A (93%)", value: `Miss up to ${total - Math.ceil(total * 0.93)}` },
            { label: "For a B (83%)", value: `Miss up to ${total - Math.ceil(total * 0.83)}` },
            { label: "For a C (73%)", value: `Miss up to ${total - Math.ceil(total * 0.73)}` },
          ],
        };
      },
    },
    {
      id: "multiTest",
      name: "Test Average",
      description: "Calculate your average across multiple tests",
      fields: [
        { name: "test1", label: "Test 1 Score (%)", type: "number", placeholder: "e.g. 88" },
        { name: "test2", label: "Test 2 Score (%)", type: "number", placeholder: "e.g. 92" },
        { name: "test3", label: "Test 3 Score (%)", type: "number", placeholder: "e.g. 78" },
        { name: "test4", label: "Test 4 Score (%)", type: "number", placeholder: "optional" },
        { name: "test5", label: "Test 5 Score (%)", type: "number", placeholder: "optional" },
      ],
      calculate: (inputs) => {
        const scores: number[] = [];
        for (let i = 1; i <= 5; i++) {
          const score = inputs[`test${i}`] as number;
          if (score !== undefined && score >= 0) scores.push(score);
        }
        if (scores.length === 0) return null;

        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        const highest = Math.max(...scores);
        const lowest = Math.min(...scores);
        const dropLowest = scores.length > 1
          ? (scores.reduce((a, b) => a + b, 0) - lowest) / (scores.length - 1)
          : avg;

        return {
          primary: { label: "Test Average", value: `${formatNumber(avg, 1)}%` },
          details: [
            { label: "Letter grade", value: getLetterGrade(avg) },
            { label: "Tests counted", value: `${scores.length}` },
            { label: "Highest score", value: `${formatNumber(highest, 1)}%` },
            { label: "Lowest score", value: `${formatNumber(lowest, 1)}%` },
            { label: "Average if lowest dropped", value: `${formatNumber(dropLowest, 1)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["grade-calculator", "final-grade-calculator", "class-average-calculator"],
  faq: [
    {
      question: "How do I calculate my test grade?",
      answer:
        "Divide the number of points (or questions) you got correct by the total number of points (or questions), then multiply by 100. For example, 42 correct out of 50 = (42/50) x 100 = 84%.",
    },
    {
      question: "How many questions can I miss on a 50-question test and still get an A?",
      answer:
        "For an A (93%), you need at least 47 correct out of 50, so you can miss 3 questions. For an A- (90%), you need 45, so you can miss 5.",
    },
    {
      question: "Does my teacher round up test scores?",
      answer:
        "Rounding policies vary by teacher. Some round up at 0.5% (e.g., 89.5 rounds to 90), some don't round at all, and some give a bump at borderline grades. Check your syllabus or ask your instructor.",
    },
  ],
  formula: "Test Score (%) = (Points Earned / Total Points) x 100",
};
