import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hoursCalculator: CalculatorDefinition = {
  slug: "hours-calculator",
  title: "Hours Calculator",
  description:
    "Free hours calculator. Calculate hours and minutes between two times, add or subtract hours from a time.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "hours calculator",
    "hours between times",
    "time difference",
    "how many hours",
    "hours and minutes calculator",
  ],
  variants: [
    {
      id: "between",
      name: "Hours Between Times",
      description: "Calculate hours and minutes between two times",
      fields: [
        { name: "startHour", label: "Start Hour (0-23)", type: "number", placeholder: "e.g. 8", min: 0, max: 23 },
        { name: "startMin", label: "Start Minutes", type: "number", placeholder: "e.g. 30", min: 0, max: 59, defaultValue: 0 },
        { name: "endHour", label: "End Hour (0-23)", type: "number", placeholder: "e.g. 17", min: 0, max: 23 },
        { name: "endMin", label: "End Minutes", type: "number", placeholder: "e.g. 45", min: 0, max: 59, defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const sh = inputs.startHour as number;
        const sm = (inputs.startMin as number) || 0;
        const eh = inputs.endHour as number;
        const em = (inputs.endMin as number) || 0;
        if (sh === undefined || eh === undefined) return null;

        let totalMin = (eh * 60 + em) - (sh * 60 + sm);
        let crossesMidnight = false;
        if (totalMin < 0) {
          totalMin += 24 * 60;
          crossesMidnight = true;
        }

        const hours = Math.floor(totalMin / 60);
        const minutes = totalMin % 60;
        const decimalHours = totalMin / 60;

        return {
          primary: {
            label: "Time Difference",
            value: `${hours}h ${minutes}m`,
          },
          details: [
            { label: "Decimal hours", value: formatNumber(decimalHours, 2) },
            { label: "Total minutes", value: formatNumber(totalMin) },
            { label: "Total seconds", value: formatNumber(totalMin * 60) },
            { label: "Crosses midnight", value: crossesMidnight ? "Yes" : "No" },
          ],
        };
      },
    },
    {
      id: "add",
      name: "Add Hours to Time",
      description: "Add hours and minutes to a starting time",
      fields: [
        { name: "startHour", label: "Start Hour (0-23)", type: "number", placeholder: "e.g. 9", min: 0, max: 23 },
        { name: "startMin", label: "Start Minutes", type: "number", placeholder: "e.g. 0", min: 0, max: 59, defaultValue: 0 },
        { name: "addHours", label: "Hours to Add", type: "number", placeholder: "e.g. 8", min: 0 },
        { name: "addMin", label: "Minutes to Add", type: "number", placeholder: "e.g. 30", min: 0, defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const sh = inputs.startHour as number;
        const sm = (inputs.startMin as number) || 0;
        const ah = (inputs.addHours as number) || 0;
        const am = (inputs.addMin as number) || 0;
        if (sh === undefined) return null;

        let totalMin = sh * 60 + sm + ah * 60 + am;
        const daysAdded = Math.floor(totalMin / (24 * 60));
        totalMin = totalMin % (24 * 60);
        const resultH = Math.floor(totalMin / 60);
        const resultM = totalMin % 60;

        const daySuffix = daysAdded > 0 ? ` (+${daysAdded} day${daysAdded > 1 ? "s" : ""})` : "";

        return {
          primary: {
            label: "Result Time",
            value: `${resultH.toString().padStart(2, "0")}:${resultM.toString().padStart(2, "0")}${daySuffix}`,
          },
          details: [
            { label: "Start time", value: `${sh.toString().padStart(2, "0")}:${sm.toString().padStart(2, "0")}` },
            { label: "Time added", value: `${ah}h ${am}m` },
            { label: "Days added", value: `${daysAdded}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "time-card-calculator",
    "work-hours-calculator",
    "time-duration-calculator",
  ],
  faq: [
    {
      question: "How do I calculate hours between two times?",
      answer:
        "Subtract the start time from the end time. Convert both to minutes first (hours × 60 + minutes), find the difference, then convert back. If the result is negative, add 1440 (24 hours in minutes) to account for crossing midnight.",
    },
    {
      question: "What are decimal hours?",
      answer:
        "Decimal hours express time as a decimal number. For example, 2 hours and 30 minutes = 2.50 decimal hours. This is useful for payroll and billing calculations.",
    },
  ],
  formula: "Hours = (End Time - Start Time) in minutes / 60",
};
