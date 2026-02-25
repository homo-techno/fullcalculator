import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const noteTakingSpeedCalculator: CalculatorDefinition = {
  slug: "note-taking-speed-calculator",
  title: "Note Taking Speed Calculator",
  description:
    "Free note taking speed calculator. Measure your note-taking rate, estimate coverage of lecture material, and improve efficiency.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "note taking speed calculator",
    "words per minute writing",
    "lecture notes calculator",
    "typing speed for notes",
    "note taking efficiency",
  ],
  variants: [
    {
      id: "speed",
      name: "Note-Taking Speed",
      description: "Calculate your note-taking speed and how much lecture content you can capture",
      fields: [
        { name: "wordsWritten", label: "Words Written/Typed", type: "number", placeholder: "e.g. 500", min: 1 },
        { name: "timeMinutes", label: "Time Taken (minutes)", type: "number", placeholder: "e.g. 15", min: 1 },
        { name: "lectureWPM", label: "Lecture Speed (words/min)", type: "number", placeholder: "e.g. 150 (avg speaking rate)", min: 50, max: 250, defaultValue: 150 },
      ],
      calculate: (inputs) => {
        const words = inputs.wordsWritten as number;
        const time = inputs.timeMinutes as number;
        const lectureWPM = (inputs.lectureWPM as number) || 150;
        if (!words || !time) return null;

        const wpm = words / time;
        const coverage = (wpm / lectureWPM) * 100;
        const lectureWords = lectureWPM * time;

        let rating: string;
        if (wpm >= 40) rating = "Fast - great for detailed notes";
        else if (wpm >= 25) rating = "Average - captures key points";
        else if (wpm >= 15) rating = "Slow - consider abbreviations";
        else rating = "Very slow - try shorthand or recording";

        return {
          primary: { label: "Note-Taking Speed", value: `${formatNumber(wpm, 1)} WPM` },
          details: [
            { label: "Rating", value: rating },
            { label: "Lecture content captured", value: `${formatNumber(coverage, 0)}%` },
            { label: "Lecture words spoken", value: formatNumber(lectureWords, 0) },
            { label: "Words you captured", value: formatNumber(words, 0) },
          ],
        };
      },
    },
    {
      id: "lecture-prep",
      name: "Lecture Notes Estimate",
      description: "Estimate how many pages of notes a lecture will produce",
      fields: [
        { name: "lectureDuration", label: "Lecture Duration (minutes)", type: "number", placeholder: "e.g. 50", min: 1 },
        { name: "noteTakingWPM", label: "Your Note-Taking Speed (WPM)", type: "number", placeholder: "e.g. 25", min: 5, max: 80 },
        { name: "wordsPerPage", label: "Words per Page", type: "number", placeholder: "e.g. 250 (handwritten)", min: 50, max: 500, defaultValue: 250 },
      ],
      calculate: (inputs) => {
        const duration = inputs.lectureDuration as number;
        const wpm = inputs.noteTakingWPM as number;
        const wordsPerPage = (inputs.wordsPerPage as number) || 250;
        if (!duration || !wpm) return null;

        const totalWords = wpm * duration;
        const pages = totalWords / wordsPerPage;
        const wordsPerHour = wpm * 60;

        return {
          primary: { label: "Estimated Pages of Notes", value: formatNumber(pages, 1) },
          details: [
            { label: "Total words written", value: formatNumber(totalWords, 0) },
            { label: "Words per hour", value: formatNumber(wordsPerHour, 0) },
            { label: "Lecture duration", value: `${formatNumber(duration, 0)} min` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["reading-time-calculator", "study-time-calculator"],
  faq: [
    {
      question: "What is a good note-taking speed?",
      answer:
        "Handwriting averages 13-25 words per minute, while typing averages 30-50+ WPM. You don't need to capture every word - focusing on key concepts at 20-30 WPM is effective.",
    },
    {
      question: "How can I take notes faster?",
      answer:
        "Use abbreviations, symbols, and shorthand. Focus on keywords and concepts rather than full sentences. Consider the Cornell method or mind mapping for efficient note structure.",
    },
  ],
  formula: "Note Speed (WPM) = Words Written / Time in Minutes",
};
