import type { CalculatorDefinition } from "./types";

export const ivfDueDateCalculator: CalculatorDefinition = {
  slug: "ivf-due-date-calculator",
  title: "IVF Due Date Calculator",
  description:
    "Free IVF due date calculator. Calculate your due date based on embryo transfer date and embryo age (day 3 or day 5). See trimester dates and key pregnancy milestones.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "ivf due date calculator",
    "ivf pregnancy calculator",
    "embryo transfer due date",
    "ivf date calculator",
    "fet due date calculator",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate IVF Due Date",
      description: "Enter your transfer date and embryo age",
      fields: [
        {
          name: "transferMonth",
          label: "Transfer Month",
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
        { name: "transferDay", label: "Transfer Day", type: "number", placeholder: "e.g. 15", min: 1, max: 31 },
        { name: "transferYear", label: "Transfer Year", type: "number", placeholder: "e.g. 2025", min: 2020, max: 2030 },
        {
          name: "embryoAge",
          label: "Embryo Age at Transfer",
          type: "select",
          options: [
            { label: "Day 3 Embryo", value: "3" },
            { label: "Day 5 Embryo (Blastocyst)", value: "5" },
          ],
          defaultValue: "5",
        },
      ],
      calculate: (inputs) => {
        const month = parseInt(inputs.transferMonth as string);
        const day = inputs.transferDay as number;
        const year = inputs.transferYear as number;
        const embryoAge = parseInt(inputs.embryoAge as string);
        if (!month || !day || !year) return null;

        const transferDate = new Date(year, month - 1, day);
        const daysToAdd = 266 - embryoAge;
        const dueDate = new Date(transferDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

        const firstTrimEnd = new Date(transferDate.getTime() + (84 - embryoAge - 14) * 24 * 60 * 60 * 1000);
        const lmpEquivalent = new Date(transferDate.getTime() - (embryoAge + 14) * 24 * 60 * 60 * 1000);
        const secondTrimEnd = new Date(lmpEquivalent.getTime() + 188 * 24 * 60 * 60 * 1000);
        const viabilityDate = new Date(lmpEquivalent.getTime() + 168 * 24 * 60 * 60 * 1000);

        const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

        return {
          primary: { label: "Estimated Due Date", value: fmt(dueDate) },
          details: [
            { label: "Transfer Date", value: fmt(transferDate) },
            { label: "Embryo Age", value: `Day ${embryoAge}` },
            { label: "Equivalent LMP Date", value: fmt(lmpEquivalent) },
            { label: "End of 1st Trimester (~12 wk)", value: fmt(firstTrimEnd) },
            { label: "Viability (~24 wk)", value: fmt(viabilityDate) },
            { label: "End of 2nd Trimester (~27 wk)", value: fmt(secondTrimEnd) },
          ],
          note: `Due date calculated as transfer date + ${daysToAdd} days (266 days gestation minus ${embryoAge} days embryo age).`,
        };
      },
    },
  ],
  relatedSlugs: ["due-date-calculator", "conception-date-calculator", "pregnancy-calculator", "ovulation-calculator"],
  faq: [
    {
      question: "How is an IVF due date calculated?",
      answer:
        "IVF due dates are calculated from the embryo transfer date. For a day 5 (blastocyst) transfer: Due Date = Transfer Date + 261 days. For a day 3 transfer: Due Date = Transfer Date + 263 days. This accounts for the 266-day gestation minus the embryo age.",
    },
    {
      question: "Is an IVF due date more accurate than a natural conception due date?",
      answer:
        "Yes. IVF due dates are typically more accurate because the exact date of fertilization and embryo age are known, eliminating the uncertainty of when ovulation and conception occurred naturally.",
    },
    {
      question: "What is the difference between day 3 and day 5 transfer?",
      answer:
        "A day 3 embryo (cleavage stage) has 6-8 cells. A day 5 embryo (blastocyst) has over 100 cells and has begun differentiating. Blastocyst transfers often have higher implantation rates because embryos that survive to day 5 are typically stronger.",
    },
  ],
  formula:
    "IVF Due Date = Transfer Date + (266 - Embryo Age in days) | Day 5: Due = Transfer + 261 days | Day 3: Due = Transfer + 263 days",
};
