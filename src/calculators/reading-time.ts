import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const readingTimeCalculator: CalculatorDefinition = {
  slug: "reading-time-calculator",
  title: "Reading Time Calculator",
  description: "Free reading time calculator. Estimate how long it takes to read or speak a given number of words or pages.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["reading time calculator", "words per minute", "reading speed calculator", "speech time calculator"],
  variants: [
    {
      id: "reading",
      name: "Reading Time",
      fields: [
        { name: "words", label: "Number of Words", type: "number", placeholder: "e.g. 3000" },
        { name: "wpm", label: "Reading Speed (WPM)", type: "number", placeholder: "e.g. 250", defaultValue: 250 },
      ],
      calculate: (inputs) => {
        const words = inputs.words as number, wpm = (inputs.wpm as number) || 250;
        if (!words) return null;
        const minutes = words / wpm;
        const h = Math.floor(minutes / 60), m = Math.ceil(minutes % 60);
        const pages = words / 250;
        return {
          primary: { label: "Reading Time", value: h > 0 ? `${h}h ${m}m` : `${m} min` },
          details: [
            { label: "Word count", value: formatNumber(words, 0) },
            { label: "Pages (≈250 words/page)", value: formatNumber(pages, 1) },
            { label: "Speaking time (150 WPM)", value: `${formatNumber(words / 150, 1)} min` },
          ],
        };
      },
    },
    {
      id: "fromPages",
      name: "From Page Count",
      fields: [
        { name: "pages", label: "Number of Pages", type: "number", placeholder: "e.g. 300" },
        { name: "wordsPerPage", label: "Words per Page", type: "number", placeholder: "e.g. 250", defaultValue: 250 },
        { name: "wpm", label: "Reading Speed (WPM)", type: "number", placeholder: "e.g. 250", defaultValue: 250 },
      ],
      calculate: (inputs) => {
        const pages = inputs.pages as number, wpp = (inputs.wordsPerPage as number) || 250;
        const wpm = (inputs.wpm as number) || 250;
        if (!pages) return null;
        const totalWords = pages * wpp;
        const totalMin = totalWords / wpm;
        const hours = totalMin / 60;
        return {
          primary: { label: "Reading Time", value: `${formatNumber(hours, 1)} hours` },
          details: [
            { label: "Total words", value: formatNumber(totalWords, 0) },
            { label: "Total minutes", value: formatNumber(totalMin, 0) },
            { label: "Pages per hour", value: formatNumber(pages / hours, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["time-duration-calculator", "pace-calculator", "word-counter-calculator"],
  faq: [{ question: "What is the average reading speed?", answer: "The average adult reads at 200-300 words per minute (WPM). College students average about 300 WPM. Speed readers can reach 700+ WPM, but with reduced comprehension. The average speaking rate is 130-150 WPM." }],
  formula: "Time = Word Count / WPM",
};
