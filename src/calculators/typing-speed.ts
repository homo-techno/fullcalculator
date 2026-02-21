import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const typingSpeedCalculator: CalculatorDefinition = {
  slug: "typing-speed-calculator",
  title: "Typing Speed Calculator",
  description:
    "Free typing speed calculator. Calculate your words per minute (WPM) and characters per minute from characters typed and time.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "typing speed",
    "WPM",
    "words per minute",
    "typing test",
    "CPM",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "characters",
          label: "Characters Typed",
          type: "number",
          placeholder: "e.g. 500",
        },
        {
          name: "seconds",
          label: "Time (seconds)",
          type: "number",
          placeholder: "e.g. 60",
        },
      ],
      calculate: (inputs) => {
        const characters = inputs.characters as number;
        const seconds = inputs.seconds as number;
        if (!characters || !seconds || characters <= 0 || seconds <= 0)
          return null;

        const words = characters / 5; // Standard: 1 word = 5 characters
        const minutes = seconds / 60;
        const wpm = words / minutes;
        const cpm = characters / minutes;

        let classification = "";
        if (wpm < 20) classification = "Beginner";
        else if (wpm < 40) classification = "Below Average";
        else if (wpm < 60) classification = "Average";
        else if (wpm < 80) classification = "Above Average";
        else if (wpm < 100) classification = "Fast";
        else if (wpm < 120) classification = "Professional";
        else classification = "Expert / Competitive";

        let job = "";
        if (wpm >= 80) job = "Court reporter, transcriptionist";
        else if (wpm >= 60) job = "Data entry, secretary, programmer";
        else if (wpm >= 40) job = "Average office worker";
        else job = "Consider practicing to improve";

        return {
          primary: {
            label: "Typing Speed",
            value: formatNumber(wpm, 0) + " WPM",
          },
          details: [
            {
              label: "Characters Per Minute",
              value: formatNumber(cpm, 0) + " CPM",
            },
            { label: "Speed Classification", value: classification },
            { label: "Suitable For", value: job },
            {
              label: "Characters Typed",
              value: formatNumber(characters, 0),
            },
            {
              label: "Words (chars / 5)",
              value: formatNumber(words, 1),
            },
            {
              label: "Time",
              value:
                formatNumber(seconds, 0) +
                " sec (" +
                formatNumber(minutes, 2) +
                " min)",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["reading-level-calculator", "study-time-calculator"],
  faq: [
    {
      question: "What is a good typing speed?",
      answer:
        "The average typing speed is about 40 WPM. 60-80 WPM is considered above average and suitable for most office jobs. Professional typists often exceed 100 WPM.",
    },
    {
      question: "How is WPM calculated?",
      answer:
        "WPM is calculated by dividing the number of characters typed by 5 (the standard word length) and then dividing by the number of minutes. For example, 300 characters in 60 seconds = 60 words / 1 minute = 60 WPM.",
    },
  ],
  formula:
    "WPM = (Characters / 5) / (Seconds / 60). CPM = Characters / (Seconds / 60). One standard word = 5 characters including spaces.",
};
