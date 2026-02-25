import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const collegeGpaCalculator: CalculatorDefinition = {
  slug: "college-gpa-calculator",
  title: "College GPA Calculator",
  description:
    "Free college GPA calculator. Calculate your undergraduate or graduate GPA with credit hours, letter grades, and multiple semesters.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "college gpa calculator",
    "university gpa",
    "undergraduate gpa",
    "graduate gpa",
    "semester gpa college",
  ],
  variants: [
    {
      id: "semester",
      name: "Semester GPA",
      description: "Calculate your college GPA for a single semester with up to 6 courses",
      fields: [
        { name: "grade1", label: "Course 1 Grade (0-4)", type: "number", placeholder: "e.g. 4.0", min: 0, max: 4, step: 0.1 },
        { name: "credits1", label: "Course 1 Credit Hours", type: "number", placeholder: "e.g. 3", min: 0.5, max: 6 },
        { name: "grade2", label: "Course 2 Grade (0-4)", type: "number", placeholder: "e.g. 3.7", min: 0, max: 4, step: 0.1 },
        { name: "credits2", label: "Course 2 Credit Hours", type: "number", placeholder: "e.g. 4", min: 0.5, max: 6 },
        { name: "grade3", label: "Course 3 Grade (0-4)", type: "number", placeholder: "e.g. 3.3", min: 0, max: 4, step: 0.1 },
        { name: "credits3", label: "Course 3 Credit Hours", type: "number", placeholder: "e.g. 3", min: 0.5, max: 6 },
        { name: "grade4", label: "Course 4 Grade (0-4)", type: "number", placeholder: "optional", min: 0, max: 4, step: 0.1 },
        { name: "credits4", label: "Course 4 Credit Hours", type: "number", placeholder: "optional", min: 0.5, max: 6 },
        { name: "grade5", label: "Course 5 Grade (0-4)", type: "number", placeholder: "optional", min: 0, max: 4, step: 0.1 },
        { name: "credits5", label: "Course 5 Credit Hours", type: "number", placeholder: "optional", min: 0.5, max: 6 },
        { name: "grade6", label: "Course 6 Grade (0-4)", type: "number", placeholder: "optional", min: 0, max: 4, step: 0.1 },
        { name: "credits6", label: "Course 6 Credit Hours", type: "number", placeholder: "optional", min: 0.5, max: 6 },
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
        let standing: string;
        if (gpa >= 3.9) standing = "Summa Cum Laude range";
        else if (gpa >= 3.7) standing = "Magna Cum Laude range";
        else if (gpa >= 3.5) standing = "Cum Laude / Dean's List range";
        else if (gpa >= 3.0) standing = "Good standing";
        else if (gpa >= 2.0) standing = "Satisfactory";
        else standing = "Academic probation risk";

        return {
          primary: { label: "Semester GPA", value: formatNumber(gpa, 2) },
          details: [
            { label: "Academic standing", value: standing },
            { label: "Total credit hours", value: formatNumber(totalCredits, 0) },
            { label: "Total quality points", value: formatNumber(totalPoints, 1) },
          ],
        };
      },
    },
    {
      id: "cumulative",
      name: "Cumulative College GPA",
      description: "Combine previous semesters with your new semester GPA",
      fields: [
        { name: "currentGPA", label: "Current Cumulative GPA", type: "number", placeholder: "e.g. 3.5", min: 0, max: 4, step: 0.01 },
        { name: "currentCredits", label: "Total Credits Earned", type: "number", placeholder: "e.g. 60", min: 0 },
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
            { label: "GPA change", value: `${change >= 0 ? "+" : ""}${formatNumber(change, 3)}` },
            { label: "Total credits completed", value: formatNumber(totalCredits, 0) },
            { label: "Total quality points", value: formatNumber(totalPoints, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gpa-calculator", "grade-calculator"],
  faq: [
    {
      question: "What is a good college GPA?",
      answer:
        "A GPA of 3.0 or higher is generally considered good. A 3.5+ may qualify for Dean's List, and 3.7+ for Latin honors at many institutions.",
    },
    {
      question: "How do plus/minus grades affect college GPA?",
      answer:
        "An A+ is typically 4.0, A is 4.0, A- is 3.7, B+ is 3.3, B is 3.0, B- is 2.7, C+ is 2.3, C is 2.0, C- is 1.7, D+ is 1.3, D is 1.0, and F is 0.0.",
    },
  ],
  formula: "College GPA = Sum(Grade Points x Credit Hours) / Sum(Credit Hours)",
};
