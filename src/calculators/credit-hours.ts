import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const creditHoursCalculator: CalculatorDefinition = {
  slug: "credit-hours-calculator",
  title: "Credit Hours Calculator",
  description:
    "Free credit hours calculator. Plan your semester course load, estimate time commitment, and track credits toward graduation.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "credit hours calculator",
    "semester credit hours",
    "course load calculator",
    "credits to graduate",
    "study hours per credit",
  ],
  variants: [
    {
      id: "time-commitment",
      name: "Time Commitment",
      description: "Estimate weekly study time based on your credit hours (rule of thumb: 2-3 hours of study per credit hour)",
      fields: [
        { name: "creditHours", label: "Total Credit Hours This Semester", type: "number", placeholder: "e.g. 15", min: 1, max: 30 },
        { name: "studyRatio", label: "Study Hours per Credit Hour", type: "select", options: [{ label: "Light (1.5 hrs)", value: "1.5" }, { label: "Moderate (2 hrs)", value: "2" }, { label: "Heavy (3 hrs)", value: "3" }], defaultValue: "2" },
      ],
      calculate: (inputs) => {
        const credits = inputs.creditHours as number;
        const ratio = parseFloat(inputs.studyRatio as string || "2");
        if (!credits) return null;

        const classHours = credits;
        const studyHours = credits * ratio;
        const totalWeekly = classHours + studyHours;
        const dailyAvg = totalWeekly / 7;

        let load: string;
        if (credits <= 11) load = "Part-time";
        else if (credits <= 15) load = "Full-time (standard)";
        else if (credits <= 18) load = "Full-time (heavy)";
        else load = "Overload (may need approval)";

        return {
          primary: { label: "Total Weekly Hours", value: formatNumber(totalWeekly, 1) },
          details: [
            { label: "In-class hours/week", value: formatNumber(classHours, 0) },
            { label: "Study hours/week", value: formatNumber(studyHours, 0) },
            { label: "Average daily commitment", value: `${formatNumber(dailyAvg, 1)} hrs` },
            { label: "Course load status", value: load },
          ],
        };
      },
    },
    {
      id: "graduation",
      name: "Credits to Graduate",
      description: "Calculate how many semesters until you complete your degree",
      fields: [
        { name: "totalRequired", label: "Total Credits Required", type: "number", placeholder: "e.g. 120", min: 1 },
        { name: "creditsCompleted", label: "Credits Completed", type: "number", placeholder: "e.g. 45", min: 0 },
        { name: "creditsPerSemester", label: "Credits Per Semester", type: "number", placeholder: "e.g. 15", min: 1, max: 24 },
      ],
      calculate: (inputs) => {
        const total = inputs.totalRequired as number;
        const completed = inputs.creditsCompleted as number;
        const perSemester = inputs.creditsPerSemester as number;
        if (!total || completed === undefined || !perSemester) return null;

        const remaining = Math.max(0, total - completed);
        const semesters = Math.ceil(remaining / perSemester);
        const years = semesters / 2;
        const percentDone = (completed / total) * 100;

        return {
          primary: { label: "Semesters Remaining", value: formatNumber(semesters, 0) },
          details: [
            { label: "Credits remaining", value: formatNumber(remaining, 0) },
            { label: "Estimated years", value: formatNumber(years, 1) },
            { label: "Percent complete", value: `${formatNumber(percentDone, 1)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gpa-calculator", "college-gpa-calculator"],
  faq: [
    {
      question: "How many credit hours is full-time?",
      answer:
        "Full-time status is typically 12-18 credit hours per semester for undergraduates. Graduate students may be full-time at 9-12 credits. Taking more than 18 may require special approval.",
    },
    {
      question: "How many credits do I need to graduate?",
      answer:
        "Most bachelor's degrees require 120-130 credit hours. Associate degrees typically require 60-64, and master's degrees require 30-60 credits.",
    },
  ],
  formula: "Weekly Commitment = Credit Hours + (Credit Hours x Study Ratio)",
};
