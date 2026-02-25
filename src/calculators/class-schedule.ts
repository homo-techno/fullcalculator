import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const classScheduleCalculator: CalculatorDefinition = {
  slug: "class-schedule-calculator",
  title: "Class Schedule Planner",
  description:
    "Free class schedule planner calculator. Estimate your weekly time in class, gaps between classes, and optimize your semester schedule.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "class schedule planner",
    "semester schedule calculator",
    "class time calculator",
    "weekly schedule planner",
    "college schedule optimizer",
  ],
  variants: [
    {
      id: "weekly-time",
      name: "Weekly Class Time",
      description: "Calculate total weekly time spent in classes based on course meetings",
      fields: [
        { name: "threeCredit", label: "3-Credit Classes (meet ~3 hrs/wk)", type: "number", placeholder: "e.g. 4", min: 0, max: 10, defaultValue: 0 },
        { name: "fourCredit", label: "4-Credit Classes (meet ~4 hrs/wk)", type: "number", placeholder: "e.g. 1", min: 0, max: 10, defaultValue: 0 },
        { name: "oneCredit", label: "1-Credit Classes (meet ~1 hr/wk)", type: "number", placeholder: "e.g. 1", min: 0, max: 10, defaultValue: 0 },
        { name: "labClasses", label: "Classes with Lab (+3 hrs/wk each)", type: "number", placeholder: "e.g. 1", min: 0, max: 5, defaultValue: 0 },
        { name: "commuteMinutes", label: "Commute Time per Trip (minutes)", type: "number", placeholder: "e.g. 20", min: 0 },
        { name: "daysOnCampus", label: "Days on Campus per Week", type: "number", placeholder: "e.g. 5", min: 1, max: 7 },
      ],
      calculate: (inputs) => {
        const three = (inputs.threeCredit as number) || 0;
        const four = (inputs.fourCredit as number) || 0;
        const one = (inputs.oneCredit as number) || 0;
        const labs = (inputs.labClasses as number) || 0;
        const commute = (inputs.commuteMinutes as number) || 0;
        const days = (inputs.daysOnCampus as number) || 5;

        const classHours = three * 3 + four * 4 + one * 1 + labs * 3;
        const totalCredits = three * 3 + four * 4 + one * 1;
        const commuteHours = (commute * 2 * days) / 60;
        const totalWeekly = classHours + commuteHours;

        return {
          primary: { label: "Total Weekly Commitment", value: `${formatNumber(totalWeekly, 1)} hrs` },
          details: [
            { label: "In-class hours", value: `${formatNumber(classHours, 0)} hrs/week` },
            { label: "Commute time", value: `${formatNumber(commuteHours, 1)} hrs/week` },
            { label: "Total credit hours", value: formatNumber(totalCredits, 0) },
            { label: "Avg hours per campus day", value: `${formatNumber(totalWeekly / days, 1)} hrs` },
          ],
        };
      },
    },
    {
      id: "balance",
      name: "Schedule Balance",
      description: "Check if your schedule leaves enough time for study, work, and rest",
      fields: [
        { name: "classHours", label: "Weekly Class Hours", type: "number", placeholder: "e.g. 15", min: 0 },
        { name: "studyHours", label: "Weekly Study Hours", type: "number", placeholder: "e.g. 20", min: 0 },
        { name: "workHours", label: "Weekly Work Hours", type: "number", placeholder: "e.g. 10", min: 0 },
        { name: "sleepHours", label: "Daily Sleep Hours", type: "number", placeholder: "e.g. 7", min: 4, max: 12 },
      ],
      calculate: (inputs) => {
        const classH = (inputs.classHours as number) || 0;
        const studyH = (inputs.studyHours as number) || 0;
        const workH = (inputs.workHours as number) || 0;
        const sleepH = (inputs.sleepHours as number) || 7;

        const totalWeekHours = 168;
        const sleepWeekly = sleepH * 7;
        const committed = classH + studyH + workH + sleepWeekly;
        const freeTime = totalWeekHours - committed;
        const freePerDay = freeTime / 7;

        let balance: string;
        if (freePerDay >= 6) balance = "Well-balanced schedule";
        else if (freePerDay >= 4) balance = "Manageable but tight";
        else if (freePerDay >= 2) balance = "Very busy - watch for burnout";
        else balance = "Overloaded - consider reducing commitments";

        return {
          primary: { label: "Free Time per Day", value: `${formatNumber(freePerDay, 1)} hrs` },
          details: [
            { label: "Balance assessment", value: balance },
            { label: "Total committed hours/week", value: formatNumber(committed, 0) },
            { label: "Free hours/week", value: formatNumber(freeTime, 0) },
            { label: "Sleep hours/week", value: formatNumber(sleepWeekly, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["credit-hours-calculator", "study-time-calculator"],
  faq: [
    {
      question: "How many hours per week should I spend in class?",
      answer:
        "A typical full-time student with 15 credit hours spends about 15 hours per week in class. Combined with 2 hours of study per credit hour, that's about 45 hours per week of academic commitment.",
    },
    {
      question: "Is it better to have classes spread out or condensed?",
      answer:
        "It depends on your learning style. Spread-out schedules allow recovery time between classes, while condensed schedules give you full free days for studying or working.",
    },
  ],
  formula: "Weekly Class Time = Sum(Credits x Meeting Hours per Credit) + Lab Hours",
};
