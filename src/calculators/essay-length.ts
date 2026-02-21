import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const essayLengthCalculator: CalculatorDefinition = {
  slug: "essay-length-calculator",
  title: "Essay Word & Page Count Calculator",
  description:
    "Free essay length calculator. Convert between word count and page count, estimate reading and speaking time for your essay or paper.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "essay length calculator",
    "words to pages",
    "page count calculator",
    "essay word count",
    "how many pages is 1000 words",
  ],
  variants: [
    {
      id: "wordsToPages",
      name: "Words to Pages",
      description: "Convert word count to estimated number of pages",
      fields: [
        { name: "wordCount", label: "Word Count", type: "number", placeholder: "e.g. 1000" },
        {
          name: "spacing",
          label: "Spacing",
          type: "select",
          options: [
            { label: "Single-spaced", value: "single" },
            { label: "Double-spaced", value: "double" },
            { label: "1.5 spacing", value: "1.5" },
          ],
        },
        {
          name: "fontSize",
          label: "Font Size",
          type: "select",
          options: [
            { label: "10pt", value: "10" },
            { label: "11pt", value: "11" },
            { label: "12pt (standard)", value: "12" },
            { label: "14pt", value: "14" },
          ],
        },
      ],
      calculate: (inputs) => {
        const words = inputs.wordCount as number;
        const spacing = inputs.spacing as string;
        const fontSize = inputs.fontSize as string;
        if (!words) return null;

        // Words per page estimates based on standard margins (1 inch), Times New Roman
        const baseWPP: Record<string, number> = {
          single: 500,
          double: 250,
          "1.5": 333,
        };

        const fontMultiplier: Record<string, number> = {
          "10": 1.2,
          "11": 1.1,
          "12": 1.0,
          "14": 0.8,
        };

        const wpp = (baseWPP[spacing] || 250) * (fontMultiplier[fontSize] || 1.0);
        const pages = words / wpp;
        const paragraphs = Math.round(words / 150); // avg paragraph ~150 words
        const readingTimeMin = words / 250; // avg reading speed
        const speakingTimeMin = words / 150; // avg speaking speed
        const sentences = Math.round(words / 15); // avg sentence ~15 words

        return {
          primary: { label: "Estimated Pages", value: formatNumber(pages, 1) },
          details: [
            { label: "Word count", value: formatNumber(words, 0) },
            { label: "Estimated sentences", value: formatNumber(sentences, 0) },
            { label: "Estimated paragraphs", value: formatNumber(paragraphs, 0) },
            { label: "Reading time", value: `${formatNumber(readingTimeMin, 1)} min` },
            { label: "Speaking time", value: `${formatNumber(speakingTimeMin, 1)} min` },
            { label: "Characters (est.)", value: formatNumber(words * 5, 0) },
          ],
        };
      },
    },
    {
      id: "pagesToWords",
      name: "Pages to Words",
      description: "Estimate how many words you need for a given page count",
      fields: [
        { name: "pageCount", label: "Number of Pages", type: "number", placeholder: "e.g. 5" },
        {
          name: "spacing",
          label: "Spacing",
          type: "select",
          options: [
            { label: "Single-spaced", value: "single" },
            { label: "Double-spaced", value: "double" },
            { label: "1.5 spacing", value: "1.5" },
          ],
        },
        {
          name: "fontSize",
          label: "Font Size",
          type: "select",
          options: [
            { label: "10pt", value: "10" },
            { label: "11pt", value: "11" },
            { label: "12pt (standard)", value: "12" },
            { label: "14pt", value: "14" },
          ],
        },
      ],
      calculate: (inputs) => {
        const pages = inputs.pageCount as number;
        const spacing = inputs.spacing as string;
        const fontSize = inputs.fontSize as string;
        if (!pages) return null;

        const baseWPP: Record<string, number> = {
          single: 500,
          double: 250,
          "1.5": 333,
        };

        const fontMultiplier: Record<string, number> = {
          "10": 1.2,
          "11": 1.1,
          "12": 1.0,
          "14": 0.8,
        };

        const wpp = (baseWPP[spacing] || 250) * (fontMultiplier[fontSize] || 1.0);
        const words = pages * wpp;
        const paragraphs = Math.round(words / 150);

        return {
          primary: { label: "Estimated Word Count", value: formatNumber(words, 0) },
          details: [
            { label: "Pages", value: formatNumber(pages, 0) },
            { label: "Estimated paragraphs", value: formatNumber(paragraphs, 0) },
            { label: "Reading time", value: `${formatNumber(words / 250, 1)} min` },
            { label: "Writing time (estimate)", value: `${formatNumber(words / 40, 0)} min` },
            { label: "Characters (est.)", value: formatNumber(words * 5, 0) },
          ],
          note: "Estimates assume standard 1-inch margins and Times New Roman or similar font. Actual results vary by formatting.",
        };
      },
    },
  ],
  relatedSlugs: ["word-counter-calculator", "reading-time-calculator", "citation-count-calculator"],
  faq: [
    {
      question: "How many pages is 1000 words?",
      answer:
        "1000 words is approximately 4 pages double-spaced or 2 pages single-spaced, using 12pt Times New Roman with standard 1-inch margins.",
    },
    {
      question: "How many words is a 5-page essay?",
      answer:
        "A 5-page essay is approximately 1,250 words double-spaced or 2,500 words single-spaced, with 12pt font and standard margins.",
    },
    {
      question: "How long does it take to write 1000 words?",
      answer:
        "The average person types about 40 words per minute, so 1000 words takes about 25 minutes of typing. However, with research, planning, and editing, a 1000-word essay typically takes 2-4 hours total.",
    },
  ],
  formula: "Pages = Word Count / Words Per Page (250 double-spaced, 500 single-spaced at 12pt)",
};
