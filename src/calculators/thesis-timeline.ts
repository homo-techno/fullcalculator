import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const thesisTimelineCalculator: CalculatorDefinition = {
  slug: "thesis-timeline-calculator",
  title: "Thesis Timeline Calculator",
  description:
    "Free thesis timeline calculator. Plan your thesis or dissertation writing schedule with milestones, deadlines, and daily word count goals.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "thesis timeline calculator",
    "dissertation planner",
    "thesis writing schedule",
    "thesis deadline calculator",
    "dissertation timeline",
  ],
  variants: [
    {
      id: "writing",
      name: "Writing Schedule",
      description: "Calculate daily and weekly writing goals to finish your thesis on time",
      fields: [
        { name: "totalWords", label: "Total Word Count Target", type: "number", placeholder: "e.g. 20000", min: 1000 },
        { name: "wordsWritten", label: "Words Already Written", type: "number", placeholder: "e.g. 5000", min: 0 },
        { name: "daysRemaining", label: "Days Until Deadline", type: "number", placeholder: "e.g. 90", min: 1 },
        { name: "writingDaysPerWeek", label: "Writing Days per Week", type: "number", placeholder: "e.g. 5", min: 1, max: 7, defaultValue: 5 },
      ],
      calculate: (inputs) => {
        const total = inputs.totalWords as number;
        const written = (inputs.wordsWritten as number) || 0;
        const days = inputs.daysRemaining as number;
        const daysPerWeek = (inputs.writingDaysPerWeek as number) || 5;
        if (!total || !days) return null;

        const remaining = Math.max(0, total - written);
        const weeks = days / 7;
        const writingDays = Math.floor(weeks * daysPerWeek);
        const wordsPerDay = remaining / writingDays;
        const wordsPerWeek = wordsPerDay * daysPerWeek;
        const percentDone = (written / total) * 100;

        // Estimate pages (250 words per page for academic writing)
        const pagesRemaining = remaining / 250;
        const pagesPerDay = wordsPerDay / 250;

        let pace: string;
        if (wordsPerDay <= 300) pace = "Comfortable pace";
        else if (wordsPerDay <= 500) pace = "Moderate pace";
        else if (wordsPerDay <= 1000) pace = "Intensive pace";
        else pace = "Very aggressive - consider extending deadline";

        return {
          primary: { label: "Words per Writing Day", value: formatNumber(wordsPerDay, 0) },
          details: [
            { label: "Pace assessment", value: pace },
            { label: "Words per week", value: formatNumber(wordsPerWeek, 0) },
            { label: "Pages remaining (~250 words/pg)", value: formatNumber(pagesRemaining, 0) },
            { label: "Progress so far", value: `${formatNumber(percentDone, 1)}%` },
            { label: "Writing days available", value: formatNumber(writingDays, 0) },
          ],
        };
      },
    },
    {
      id: "milestones",
      name: "Milestone Planner",
      description: "Break your thesis into phases with time estimates",
      fields: [
        { name: "totalMonths", label: "Total Months Available", type: "number", placeholder: "e.g. 12", min: 1, max: 48 },
        { name: "researchPercent", label: "Research Phase (%)", type: "number", placeholder: "e.g. 30", min: 0, max: 100, defaultValue: 30 },
        { name: "writingPercent", label: "Writing Phase (%)", type: "number", placeholder: "e.g. 40", min: 0, max: 100, defaultValue: 40 },
        { name: "revisionPercent", label: "Revision & Editing Phase (%)", type: "number", placeholder: "e.g. 20", min: 0, max: 100, defaultValue: 20 },
        { name: "defensePercent", label: "Defense Prep Phase (%)", type: "number", placeholder: "e.g. 10", min: 0, max: 100, defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const months = inputs.totalMonths as number;
        const research = (inputs.researchPercent as number) || 30;
        const writing = (inputs.writingPercent as number) || 40;
        const revision = (inputs.revisionPercent as number) || 20;
        const defense = (inputs.defensePercent as number) || 10;
        if (!months) return null;

        const totalPercent = research + writing + revision + defense;
        const researchMonths = (research / totalPercent) * months;
        const writingMonths = (writing / totalPercent) * months;
        const revisionMonths = (revision / totalPercent) * months;
        const defenseMonths = (defense / totalPercent) * months;

        return {
          primary: { label: "Timeline Duration", value: `${formatNumber(months, 0)} months` },
          details: [
            { label: "Research phase", value: `${formatNumber(researchMonths, 1)} months` },
            { label: "Writing phase", value: `${formatNumber(writingMonths, 1)} months` },
            { label: "Revision & editing", value: `${formatNumber(revisionMonths, 1)} months` },
            { label: "Defense preparation", value: `${formatNumber(defenseMonths, 1)} months` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["reading-time-calculator", "study-time-calculator"],
  faq: [
    {
      question: "How long does a thesis take to write?",
      answer:
        "A master's thesis typically takes 3-6 months of active writing (10,000-50,000 words). A doctoral dissertation can take 1-2 years of writing (50,000-100,000+ words). Planning ahead is critical.",
    },
    {
      question: "How many words should I write per day?",
      answer:
        "Academic writers commonly aim for 300-1,000 words per day. Consistent daily writing of 500 words produces a 60,000-word dissertation in about 6 months of 5-day weeks.",
    },
  ],
  formula: "Words per Day = (Total Words - Words Written) / Writing Days Available",
};
