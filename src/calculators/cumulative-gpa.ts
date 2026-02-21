import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function gpaToLetter(gpa: number): string {
  if (gpa >= 3.9) return "A";
  if (gpa >= 3.7) return "A-";
  if (gpa >= 3.3) return "B+";
  if (gpa >= 3.0) return "B";
  if (gpa >= 2.7) return "B-";
  if (gpa >= 2.3) return "C+";
  if (gpa >= 2.0) return "C";
  if (gpa >= 1.7) return "C-";
  if (gpa >= 1.3) return "D+";
  if (gpa >= 1.0) return "D";
  return "F";
}

export const cumulativeGpaCalculator: CalculatorDefinition = {
  slug: "cumulative-gpa-calculator",
  title: "Cumulative GPA Calculator",
  description:
    "Free cumulative GPA calculator. Combine multiple semesters to find your overall GPA. Add new semester grades to your existing GPA.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "cumulative gpa calculator",
    "overall gpa calculator",
    "combine gpa calculator",
    "multi semester gpa",
    "total gpa calculator",
  ],
  variants: [
    {
      id: "combine",
      name: "Combine Existing GPA with New Semester",
      description: "Add a new semester's GPA to your existing cumulative GPA",
      fields: [
        { name: "currentGPA", label: "Current Cumulative GPA", type: "number", placeholder: "e.g. 3.5", min: 0, max: 4, step: 0.01 },
        { name: "currentCredits", label: "Total Credits Completed", type: "number", placeholder: "e.g. 60", min: 0 },
        { name: "newGPA", label: "New Semester GPA", type: "number", placeholder: "e.g. 3.8", min: 0, max: 4, step: 0.01 },
        { name: "newCredits", label: "New Semester Credits", type: "number", placeholder: "e.g. 15", min: 0 },
      ],
      calculate: (inputs) => {
        const curGPA = inputs.currentGPA as number;
        const curCredits = inputs.currentCredits as number;
        const newGPA = inputs.newGPA as number;
        const newCredits = inputs.newCredits as number;
        if (curGPA === undefined || !curCredits || newGPA === undefined || !newCredits) return null;

        const totalPoints = curGPA * curCredits + newGPA * newCredits;
        const totalCredits = curCredits + newCredits;
        const cumGPA = totalPoints / totalCredits;
        const change = cumGPA - curGPA;

        return {
          primary: { label: "New Cumulative GPA", value: formatNumber(cumGPA, 3) },
          details: [
            { label: "Previous cumulative GPA", value: formatNumber(curGPA, 3) },
            { label: "Change", value: `${change >= 0 ? "+" : ""}${formatNumber(change, 3)}` },
            { label: "Letter grade equivalent", value: gpaToLetter(cumGPA) },
            { label: "Total credits", value: formatNumber(totalCredits, 0) },
            { label: "Total quality points", value: formatNumber(totalPoints, 1) },
          ],
        };
      },
    },
    {
      id: "multiSemester",
      name: "Multiple Semesters",
      description: "Calculate cumulative GPA from up to 4 semesters",
      fields: [
        { name: "gpa1", label: "Semester 1 GPA", type: "number", placeholder: "e.g. 3.2", min: 0, max: 4, step: 0.01 },
        { name: "credits1", label: "Semester 1 Credits", type: "number", placeholder: "e.g. 15", min: 0 },
        { name: "gpa2", label: "Semester 2 GPA", type: "number", placeholder: "e.g. 3.5", min: 0, max: 4, step: 0.01 },
        { name: "credits2", label: "Semester 2 Credits", type: "number", placeholder: "e.g. 16", min: 0 },
        { name: "gpa3", label: "Semester 3 GPA", type: "number", placeholder: "e.g. 3.7", min: 0, max: 4, step: 0.01 },
        { name: "credits3", label: "Semester 3 Credits", type: "number", placeholder: "optional", min: 0 },
        { name: "gpa4", label: "Semester 4 GPA", type: "number", placeholder: "optional", min: 0, max: 4, step: 0.01 },
        { name: "credits4", label: "Semester 4 Credits", type: "number", placeholder: "optional", min: 0 },
      ],
      calculate: (inputs) => {
        let totalPoints = 0;
        let totalCredits = 0;
        let semesterCount = 0;

        for (let i = 1; i <= 4; i++) {
          const gpa = inputs[`gpa${i}`] as number;
          const credits = inputs[`credits${i}`] as number;
          if (gpa !== undefined && gpa >= 0 && credits && credits > 0) {
            totalPoints += gpa * credits;
            totalCredits += credits;
            semesterCount++;
          }
        }

        if (totalCredits === 0) return null;

        const cumGPA = totalPoints / totalCredits;

        return {
          primary: { label: "Cumulative GPA", value: formatNumber(cumGPA, 3) },
          details: [
            { label: "Letter grade equivalent", value: gpaToLetter(cumGPA) },
            { label: "Semesters included", value: `${semesterCount}` },
            { label: "Total credits", value: formatNumber(totalCredits, 0) },
            { label: "Total quality points", value: formatNumber(totalPoints, 1) },
            { label: "Dean's List eligible (3.5+)", value: cumGPA >= 3.5 ? "Yes" : "No" },
          ],
        };
      },
    },
    {
      id: "target",
      name: "Target GPA Calculator",
      description: "Find out what GPA you need next semester to reach your target cumulative GPA",
      fields: [
        { name: "currentGPA", label: "Current Cumulative GPA", type: "number", placeholder: "e.g. 3.2", min: 0, max: 4, step: 0.01 },
        { name: "currentCredits", label: "Credits Completed", type: "number", placeholder: "e.g. 60", min: 0 },
        { name: "targetGPA", label: "Target Cumulative GPA", type: "number", placeholder: "e.g. 3.5", min: 0, max: 4, step: 0.01 },
        { name: "nextCredits", label: "Credits Next Semester", type: "number", placeholder: "e.g. 15", min: 0 },
      ],
      calculate: (inputs) => {
        const curGPA = inputs.currentGPA as number;
        const curCredits = inputs.currentCredits as number;
        const targetGPA = inputs.targetGPA as number;
        const nextCredits = inputs.nextCredits as number;
        if (curGPA === undefined || !curCredits || targetGPA === undefined || !nextCredits) return null;

        const neededPoints = targetGPA * (curCredits + nextCredits) - curGPA * curCredits;
        const neededGPA = neededPoints / nextCredits;

        let note: string | undefined;
        if (neededGPA > 4.0) note = "The required GPA exceeds 4.0. You may need more semesters to reach your target.";
        else if (neededGPA < 0) note = "You have already exceeded your target GPA!";

        return {
          primary: { label: "Required Semester GPA", value: formatNumber(neededGPA, 2) },
          details: [
            { label: "Current cumulative GPA", value: formatNumber(curGPA, 3) },
            { label: "Target cumulative GPA", value: formatNumber(targetGPA, 3) },
            { label: "GPA gap", value: formatNumber(targetGPA - curGPA, 3) },
            { label: "Quality points needed", value: formatNumber(neededPoints, 1) },
            { label: "Achievable (4.0 max)", value: neededGPA <= 4.0 && neededGPA >= 0 ? "Yes" : "No" },
          ],
          note,
        };
      },
    },
  ],
  relatedSlugs: ["gpa-calculator", "letter-grade-calculator", "final-grade-calculator"],
  faq: [
    {
      question: "How is cumulative GPA calculated?",
      answer:
        "Cumulative GPA = Total Quality Points / Total Credit Hours across all semesters. Quality points for each semester = Semester GPA x Credits taken that semester.",
    },
    {
      question: "Why is my cumulative GPA hard to raise?",
      answer:
        "As you accumulate more credit hours, each new semester has less impact on your cumulative GPA. For example, if you have 90 credits at a 3.0, a perfect 4.0 semester with 15 credits only raises your GPA to about 3.14.",
    },
    {
      question: "What is the difference between semester GPA and cumulative GPA?",
      answer:
        "Semester GPA only considers courses from one semester. Cumulative GPA combines all semesters into one overall average, weighted by credit hours.",
    },
  ],
  formula: "Cumulative GPA = (GPA_1 x Credits_1 + GPA_2 x Credits_2 + ...) / (Credits_1 + Credits_2 + ...)",
};
