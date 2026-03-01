import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const reverseDueDateCalculator: CalculatorDefinition = {
  slug: "reverse-due-date-calculator",
  title: "Reverse Due Date Calculator",
  description: "Calculate the estimated conception date and fertile window from a given due date or birth date.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["reverse due date", "conception date from due date", "when did i conceive"],
  variants: [{
    id: "standard",
    name: "Reverse Due Date",
    description: "Calculate the estimated conception date and fertile window from a given due date or birth date",
    fields: [
      { name: "gestationWeeks", label: "Gestation at Delivery", type: "number", suffix: "weeks", min: 34, max: 42, defaultValue: 40 },
      { name: "dueDateMethod", label: "Date Type", type: "select", options: [{value:"due",label:"Due Date"},{value:"birth",label:"Birth Date"}], defaultValue: "due" },
      { name: "cycleLength", label: "Average Cycle Length", type: "number", suffix: "days", min: 21, max: 40, defaultValue: 28 },
    ],
    calculate: (inputs) => {
      const weeks = inputs.gestationWeeks as number;
      const method = inputs.dueDateMethod as string;
      const cycleLen = inputs.cycleLength as number;
      if (!weeks || !cycleLen) return null;
      const totalDays = weeks * 7;
      const ovulationDay = cycleLen - 14;
      const conceptionDaysBeforeDue = totalDays - ovulationDay;
      const fertileWindowStart = conceptionDaysBeforeDue + 5;
      const fertileWindowEnd = conceptionDaysBeforeDue - 1;
      const lmpDaysBeforeDue = totalDays;
      return {
        primary: { label: "Estimated Conception", value: formatNumber(conceptionDaysBeforeDue) + " days before " + (method === "due" ? "due date" : "birth date") },
        details: [
          { label: "Last Menstrual Period", value: formatNumber(lmpDaysBeforeDue) + " days before " + (method === "due" ? "due date" : "birth date") },
          { label: "Fertile Window Start", value: formatNumber(fertileWindowStart) + " days before " + (method === "due" ? "due date" : "birth date") },
          { label: "Ovulation Day of Cycle", value: "Day " + formatNumber(ovulationDay) },
        ],
      };
    },
  }],
  relatedSlugs: ["implantation-date-calculator", "fertility-by-age-calculator"],
  faq: [
    { question: "How accurate is a reverse due date calculation?", answer: "Reverse due date calculations provide an estimate within a range of about 5 days. Actual conception depends on individual ovulation timing and cycle regularity." },
    { question: "Does cycle length affect the estimated conception date?", answer: "Yes. Longer cycles mean later ovulation, so the estimated conception date shifts accordingly. The standard 28-day cycle assumes ovulation on day 14." },
  ],
  formula: "Conception Date = Due Date - (Gestation Weeks x 7) + (Cycle Length - 14)",
};
