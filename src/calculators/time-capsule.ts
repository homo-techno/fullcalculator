import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const timeCapsuleCalculator: CalculatorDefinition = {
  slug: "time-capsule-calculator",
  title: "Time Capsule Date Calculator",
  description:
    "Free time capsule date calculator. Plan when to open your time capsule, see how many days remain, and discover what the world might look like when you open it.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "time capsule",
    "time capsule date",
    "capsule opening",
    "future date",
    "time capsule planner",
    "capsule countdown",
  ],
  variants: [
    {
      id: "capsule-plan",
      name: "Time Capsule Planner",
      description: "Plan your time capsule seal and opening dates",
      fields: [
        {
          name: "sealYear",
          label: "Year Sealed",
          type: "number",
          placeholder: "e.g. 2026",
          min: 1900,
          max: 2100,
        },
        {
          name: "sealMonth",
          label: "Month Sealed",
          type: "number",
          placeholder: "1-12",
          min: 1,
          max: 12,
        },
        {
          name: "sealDay",
          label: "Day Sealed",
          type: "number",
          placeholder: "1-31",
          min: 1,
          max: 31,
        },
        {
          name: "waitYears",
          label: "Years to Wait Before Opening",
          type: "select",
          options: [
            { label: "1 year", value: "1" },
            { label: "5 years", value: "5" },
            { label: "10 years", value: "10" },
            { label: "15 years", value: "15" },
            { label: "20 years", value: "20" },
            { label: "25 years", value: "25" },
            { label: "50 years", value: "50" },
          ],
        },
      ],
      calculate: (inputs) => {
        const sealYear = inputs.sealYear as number;
        const sealMonth = inputs.sealMonth as number;
        const sealDay = inputs.sealDay as number;
        const waitStr = (inputs.waitYears as string) || "10";

        if (!sealYear || !sealMonth || !sealDay) return null;

        const waitYears = parseInt(waitStr);
        const sealDate = new Date(sealYear, sealMonth - 1, sealDay);
        const openYear = sealYear + waitYears;
        const openDate = new Date(openYear, sealMonth - 1, sealDay);

        const now = new Date();
        const diffMs = openDate.getTime() - now.getTime();
        const daysUntilOpen = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        const totalDaysSealed = Math.ceil(
          (openDate.getTime() - sealDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        const dayNames = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December",
        ];

        const openDayName = dayNames[openDate.getDay()];
        const openMonthName = monthNames[openDate.getMonth()];

        // How old will you be (rough)
        const progressMs = now.getTime() - sealDate.getTime();
        const progressDays = progressMs / (1000 * 60 * 60 * 24);
        const percentComplete =
          totalDaysSealed > 0
            ? Math.min(100, Math.max(0, (progressDays / totalDaysSealed) * 100))
            : 0;

        const isOpen = daysUntilOpen <= 0;

        return {
          primary: {
            label: "Opening Date",
            value: isOpen
              ? "Time to open!"
              : `${openMonthName} ${sealDay}, ${openYear}`,
          },
          details: [
            {
              label: "Sealed date",
              value: `${monthNames[sealMonth - 1]} ${sealDay}, ${sealYear}`,
            },
            {
              label: "Opening date",
              value: `${openDayName}, ${openMonthName} ${sealDay}, ${openYear}`,
            },
            {
              label: "Wait period",
              value: `${waitYears} years (${formatNumber(totalDaysSealed)} days)`,
            },
            {
              label: "Days remaining",
              value: isOpen ? "0 - ready to open!" : formatNumber(daysUntilOpen),
            },
            {
              label: "Progress",
              value: `${formatNumber(percentComplete, 1)}% complete`,
            },
            {
              label: "Weeks remaining",
              value: isOpen ? "0" : formatNumber(Math.ceil(daysUntilOpen / 7)),
            },
            {
              label: "Months remaining",
              value: isOpen
                ? "0"
                : formatNumber(Math.ceil(daysUntilOpen / 30.44)),
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "countdown-days-calculator",
    "how-many-days-until-calculator",
    "event-countdown-calculator",
  ],
  faq: [
    {
      question: "How long should a time capsule stay sealed?",
      answer:
        "Common durations are 5, 10, 25, or 50 years. Schools often choose 10-25 years. The longest planned capsules, like the Crypt of Civilization, are sealed for thousands of years.",
    },
    {
      question: "What should I put in a time capsule?",
      answer:
        "Include items that capture the current moment: newspapers, photos, letters to your future self, popular gadgets, price lists, playlists, and personal mementos. Avoid perishables and batteries.",
    },
  ],
  formula:
    "Opening Date = Seal Date + Wait Years. Days Remaining = Opening Date - Today. Progress = (Days Elapsed / Total Days) x 100.",
};
