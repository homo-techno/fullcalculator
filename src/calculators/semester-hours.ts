import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const semesterHoursCalculator: CalculatorDefinition = {
  slug: "semester-hours-calculator",
  title: "Semester Credit Hours Calculator",
  description:
    "Free semester credit hours calculator. Plan your course load, calculate total study hours, and track progress toward graduation.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "semester hours calculator",
    "credit hours calculator",
    "course load calculator",
    "how many credits should I take",
    "full time credit hours",
  ],
  variants: [
    {
      id: "courseLoad",
      name: "Course Load Planner",
      description: "Calculate your total credit hours and estimated weekly time commitment",
      fields: [
        { name: "course1", label: "Course 1 Credits", type: "number", placeholder: "e.g. 3", min: 1, max: 6 },
        { name: "course2", label: "Course 2 Credits", type: "number", placeholder: "e.g. 4", min: 1, max: 6 },
        { name: "course3", label: "Course 3 Credits", type: "number", placeholder: "e.g. 3", min: 1, max: 6 },
        { name: "course4", label: "Course 4 Credits", type: "number", placeholder: "e.g. 3", min: 1, max: 6 },
        { name: "course5", label: "Course 5 Credits", type: "number", placeholder: "optional", min: 1, max: 6 },
        { name: "course6", label: "Course 6 Credits", type: "number", placeholder: "optional", min: 1, max: 6 },
      ],
      calculate: (inputs) => {
        let totalCredits = 0;
        let courseCount = 0;

        for (let i = 1; i <= 6; i++) {
          const credits = inputs[`course${i}`] as number;
          if (credits && credits > 0) {
            totalCredits += credits;
            courseCount++;
          }
        }

        if (courseCount === 0) return null;

        // Carnegie rule: 2-3 hours of study per credit hour per week
        const classHoursPerWeek = totalCredits; // 1 credit = 1 hour of class per week
        const studyHoursLow = totalCredits * 2;
        const studyHoursHigh = totalCredits * 3;
        const totalWeeklyLow = classHoursPerWeek + studyHoursLow;
        const totalWeeklyHigh = classHoursPerWeek + studyHoursHigh;

        let status: string;
        if (totalCredits >= 12) status = "Full-time";
        else if (totalCredits >= 9) status = "Three-quarter time";
        else if (totalCredits >= 6) status = "Half-time";
        else status = "Less than half-time";

        return {
          primary: { label: "Total Credit Hours", value: formatNumber(totalCredits, 0) },
          details: [
            { label: "Enrollment status", value: status },
            { label: "Number of courses", value: `${courseCount}` },
            { label: "Class hours per week", value: `~${formatNumber(classHoursPerWeek, 0)} hrs` },
            { label: "Study hours per week", value: `${formatNumber(studyHoursLow, 0)}-${formatNumber(studyHoursHigh, 0)} hrs` },
            { label: "Total weekly commitment", value: `${formatNumber(totalWeeklyLow, 0)}-${formatNumber(totalWeeklyHigh, 0)} hrs` },
            { label: "Financial aid eligible (6+ credits)", value: totalCredits >= 6 ? "Yes" : "May not qualify" },
          ],
        };
      },
    },
    {
      id: "graduation",
      name: "Graduation Timeline",
      description: "Calculate how many semesters until you graduate",
      fields: [
        { name: "totalRequired", label: "Total Credits Required for Degree", type: "number", placeholder: "e.g. 120" },
        { name: "creditsCompleted", label: "Credits Already Completed", type: "number", placeholder: "e.g. 45" },
        { name: "creditsPerSemester", label: "Credits Per Semester (planned)", type: "number", placeholder: "e.g. 15" },
        { name: "summerCredits", label: "Summer Credits Per Year", type: "number", placeholder: "e.g. 6", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const required = inputs.totalRequired as number;
        const completed = inputs.creditsCompleted as number;
        const perSemester = inputs.creditsPerSemester as number;
        const summer = (inputs.summerCredits as number) || 0;
        if (!required || completed === undefined || !perSemester) return null;

        const remaining = Math.max(0, required - completed);
        const creditsPerYear = perSemester * 2 + summer;
        const yearsRemaining = remaining / creditsPerYear;
        const semestersRemaining = Math.ceil(remaining / perSemester);
        const percentComplete = (completed / required) * 100;

        return {
          primary: { label: "Semesters Remaining", value: formatNumber(semestersRemaining, 0) },
          details: [
            { label: "Credits remaining", value: formatNumber(remaining, 0) },
            { label: "Percent complete", value: `${formatNumber(percentComplete, 1)}%` },
            { label: "Credits per year", value: formatNumber(creditsPerYear, 0) },
            { label: "Years remaining", value: formatNumber(yearsRemaining, 1) },
            { label: "On track for 4-year graduation", value: completed >= (required / 8) * Math.floor(completed / (perSemester || 15)) ? "Approximately" : "May need more credits" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gpa-calculator", "tuition-cost-calculator", "study-time-calculator"],
  faq: [
    {
      question: "How many credit hours is full-time?",
      answer:
        "Full-time enrollment is typically 12 or more credit hours per semester for undergraduates. Most students take 15 credits (5 three-credit courses) per semester to graduate in 4 years (120 total credits).",
    },
    {
      question: "How many hours per week should I study per credit hour?",
      answer:
        "The general rule (Carnegie rule) is 2-3 hours of study time per credit hour per week. A 3-credit course requires 3 hours in class plus 6-9 hours of study, totaling 9-12 hours per week.",
    },
    {
      question: "How many credits do I need to graduate?",
      answer:
        "Most bachelor's degrees require 120 credit hours. Associate degrees typically require 60 credits. Some programs like engineering or nursing may require 130+ credits.",
    },
  ],
  formula: "Weekly Commitment = Credit Hours + (Credit Hours x 2 to 3 study hours)",
};
