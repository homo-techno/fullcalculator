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

export const classAverageCalculator: CalculatorDefinition = {
  slug: "class-average-calculator",
  title: "Class Average Calculator",
  description:
    "Free class average calculator. Calculate the mean, median, highest, and lowest scores for a class of students. Useful for teachers and students.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "class average calculator",
    "class mean calculator",
    "student average score",
    "teacher grade calculator",
    "class score statistics",
  ],
  variants: [
    {
      id: "average",
      name: "Class Average from Scores",
      description: "Enter up to 10 student scores to calculate class statistics",
      fields: [
        { name: "s1", label: "Score 1", type: "number", placeholder: "e.g. 88" },
        { name: "s2", label: "Score 2", type: "number", placeholder: "e.g. 92" },
        { name: "s3", label: "Score 3", type: "number", placeholder: "e.g. 75" },
        { name: "s4", label: "Score 4", type: "number", placeholder: "e.g. 81" },
        { name: "s5", label: "Score 5", type: "number", placeholder: "e.g. 95" },
        { name: "s6", label: "Score 6", type: "number", placeholder: "optional" },
        { name: "s7", label: "Score 7", type: "number", placeholder: "optional" },
        { name: "s8", label: "Score 8", type: "number", placeholder: "optional" },
        { name: "s9", label: "Score 9", type: "number", placeholder: "optional" },
        { name: "s10", label: "Score 10", type: "number", placeholder: "optional" },
      ],
      calculate: (inputs) => {
        const scores: number[] = [];
        for (let i = 1; i <= 10; i++) {
          const s = inputs[`s${i}`] as number;
          if (s !== undefined && s >= 0) scores.push(s);
        }
        if (scores.length === 0) return null;

        const sorted = [...scores].sort((a, b) => a - b);
        const sum = scores.reduce((a, b) => a + b, 0);
        const mean = sum / scores.length;
        const highest = sorted[sorted.length - 1];
        const lowest = sorted[0];
        const range = highest - lowest;

        // Median
        let median: number;
        const mid = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 0) {
          median = (sorted[mid - 1] + sorted[mid]) / 2;
        } else {
          median = sorted[mid];
        }

        // Standard deviation
        const variance = scores.reduce((acc, s) => acc + Math.pow(s - mean, 2), 0) / scores.length;
        const stdDev = Math.sqrt(variance);

        // Count passing (>=60%)
        const passing = scores.filter((s) => s >= 60).length;

        return {
          primary: { label: "Class Average", value: `${formatNumber(mean, 1)}%` },
          details: [
            { label: "Letter grade", value: getLetterGrade(mean) },
            { label: "Median score", value: `${formatNumber(median, 1)}%` },
            { label: "Highest score", value: `${formatNumber(highest, 1)}%` },
            { label: "Lowest score", value: `${formatNumber(lowest, 1)}%` },
            { label: "Range", value: `${formatNumber(range, 1)}` },
            { label: "Standard deviation", value: formatNumber(stdDev, 1) },
            { label: "Students counted", value: `${scores.length}` },
            { label: "Passing (60%+)", value: `${passing} / ${scores.length} (${formatNumber((passing / scores.length) * 100, 0)}%)` },
          ],
        };
      },
    },
    {
      id: "summary",
      name: "Quick Class Summary",
      description: "Enter summary data if you already know the total and count",
      fields: [
        { name: "sumOfScores", label: "Sum of All Scores", type: "number", placeholder: "e.g. 2450" },
        { name: "studentCount", label: "Number of Students", type: "number", placeholder: "e.g. 30" },
        { name: "highestScore", label: "Highest Score", type: "number", placeholder: "e.g. 98" },
        { name: "lowestScore", label: "Lowest Score", type: "number", placeholder: "e.g. 52" },
      ],
      calculate: (inputs) => {
        const total = inputs.sumOfScores as number;
        const count = inputs.studentCount as number;
        const highest = inputs.highestScore as number;
        const lowest = inputs.lowestScore as number;
        if (!total || !count) return null;

        const average = total / count;
        const range = (highest && lowest !== undefined) ? highest - lowest : 0;

        return {
          primary: { label: "Class Average", value: `${formatNumber(average, 1)}%` },
          details: [
            { label: "Letter grade", value: getLetterGrade(average) },
            { label: "Total points", value: formatNumber(total, 0) },
            { label: "Number of students", value: formatNumber(count, 0) },
            ...(highest ? [{ label: "Highest score", value: `${formatNumber(highest, 1)}%` }] : []),
            ...(lowest !== undefined ? [{ label: "Lowest score", value: `${formatNumber(lowest, 1)}%` }] : []),
            ...(range > 0 ? [{ label: "Range", value: formatNumber(range, 1) }] : []),
          ],
        };
      },
    },
  ],
  relatedSlugs: ["test-score-calculator", "grade-calculator", "curve-grade-calculator"],
  faq: [
    {
      question: "How do you calculate a class average?",
      answer:
        "Add up all the student scores and divide by the number of students. For example, if 5 students scored 85, 90, 78, 92, and 88, the average is (85+90+78+92+88)/5 = 86.6%.",
    },
    {
      question: "What is the difference between mean and median?",
      answer:
        "The mean is the arithmetic average (sum / count). The median is the middle value when scores are sorted. The median is less affected by extreme outliers. If most students score 85-95 but one scores 20, the median will better represent the typical performance.",
    },
    {
      question: "What is a good class average?",
      answer:
        "A class average of 75-85% is typical for most courses. Averages above 90% may indicate the material is too easy or grade inflation, while averages below 65% may suggest the material is too difficult or the test was unreasonably hard.",
    },
  ],
  formula: "Mean = Sum of Scores / Number of Students",
};
