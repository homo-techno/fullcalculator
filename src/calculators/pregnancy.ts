import type { CalculatorDefinition } from "./types";

export const pregnancyCalculator: CalculatorDefinition = {
  slug: "pregnancy-due-date-calculator",
  title: "Pregnancy Due Date Calculator",
  description: "Free pregnancy due date calculator. Estimate your due date, conception date, and pregnancy milestones based on your last menstrual period.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["due date calculator", "pregnancy calculator", "pregnancy due date", "conception date calculator", "how many weeks pregnant"],
  variants: [
    {
      id: "lmp",
      name: "Due Date from Last Period",
      description: "Calculate due date from the first day of your last menstrual period (Naegele's rule)",
      fields: [
        { name: "year", label: "LMP Year", type: "number", placeholder: "e.g. 2026", min: 2024, max: 2027 },
        { name: "month", label: "LMP Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "day", label: "LMP Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
      ],
      calculate: (inputs) => {
        const y = inputs.year as number;
        const m = inputs.month as number;
        const d = inputs.day as number;
        if (!y || !m || !d) return null;

        const lmp = new Date(y, m - 1, d);
        const dueDate = new Date(lmp);
        dueDate.setDate(dueDate.getDate() + 280); // 40 weeks

        const conception = new Date(lmp);
        conception.setDate(conception.getDate() + 14);

        const today = new Date();
        const daysSinceLMP = Math.floor((today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24));
        const weeksPregnant = Math.floor(daysSinceLMP / 7);
        const daysExtra = daysSinceLMP % 7;

        const trimester1End = new Date(lmp); trimester1End.setDate(trimester1End.getDate() + 84);
        const trimester2End = new Date(lmp); trimester2End.setDate(trimester2End.getDate() + 189);

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const formatDate = (dt: Date) => `${months[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`;

        return {
          primary: { label: "Estimated Due Date", value: formatDate(dueDate) },
          details: [
            { label: "Current progress", value: daysSinceLMP >= 0 ? `${weeksPregnant} weeks, ${daysExtra} days` : "Not yet started" },
            { label: "Estimated conception", value: formatDate(conception) },
            { label: "1st trimester ends", value: formatDate(trimester1End) },
            { label: "2nd trimester ends", value: formatDate(trimester2End) },
          ],
          note: "Due dates are estimates. Only about 5% of babies are born on their exact due date. Most are born within 2 weeks before or after.",
        };
      },
    },
  ],
  relatedSlugs: ["age-calculator", "date-calculator", "bmi-calculator"],
  faq: [
    { question: "How is a due date calculated?", answer: "Using Naegele's rule: add 280 days (40 weeks) to the first day of your last menstrual period (LMP). This assumes a 28-day cycle with ovulation on day 14." },
    { question: "How accurate is a due date calculator?", answer: "Due date calculators give an estimate. Only about 5% of babies are born on their exact due date. About 80% are born within 2 weeks of the estimated date." },
  ],
  formula: "Due Date = LMP + 280 days (40 weeks)",
};
