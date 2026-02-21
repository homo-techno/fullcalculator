import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wordCounterCalculator: CalculatorDefinition = {
  slug: "word-counter-calculator",
  title: "Word Counter",
  description: "Free word counter tool. Count words, characters, sentences, and paragraphs. Estimate reading and speaking time.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["word counter", "character counter", "word count", "letter counter", "text analyzer"],
  variants: [
    {
      id: "count",
      name: "Count Words & Characters",
      fields: [
        { name: "text", label: "Enter your text", type: "text" as "number", placeholder: "Paste or type your text here..." },
      ],
      calculate: (inputs) => {
        const text = String(inputs.text || "").trim();
        if (!text) return null;
        const words = text.split(/\s+/).filter(w => w.length > 0).length;
        const chars = text.length;
        const charsNoSpaces = text.replace(/\s/g, "").length;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || 1;
        const readingMin = words / 250;
        const speakingMin = words / 150;
        return {
          primary: { label: "Words", value: formatNumber(words, 0) },
          details: [
            { label: "Characters (with spaces)", value: formatNumber(chars, 0) },
            { label: "Characters (no spaces)", value: formatNumber(charsNoSpaces, 0) },
            { label: "Sentences", value: formatNumber(sentences, 0) },
            { label: "Paragraphs", value: formatNumber(paragraphs, 0) },
            { label: "Reading time", value: `${formatNumber(readingMin, 1)} min` },
            { label: "Speaking time", value: `${formatNumber(speakingMin, 1)} min` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["reading-time-calculator", "time-duration-calculator"],
  faq: [{ question: "How are words counted?", answer: "Words are counted by splitting text on whitespace. A 'word' is any sequence of non-space characters. Average reading speed is 250 WPM, average speaking speed is 150 WPM." }],
  formula: "Words = text split by spaces | Reading time = words / 250 WPM",
};
