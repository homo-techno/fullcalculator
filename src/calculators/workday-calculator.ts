import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const workdayCalculator: CalculatorDefinition = {
  slug: "workday-calculator",
  title: "Working Days Calculator",
  description:
    "Free working days calculator. Calculate the number of business days between two dates, excluding weekends and holidays.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "working days calculator",
    "business days calculator",
    "workdays between dates",
    "exclude weekends",
    "weekday calculator",
  ],
  variants: [
    {
      id: "workdays-between",
      name: "Working Days Between Dates",
      description: "Count business days (Mon-Fri) between two dates",
      fields: [
        { name: "startYear", label: "Start Year", type: "number", placeholder: "e.g. 2024", min: 1900, max: 2100 },
        { name: "startMonth", label: "Start Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "startDay", label: "Start Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
        { name: "endYear", label: "End Year", type: "number", placeholder: "e.g. 2026", min: 1900, max: 2100 },
        { name: "endMonth", label: "End Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "endDay", label: "End Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
        { name: "holidays", label: "Holidays to Exclude", type: "number", placeholder: "e.g. 10", min: 0, defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const sy = inputs.startYear as number;
        const sm = inputs.startMonth as number;
        const sd = inputs.startDay as number;
        const ey = inputs.endYear as number;
        const em = inputs.endMonth as number;
        const ed = inputs.endDay as number;
        const holidays = (inputs.holidays as number) || 0;
        if (!sy || !sm || !sd || !ey || !em || !ed) return null;

        const start = new Date(sy, sm - 1, sd);
        const end = new Date(ey, em - 1, ed);
        if (start > end) return null;

        let workdays = 0;
        let weekendDays = 0;
        const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const current = new Date(start);

        for (let i = 0; i <= totalDays; i++) {
          const dayOfWeek = current.getDay();
          if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            workdays++;
          } else {
            weekendDays++;
          }
          current.setDate(current.getDate() + 1);
        }

        const netWorkdays = Math.max(0, workdays - holidays);

        return {
          primary: {
            label: "Working Days",
            value: formatNumber(netWorkdays),
            suffix: "days",
          },
          details: [
            { label: "Calendar days", value: formatNumber(totalDays + 1) },
            { label: "Weekdays (before holidays)", value: formatNumber(workdays) },
            { label: "Weekend days", value: formatNumber(weekendDays) },
            { label: "Holidays excluded", value: formatNumber(holidays) },
            { label: "Work weeks", value: formatNumber(netWorkdays / 5, 1) },
          ],
        };
      },
    },
    {
      id: "add-workdays",
      name: "Add Working Days to Date",
      description: "Find a future date by adding business days",
      fields: [
        { name: "startYear", label: "Start Year", type: "number", placeholder: "e.g. 2026", min: 1900, max: 2100 },
        { name: "startMonth", label: "Start Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "startDay", label: "Start Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
        { name: "workdays", label: "Working Days to Add", type: "number", placeholder: "e.g. 20", min: 1 },
      ],
      calculate: (inputs) => {
        const sy = inputs.startYear as number;
        const sm = inputs.startMonth as number;
        const sd = inputs.startDay as number;
        const addDays = inputs.workdays as number;
        if (!sy || !sm || !sd || !addDays) return null;

        const current = new Date(sy, sm - 1, sd);
        let added = 0;

        while (added < addDays) {
          current.setDate(current.getDate() + 1);
          const dayOfWeek = current.getDay();
          if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            added++;
          }
        }

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const resultStr = `${dayNames[current.getDay()]}, ${monthNames[current.getMonth()]} ${current.getDate()}, ${current.getFullYear()}`;

        const totalCalendar = Math.floor((current.getTime() - new Date(sy, sm - 1, sd).getTime()) / (1000 * 60 * 60 * 24));

        return {
          primary: { label: "Target Date", value: resultStr },
          details: [
            { label: "Working days added", value: formatNumber(addDays) },
            { label: "Calendar days", value: formatNumber(totalCalendar) },
            { label: "Weeks spanned", value: formatNumber(Math.ceil(totalCalendar / 7)) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "business-days-calculator",
    "days-between-dates-calculator",
    "date-calculator",
  ],
  faq: [
    {
      question: "What counts as a working day?",
      answer:
        "A working day (business day) is Monday through Friday. Weekends (Saturday and Sunday) are excluded. You can also specify the number of holidays to exclude.",
    },
    {
      question: "How do I account for holidays?",
      answer:
        "Enter the number of holidays that fall on weekdays during your date range. The calculator will subtract them from the total working days.",
    },
  ],
  formula: "Working Days = Weekdays in Range - Holidays",
};
