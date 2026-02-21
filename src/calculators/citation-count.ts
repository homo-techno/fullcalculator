import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const citationCountCalculator: CalculatorDefinition = {
  slug: "citation-count-calculator",
  title: "Citation & Bibliography Counter",
  description:
    "Free citation counter calculator. Estimate how many sources you need for your research paper and calculate bibliography page length.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "citation calculator",
    "bibliography counter",
    "how many sources do I need",
    "reference count calculator",
    "research paper sources",
  ],
  variants: [
    {
      id: "sourcesNeeded",
      name: "Sources Needed Estimator",
      description: "Estimate the minimum number of sources recommended for your paper",
      fields: [
        { name: "pageCount", label: "Paper Length (pages, double-spaced)", type: "number", placeholder: "e.g. 10" },
        {
          name: "paperType",
          label: "Paper Type",
          type: "select",
          options: [
            { label: "High school essay", value: "high_school" },
            { label: "Undergraduate paper", value: "undergrad" },
            { label: "Graduate paper", value: "graduate" },
            { label: "Research paper / thesis", value: "research" },
            { label: "Literature review", value: "lit_review" },
          ],
        },
      ],
      calculate: (inputs) => {
        const pages = inputs.pageCount as number;
        const type = inputs.paperType as string;
        if (!pages || !type) return null;

        // Sources per page recommendations
        const sourcesPerPage: Record<string, number> = {
          high_school: 1.0,
          undergrad: 1.5,
          graduate: 2.0,
          research: 2.5,
          lit_review: 3.0,
        };

        const rate = sourcesPerPage[type] || 1.5;
        const minSources = Math.ceil(pages * rate);
        const maxSources = Math.ceil(minSources * 1.5);
        const wordCount = pages * 250; // double-spaced
        const bibPages = Math.ceil(minSources / 5); // ~5 references per page in APA/MLA

        const typeLabels: Record<string, string> = {
          high_school: "High school essay",
          undergrad: "Undergraduate paper",
          graduate: "Graduate paper",
          research: "Research paper / thesis",
          lit_review: "Literature review",
        };

        return {
          primary: { label: "Recommended Sources", value: `${minSources} - ${maxSources}` },
          details: [
            { label: "Paper type", value: typeLabels[type] || type },
            { label: "Paper length", value: `${pages} pages (~${formatNumber(wordCount, 0)} words)` },
            { label: "Minimum recommended", value: `${minSources} sources` },
            { label: "Ideal range", value: `${minSources} - ${maxSources} sources` },
            { label: "Sources per page ratio", value: `~${rate}` },
            { label: "Estimated bibliography pages", value: `${bibPages}` },
          ],
        };
      },
    },
    {
      id: "bibLength",
      name: "Bibliography Page Length",
      description: "Estimate how long your bibliography/references section will be",
      fields: [
        { name: "sourceCount", label: "Number of Sources", type: "number", placeholder: "e.g. 15" },
        {
          name: "citationStyle",
          label: "Citation Style",
          type: "select",
          options: [
            { label: "APA (7th edition)", value: "apa" },
            { label: "MLA (9th edition)", value: "mla" },
            { label: "Chicago / Turabian", value: "chicago" },
            { label: "IEEE", value: "ieee" },
          ],
        },
      ],
      calculate: (inputs) => {
        const sources = inputs.sourceCount as number;
        const style = inputs.citationStyle as string;
        if (!sources || !style) return null;

        // Average lines per reference by style
        const linesPerRef: Record<string, number> = {
          apa: 3.5,
          mla: 3.0,
          chicago: 4.0,
          ieee: 2.5,
        };

        const lines = sources * (linesPerRef[style] || 3.0);
        const linesPerPage = 23; // double-spaced, 12pt
        const bibPages = lines / linesPerPage;

        const styleLabels: Record<string, string> = {
          apa: "APA (7th edition)",
          mla: "MLA (9th edition)",
          chicago: "Chicago / Turabian",
          ieee: "IEEE",
        };

        return {
          primary: { label: "Bibliography Length", value: `${formatNumber(bibPages, 1)} pages` },
          details: [
            { label: "Citation style", value: styleLabels[style] || style },
            { label: "Total sources", value: formatNumber(sources, 0) },
            { label: "Estimated lines", value: formatNumber(lines, 0) },
            { label: "Avg. lines per reference", value: formatNumber(linesPerRef[style] || 3, 1) },
          ],
          note: "Estimates are approximate. Actual length varies by source types (books, journals, websites), annotation length, and formatting.",
        };
      },
    },
  ],
  relatedSlugs: ["essay-length-calculator", "word-counter-calculator", "reading-time-calculator"],
  faq: [
    {
      question: "How many sources do I need for a research paper?",
      answer:
        "A general rule is 1-2 sources per page for undergraduate papers and 2-3 per page for graduate-level work. A 10-page undergraduate paper typically needs 10-20 sources. Literature reviews require more, around 30+ sources.",
    },
    {
      question: "What citation style should I use?",
      answer:
        "APA is standard for social sciences, psychology, and education. MLA is used in humanities and liberal arts. Chicago is common in history and some humanities. IEEE is for engineering and computer science. Always follow your professor's requirements.",
    },
    {
      question: "How long should my bibliography be?",
      answer:
        "A bibliography typically takes about 1 page for every 5-7 sources in APA or MLA format. A paper with 15 sources will have roughly 2-3 pages of references.",
    },
  ],
  formula: "Recommended Sources = Paper Pages x Sources-per-Page Rate (varies by level)",
};
