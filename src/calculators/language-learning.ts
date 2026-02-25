import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const languageOptions = [
  { label: "Spanish (600 hours)", value: "600" },
  { label: "French (600 hours)", value: "600" },
  { label: "Portuguese (600 hours)", value: "600" },
  { label: "German (750 hours)", value: "750" },
  { label: "Italian (600 hours)", value: "600" },
  { label: "Russian (1100 hours)", value: "1100" },
  { label: "Hindi (1100 hours)", value: "1100" },
  { label: "Chinese (Mandarin) (2200 hours)", value: "2200" },
  { label: "Japanese (2200 hours)", value: "2200" },
  { label: "Korean (2200 hours)", value: "2200" },
  { label: "Arabic (2200 hours)", value: "2200" },
];

const difficultyOptions = [
  { label: "Category I - Easy (e.g. Spanish)", value: "1" },
  { label: "Category II - Medium (e.g. German)", value: "2" },
  { label: "Category III - Hard (e.g. Russian)", value: "3" },
  { label: "Category IV - Hardest (e.g. Japanese)", value: "4" },
];

export const languageLearningCalculator: CalculatorDefinition = {
  slug: "language-learning-calculator",
  title: "Language Learning Time Calculator",
  description:
    "Free language learning time calculator. Estimate how long it takes to learn a new language based on FSI data, your daily study time, and the language difficulty.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "language learning",
    "learn a language",
    "language study time",
    "FSI language",
    "how long to learn",
    "language difficulty",
  ],
  variants: [
    {
      id: "learning-time",
      name: "Learning Time Estimate",
      description: "Estimate total time to learn a language to proficiency",
      fields: [
        {
          name: "language",
          label: "Language",
          type: "select",
          options: languageOptions,
        },
        {
          name: "dailyMinutes",
          label: "Daily Study Time (minutes)",
          type: "number",
          placeholder: "e.g. 30",
          min: 5,
          max: 480,
        },
        {
          name: "daysPerWeek",
          label: "Study Days per Week",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 7,
          defaultValue: 5,
        },
        {
          name: "immersion",
          label: "Immersion Bonus",
          type: "select",
          options: [
            { label: "None (self-study only)", value: "1.0" },
            { label: "Some (media/apps)", value: "0.85" },
            { label: "Moderate (tutor + media)", value: "0.7" },
            { label: "Full (living in country)", value: "0.5" },
          ],
        },
      ],
      calculate: (inputs) => {
        const langHoursStr = (inputs.language as string) || "600";
        const dailyMinutes = inputs.dailyMinutes as number;
        const daysPerWeek = (inputs.daysPerWeek as number) || 5;
        const immersionStr = (inputs.immersion as string) || "1.0";

        if (!dailyMinutes) return null;

        const totalHoursBase = parseFloat(langHoursStr);
        const immersionFactor = parseFloat(immersionStr);
        const totalHours = totalHoursBase * immersionFactor;

        const dailyHours = dailyMinutes / 60;
        const weeklyHours = dailyHours * daysPerWeek;
        const weeksNeeded = totalHours / weeklyHours;
        const monthsNeeded = weeksNeeded / 4.345;
        const yearsNeeded = monthsNeeded / 12;
        const totalSessions = Math.ceil(weeksNeeded * daysPerWeek);

        return {
          primary: {
            label: "Estimated Time",
            value: yearsNeeded >= 1
              ? `${formatNumber(yearsNeeded, 1)} years`
              : `${formatNumber(monthsNeeded, 1)} months`,
          },
          details: [
            { label: "Total study hours needed", value: formatNumber(totalHours, 0) },
            { label: "FSI base hours", value: formatNumber(totalHoursBase, 0) },
            { label: "Immersion multiplier", value: `${immersionFactor}x` },
            { label: "Daily study", value: `${formatNumber(dailyMinutes)} min` },
            { label: "Weekly study", value: `${formatNumber(weeklyHours, 1)} hours` },
            { label: "Weeks needed", value: formatNumber(weeksNeeded, 1) },
            { label: "Months needed", value: formatNumber(monthsNeeded, 1) },
            { label: "Total sessions", value: formatNumber(totalSessions) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "study-time-calculator",
    "music-practice-calculator",
    "reading-time-calculator",
  ],
  faq: [
    {
      question: "How long does it take to learn a language?",
      answer:
        "According to the US Foreign Service Institute (FSI), Category I languages (Spanish, French) take ~600 hours. Category IV languages (Japanese, Chinese, Arabic) take ~2,200 hours to reach professional proficiency.",
    },
    {
      question: "Can immersion speed up language learning?",
      answer:
        "Yes, full immersion (living in the country) can roughly halve the time needed. Even partial immersion through media, tutors, or language exchange partners significantly accelerates learning.",
    },
  ],
  formula:
    "Total Hours = FSI Base Hours x Immersion Factor. Weeks = Total Hours / (Daily Minutes / 60 x Days per Week).",
};
