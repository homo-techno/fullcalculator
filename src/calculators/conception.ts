import type { CalculatorDefinition } from "./types";

export const conceptionCalculator: CalculatorDefinition = {
  slug: "conception-date-calculator",
  title: "Conception Date Calculator",
  description:
    "Free conception date calculator. Estimate your conception date from your due date or last menstrual period (LMP). See your fertile window and key pregnancy dates.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "conception date calculator",
    "when did I conceive",
    "conception calculator",
    "fertile window calculator",
    "when was I conceived",
  ],
  variants: [
    {
      id: "from-lmp",
      name: "From Last Menstrual Period",
      description: "Calculate conception date from LMP",
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
        const conception = new Date(lmp.getTime() + 14 * 24 * 60 * 60 * 1000);
        const fertileStart = new Date(lmp.getTime() + 10 * 24 * 60 * 60 * 1000);
        const fertileEnd = new Date(lmp.getTime() + 17 * 24 * 60 * 60 * 1000);
        const dueDate = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);

        const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

        return {
          primary: { label: "Estimated Conception Date", value: fmt(conception) },
          details: [
            { label: "Fertile Window", value: `${fmt(fertileStart)} - ${fmt(fertileEnd)}` },
            { label: "Due Date", value: fmt(dueDate) },
            { label: "LMP", value: fmt(lmp) },
          ],
          note: "Conception typically occurs around day 14 of a 28-day cycle (ovulation). Actual conception may vary by a few days.",
        };
      },
    },
    {
      id: "from-due-date",
      name: "From Due Date",
      description: "Work backwards from your due date",
      fields: [
        {
          name: "dueMonth",
          label: "Due Date Month",
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
        { name: "dueDay", label: "Due Date Day", type: "number", placeholder: "e.g. 20", min: 1, max: 31 },
        { name: "dueYear", label: "Due Date Year", type: "number", placeholder: "e.g. 2026", min: 2020, max: 2030 },
      ],
      calculate: (inputs) => {
        const month = parseInt(inputs.dueMonth as string);
        const day = inputs.dueDay as number;
        const year = inputs.dueYear as number;
        if (!month || !day || !year) return null;

        const dueDate = new Date(year, month - 1, day);
        const conception = new Date(dueDate.getTime() - 266 * 24 * 60 * 60 * 1000);
        const fertileStart = new Date(conception.getTime() - 4 * 24 * 60 * 60 * 1000);
        const fertileEnd = new Date(conception.getTime() + 3 * 24 * 60 * 60 * 1000);
        const lmp = new Date(dueDate.getTime() - 280 * 24 * 60 * 60 * 1000);

        const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

        return {
          primary: { label: "Estimated Conception Date", value: fmt(conception) },
          details: [
            { label: "Fertile Window", value: `${fmt(fertileStart)} - ${fmt(fertileEnd)}` },
            { label: "Estimated LMP", value: fmt(lmp) },
            { label: "Due Date", value: fmt(dueDate) },
          ],
          note: "This estimates conception at 266 days before the due date. Actual conception may vary by a few days.",
        };
      },
    },
  ],
  relatedSlugs: ["due-date-calculator", "ovulation-calculator", "pregnancy-calculator"],
  faq: [
    {
      question: "When does conception occur?",
      answer:
        "Conception typically occurs during ovulation, around day 14 of a 28-day menstrual cycle. Sperm can survive up to 5 days, so intercourse a few days before ovulation can still result in conception.",
    },
    {
      question: "How accurate is this conception date?",
      answer:
        "This calculator estimates conception based on a standard 28-day cycle with ovulation on day 14. If your cycle is longer or shorter, the actual conception date may differ by several days.",
    },
    {
      question: "What is the fertile window?",
      answer:
        "The fertile window is the approximately 6-day period when pregnancy is possible: the 5 days before ovulation and the day of ovulation itself. Sperm can survive in the body for up to 5 days, while the egg is viable for about 12-24 hours.",
    },
  ],
  formula:
    "From LMP: Conception ≈ LMP + 14 days | From Due Date: Conception ≈ Due Date - 266 days | Due Date = LMP + 280 days",
};
