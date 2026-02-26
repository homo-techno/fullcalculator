import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const readingSpeedCalculator: CalculatorDefinition = {
  slug: "reading-speed-calc",
  title: "Reading Speed WPM Calculator",
  description:
    "Free reading speed calculator. Estimate reading time by word count and WPM. Calculate pages per hour and compare reading speeds for different content types.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "reading speed calculator",
    "WPM calculator",
    "words per minute",
    "reading time calculator",
    "book reading time",
    "article reading time",
    "speed reading",
  ],
  variants: [
    {
      id: "reading-time",
      name: "Reading Time Estimator",
      description: "Estimate time to read based on word count",
      fields: [
        {
          name: "wordCount",
          label: "Word Count",
          type: "number",
          placeholder: "e.g. 5000",
        },
        {
          name: "readingSpeed",
          label: "Reading Speed (WPM)",
          type: "select",
          options: [
            { label: "Slow Reader (150 WPM)", value: "150" },
            { label: "Average Reader (250 WPM)", value: "250" },
            { label: "Fast Reader (350 WPM)", value: "350" },
            { label: "Speed Reader (500 WPM)", value: "500" },
            { label: "Very Fast (700 WPM)", value: "700" },
          ],
          defaultValue: "250",
        },
      ],
      calculate: (inputs) => {
        const wordCount = parseFloat(inputs.wordCount as string);
        const wpm = parseFloat(inputs.readingSpeed as string);
        if (isNaN(wordCount) || isNaN(wpm) || wordCount <= 0 || wpm <= 0) return null;

        const totalMinutes = wordCount / wpm;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.floor(totalMinutes % 60);
        const seconds = Math.round((totalMinutes % 1) * 60);

        let timeStr = "";
        if (hours > 0) timeStr += hours + "h ";
        if (minutes > 0) timeStr += minutes + "m ";
        if (hours === 0) timeStr += seconds + "s";

        const pages = wordCount / 250; // ~250 words per page
        const speakingTime = wordCount / 130; // ~130 WPM speaking

        return {
          primary: {
            label: "Reading Time",
            value: timeStr.trim(),
          },
          details: [
            { label: "Word Count", value: formatNumber(wordCount) },
            { label: "Reading Speed", value: formatNumber(wpm) + " WPM" },
            { label: "Estimated Pages", value: formatNumber(pages, 1) + " pages" },
            { label: "Speaking Time", value: formatNumber(speakingTime, 1) + " minutes" },
            { label: "Total Minutes", value: formatNumber(totalMinutes, 1) },
          ],
        };
      },
    },
    {
      id: "book-time",
      name: "Book Reading Time",
      description: "Estimate time to finish a book",
      fields: [
        {
          name: "pages",
          label: "Number of Pages",
          type: "number",
          placeholder: "e.g. 300",
        },
        {
          name: "readingSpeed",
          label: "Your Reading Speed",
          type: "select",
          options: [
            { label: "Slow (150 WPM)", value: "150" },
            { label: "Average (250 WPM)", value: "250" },
            { label: "Fast (350 WPM)", value: "350" },
            { label: "Speed Reader (500 WPM)", value: "500" },
          ],
          defaultValue: "250",
        },
        {
          name: "dailyMinutes",
          label: "Daily Reading Time (minutes)",
          type: "number",
          placeholder: "e.g. 30",
          defaultValue: 30,
        },
      ],
      calculate: (inputs) => {
        const pages = parseFloat(inputs.pages as string);
        const wpm = parseFloat(inputs.readingSpeed as string);
        const dailyMinutes = parseFloat(inputs.dailyMinutes as string);
        if (isNaN(pages) || isNaN(wpm) || isNaN(dailyMinutes)) return null;
        if (pages <= 0 || wpm <= 0 || dailyMinutes <= 0) return null;

        const wordsPerPage = 250;
        const totalWords = pages * wordsPerPage;
        const totalMinutes = totalWords / wpm;
        const totalHours = totalMinutes / 60;
        const daysToFinish = Math.ceil(totalMinutes / dailyMinutes);
        const pagesPerHour = (wpm * 60) / wordsPerPage;

        return {
          primary: {
            label: "Days to Finish",
            value: formatNumber(daysToFinish),
            suffix: "days",
          },
          details: [
            { label: "Total Reading Time", value: formatNumber(totalHours, 1) + " hours" },
            { label: "Pages per Hour", value: formatNumber(pagesPerHour, 1) },
            { label: "Estimated Word Count", value: formatNumber(totalWords) },
            { label: "Daily Reading", value: formatNumber(dailyMinutes) + " min/day" },
            { label: "Weeks to Finish", value: formatNumber(daysToFinish / 7, 1) },
          ],
        };
      },
    },
    {
      id: "wpm-calc",
      name: "Calculate Your WPM",
      description: "Calculate your reading speed from words and time",
      fields: [
        {
          name: "wordsRead",
          label: "Words Read",
          type: "number",
          placeholder: "e.g. 500",
        },
        {
          name: "timeSeconds",
          label: "Time Taken (seconds)",
          type: "number",
          placeholder: "e.g. 120",
        },
      ],
      calculate: (inputs) => {
        const wordsRead = parseFloat(inputs.wordsRead as string);
        const timeSeconds = parseFloat(inputs.timeSeconds as string);
        if (isNaN(wordsRead) || isNaN(timeSeconds) || wordsRead <= 0 || timeSeconds <= 0) return null;

        const wpm = (wordsRead / timeSeconds) * 60;

        let level = "Below average";
        if (wpm >= 700) level = "Exceptional speed reader";
        else if (wpm >= 500) level = "Speed reader";
        else if (wpm >= 350) level = "Fast reader";
        else if (wpm >= 250) level = "Average adult reader";
        else if (wpm >= 200) level = "Slightly below average";

        const pagesPerHour = (wpm * 60) / 250;

        return {
          primary: {
            label: "Your Reading Speed",
            value: formatNumber(wpm, 0),
            suffix: "WPM",
          },
          details: [
            { label: "Level", value: level },
            { label: "Pages per Hour", value: formatNumber(pagesPerHour, 1) },
            { label: "Words Read", value: formatNumber(wordsRead) },
            { label: "Time", value: formatNumber(timeSeconds) + " seconds" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["typing-speed-test-calc", "data-transfer-calc", "time-card-calculator"],
  faq: [
    {
      question: "What is the average reading speed?",
      answer:
        "The average adult reads at about 200-250 words per minute (WPM). College students average about 300 WPM. Speed readers can reach 500-700 WPM. The average is higher for fiction (250 WPM) than technical material (150-200 WPM).",
    },
    {
      question: "How can I improve my reading speed?",
      answer:
        "Practice reducing subvocalization (inner speech), use a pointer/finger to guide your eyes, read in chunks rather than word-by-word, minimize regression (re-reading), and practice regularly. Most people can improve to 400-500 WPM with practice.",
    },
    {
      question: "How many words are on a typical page?",
      answer:
        "A standard book page has about 250-300 words. Academic texts average 300-350. Paperback novels average 200-250. Web articles vary widely. A standard double-spaced typed page has about 250 words.",
    },
  ],
  formula:
    "Reading Time = Word Count / WPM | WPM = Words Read / (Seconds / 60) | Pages/Hour = WPM x 60 / 250",
};
