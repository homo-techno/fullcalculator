import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gpaCalculator: CalculatorDefinition = {
  slug: "gpa-calculator",
  title: "GPA Calculator",
  description:
    "Free GPA calculator. Calculate your Grade Point Average for college or high school. Supports letter grades and credit hours.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "gpa calculator",
    "grade point average",
    "college gpa calculator",
    "cumulative gpa calculator",
    "grade calculator",
  ],
  variants: [
    {
      id: "semester",
      name: "Semester GPA",
      description: "Calculate GPA for up to 6 courses. Use grade values: A=4, B=3, C=2, D=1, F=0 (A+=4, A-=3.7, B+=3.3, etc.)",
      fields: [
        { name: "grade1", label: "Course 1 Grade (0-4)", type: "number", placeholder: "e.g. 3.7", min: 0, max: 4, step: 0.1 },
        { name: "credits1", label: "Course 1 Credits", type: "number", placeholder: "e.g. 3", min: 0.5, max: 6 },
        { name: "grade2", label: "Course 2 Grade (0-4)", type: "number", placeholder: "e.g. 3.3", min: 0, max: 4, step: 0.1 },
        { name: "credits2", label: "Course 2 Credits", type: "number", placeholder: "e.g. 4", min: 0.5, max: 6 },
        { name: "grade3", label: "Course 3 Grade (0-4)", type: "number", placeholder: "e.g. 4.0", min: 0, max: 4, step: 0.1 },
        { name: "credits3", label: "Course 3 Credits", type: "number", placeholder: "e.g. 3", min: 0.5, max: 6 },
        { name: "grade4", label: "Course 4 Grade (0-4)", type: "number", placeholder: "optional", min: 0, max: 4, step: 0.1 },
        { name: "credits4", label: "Course 4 Credits", type: "number", placeholder: "optional", min: 0.5, max: 6 },
      ],
      calculate: (inputs) => {
        let totalPoints = 0;
        let totalCredits = 0;

        for (let i = 1; i <= 6; i++) {
          const grade = inputs[`grade${i}`] as number;
          const credits = inputs[`credits${i}`] as number;
          if (grade !== undefined && grade >= 0 && credits && credits > 0) {
            totalPoints += grade * credits;
            totalCredits += credits;
          }
        }

        if (totalCredits === 0) return null;

        const gpa = totalPoints / totalCredits;
        let letterGrade: string;
        if (gpa >= 3.7) letterGrade = "A / A-";
        else if (gpa >= 3.3) letterGrade = "B+";
        else if (gpa >= 3.0) letterGrade = "B";
        else if (gpa >= 2.7) letterGrade = "B-";
        else if (gpa >= 2.3) letterGrade = "C+";
        else if (gpa >= 2.0) letterGrade = "C";
        else if (gpa >= 1.0) letterGrade = "D";
        else letterGrade = "F";

        return {
          primary: { label: "Semester GPA", value: formatNumber(gpa, 2) },
          details: [
            { label: "Letter grade equivalent", value: letterGrade },
            { label: "Total credits", value: formatNumber(totalCredits, 0) },
            { label: "Total quality points", value: formatNumber(totalPoints, 1) },
          ],
        };
      },
    },
    {
      id: "cumulative",
      name: "Cumulative GPA",
      description: "Combine your current GPA with new semester grades",
      fields: [
        { name: "currentGPA", label: "Current Cumulative GPA", type: "number", placeholder: "e.g. 3.5", min: 0, max: 4, step: 0.01 },
        { name: "currentCredits", label: "Credits Completed", type: "number", placeholder: "e.g. 60", min: 0 },
        { name: "newGPA", label: "New Semester GPA", type: "number", placeholder: "e.g. 3.8", min: 0, max: 4, step: 0.01 },
        { name: "newCredits", label: "New Semester Credits", type: "number", placeholder: "e.g. 15", min: 0 },
      ],
      calculate: (inputs) => {
        const curGPA = inputs.currentGPA as number;
        const curCredits = inputs.currentCredits as number;
        const newGPA = inputs.newGPA as number;
        const newCredits = inputs.newCredits as number;
        if (!curCredits || !newCredits || curGPA === undefined || newGPA === undefined) return null;

        const totalPoints = curGPA * curCredits + newGPA * newCredits;
        const totalCredits = curCredits + newCredits;
        const cumGPA = totalPoints / totalCredits;
        const change = cumGPA - curGPA;

        return {
          primary: { label: "Cumulative GPA", value: formatNumber(cumGPA, 2) },
          details: [
            { label: "Change from current", value: `${change >= 0 ? "+" : ""}${formatNumber(change, 2)}` },
            { label: "Total credits", value: formatNumber(totalCredits, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "age-calculator"],
  faq: [
    {
      question: "How is GPA calculated?",
      answer:
        "GPA = Total Quality Points / Total Credit Hours. Quality points for each course = Grade Points x Credit Hours. For example, an A (4.0) in a 3-credit course = 12 quality points.",
    },
    {
      question: "What GPA do I need for Dean's List?",
      answer:
        "Most colleges require a 3.5 GPA or higher for Dean's List, though this varies by institution. Some require 3.7 or above.",
    },
  ],
  formula: "GPA = Sum(Grade x Credits) / Sum(Credits)",
};
