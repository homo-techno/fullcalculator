import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const citationGeneratorCalculator: CalculatorDefinition = {
  slug: "citation-count-calculator",
  title: "Citation Count Calculator",
  description:
    "Free citation count calculator. Estimate the number of citations needed for your paper, calculate citation density, and plan your bibliography.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "citation count calculator",
    "bibliography calculator",
    "references needed",
    "citation density",
    "academic citations calculator",
  ],
  variants: [
    {
      id: "estimate",
      name: "Citations Needed",
      description: "Estimate how many citations/references your paper needs based on length and type",
      fields: [
        { name: "paperLength", label: "Paper Length (pages)", type: "number", placeholder: "e.g. 15", min: 1, max: 500 },
        { name: "paperType", label: "Paper Type", type: "select", options: [{ label: "Undergraduate Essay", value: "2" }, { label: "Research Paper", value: "3" }, { label: "Master's Thesis", value: "4" }, { label: "Doctoral Dissertation", value: "5" }, { label: "Journal Article", value: "3.5" }], defaultValue: "3" },
        { name: "wordCount", label: "Word Count (optional)", type: "number", placeholder: "e.g. 5000", min: 0 },
      ],
      calculate: (inputs) => {
        const pages = inputs.paperLength as number;
        const citesPerPage = parseFloat(inputs.paperType as string || "3");
        const wordCount = (inputs.wordCount as number) || pages * 250;
        if (!pages) return null;

        const minCitations = Math.ceil(pages * citesPerPage * 0.7);
        const recommendedCitations = Math.ceil(pages * citesPerPage);
        const maxCitations = Math.ceil(pages * citesPerPage * 1.5);
        const citationDensity = recommendedCitations / wordCount * 1000;

        const bibPages = Math.ceil(recommendedCitations / 5); // ~5 refs per page

        return {
          primary: { label: "Recommended Citations", value: formatNumber(recommendedCitations, 0) },
          details: [
            { label: "Minimum acceptable", value: formatNumber(minCitations, 0) },
            { label: "Upper range", value: formatNumber(maxCitations, 0) },
            { label: "Citations per 1,000 words", value: formatNumber(citationDensity, 1) },
            { label: "Estimated bibliography pages", value: formatNumber(bibPages, 0) },
          ],
        };
      },
    },
    {
      id: "search-time",
      name: "Research Time Estimate",
      description: "Estimate how long it will take to find and read your sources",
      fields: [
        { name: "citationsNeeded", label: "Citations Needed", type: "number", placeholder: "e.g. 30", min: 1 },
        { name: "minutesPerSource", label: "Minutes to Find Each Source", type: "number", placeholder: "e.g. 15", min: 1, max: 60, defaultValue: 15 },
        { name: "readTimePerSource", label: "Minutes to Read/Skim Each Source", type: "number", placeholder: "e.g. 30", min: 5, max: 120, defaultValue: 30 },
        { name: "relevanceRate", label: "Relevance Rate (% of sources useful)", type: "number", placeholder: "e.g. 60", min: 10, max: 100, defaultValue: 60 },
      ],
      calculate: (inputs) => {
        const citations = inputs.citationsNeeded as number;
        const findTime = (inputs.minutesPerSource as number) || 15;
        const readTime = (inputs.readTimePerSource as number) || 30;
        const relevance = ((inputs.relevanceRate as number) || 60) / 100;
        if (!citations) return null;

        const sourcesToReview = Math.ceil(citations / relevance);
        const totalFindMinutes = sourcesToReview * findTime;
        const totalReadMinutes = sourcesToReview * readTime;
        const totalMinutes = totalFindMinutes + totalReadMinutes;
        const totalHours = totalMinutes / 60;
        const totalDays = totalHours / 6; // 6 productive hours per day

        return {
          primary: { label: "Total Research Time", value: `${formatNumber(totalHours, 1)} hours` },
          details: [
            { label: "Sources to review", value: formatNumber(sourcesToReview, 0) },
            { label: "Finding sources", value: `${formatNumber(totalFindMinutes / 60, 1)} hrs` },
            { label: "Reading sources", value: `${formatNumber(totalReadMinutes / 60, 1)} hrs` },
            { label: "Full research days (6 hrs/day)", value: formatNumber(totalDays, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["reading-time-calculator", "thesis-timeline-calculator"],
  faq: [
    {
      question: "How many citations should a paper have?",
      answer:
        "A general rule is 2-3 citations per page for undergraduate papers, 3-4 for research papers, and 4-5 for graduate theses. Journal articles typically have 20-50 references regardless of length.",
    },
    {
      question: "Is it possible to have too many citations?",
      answer:
        "Yes. Over-citing can make your paper feel like a literature summary rather than original work. Aim for a balance where citations support your arguments without overwhelming your own analysis.",
    },
  ],
  formula: "Recommended Citations = Paper Pages x Citations per Page (by paper type)",
};
