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

export const curveGradeCalculator: CalculatorDefinition = {
  slug: "curve-grade-calculator",
  title: "Grade Curve Calculator",
  description:
    "Free grade curve calculator. Apply flat curve, square root curve, or bell curve adjustments to test scores. See how curving affects your grade.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "grade curve calculator",
    "curve grade calculator",
    "bell curve grading",
    "test curve calculator",
    "square root curve calculator",
  ],
  variants: [
    {
      id: "flat",
      name: "Flat Curve (Add Points)",
      description: "Add a flat number of points to every score, or curve to set highest score to 100",
      fields: [
        { name: "yourScore", label: "Your Score (%)", type: "number", placeholder: "e.g. 72" },
        { name: "highestScore", label: "Highest Score in Class (%)", type: "number", placeholder: "e.g. 92" },
        {
          name: "curveMethod",
          label: "Curve Method",
          type: "select",
          options: [
            { label: "Highest score becomes 100", value: "highest_to_100" },
            { label: "Add fixed points", value: "fixed" },
          ],
        },
        { name: "fixedPoints", label: "Points to Add (if fixed)", type: "number", placeholder: "e.g. 8", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const score = inputs.yourScore as number;
        const highest = inputs.highestScore as number;
        const method = inputs.curveMethod as string;
        const fixed = (inputs.fixedPoints as number) || 0;
        if (score === undefined || !method) return null;

        let curvedScore: number;
        let curveAmount: number;

        if (method === "highest_to_100" && highest) {
          curveAmount = 100 - highest;
          curvedScore = score + curveAmount;
        } else {
          curveAmount = fixed;
          curvedScore = score + curveAmount;
        }

        curvedScore = Math.min(curvedScore, 100);

        return {
          primary: { label: "Curved Score", value: `${formatNumber(curvedScore, 1)}%` },
          details: [
            { label: "Original score", value: `${formatNumber(score, 1)}% (${getLetterGrade(score)})` },
            { label: "Curved score", value: `${formatNumber(curvedScore, 1)}% (${getLetterGrade(curvedScore)})` },
            { label: "Points added", value: `+${formatNumber(curveAmount, 1)}` },
            { label: "Letter grade change", value: `${getLetterGrade(score)} -> ${getLetterGrade(curvedScore)}` },
            ...(highest ? [{ label: "Highest class score", value: `${formatNumber(highest, 1)}%` }] : []),
          ],
        };
      },
    },
    {
      id: "squareRoot",
      name: "Square Root Curve",
      description: "Apply a square root curve (lower scores benefit more)",
      fields: [
        { name: "yourScore", label: "Your Score (%)", type: "number", placeholder: "e.g. 65" },
      ],
      calculate: (inputs) => {
        const score = inputs.yourScore as number;
        if (score === undefined || score < 0) return null;

        // Square root curve: new score = sqrt(score) * 10
        const curved = Math.sqrt(score) * 10;
        const improvement = curved - score;

        // Show examples at different score levels
        const examples = [50, 60, 70, 80, 90].map((s) => ({
          original: s,
          curved: Math.sqrt(s) * 10,
        }));

        return {
          primary: { label: "Curved Score", value: `${formatNumber(curved, 1)}%` },
          details: [
            { label: "Original score", value: `${formatNumber(score, 1)}% (${getLetterGrade(score)})` },
            { label: "New letter grade", value: getLetterGrade(curved) },
            { label: "Points gained", value: `+${formatNumber(improvement, 1)}` },
            { label: "50% curves to", value: `${formatNumber(examples[0].curved, 1)}%` },
            { label: "60% curves to", value: `${formatNumber(examples[1].curved, 1)}%` },
            { label: "70% curves to", value: `${formatNumber(examples[2].curved, 1)}%` },
            { label: "80% curves to", value: `${formatNumber(examples[3].curved, 1)}%` },
            { label: "90% curves to", value: `${formatNumber(examples[4].curved, 1)}%` },
          ],
          note: "The square root curve benefits lower scores more. A 50% becomes 70.7%, while a 90% becomes 94.9%.",
        };
      },
    },
    {
      id: "bellCurve",
      name: "Bell Curve (Normal Distribution)",
      description: "Apply a bell curve based on class mean and standard deviation",
      fields: [
        { name: "yourScore", label: "Your Score", type: "number", placeholder: "e.g. 72" },
        { name: "classMean", label: "Class Average (Mean)", type: "number", placeholder: "e.g. 68" },
        { name: "classStdDev", label: "Standard Deviation", type: "number", placeholder: "e.g. 12" },
        { name: "targetMean", label: "Target Mean (desired average)", type: "number", placeholder: "e.g. 80", defaultValue: 80 },
      ],
      calculate: (inputs) => {
        const score = inputs.yourScore as number;
        const mean = inputs.classMean as number;
        const stdDev = inputs.classStdDev as number;
        const targetMean = (inputs.targetMean as number) || 80;
        if (score === undefined || !mean || !stdDev) return null;

        // Z-score
        const zScore = (score - mean) / stdDev;

        // Apply to new scale: target mean with standard deviation of 10
        const targetStdDev = 10;
        const curved = targetMean + zScore * targetStdDev;
        const clampedCurved = Math.min(100, Math.max(0, curved));

        return {
          primary: { label: "Bell Curve Score", value: `${formatNumber(clampedCurved, 1)}%` },
          details: [
            { label: "Original score", value: `${formatNumber(score, 1)}% (${getLetterGrade(score)})` },
            { label: "New letter grade", value: getLetterGrade(clampedCurved) },
            { label: "Z-score", value: formatNumber(zScore, 2) },
            { label: "Class mean", value: `${formatNumber(mean, 1)}%` },
            { label: "Standard deviation", value: formatNumber(stdDev, 1) },
            { label: "Target mean", value: `${formatNumber(targetMean, 0)}%` },
            { label: "Points changed", value: `${curved - score >= 0 ? "+" : ""}${formatNumber(curved - score, 1)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["class-average-calculator", "test-score-calculator", "grade-calculator"],
  faq: [
    {
      question: "What is grading on a curve?",
      answer:
        "Curving adjusts scores to account for exam difficulty. Common methods include adding points to all scores, using a square root curve, or fitting scores to a bell curve (normal distribution). The goal is to ensure grades fairly represent student ability relative to the exam.",
    },
    {
      question: "How does the square root curve work?",
      answer:
        "The square root curve takes the square root of your percentage and multiplies by 10. This benefits lower scores more: a 49% becomes 70%, while a 81% becomes 90%. The formula is: Curved Score = sqrt(Original) x 10.",
    },
    {
      question: "Is curving fair to students who did well?",
      answer:
        "Curving helps lower scores more than higher scores, which can feel unfair to top students. However, most curving methods still maintain the relative ranking of students. A student who scored highest before the curve will still score highest after.",
    },
  ],
  formula: "Flat: Curved = Score + (100 - Highest) | Sqrt: Curved = sqrt(Score) x 10 | Bell: Curved = Target Mean + Z-score x 10",
};
