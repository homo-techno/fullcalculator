import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const domainAuthorityCalculator: CalculatorDefinition = {
  slug: "domain-authority",
  title: "Domain Authority Estimator",
  description: "Free domain authority estimator. Estimate your domain authority score based on key SEO metrics like backlinks, referring domains, and site age.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["domain authority", "da score", "seo score", "backlinks", "referring domains", "moz"],
  variants: [
    {
      id: "basic",
      name: "DA Estimator",
      fields: [
        { name: "totalBacklinks", label: "Total Backlinks", type: "number", placeholder: "e.g. 5000" },
        { name: "referringDomains", label: "Referring Domains", type: "number", placeholder: "e.g. 200" },
        { name: "siteAgeYears", label: "Site Age (Years)", type: "number", placeholder: "e.g. 3" },
        { name: "totalPages", label: "Total Indexed Pages", type: "number", placeholder: "e.g. 500" },
      ],
      calculate: (inputs) => {
        const backlinks = inputs.totalBacklinks as number;
        const domains = inputs.referringDomains as number;
        const age = inputs.siteAgeYears as number;
        const pages = inputs.totalPages as number;
        if (!backlinks || !domains || !age || !pages) return null;
        const domainScore = Math.min(100, Math.round(
          Math.log10(domains + 1) * 15 +
          Math.log10(backlinks + 1) * 10 +
          Math.min(age, 10) * 2 +
          Math.log10(pages + 1) * 5
        ));
        const linksPerDomain = backlinks / domains;
        const pagesPerDomain = pages / domains;
        const rating = domainScore >= 60 ? "Strong" : domainScore >= 40 ? "Moderate" : domainScore >= 20 ? "Building" : "New";
        return {
          primary: { label: "Estimated Domain Authority", value: `${formatNumber(domainScore, 0)}/100` },
          details: [
            { label: "Rating", value: rating },
            { label: "Links per Referring Domain", value: formatNumber(linksPerDomain, 1) },
            { label: "Referring Domains", value: formatNumber(domains, 0) },
            { label: "Total Backlinks", value: formatNumber(backlinks, 0) },
            { label: "Indexed Pages", value: formatNumber(pages, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["seo-roi", "keyword-density", "content-roi"],
  faq: [
    { question: "What is Domain Authority?", answer: "Domain Authority (DA) is a search engine ranking score developed by Moz that predicts how likely a website is to rank in search results. Scores range from 1-100, with higher scores indicating greater ranking potential." },
    { question: "How can I improve my Domain Authority?", answer: "Improve DA by earning high-quality backlinks from authoritative sites, creating valuable content, improving technical SEO, removing toxic links, and being patient as DA grows over time." },
  ],
  formula: "DA Estimate = f(log(Referring Domains), log(Backlinks), Site Age, log(Pages))",
};
