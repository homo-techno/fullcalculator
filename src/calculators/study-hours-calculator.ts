import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const studyHoursCalculator: CalculatorDefinition = {
  slug: "study-hours-calculator",
  title: "Study Hours Calculator",
  description: "Calculate the recommended weekly study hours based on credit load.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["study","hours","credits","college","time management"],
  variants: [{
    id: "standard",
    name: "Study Hours",
    description: "Calculate the recommended weekly study hours based on credit load.",
    fields: [
      { name: "creditHours", label: "Total Credit Hours", type: "number", min: 1, max: 24, step: 1, defaultValue: 15 },
      { name: "studyRatio", label: "Study Hours Per Credit", type: "select", options: [{ value: "2", label: "Standard (2:1)" }, { value: "2.5", label: "Challenging (2.5:1)" }, { value: "3", label: "Intensive (3:1)" }] },
      { name: "classHoursPerCredit", label: "Class Hours Per Credit", type: "number", min: 0.5, max: 2, step: 0.5, defaultValue: 1 },
      { name: "studyDays", label: "Study Days Per Week", type: "number", min: 3, max: 7, step: 1, defaultValue: 6 },
    ],
    calculate: (inputs) => {
    const creditHours = inputs.creditHours as number;
    const studyRatio = inputs.studyRatio as number;
    const classHoursPerCredit = inputs.classHoursPerCredit as number;
    const studyDays = inputs.studyDays as number;
    const weeklyClassHours = creditHours * classHoursPerCredit;
    const weeklyStudyHours = creditHours * studyRatio;
    const totalWeeklyHours = weeklyClassHours + weeklyStudyHours;
    const studyHoursPerDay = weeklyStudyHours / studyDays;
    return {
      primary: { label: "Weekly Study Hours", value: formatNumber(weeklyStudyHours) + " hrs" },
      details: [
        { label: "Weekly Class Hours", value: formatNumber(weeklyClassHours) + " hrs" },
        { label: "Total Academic Hours", value: formatNumber(totalWeeklyHours) + " hrs" },
        { label: "Study Hours Per Day", value: formatNumber(studyHoursPerDay) + " hrs" },
        { label: "Free Hours Per Week", value: formatNumber(168 - totalWeeklyHours - 56) + " hrs" }
      ]
    };
  },
  }],
  relatedSlugs: ["gpa-calculator","tutoring-cost-calculator","classroom-size-calculator"],
  faq: [
    { question: "How many hours should I study per credit hour?", answer: "The general rule is 2 to 3 hours of study for each credit hour per week." },
    { question: "How many hours per week should a college student study?", answer: "A full-time student taking 15 credits should study 30 to 45 hours per week." },
  ],
  formula: "Weekly Study Hours = Credit Hours x Study Ratio",
};
