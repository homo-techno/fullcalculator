import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const letterToGpa: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "D-": 0.7,
  "F": 0.0,
};

export const letterGradeCalculator: CalculatorDefinition = {
  slug: "letter-grade-calculator",
  title: "Letter Grade to GPA Converter",
  description:
    "Free letter grade to GPA converter. Convert letter grades to GPA points and see equivalent percentages on both 4.0 and 5.0 scales.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "letter grade to gpa",
    "grade converter",
    "letter grade calculator",
    "gpa converter",
    "grade point average converter",
  ],
  variants: [
    {
      id: "convert",
      name: "Letter Grade to GPA",
      description: "Convert a letter grade to its GPA equivalent on a 4.0 scale",
      fields: [
        {
          name: "letterGrade",
          label: "Letter Grade",
          type: "select",
          options: [
            { label: "A+ (97-100%)", value: "A+" },
            { label: "A (93-96%)", value: "A" },
            { label: "A- (90-92%)", value: "A-" },
            { label: "B+ (87-89%)", value: "B+" },
            { label: "B (83-86%)", value: "B" },
            { label: "B- (80-82%)", value: "B-" },
            { label: "C+ (77-79%)", value: "C+" },
            { label: "C (73-76%)", value: "C" },
            { label: "C- (70-72%)", value: "C-" },
            { label: "D+ (67-69%)", value: "D+" },
            { label: "D (63-66%)", value: "D" },
            { label: "D- (60-62%)", value: "D-" },
            { label: "F (0-59%)", value: "F" },
          ],
        },
      ],
      calculate: (inputs) => {
        const grade = inputs.letterGrade as string;
        if (!grade || !(grade in letterToGpa)) return null;

        const gpa = letterToGpa[grade];
        const percentRanges: Record<string, string> = {
          "A+": "97-100%", "A": "93-96%", "A-": "90-92%",
          "B+": "87-89%", "B": "83-86%", "B-": "80-82%",
          "C+": "77-79%", "C": "73-76%", "C-": "70-72%",
          "D+": "67-69%", "D": "63-66%", "D-": "60-62%",
          "F": "0-59%",
        };

        const gpa5 = gpa + (grade === "A+" ? 1.0 : grade === "A" ? 1.0 : gpa > 0 ? 1.0 : 0);

        return {
          primary: { label: "GPA (4.0 Scale)", value: formatNumber(gpa, 1) },
          details: [
            { label: "Letter grade", value: grade },
            { label: "Percentage range", value: percentRanges[grade] || "N/A" },
            { label: "GPA (5.0 weighted scale)", value: formatNumber(gpa5, 1) },
            { label: "Passing grade", value: gpa >= 1.0 ? "Yes" : "No" },
            { label: "Dean's List eligible (3.5+)", value: gpa >= 3.5 ? "Yes" : "No" },
          ],
        };
      },
    },
    {
      id: "multiCourse",
      name: "Multi-Course GPA from Letter Grades",
      description: "Enter letter grades for multiple courses to calculate GPA",
      fields: [
        {
          name: "grade1",
          label: "Course 1 Grade",
          type: "select",
          options: [
            { label: "A+", value: "A+" }, { label: "A", value: "A" }, { label: "A-", value: "A-" },
            { label: "B+", value: "B+" }, { label: "B", value: "B" }, { label: "B-", value: "B-" },
            { label: "C+", value: "C+" }, { label: "C", value: "C" }, { label: "C-", value: "C-" },
            { label: "D+", value: "D+" }, { label: "D", value: "D" }, { label: "D-", value: "D-" },
            { label: "F", value: "F" },
          ],
        },
        { name: "credits1", label: "Course 1 Credits", type: "number", placeholder: "e.g. 3", min: 1, max: 6 },
        {
          name: "grade2",
          label: "Course 2 Grade",
          type: "select",
          options: [
            { label: "A+", value: "A+" }, { label: "A", value: "A" }, { label: "A-", value: "A-" },
            { label: "B+", value: "B+" }, { label: "B", value: "B" }, { label: "B-", value: "B-" },
            { label: "C+", value: "C+" }, { label: "C", value: "C" }, { label: "C-", value: "C-" },
            { label: "D+", value: "D+" }, { label: "D", value: "D" }, { label: "D-", value: "D-" },
            { label: "F", value: "F" },
          ],
        },
        { name: "credits2", label: "Course 2 Credits", type: "number", placeholder: "e.g. 4", min: 1, max: 6 },
        {
          name: "grade3",
          label: "Course 3 Grade",
          type: "select",
          options: [
            { label: "A+", value: "A+" }, { label: "A", value: "A" }, { label: "A-", value: "A-" },
            { label: "B+", value: "B+" }, { label: "B", value: "B" }, { label: "B-", value: "B-" },
            { label: "C+", value: "C+" }, { label: "C", value: "C" }, { label: "C-", value: "C-" },
            { label: "D+", value: "D+" }, { label: "D", value: "D" }, { label: "D-", value: "D-" },
            { label: "F", value: "F" },
          ],
        },
        { name: "credits3", label: "Course 3 Credits", type: "number", placeholder: "e.g. 3", min: 1, max: 6 },
        {
          name: "grade4",
          label: "Course 4 Grade",
          type: "select",
          options: [
            { label: "A+", value: "A+" }, { label: "A", value: "A" }, { label: "A-", value: "A-" },
            { label: "B+", value: "B+" }, { label: "B", value: "B" }, { label: "B-", value: "B-" },
            { label: "C+", value: "C+" }, { label: "C", value: "C" }, { label: "C-", value: "C-" },
            { label: "D+", value: "D+" }, { label: "D", value: "D" }, { label: "D-", value: "D-" },
            { label: "F", value: "F" },
          ],
        },
        { name: "credits4", label: "Course 4 Credits", type: "number", placeholder: "optional", min: 1, max: 6 },
      ],
      calculate: (inputs) => {
        let totalPoints = 0;
        let totalCredits = 0;
        let courseCount = 0;

        for (let i = 1; i <= 4; i++) {
          const grade = inputs[`grade${i}`] as string;
          const credits = inputs[`credits${i}`] as number;
          if (grade && grade in letterToGpa && credits && credits > 0) {
            totalPoints += letterToGpa[grade] * credits;
            totalCredits += credits;
            courseCount++;
          }
        }

        if (totalCredits === 0) return null;

        const gpa = totalPoints / totalCredits;

        return {
          primary: { label: "Semester GPA", value: formatNumber(gpa, 2) },
          details: [
            { label: "Courses counted", value: `${courseCount}` },
            { label: "Total credits", value: formatNumber(totalCredits, 0) },
            { label: "Total quality points", value: formatNumber(totalPoints, 1) },
            { label: "Equivalent letter grade", value: gpa >= 3.7 ? "A-/A" : gpa >= 3.3 ? "B+" : gpa >= 3.0 ? "B" : gpa >= 2.7 ? "B-" : gpa >= 2.0 ? "C" : gpa >= 1.0 ? "D" : "F" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gpa-calculator", "cumulative-gpa-calculator", "gpa-to-percentage-calculator"],
  faq: [
    {
      question: "What is the GPA scale?",
      answer:
        "The standard 4.0 GPA scale assigns: A/A+ = 4.0, A- = 3.7, B+ = 3.3, B = 3.0, B- = 2.7, C+ = 2.3, C = 2.0, C- = 1.7, D+ = 1.3, D = 1.0, D- = 0.7, F = 0.0.",
    },
    {
      question: "What is a weighted GPA on a 5.0 scale?",
      answer:
        "Some high schools use a 5.0 scale for honors and AP classes, adding 1.0 to the standard GPA points. For example, an A in an AP class would be 5.0 instead of 4.0.",
    },
    {
      question: "Is an A+ worth more than an A?",
      answer:
        "On the standard 4.0 scale, both A+ and A are worth 4.0 GPA points. Some institutions may award 4.3 for an A+, but this is uncommon.",
    },
  ],
  formula: "GPA = Sum(Grade Points x Credits) / Sum(Credits)",
};
