import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const keywordDensityCalculator: CalculatorDefinition = {
  slug: "keyword-density",
  title: "Keyword Density Calculator",
  description: "Free keyword density calculator. Analyze how frequently a keyword appears in your content relative to the total word count for SEO optimization.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["keyword density", "seo", "content optimization", "keyword frequency", "on-page seo"],
  variants: [
    {
      id: "basic",
      name: "Basic Keyword Density",
      fields: [
        { name: "keywordCount", label: "Keyword Occurrences", type: "number", placeholder: "e.g. 15" },
        { name: "totalWords", label: "Total Word Count", type: "number", placeholder: "e.g. 1000" },
      ],
      calculate: (inputs) => {
        const keywordCount = inputs.keywordCount as number;
        const totalWords = inputs.totalWords as number;
        if (!keywordCount || !totalWords) return null;
        const density = (keywordCount / totalWords) * 100;
        const wordsPerKeyword = totalWords / keywordCount;
        const isOptimal = density >= 1 && density <= 3;
        return {
          primary: { label: "Keyword Density", value: `${formatNumber(density, 2)}%` },
          details: [
            { label: "Keyword Occurrences", value: formatNumber(keywordCount, 0) },
            { label: "Total Word Count", value: formatNumber(totalWords, 0) },
            { label: "Words Between Keywords", value: formatNumber(wordsPerKeyword, 0) },
            { label: "Density Assessment", value: isOptimal ? "Optimal (1-3%)" : density < 1 ? "Low (under 1%)" : "High (over 3%)" },
          ],
        };
      },
    },
    {
      id: "target",
      name: "Target Density Planning",
      fields: [
        { name: "totalWords", label: "Total Word Count", type: "number", placeholder: "e.g. 1500" },
        { name: "targetDensity", label: "Target Density (%)", type: "number", placeholder: "e.g. 2" },
        { name: "currentOccurrences", label: "Current Occurrences", type: "number", placeholder: "e.g. 8" },
      ],
      calculate: (inputs) => {
        const totalWords = inputs.totalWords as number;
        const targetDensity = inputs.targetDensity as number;
        const currentOccurrences = inputs.currentOccurrences as number;
        if (!totalWords || !targetDensity) return null;
        const targetOccurrences = Math.round((targetDensity / 100) * totalWords);
        const currentDensity = currentOccurrences ? (currentOccurrences / totalWords) * 100 : 0;
        const needed = targetOccurrences - (currentOccurrences || 0);
        return {
          primary: { label: "Target Keyword Count", value: formatNumber(targetOccurrences, 0) },
          details: [
            { label: "Current Density", value: `${formatNumber(currentDensity, 2)}%` },
            { label: "Target Density", value: `${formatNumber(targetDensity, 2)}%` },
            { label: "Keywords Needed", value: formatNumber(Math.max(0, needed), 0) },
            { label: "Total Word Count", value: formatNumber(totalWords, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["seo-roi", "content-roi", "blog-traffic"],
  faq: [
    { question: "What is the ideal keyword density?", answer: "The ideal keyword density is generally between 1-3%. Modern SEO focuses more on natural language and semantic relevance rather than exact keyword frequency. Keyword stuffing (above 3-4%) can hurt rankings." },
    { question: "Does keyword density still matter for SEO?", answer: "While exact keyword density is less important than it once was, ensuring your target keyword appears naturally throughout your content is still a ranking factor. Focus on topical relevance and user experience over rigid density targets." },
  ],
  formula: "Keyword Density = (Keyword Occurrences / Total Words) x 100",
};
