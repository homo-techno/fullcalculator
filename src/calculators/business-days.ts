import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const businessDaysCalculator: CalculatorDefinition = {
  slug: "business-days-calculator",
  title: "Business Days Calculator",
  description:
    "Free business days calculator. Add business days to a start date, automatically excluding weekends to find the end date.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "business days",
    "working days",
    "weekday calculator",
    "exclude weekends",
    "work days",
  ],
  variants: [
    {
      id: "calc",
      name: "Add Business Days",
      fields: [
        {
          name: "month",
          label: "Start Month (1-12)",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "day",
          label: "Start Day (1-31)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "year",
          label: "Start Year",
          type: "number",
          placeholder: "e.g. 2025",
        },
        {
          name: "businessDays",
          label: "Business Days to Add",
          type: "number",
          placeholder: "e.g. 15",
        },
      ],
      calculate: (inputs) => {
        const month = inputs.month as number;
        const day = inputs.day as number;
        const year = inputs.year as number;
        const businessDays = inputs.businessDays as number;

        if (!month || !day || !year || !businessDays) return null;

        const startDate = new Date(year, month - 1, day);
        const endDate = new Date(startDate);
        let added = 0;
        let totalCalendarDays = 0;
        let weekendDays = 0;

        while (added < businessDays) {
          endDate.setDate(endDate.getDate() + 1);
          totalCalendarDays++;
          const dayOfWeek = endDate.getDay();
          if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            added++;
          } else {
            weekendDays++;
          }
        }

        const endMonth = endDate.getMonth() + 1;
        const endDay = endDate.getDate();
        const endYear = endDate.getFullYear();

        return {
          primary: {
            label: "End Date",
            value: `${endMonth}/${endDay}/${endYear}`,
          },
          details: [
            {
              label: "Start Date",
              value: `${month}/${day}/${year}`,
            },
            {
              label: "Business Days Added",
              value: formatNumber(businessDays, 0),
            },
            {
              label: "Total Calendar Days",
              value: formatNumber(totalCalendarDays, 0),
            },
            {
              label: "Weekend Days Skipped",
              value: formatNumber(weekendDays, 0),
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["days-between-dates-calculator"],
  faq: [
    {
      question: "What counts as a business day?",
      answer:
        "A business day is any day from Monday through Friday. Saturdays and Sundays are excluded. This calculator does not account for public holidays.",
    },
    {
      question: "Does this calculator include holidays?",
      answer:
        "No, this calculator only excludes weekends (Saturday and Sunday). Public holidays vary by country and are not excluded.",
    },
  ],
  formula:
    "Starting from the given date, add one calendar day at a time. If the day is Monday-Friday, count it as a business day. Continue until the desired number of business days has been added.",
};
