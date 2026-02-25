import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const skillLevelOptions = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
  { label: "Professional", value: "professional" },
];

const targetLevelOptions = [
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
  { label: "Professional", value: "professional" },
  { label: "Master (10,000 hours)", value: "master" },
];

const hoursRequired: Record<string, number> = {
  beginner: 0,
  intermediate: 1000,
  advanced: 3000,
  professional: 6000,
  master: 10000,
};

export const musicPracticeCalculator: CalculatorDefinition = {
  slug: "music-practice-calculator",
  title: "Music Practice Time Calculator",
  description:
    "Free music practice time calculator. Estimate how long it will take to reach your musical goals based on your current skill level and daily practice time.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "music practice",
    "practice time",
    "10000 hours",
    "instrument practice",
    "music goals",
    "practice schedule",
  ],
  variants: [
    {
      id: "practice-time",
      name: "Practice Time to Goal",
      description:
        "Calculate how long it takes to reach your target skill level",
      fields: [
        {
          name: "currentLevel",
          label: "Current Level",
          type: "select",
          options: skillLevelOptions,
        },
        {
          name: "targetLevel",
          label: "Target Level",
          type: "select",
          options: targetLevelOptions,
        },
        {
          name: "dailyMinutes",
          label: "Daily Practice (minutes)",
          type: "number",
          placeholder: "e.g. 60",
          min: 5,
          max: 480,
        },
        {
          name: "daysPerWeek",
          label: "Days per Week",
          type: "number",
          placeholder: "e.g. 6",
          min: 1,
          max: 7,
          defaultValue: 6,
        },
      ],
      calculate: (inputs) => {
        const currentLevel = (inputs.currentLevel as string) || "beginner";
        const targetLevel = (inputs.targetLevel as string) || "advanced";
        const dailyMinutes = inputs.dailyMinutes as number;
        const daysPerWeek = (inputs.daysPerWeek as number) || 6;

        if (!dailyMinutes) return null;

        const currentHours = hoursRequired[currentLevel] || 0;
        const targetHours = hoursRequired[targetLevel] || 0;

        if (targetHours <= currentHours) {
          return {
            primary: { label: "Result", value: "Target must be higher than current level" },
            details: [],
          };
        }

        const hoursNeeded = targetHours - currentHours;
        const dailyHours = dailyMinutes / 60;
        const weeklyHours = dailyHours * daysPerWeek;
        const weeksNeeded = hoursNeeded / weeklyHours;
        const monthsNeeded = weeksNeeded / 4.345;
        const yearsNeeded = monthsNeeded / 12;

        return {
          primary: {
            label: "Time to Reach Goal",
            value: yearsNeeded >= 1
              ? `${formatNumber(yearsNeeded, 1)} years`
              : `${formatNumber(monthsNeeded, 1)} months`,
          },
          details: [
            { label: "Hours needed", value: formatNumber(hoursNeeded) },
            { label: "Daily practice", value: `${formatNumber(dailyMinutes)} min` },
            { label: "Weekly practice", value: `${formatNumber(weeklyHours, 1)} hours` },
            { label: "Weeks needed", value: formatNumber(weeksNeeded, 1) },
            { label: "Months needed", value: formatNumber(monthsNeeded, 1) },
            { label: "Years needed", value: formatNumber(yearsNeeded, 1) },
            { label: "Total sessions", value: formatNumber(weeksNeeded * daysPerWeek, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "bpm-calculator",
    "metronome-calculator",
    "study-time-calculator",
  ],
  faq: [
    {
      question: "Is the 10,000-hour rule real?",
      answer:
        "The 10,000-hour rule, popularized by Malcolm Gladwell, suggests that roughly 10,000 hours of deliberate practice are needed to achieve mastery. While debated by researchers, significant practice (thousands of hours) is undeniably needed for expertise.",
    },
    {
      question: "How much should I practice music each day?",
      answer:
        "Beginners benefit from 30-60 minutes daily. Intermediate players often practice 1-2 hours. Advanced and professional musicians may practice 3-6 hours per day, broken into focused sessions.",
    },
  ],
  formula:
    "Hours Needed = Target Level Hours - Current Level Hours. Weeks = Hours Needed / (Daily Minutes / 60 x Days/Week).",
};
