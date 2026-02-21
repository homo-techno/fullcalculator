import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const readingLevelCalculator: CalculatorDefinition = {
  slug: "reading-level-calculator",
  title: "Reading Level Calculator",
  description:
    "Free reading level calculator. Calculate Flesch-Kincaid grade level and reading ease score from text statistics.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "reading level",
    "Flesch-Kincaid",
    "readability",
    "grade level",
    "reading ease",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "totalWords",
          label: "Total Words",
          type: "number",
          placeholder: "e.g. 200",
        },
        {
          name: "totalSentences",
          label: "Total Sentences",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "totalSyllables",
          label: "Total Syllables",
          type: "number",
          placeholder: "e.g. 300",
        },
      ],
      calculate: (inputs) => {
        const words = inputs.totalWords as number;
        const sentences = inputs.totalSentences as number;
        const syllables = inputs.totalSyllables as number;
        if (!words || !sentences || !syllables) return null;
        if (words <= 0 || sentences <= 0 || syllables <= 0) return null;

        // Flesch-Kincaid Grade Level
        const fkGrade =
          0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;

        // Flesch Reading Ease
        const readingEase =
          206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);

        const avgWordsPerSentence = words / sentences;
        const avgSyllablesPerWord = syllables / words;

        let easeDescription = "";
        if (readingEase >= 90) easeDescription = "Very Easy (5th grade)";
        else if (readingEase >= 80) easeDescription = "Easy (6th grade)";
        else if (readingEase >= 70) easeDescription = "Fairly Easy (7th grade)";
        else if (readingEase >= 60) easeDescription = "Standard (8th-9th grade)";
        else if (readingEase >= 50) easeDescription = "Fairly Difficult (10th-12th grade)";
        else if (readingEase >= 30) easeDescription = "Difficult (college)";
        else easeDescription = "Very Difficult (college graduate)";

        let audience = "";
        if (fkGrade <= 5) audience = "Elementary school students";
        else if (fkGrade <= 8) audience = "Middle school students";
        else if (fkGrade <= 12) audience = "High school students";
        else if (fkGrade <= 16) audience = "College students";
        else audience = "Graduate / professional";

        return {
          primary: {
            label: "Flesch-Kincaid Grade Level",
            value: formatNumber(Math.max(0, fkGrade), 1),
          },
          details: [
            {
              label: "Reading Ease Score",
              value: formatNumber(Math.max(0, Math.min(100, readingEase)), 1),
            },
            { label: "Ease Description", value: easeDescription },
            { label: "Target Audience", value: audience },
            {
              label: "Avg Words Per Sentence",
              value: formatNumber(avgWordsPerSentence, 1),
            },
            {
              label: "Avg Syllables Per Word",
              value: formatNumber(avgSyllablesPerWord, 2),
            },
            {
              label: "Total Words",
              value: formatNumber(words, 0),
            },
            {
              label: "Total Sentences",
              value: formatNumber(sentences, 0),
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["typing-speed-calculator", "study-time-calculator"],
  faq: [
    {
      question: "What is the Flesch-Kincaid grade level?",
      answer:
        "The Flesch-Kincaid grade level indicates the U.S. school grade needed to understand the text. A score of 8.0 means an 8th grader can understand it. Most newspapers aim for grades 7-9.",
    },
    {
      question: "What is a good Flesch reading ease score?",
      answer:
        "Scores range from 0 to 100. 60-70 is standard (understandable by 13-15 year olds). Higher scores mean easier reading. Most public-facing content should aim for 60 or above.",
    },
  ],
  formula:
    "FK Grade = 0.39 x (words/sentences) + 11.8 x (syllables/words) - 15.59. Reading Ease = 206.835 - 1.015 x (words/sentences) - 84.6 x (syllables/words).",
};
