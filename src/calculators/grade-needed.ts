import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gradeNeededCalculator: CalculatorDefinition = {
  slug: "grade-needed-calculator",
  title: "Grade Needed Calculator",
  description:
    "Free grade needed calculator. Find out what score you need on your final exam or remaining assignments to achieve your desired grade.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "grade needed calculator",
    "final exam grade needed",
    "what grade do i need",
    "target grade calculator",
    "minimum grade calculator",
  ],
  variants: [
    {
      id: "final-exam",
      name: "Final Exam Grade Needed",
      description: "Calculate what you need on the final exam to get your desired course grade",
      fields: [
        { name: "currentGrade", label: "Current Grade (%)", type: "number", placeholder: "e.g. 85", min: 0, max: 100, step: 0.1 },
        { name: "desiredGrade", label: "Desired Final Grade (%)", type: "number", placeholder: "e.g. 90", min: 0, max: 100, step: 0.1 },
        { name: "finalWeight", label: "Final Exam Weight (%)", type: "number", placeholder: "e.g. 30", min: 1, max: 100, step: 0.1 },
      ],
      calculate: (inputs) => {
        const current = inputs.currentGrade as number;
        const desired = inputs.desiredGrade as number;
        const weight = inputs.finalWeight as number;
        if (current === undefined || desired === undefined || !weight) return null;

        const courseWeight = 100 - weight;
        const neededGrade = (desired - (current * courseWeight / 100)) / (weight / 100);

        let assessment: string;
        if (neededGrade <= 0) assessment = "You've already secured this grade!";
        else if (neededGrade <= 60) assessment = "Very achievable";
        else if (neededGrade <= 80) assessment = "Achievable with study";
        else if (neededGrade <= 100) assessment = "Challenging but possible";
        else assessment = "Not possible with final alone";

        return {
          primary: { label: "Grade Needed on Final", value: `${formatNumber(neededGrade, 1)}%` },
          details: [
            { label: "Assessment", value: assessment },
            { label: "Current grade contributes", value: `${formatNumber(current * courseWeight / 100, 1)} points` },
            { label: "Final exam weight", value: `${formatNumber(weight, 0)}%` },
          ],
        };
      },
    },
    {
      id: "assignments",
      name: "Assignment Grade Needed",
      description: "Calculate what average you need on remaining assignments",
      fields: [
        { name: "earnedPoints", label: "Points Earned So Far", type: "number", placeholder: "e.g. 340", min: 0 },
        { name: "totalPointsSoFar", label: "Total Points Available So Far", type: "number", placeholder: "e.g. 400", min: 1 },
        { name: "desiredPercent", label: "Desired Final Percentage", type: "number", placeholder: "e.g. 90", min: 0, max: 100, step: 0.1 },
        { name: "remainingPoints", label: "Remaining Points Available", type: "number", placeholder: "e.g. 200", min: 1 },
      ],
      calculate: (inputs) => {
        const earned = inputs.earnedPoints as number;
        const totalSoFar = inputs.totalPointsSoFar as number;
        const desired = inputs.desiredPercent as number;
        const remaining = inputs.remainingPoints as number;
        if (earned === undefined || !totalSoFar || desired === undefined || !remaining) return null;

        const totalPoints = totalSoFar + remaining;
        const pointsNeeded = (desired / 100) * totalPoints;
        const pointsStillNeeded = pointsNeeded - earned;
        const percentNeeded = (pointsStillNeeded / remaining) * 100;
        const currentPercent = (earned / totalSoFar) * 100;

        return {
          primary: { label: "Average Needed on Remaining", value: `${formatNumber(percentNeeded, 1)}%` },
          details: [
            { label: "Current percentage", value: `${formatNumber(currentPercent, 1)}%` },
            { label: "Points still needed", value: formatNumber(pointsStillNeeded, 0) },
            { label: "Total course points", value: formatNumber(totalPoints, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["grade-calculator", "gpa-calculator"],
  faq: [
    {
      question: "How do I calculate what I need on my final?",
      answer:
        "Use the formula: Needed = (Desired Grade - Current Grade x (1 - Final Weight)) / Final Weight. For example, if you have an 85% and want a 90% with a 30% final, you need (90 - 85 x 0.70) / 0.30 = 101.7%.",
    },
    {
      question: "What if the required grade is over 100%?",
      answer:
        "If the calculator shows you need more than 100%, it means achieving your desired grade through the final exam alone is mathematically impossible. Consider adjusting your target grade.",
    },
  ],
  formula: "Grade Needed = (Desired - Current x (1 - Final Weight)) / Final Weight",
};
