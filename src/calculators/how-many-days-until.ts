import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const eventOptions = [
  { label: "Christmas (Dec 25)", value: "christmas" },
  { label: "New Year (Jan 1)", value: "newyear" },
  { label: "Valentine's Day (Feb 14)", value: "valentines" },
  { label: "Halloween (Oct 31)", value: "halloween" },
  { label: "Independence Day (Jul 4)", value: "july4" },
  { label: "Thanksgiving (Nov 27)", value: "thanksgiving" },
  { label: "St. Patrick's Day (Mar 17)", value: "stpatricks" },
  { label: "Easter (Apr 20)", value: "easter" },
  { label: "Mother's Day (May 11)", value: "mothersday" },
  { label: "Father's Day (Jun 15)", value: "fathersday" },
];

const eventDates: Record<string, { month: number; day: number }> = {
  christmas: { month: 12, day: 25 },
  newyear: { month: 1, day: 1 },
  valentines: { month: 2, day: 14 },
  halloween: { month: 10, day: 31 },
  july4: { month: 7, day: 4 },
  thanksgiving: { month: 11, day: 27 },
  stpatricks: { month: 3, day: 17 },
  easter: { month: 4, day: 20 },
  mothersday: { month: 5, day: 11 },
  fathersday: { month: 6, day: 15 },
};

export const howManyDaysUntilCalculator: CalculatorDefinition = {
  slug: "how-many-days-until-calculator",
  title: "How Many Days Until Calculator",
  description:
    "Free how many days until calculator. Find out exactly how many days, weeks, and hours remain until popular holidays and events.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "how many days until",
    "days until christmas",
    "days until new year",
    "countdown",
    "holiday countdown",
    "event countdown",
  ],
  variants: [
    {
      id: "event-countdown",
      name: "Days Until Event",
      description: "See how many days remain until a popular holiday or event",
      fields: [
        {
          name: "event",
          label: "Event",
          type: "select",
          options: eventOptions,
        },
      ],
      calculate: (inputs) => {
        const eventKey = (inputs.event as string) || "christmas";
        const ev = eventDates[eventKey];
        if (!ev) return null;

        const now = new Date();
        let targetYear = now.getFullYear();
        let target = new Date(targetYear, ev.month - 1, ev.day);

        if (target.getTime() <= now.getTime()) {
          targetYear++;
          target = new Date(targetYear, ev.month - 1, ev.day);
        }

        const diffMs = target.getTime() - now.getTime();
        const totalDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(totalDays / 7);
        const remainingDays = totalDays % 7;
        const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const months = Math.floor(totalDays / 30.4375);

        const eventLabel =
          eventOptions.find((o) => o.value === eventKey)?.label ?? eventKey;

        const dayNames = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];

        return {
          primary: {
            label: `Days Until ${eventLabel.split(" (")[0]}`,
            value: formatNumber(totalDays),
            suffix: "days",
          },
          details: [
            {
              label: "Target date",
              value: `${dayNames[target.getDay()]}, ${ev.month}/${ev.day}/${targetYear}`,
            },
            {
              label: "Weeks and days",
              value: `${weeks} weeks, ${remainingDays} days`,
            },
            { label: "Approximate months", value: formatNumber(months) },
            { label: "Total hours", value: formatNumber(totalHours) },
            { label: "Total minutes", value: formatNumber(totalMinutes) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "countdown-days-calculator",
    "event-countdown-calculator",
    "days-between-dates-calculator",
  ],
  faq: [
    {
      question: "How many days until Christmas?",
      answer:
        "Select Christmas from the event list and the calculator will show the exact number of days, weeks, and hours remaining until December 25.",
    },
    {
      question: "Does the calculator adjust for the next occurrence?",
      answer:
        "Yes. If the selected holiday has already passed this year, the calculator automatically counts down to next year's date.",
    },
  ],
  formula: "Days Until = Event Date - Today's Date",
};
