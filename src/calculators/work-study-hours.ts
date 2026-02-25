import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const workStudyHoursCalculator: CalculatorDefinition = {
  slug: "work-study-hours-calculator",
  title: "Work-Study Hours Calculator",
  description:
    "Free work-study hours calculator. Calculate how many hours per week you need to work to earn your federal work-study award.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "work study hours calculator",
    "federal work study",
    "work study schedule",
    "campus job hours",
    "work study earnings",
  ],
  variants: [
    {
      id: "hours-needed",
      name: "Weekly Hours Needed",
      description: "Calculate how many hours per week to work to earn your full work-study award",
      fields: [
        { name: "totalAward", label: "Total Work-Study Award ($)", type: "number", placeholder: "e.g. 3000", min: 0 },
        { name: "hourlyRate", label: "Hourly Pay Rate ($)", type: "number", placeholder: "e.g. 12", min: 0, step: 0.25 },
        { name: "semesterWeeks", label: "Weeks in Semester", type: "number", placeholder: "e.g. 15", min: 1, max: 20, defaultValue: 15 },
      ],
      calculate: (inputs) => {
        const award = inputs.totalAward as number;
        const rate = inputs.hourlyRate as number;
        const weeks = (inputs.semesterWeeks as number) || 15;
        if (!award || !rate) return null;

        const totalHours = award / rate;
        const hoursPerWeek = totalHours / weeks;
        const monthlyEarnings = award / (weeks / 4.33);

        let feasibility: string;
        if (hoursPerWeek <= 10) feasibility = "Very manageable alongside classes";
        else if (hoursPerWeek <= 15) feasibility = "Manageable for most students";
        else if (hoursPerWeek <= 20) feasibility = "Heavy but doable with good scheduling";
        else feasibility = "Very heavy - may impact academics";

        return {
          primary: { label: "Hours per Week", value: formatNumber(hoursPerWeek, 1) },
          details: [
            { label: "Feasibility", value: feasibility },
            { label: "Total hours in semester", value: formatNumber(totalHours, 0) },
            { label: "Monthly earnings", value: `$${formatNumber(monthlyEarnings, 2)}` },
            { label: "Hours per day (5-day week)", value: formatNumber(hoursPerWeek / 5, 1) },
          ],
        };
      },
    },
    {
      id: "earnings",
      name: "Earnings Projection",
      description: "Project your work-study earnings based on your actual schedule",
      fields: [
        { name: "hoursPerWeek", label: "Hours Working per Week", type: "number", placeholder: "e.g. 10", min: 1, max: 20 },
        { name: "hourlyRate", label: "Hourly Pay Rate ($)", type: "number", placeholder: "e.g. 12", min: 0, step: 0.25 },
        { name: "semesterWeeks", label: "Weeks Working", type: "number", placeholder: "e.g. 14", min: 1, max: 20 },
        { name: "awardLimit", label: "Work-Study Award Limit ($)", type: "number", placeholder: "e.g. 3000", min: 0 },
      ],
      calculate: (inputs) => {
        const hours = inputs.hoursPerWeek as number;
        const rate = inputs.hourlyRate as number;
        const weeks = inputs.semesterWeeks as number;
        const limit = (inputs.awardLimit as number) || Infinity;
        if (!hours || !rate || !weeks) return null;

        const potentialEarnings = hours * rate * weeks;
        const actualEarnings = Math.min(potentialEarnings, limit);
        const weeksToMaxOut = limit !== Infinity ? Math.ceil(limit / (hours * rate)) : weeks;
        const leftover = limit !== Infinity ? Math.max(0, limit - potentialEarnings) : 0;

        return {
          primary: { label: "Projected Earnings", value: `$${formatNumber(actualEarnings, 2)}` },
          details: [
            { label: "Weekly earnings", value: `$${formatNumber(hours * rate, 2)}` },
            { label: "Weeks to reach award limit", value: limit !== Infinity ? formatNumber(weeksToMaxOut, 0) : "No limit set" },
            { label: "Award amount unused", value: leftover > 0 ? `$${formatNumber(leftover, 2)}` : "Fully earned" },
            { label: "Total hours worked", value: formatNumber(hours * weeks, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["financial-aid-estimate-calculator", "student-monthly-budget-calculator"],
  faq: [
    {
      question: "What is federal work-study?",
      answer:
        "Federal Work-Study provides part-time jobs for undergraduate and graduate students with financial need. The program encourages community service and work related to your field of study. Your award amount is the maximum you can earn.",
    },
    {
      question: "How many hours can I work with work-study?",
      answer:
        "Work-study students typically work 10-15 hours per week during the school year. You cannot work more than 20 hours per week, and your total earnings cannot exceed your work-study award.",
    },
  ],
  formula: "Hours per Week = Total Award / (Hourly Rate x Weeks in Semester)",
};
