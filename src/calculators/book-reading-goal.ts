import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bookReadingGoalCalculator: CalculatorDefinition = {
  slug: "book-reading-goal-calculator",
  title: "Book Reading Goal Calculator",
  description:
    "Free book reading goal calculator. Find out how many pages or minutes per day you need to read to hit your yearly book goal.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "book reading goal",
    "reading challenge",
    "books per year",
    "pages per day",
    "reading pace",
    "reading habit",
  ],
  variants: [
    {
      id: "reading-goal",
      name: "Reading Goal",
      description: "Calculate daily reading needed to meet your annual book goal",
      fields: [
        {
          name: "booksGoal",
          label: "Books Goal (per year)",
          type: "number",
          placeholder: "e.g. 24",
          min: 1,
          max: 365,
        },
        {
          name: "avgPages",
          label: "Average Pages per Book",
          type: "number",
          placeholder: "e.g. 300",
          min: 10,
          max: 2000,
        },
        {
          name: "readingSpeed",
          label: "Reading Speed (pages/hour)",
          type: "number",
          placeholder: "e.g. 30",
          min: 1,
          max: 200,
        },
        {
          name: "booksRead",
          label: "Books Already Read This Year",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
          max: 365,
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const booksGoal = inputs.booksGoal as number;
        const avgPages = inputs.avgPages as number;
        const readingSpeed = inputs.readingSpeed as number;
        const booksRead = (inputs.booksRead as number) || 0;

        if (!booksGoal || !avgPages || !readingSpeed) return null;

        const booksRemaining = Math.max(0, booksGoal - booksRead);
        const totalPagesRemaining = booksRemaining * avgPages;

        const now = new Date();
        const endOfYear = new Date(now.getFullYear(), 11, 31);
        const daysLeft = Math.max(
          1,
          Math.ceil(
            (endOfYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          )
        );

        const pagesPerDay = totalPagesRemaining / daysLeft;
        const minutesPerDay = (pagesPerDay / readingSpeed) * 60;
        const hoursPerWeek = (minutesPerDay * 7) / 60;
        const totalHours = totalPagesRemaining / readingSpeed;
        const daysPerBook = avgPages / readingSpeed / (minutesPerDay / 60 || 1);

        return {
          primary: {
            label: "Pages Per Day",
            value: formatNumber(pagesPerDay, 1),
            suffix: "pages/day",
          },
          details: [
            { label: "Books remaining", value: formatNumber(booksRemaining) },
            { label: "Days left in year", value: formatNumber(daysLeft) },
            { label: "Minutes per day", value: `${formatNumber(minutesPerDay, 1)} min` },
            { label: "Hours per week", value: formatNumber(hoursPerWeek, 1) },
            { label: "Total pages remaining", value: formatNumber(totalPagesRemaining) },
            { label: "Total reading hours remaining", value: formatNumber(totalHours, 1) },
            { label: "Days per book (at this pace)", value: formatNumber(daysPerBook, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "reading-time-calculator",
    "reading-level-calculator",
    "study-time-calculator",
  ],
  faq: [
    {
      question: "How many books does the average person read per year?",
      answer:
        "The average American reads about 12 books per year. Avid readers often set goals of 24-52 books per year.",
    },
    {
      question: "What is a good reading speed?",
      answer:
        "The average adult reads about 30 pages per hour (roughly 250 words per minute). Speed readers can manage 50-80 pages per hour.",
    },
  ],
  formula:
    "Pages/Day = (Books Remaining x Avg Pages) / Days Left in Year. Minutes/Day = (Pages/Day / Reading Speed) x 60.",
};
