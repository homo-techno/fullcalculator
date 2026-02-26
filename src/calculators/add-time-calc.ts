import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const addTimeCalc: CalculatorDefinition = {
  slug: "add-time-calculator",
  title: "Add Time Calculator",
  description:
    "Free online add time calculator. Add hours, minutes, and seconds to a starting time to get the resulting time.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "add time calculator",
    "time addition",
    "add hours minutes",
    "time calculator",
    "add to time",
  ],
  variants: [
    {
      id: "add-time",
      name: "Add Time",
      description: "Add hours, minutes, and seconds to a starting time",
      fields: [
        {
          name: "startHours",
          label: "Start Hours (0-23)",
          type: "number",
          placeholder: "e.g. 14",
          min: 0,
          max: 23,
        },
        {
          name: "startMinutes",
          label: "Start Minutes (0-59)",
          type: "number",
          placeholder: "e.g. 30",
          min: 0,
          max: 59,
        },
        {
          name: "startSeconds",
          label: "Start Seconds (0-59)",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
          max: 59,
        },
        {
          name: "addHours",
          label: "Add Hours",
          type: "number",
          placeholder: "e.g. 3",
          min: 0,
        },
        {
          name: "addMinutes",
          label: "Add Minutes",
          type: "number",
          placeholder: "e.g. 45",
          min: 0,
        },
        {
          name: "addSeconds",
          label: "Add Seconds",
          type: "number",
          placeholder: "e.g. 30",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const sH = parseFloat(inputs.startHours as string) || 0;
        const sM = parseFloat(inputs.startMinutes as string) || 0;
        const sS = parseFloat(inputs.startSeconds as string) || 0;
        const aH = parseFloat(inputs.addHours as string) || 0;
        const aM = parseFloat(inputs.addMinutes as string) || 0;
        const aS = parseFloat(inputs.addSeconds as string) || 0;

        const totalStartSeconds = sH * 3600 + sM * 60 + sS;
        const totalAddSeconds = aH * 3600 + aM * 60 + aS;
        const totalSeconds = totalStartSeconds + totalAddSeconds;

        const days = Math.floor(totalSeconds / 86400);
        const remaining = totalSeconds % 86400;
        const hours = Math.floor(remaining / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const seconds = Math.floor(remaining % 60);

        const pad = (n: number) => n.toString().padStart(2, "0");
        const resultTime = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

        return {
          primary: {
            label: "Resulting Time",
            value: resultTime,
          },
          details: [
            {
              label: "Days rolled over",
              value: formatNumber(days),
            },
            {
              label: "Total seconds added",
              value: formatNumber(totalAddSeconds),
            },
            {
              label: "Total result in seconds",
              value: formatNumber(totalSeconds),
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["subtract-time-calculator", "time-to-decimal-converter"],
  faq: [
    {
      question: "How do I add time to a clock time?",
      answer:
        "Enter your starting time in hours, minutes, and seconds (24-hour format), then enter the amount of time to add. The calculator returns the resulting time and any day rollovers.",
    },
    {
      question: "What if the result goes past midnight?",
      answer:
        "The calculator shows how many days have rolled over. For example, adding 10 hours to 20:00 gives 06:00 with 1 day rolled over.",
    },
  ],
  formula: "Result Time = Start Time + Added Time",
};
