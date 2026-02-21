import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const studyTimeCalculator: CalculatorDefinition = {
  slug: "study-time-calculator",
  title: "Study Time Calculator",
  description:
    "Free study time calculator. Plan your study schedule using the Pomodoro method based on subjects, exam date, and material.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "study time",
    "study planner",
    "Pomodoro",
    "exam prep",
    "study schedule",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "subjects",
          label: "Number of Subjects",
          type: "number",
          placeholder: "e.g. 4",
        },
        {
          name: "daysUntilExam",
          label: "Days Until Exam",
          type: "number",
          placeholder: "e.g. 14",
        },
        {
          name: "chaptersPerSubject",
          label: "Chapters/Units Per Subject",
          type: "number",
          placeholder: "e.g. 8",
        },
      ],
      calculate: (inputs) => {
        const subjects = inputs.subjects as number;
        const days = inputs.daysUntilExam as number;
        const chapters = inputs.chaptersPerSubject as number;
        if (!subjects || !days || !chapters) return null;
        if (subjects <= 0 || days <= 0 || chapters <= 0) return null;

        // Estimate ~30 min per chapter (1 Pomodoro + break)
        const minutesPerChapter = 30;
        const pomodoroMinutes = 25;
        const breakMinutes = 5;
        const longBreakMinutes = 15;
        const pomodorosPerChapter = 1;

        const totalChapters = subjects * chapters;
        const totalPomodoros = totalChapters * pomodorosPerChapter;
        const totalStudyMinutes = totalPomodoros * pomodoroMinutes;
        const totalBreakMinutes =
          totalPomodoros * breakMinutes +
          Math.floor(totalPomodoros / 4) * (longBreakMinutes - breakMinutes);
        const totalMinutesWithBreaks = totalStudyMinutes + totalBreakMinutes;
        const totalHours = totalStudyMinutes / 60;

        const dailyStudyMinutes = totalStudyMinutes / days;
        const dailyStudyHours = dailyStudyMinutes / 60;
        const dailyPomodoros = Math.ceil(totalPomodoros / days);
        const chaptersPerDay = totalChapters / days;

        // Review time (add 20% for review)
        const reviewHours = totalHours * 0.2;
        const grandTotalHours = totalHours + reviewHours;
        const dailyWithReview = grandTotalHours / days;

        return {
          primary: {
            label: "Total Study Hours",
            value: formatNumber(grandTotalHours, 1) + " hours",
          },
          details: [
            {
              label: "Daily Study Time",
              value:
                formatNumber(dailyWithReview * 60, 0) +
                " min (" +
                formatNumber(dailyWithReview, 1) +
                " hrs)",
            },
            {
              label: "Daily Pomodoros",
              value: formatNumber(dailyPomodoros, 0) + " sessions",
            },
            {
              label: "Chapters Per Day",
              value: formatNumber(chaptersPerDay, 1),
            },
            {
              label: "Total Chapters",
              value: formatNumber(totalChapters, 0),
            },
            {
              label: "Total Pomodoro Sessions",
              value: formatNumber(totalPomodoros, 0),
            },
            {
              label: "Study Time (no review)",
              value: formatNumber(totalHours, 1) + " hours",
            },
            {
              label: "Review Time (20%)",
              value: formatNumber(reviewHours, 1) + " hours",
            },
            {
              label: "Pomodoro Format",
              value: pomodoroMinutes + " min focus + " + breakMinutes + " min break",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["reading-level-calculator", "sleep-debt-calculator"],
  faq: [
    {
      question: "What is the Pomodoro technique?",
      answer:
        "The Pomodoro technique involves studying in 25-minute focused blocks followed by 5-minute breaks. After every 4 Pomodoros, take a longer 15-minute break. This helps maintain concentration and prevent burnout.",
    },
    {
      question: "How many hours should I study per day?",
      answer:
        "Most research suggests 3-5 hours of focused study per day is optimal. Quality matters more than quantity. Using the Pomodoro technique helps ensure your study time is productive.",
    },
  ],
  formula:
    "Total Chapters = Subjects x Chapters per Subject. Study Time = Total Chapters x 25 min. Review = 20% extra. Daily Time = Total / Days until exam. Pomodoro: 25 min focus + 5 min break, long break every 4 sessions.",
};
