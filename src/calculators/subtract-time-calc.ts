import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const subtractTimeCalc: CalculatorDefinition = {
  slug: "subtract-time-calculator",
  title: "Subtract Time Calculator",
  description:
    "Free online subtract time calculator. Subtract hours, minutes, and seconds from a starting time to find the resulting time.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "subtract time calculator",
    "time subtraction",
    "subtract hours minutes",
    "time difference",
    "remove time",
  ],
  variants: [
    {
      id: "subtract-time",
      name: "Subtract Time",
      description: "Subtract hours, minutes, and seconds from a starting time",
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
          name: "subHours",
          label: "Subtract Hours",
          type: "number",
          placeholder: "e.g. 3",
          min: 0,
        },
        {
          name: "subMinutes",
          label: "Subtract Minutes",
          type: "number",
          placeholder: "e.g. 45",
          min: 0,
        },
        {
          name: "subSeconds",
          label: "Subtract Seconds",
          type: "number",
          placeholder: "e.g. 30",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const sH = parseFloat(inputs.startHours as string) || 0;
        const sM = parseFloat(inputs.startMinutes as string) || 0;
        const sS = parseFloat(inputs.startSeconds as string) || 0;
        const subH = parseFloat(inputs.subHours as string) || 0;
        const subM = parseFloat(inputs.subMinutes as string) || 0;
        const subS = parseFloat(inputs.subSeconds as string) || 0;

        const totalStartSeconds = sH * 3600 + sM * 60 + sS;
        const totalSubSeconds = subH * 3600 + subM * 60 + subS;
        let totalSeconds = totalStartSeconds - totalSubSeconds;

        const daysBack = totalSeconds < 0 ? Math.ceil(Math.abs(totalSeconds) / 86400) : 0;
        totalSeconds = ((totalSeconds % 86400) + 86400) % 86400;

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        const pad = (n: number) => n.toString().padStart(2, "0");
        const resultTime = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

        return {
          primary: {
            label: "Resulting Time",
            value: resultTime,
          },
          details: [
            {
              label: "Days rolled back",
              value: formatNumber(daysBack),
            },
            {
              label: "Total seconds subtracted",
              value: formatNumber(totalSubSeconds),
            },
            {
              label: "Result in total seconds",
              value: formatNumber(totalSeconds),
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["add-time-calculator", "time-to-decimal-converter"],
  faq: [
    {
      question: "How do I subtract time from a clock time?",
      answer:
        "Enter the starting time in hours, minutes, and seconds (24-hour format), then enter the time to subtract. The calculator will show the resulting time and any days rolled back.",
    },
    {
      question: "What if the result goes before midnight?",
      answer:
        "The calculator handles negative times by rolling back to the previous day. For example, subtracting 5 hours from 03:00 gives 22:00 with 1 day rolled back.",
    },
  ],
  formula: "Result Time = Start Time - Subtracted Time",
};
