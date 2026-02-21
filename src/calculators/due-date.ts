import type { CalculatorDefinition } from "./types";

export const dueDateCalculator: CalculatorDefinition = {
  slug: "due-date-calculator",
  title: "Due Date Calculator",
  description: "Free pregnancy due date calculator. Estimate your baby's due date from your last menstrual period or conception date.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["due date calculator", "pregnancy due date", "baby due date", "expected delivery date", "gestational age"],
  variants: [
    {
      id: "fromLMP",
      name: "From Last Menstrual Period",
      fields: [
        { name: "year", label: "LMP Year", type: "number", placeholder: "e.g. 2025" },
        { name: "month", label: "LMP Month (1-12)", type: "number", placeholder: "e.g. 6", min: 1, max: 12 },
        { name: "day", label: "LMP Day", type: "number", placeholder: "e.g. 15", min: 1, max: 31 },
      ],
      calculate: (inputs) => {
        const y = inputs.year as number, m = inputs.month as number, d = inputs.day as number;
        if (!y || !m || !d) return null;
        const lmp = new Date(y, m - 1, d);
        if (isNaN(lmp.getTime())) return null;
        const dueDate = new Date(lmp);
        dueDate.setDate(dueDate.getDate() + 280);
        const today = new Date();
        const daysDiff = Math.floor((today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24));
        const weeksPregnant = Math.floor(daysDiff / 7);
        const daysExtra = daysDiff % 7;
        const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const conceptionDate = new Date(lmp);
        conceptionDate.setDate(conceptionDate.getDate() + 14);
        const trimester = weeksPregnant < 13 ? "1st" : weeksPregnant < 27 ? "2nd" : "3rd";
        const formatDate = (d: Date) => d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        return {
          primary: { label: "Estimated Due Date", value: formatDate(dueDate) },
          details: [
            { label: "Current week", value: daysDiff > 0 ? `${weeksPregnant} weeks, ${daysExtra} days` : "Not yet started" },
            { label: "Trimester", value: daysDiff > 0 ? trimester : "—" },
            { label: "Days until due", value: daysUntilDue > 0 ? `${daysUntilDue} days` : "Past due" },
            { label: "Estimated conception", value: formatDate(conceptionDate) },
          ],
        };
      },
    },
    {
      id: "fromConception",
      name: "From Conception Date",
      fields: [
        { name: "year", label: "Year", type: "number", placeholder: "e.g. 2025" },
        { name: "month", label: "Month (1-12)", type: "number", placeholder: "e.g. 7", min: 1, max: 12 },
        { name: "day", label: "Day", type: "number", placeholder: "e.g. 1", min: 1, max: 31 },
      ],
      calculate: (inputs) => {
        const y = inputs.year as number, m = inputs.month as number, d = inputs.day as number;
        if (!y || !m || !d) return null;
        const conception = new Date(y, m - 1, d);
        if (isNaN(conception.getTime())) return null;
        const dueDate = new Date(conception);
        dueDate.setDate(dueDate.getDate() + 266);
        const formatDate = (d: Date) => d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        return {
          primary: { label: "Estimated Due Date", value: formatDate(dueDate) },
          details: [
            { label: "Conception date", value: formatDate(conception) },
            { label: "Gestation period", value: "266 days (38 weeks)" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pregnancy-calculator", "ovulation-calculator", "age-calculator"],
  faq: [{ question: "How is the due date calculated?", answer: "From LMP: add 280 days (40 weeks) to the first day of your last menstrual period (Naegele's rule). From conception: add 266 days (38 weeks). Only about 5% of babies are born on their due date." }],
  formula: "Due Date = LMP + 280 days = Conception + 266 days",
};
