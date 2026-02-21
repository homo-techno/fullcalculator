import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pregnancyWeekCalculator: CalculatorDefinition = {
  slug: "pregnancy-week-calculator",
  title: "Pregnancy Week Calculator",
  description:
    "Free pregnancy week calculator. Find out how many weeks pregnant you are from your last menstrual period. See your trimester, due date, and baby development milestones.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "pregnancy week calculator",
    "how many weeks pregnant",
    "pregnancy calculator",
    "weeks pregnant calculator",
    "pregnancy trimester calculator",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Pregnancy Week",
      description: "Find out how far along you are",
      fields: [
        {
          name: "lmpMonth",
          label: "LMP Month",
          type: "select",
          options: [
            { label: "January", value: "1" }, { label: "February", value: "2" },
            { label: "March", value: "3" }, { label: "April", value: "4" },
            { label: "May", value: "5" }, { label: "June", value: "6" },
            { label: "July", value: "7" }, { label: "August", value: "8" },
            { label: "September", value: "9" }, { label: "October", value: "10" },
            { label: "November", value: "11" }, { label: "December", value: "12" },
          ],
          defaultValue: "1",
        },
        { name: "lmpDay", label: "LMP Day", type: "number", placeholder: "e.g. 15", min: 1, max: 31 },
        { name: "lmpYear", label: "LMP Year", type: "number", placeholder: "e.g. 2025", min: 2020, max: 2030 },
      ],
      calculate: (inputs) => {
        const month = parseInt(inputs.lmpMonth as string);
        const day = inputs.lmpDay as number;
        const year = inputs.lmpYear as number;
        if (!month || !day || !year) return null;

        const lmp = new Date(year, month - 1, day);
        const now = new Date();
        const diffMs = now.getTime() - lmp.getTime();
        const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

        if (diffDays < 0) return null;

        const weeks = Math.floor(diffDays / 7);
        const days = diffDays % 7;
        const dueDate = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
        const daysRemaining = Math.max(0, Math.floor((dueDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));

        let trimester: string;
        if (weeks < 13) trimester = "First Trimester (weeks 1-12)";
        else if (weeks < 28) trimester = "Second Trimester (weeks 13-27)";
        else trimester = "Third Trimester (weeks 28-40)";

        let milestone: string;
        if (weeks < 4) milestone = "Implantation occurring; early cell division";
        else if (weeks < 8) milestone = "Heart begins to beat; basic organs forming";
        else if (weeks < 12) milestone = "Fingers and toes forming; fetus is about 2 inches";
        else if (weeks < 16) milestone = "Sex may be identifiable; fetus is about 4 inches";
        else if (weeks < 20) milestone = "Movement may be felt (quickening); about 6 inches";
        else if (weeks < 24) milestone = "Hearing develops; viable outside womb with intensive care";
        else if (weeks < 28) milestone = "Eyes open; lungs developing; about 14 inches";
        else if (weeks < 32) milestone = "Rapid brain development; about 16 inches";
        else if (weeks < 36) milestone = "Most organs mature; baby gaining weight rapidly";
        else if (weeks < 40) milestone = "Full term approaching; baby drops into position";
        else milestone = "Full term! Baby could arrive any day";

        const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

        return {
          primary: { label: "Pregnancy Week", value: `${weeks} weeks, ${days} days` },
          details: [
            { label: "Trimester", value: trimester },
            { label: "Due Date", value: fmt(dueDate) },
            { label: "Days Remaining", value: `${daysRemaining} days` },
            { label: "Progress", value: `${formatNumber((diffDays / 280) * 100, 1)}%` },
            { label: "Baby Development", value: milestone },
          ],
          note: "Pregnancy is counted from the first day of your last menstrual period (LMP). Full term is 40 weeks (280 days) from LMP.",
        };
      },
    },
  ],
  relatedSlugs: ["due-date-calculator", "conception-date-calculator", "pregnancy-calculator", "ovulation-calculator"],
  faq: [
    {
      question: "How do you count pregnancy weeks?",
      answer:
        "Pregnancy is counted from the first day of your last menstrual period (LMP), not from conception. This means you are about 2 weeks 'pregnant' before conception actually occurs. Full term pregnancy is 40 weeks from LMP.",
    },
    {
      question: "What are the three trimesters?",
      answer:
        "First trimester: weeks 1-12 (major organ development). Second trimester: weeks 13-27 (rapid growth, movement felt). Third trimester: weeks 28-40 (brain development, weight gain, preparation for birth).",
    },
    {
      question: "When is my due date?",
      answer:
        "Your estimated due date is 280 days (40 weeks) from the first day of your last menstrual period. Only about 5% of babies are born on their exact due date. Most are born within 2 weeks before or after.",
    },
  ],
  formula:
    "Pregnancy Week = (Today - LMP) / 7 | Due Date = LMP + 280 days | Trimester: 1st (1-12wk), 2nd (13-27wk), 3rd (28-40wk)",
};
