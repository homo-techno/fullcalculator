import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const typingSpeedTestCalculator: CalculatorDefinition = {
  slug: "typing-speed-test-calc",
  title: "Typing Speed Calculator",
  description:
    "Free typing speed and accuracy calculator. Calculate WPM, adjusted WPM, and characters per minute from your typing test results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "typing speed calculator",
    "typing WPM",
    "typing test calculator",
    "words per minute typing",
    "typing accuracy",
    "CPM calculator",
    "typing speed test",
  ],
  variants: [
    {
      id: "typing-wpm",
      name: "Typing Speed from Test",
      description: "Calculate WPM from your typing test results",
      fields: [
        {
          name: "totalChars",
          label: "Total Characters Typed",
          type: "number",
          placeholder: "e.g. 300",
        },
        {
          name: "errors",
          label: "Number of Errors",
          type: "number",
          placeholder: "e.g. 5",
          defaultValue: 0,
        },
        {
          name: "timeSeconds",
          label: "Time Taken (seconds)",
          type: "number",
          placeholder: "e.g. 60",
        },
      ],
      calculate: (inputs) => {
        const totalChars = parseFloat(inputs.totalChars as string);
        const errors = parseFloat(inputs.errors as string);
        const timeSeconds = parseFloat(inputs.timeSeconds as string);
        if (isNaN(totalChars) || isNaN(errors) || isNaN(timeSeconds)) return null;
        if (totalChars <= 0 || timeSeconds <= 0 || errors < 0) return null;

        const timeMinutes = timeSeconds / 60;
        const grossWPM = (totalChars / 5) / timeMinutes; // 5 chars = 1 "word"
        const netWPM = Math.max(0, grossWPM - (errors / timeMinutes));
        const cpm = totalChars / timeMinutes;
        const accuracy = ((totalChars - errors) / totalChars) * 100;

        let level = "Beginner (below 30 WPM)";
        if (netWPM >= 100) level = "Professional/Expert (100+ WPM)";
        else if (netWPM >= 70) level = "Advanced (70-99 WPM)";
        else if (netWPM >= 50) level = "Intermediate (50-69 WPM)";
        else if (netWPM >= 30) level = "Average (30-49 WPM)";

        return {
          primary: {
            label: "Net Typing Speed",
            value: formatNumber(netWPM, 1),
            suffix: "WPM",
          },
          details: [
            { label: "Gross WPM", value: formatNumber(grossWPM, 1) },
            { label: "Characters/min (CPM)", value: formatNumber(cpm, 0) },
            { label: "Accuracy", value: formatNumber(accuracy, 1) + "%" },
            { label: "Errors", value: formatNumber(errors) },
            { label: "Skill Level", value: level },
          ],
        };
      },
    },
    {
      id: "typing-time-estimate",
      name: "Typing Time Estimator",
      description: "Estimate how long it takes to type a document",
      fields: [
        {
          name: "wordCount",
          label: "Word Count to Type",
          type: "number",
          placeholder: "e.g. 1000",
        },
        {
          name: "typingSpeed",
          label: "Your Typing Speed (WPM)",
          type: "select",
          options: [
            { label: "Slow (25 WPM)", value: "25" },
            { label: "Average (40 WPM)", value: "40" },
            { label: "Good (55 WPM)", value: "55" },
            { label: "Fast (70 WPM)", value: "70" },
            { label: "Very Fast (90 WPM)", value: "90" },
            { label: "Expert (110 WPM)", value: "110" },
          ],
          defaultValue: "40",
        },
        {
          name: "thinkingFactor",
          label: "Content Complexity",
          type: "select",
          options: [
            { label: "Transcription (1x - just copying)", value: "1" },
            { label: "Simple (2x - casual writing)", value: "2" },
            { label: "Moderate (3x - business writing)", value: "3" },
            { label: "Complex (5x - technical/creative)", value: "5" },
          ],
          defaultValue: "3",
        },
      ],
      calculate: (inputs) => {
        const wordCount = parseFloat(inputs.wordCount as string);
        const wpm = parseFloat(inputs.typingSpeed as string);
        const thinkFactor = parseFloat(inputs.thinkingFactor as string);
        if (isNaN(wordCount) || isNaN(wpm) || isNaN(thinkFactor)) return null;
        if (wordCount <= 0 || wpm <= 0) return null;

        const pureTypingMin = wordCount / wpm;
        const totalMin = pureTypingMin * thinkFactor;
        const hours = Math.floor(totalMin / 60);
        const minutes = Math.round(totalMin % 60);

        let timeStr = "";
        if (hours > 0) timeStr += hours + "h ";
        timeStr += minutes + "m";

        return {
          primary: {
            label: "Estimated Total Time",
            value: timeStr.trim(),
          },
          details: [
            { label: "Pure Typing Time", value: formatNumber(pureTypingMin, 1) + " min" },
            { label: "With Thinking/Editing", value: formatNumber(totalMin, 1) + " min" },
            { label: "Typing Speed", value: formatNumber(wpm) + " WPM" },
            { label: "Complexity Multiplier", value: thinkFactor + "x" },
            { label: "Estimated Pages", value: formatNumber(wordCount / 250, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["reading-speed-calc", "data-transfer-calc", "time-card-calculator"],
  faq: [
    {
      question: "What is a good typing speed?",
      answer:
        "The average typing speed is 40 WPM. 50-60 WPM is considered good. 70+ WPM is fast. Professional typists typically reach 80-100 WPM. Competitive typists can exceed 150 WPM. For most office jobs, 50-60 WPM with good accuracy is sufficient.",
    },
    {
      question: "What is the difference between gross and net WPM?",
      answer:
        "Gross WPM counts all characters typed divided by 5 (standard word length). Net WPM subtracts errors from gross WPM: Net WPM = Gross WPM - (Errors / Minutes). Net WPM better represents actual productive typing speed.",
    },
    {
      question: "How is typing WPM calculated?",
      answer:
        "WPM = (Total Characters / 5) / Minutes. The standard 'word' is defined as 5 characters including spaces. So typing 300 characters in 1 minute = 60 WPM. Errors are subtracted for Net WPM.",
    },
  ],
  formula:
    "Gross WPM = (Characters / 5) / Minutes | Net WPM = Gross WPM - (Errors / Minutes) | Accuracy = (Correct / Total) x 100",
};
