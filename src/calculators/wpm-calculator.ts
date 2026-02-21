import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wpmCalculator: CalculatorDefinition = {
  slug: "wpm-calculator",
  title: "Words Per Minute Calculator",
  description:
    "Free words per minute calculator. Calculate your reading speed, typing speed, or speaking rate in WPM. Find out how long it takes to read or present content.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "words per minute calculator",
    "wpm calculator",
    "reading speed calculator",
    "speaking rate calculator",
    "how fast do I read",
  ],
  variants: [
    {
      id: "readingWpm",
      name: "Reading Speed (WPM)",
      description: "Calculate your reading words per minute from word count and time",
      fields: [
        { name: "wordCount", label: "Total Words Read", type: "number", placeholder: "e.g. 1500" },
        { name: "minutes", label: "Time Taken (minutes)", type: "number", placeholder: "e.g. 6" },
        { name: "seconds", label: "Additional Seconds", type: "number", placeholder: "e.g. 30", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const words = inputs.wordCount as number;
        const minutes = inputs.minutes as number;
        const seconds = (inputs.seconds as number) || 0;
        if (!words || (!minutes && !seconds)) return null;

        const totalMinutes = minutes + seconds / 60;
        const wpm = words / totalMinutes;

        let level: string;
        if (wpm >= 700) level = "Speed reader";
        else if (wpm >= 400) level = "Above average reader";
        else if (wpm >= 250) level = "Average adult reader";
        else if (wpm >= 200) level = "Below average";
        else if (wpm >= 150) level = "Slow reader / careful reading";
        else level = "Very slow / beginner";

        // How long to read various things at this speed
        const timeForNovel = 80000 / wpm; // average novel ~80k words
        const timeForArticle = 2000 / wpm;
        const timeForTextbook = 5000 / wpm; // textbook chapter

        return {
          primary: { label: "Reading Speed", value: `${formatNumber(wpm, 0)} WPM` },
          details: [
            { label: "Words read", value: formatNumber(words, 0) },
            { label: "Time taken", value: `${formatNumber(totalMinutes, 1)} min` },
            { label: "Reading level", value: level },
            { label: "Time to read a 2,000-word article", value: `${formatNumber(timeForArticle, 1)} min` },
            { label: "Time to read a textbook chapter", value: `${formatNumber(timeForTextbook, 0)} min` },
            { label: "Time to read a novel (80k words)", value: `${formatNumber(timeForNovel / 60, 1)} hrs` },
          ],
        };
      },
    },
    {
      id: "speakingWpm",
      name: "Speaking Rate",
      description: "Calculate your speaking rate and estimate presentation timing",
      fields: [
        { name: "wordCount", label: "Words Spoken / In Script", type: "number", placeholder: "e.g. 800" },
        { name: "minutes", label: "Time Taken (minutes)", type: "number", placeholder: "e.g. 5" },
        { name: "seconds", label: "Additional Seconds", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const words = inputs.wordCount as number;
        const minutes = inputs.minutes as number;
        const seconds = (inputs.seconds as number) || 0;
        if (!words || (!minutes && !seconds)) return null;

        const totalMinutes = minutes + seconds / 60;
        const wpm = words / totalMinutes;

        let pace: string;
        if (wpm >= 180) pace = "Fast (may be hard to follow)";
        else if (wpm >= 160) pace = "Conversational (natural)";
        else if (wpm >= 140) pace = "Moderate (ideal for presentations)";
        else if (wpm >= 120) pace = "Slow (deliberate, formal)";
        else pace = "Very slow";

        // Estimate words needed for different time slots
        const wordsFor5Min = wpm * 5;
        const wordsFor10Min = wpm * 10;
        const wordsFor15Min = wpm * 15;
        const wordsFor20Min = wpm * 20;

        return {
          primary: { label: "Speaking Rate", value: `${formatNumber(wpm, 0)} WPM` },
          details: [
            { label: "Pace assessment", value: pace },
            { label: "Words for a 5-min speech", value: formatNumber(wordsFor5Min, 0) },
            { label: "Words for a 10-min speech", value: formatNumber(wordsFor10Min, 0) },
            { label: "Words for a 15-min speech", value: formatNumber(wordsFor15Min, 0) },
            { label: "Words for a 20-min speech", value: formatNumber(wordsFor20Min, 0) },
          ],
          note: "The ideal presentation pace is 130-160 WPM. Allow extra time for pauses, audience interaction, and slide transitions.",
        };
      },
    },
    {
      id: "timeEstimate",
      name: "Time to Read / Present",
      description: "Estimate how long it will take to read or present a given word count",
      fields: [
        { name: "wordCount", label: "Word Count", type: "number", placeholder: "e.g. 3000" },
        {
          name: "activity",
          label: "Activity",
          type: "select",
          options: [
            { label: "Silent reading (250 WPM)", value: "reading" },
            { label: "Presentation (150 WPM)", value: "presenting" },
            { label: "Audiobook (150 WPM)", value: "audiobook" },
            { label: "Careful study (100 WPM)", value: "study" },
          ],
        },
      ],
      calculate: (inputs) => {
        const words = inputs.wordCount as number;
        const activity = inputs.activity as string;
        if (!words || !activity) return null;

        const speeds: Record<string, number> = {
          reading: 250,
          presenting: 150,
          audiobook: 150,
          study: 100,
        };

        const wpm = speeds[activity] || 250;
        const totalMinutes = words / wpm;
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        return {
          primary: { label: "Estimated Time", value: hours > 0 ? `${hours}h ${formatNumber(mins, 0)}m` : `${formatNumber(totalMinutes, 1)} min` },
          details: [
            { label: "Word count", value: formatNumber(words, 0) },
            { label: "Speed used", value: `${wpm} WPM` },
            { label: "Total minutes", value: formatNumber(totalMinutes, 1) },
            { label: "Silent reading time", value: `${formatNumber(words / 250, 1)} min` },
            { label: "Presentation time", value: `${formatNumber(words / 150, 1)} min` },
            { label: "Study time", value: `${formatNumber(words / 100, 1)} min` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["reading-time-calculator", "typing-speed-calculator", "essay-length-calculator"],
  faq: [
    {
      question: "What is the average reading speed?",
      answer:
        "The average adult reads about 200-250 words per minute. College students average about 300 WPM. Speed readers can reach 700+ WPM, though comprehension may decrease at very high speeds.",
    },
    {
      question: "What is a good speaking rate for presentations?",
      answer:
        "The ideal speaking rate for presentations is 130-160 words per minute. Normal conversation is 150-180 WPM. Speaking too fast (180+) can lose your audience, while speaking too slow (under 120) can bore them.",
    },
    {
      question: "How many words is a 5-minute speech?",
      answer:
        "At a comfortable presentation pace of 150 WPM, a 5-minute speech is about 750 words. At a faster conversational pace of 170 WPM, it would be about 850 words.",
    },
  ],
  formula: "WPM = Total Words / Time in Minutes",
};
