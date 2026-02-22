import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const leadScoringCalculator: CalculatorDefinition = {
  slug: "lead-scoring",
  title: "Lead Scoring Calculator",
  description: "Free lead scoring calculator. Score and prioritize your leads based on demographic fit, behavioral signals, and engagement level.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["lead scoring", "lead qualification", "sales leads", "mql", "sql", "lead priority"],
  variants: [
    {
      id: "basic",
      name: "Basic Lead Score",
      fields: [
        { name: "jobTitleFit", label: "Job Title Fit (1-10)", type: "number", placeholder: "e.g. 8", min: 1, max: 10 },
        { name: "companySizeFit", label: "Company Size Fit (1-10)", type: "number", placeholder: "e.g. 7", min: 1, max: 10 },
        { name: "industryFit", label: "Industry Fit (1-10)", type: "number", placeholder: "e.g. 9", min: 1, max: 10 },
        { name: "websiteVisits", label: "Website Visits (last 30 days)", type: "number", placeholder: "e.g. 12" },
        { name: "emailEngagements", label: "Email Engagements (last 30 days)", type: "number", placeholder: "e.g. 5" },
        { name: "contentDownloads", label: "Content Downloads", type: "number", placeholder: "e.g. 3" },
      ],
      calculate: (inputs) => {
        const jobTitle = inputs.jobTitleFit as number;
        const companySize = inputs.companySizeFit as number;
        const industry = inputs.industryFit as number;
        const visits = inputs.websiteVisits as number;
        const emails = inputs.emailEngagements as number;
        const downloads = inputs.contentDownloads as number;
        if (!jobTitle || !companySize || !industry) return null;
        const demographicScore = ((jobTitle + companySize + industry) / 30) * 40;
        const visitScore = Math.min(20, (visits || 0) * 1.5);
        const emailScore = Math.min(20, (emails || 0) * 3);
        const downloadScore = Math.min(20, (downloads || 0) * 5);
        const behavioralScore = visitScore + emailScore + downloadScore;
        const totalScore = Math.round(demographicScore + behavioralScore);
        const priority = totalScore >= 80 ? "Hot (SQL)" : totalScore >= 60 ? "Warm (MQL)" : totalScore >= 40 ? "Nurture" : "Cold";
        return {
          primary: { label: "Lead Score", value: `${formatNumber(totalScore, 0)}/100` },
          details: [
            { label: "Demographic Score", value: `${formatNumber(demographicScore, 0)}/40` },
            { label: "Behavioral Score", value: `${formatNumber(behavioralScore, 0)}/60` },
            { label: "Lead Priority", value: priority },
            { label: "Visit Score", value: `${formatNumber(visitScore, 0)}/20` },
            { label: "Engagement Score", value: `${formatNumber(emailScore + downloadScore, 0)}/40` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sales-funnel", "customer-acquisition-cost", "retention-rate"],
  faq: [
    { question: "What is lead scoring?", answer: "Lead scoring is a methodology for ranking prospects based on their perceived value to the organization. It assigns numerical values based on demographic attributes and behavioral signals to prioritize sales efforts." },
    { question: "What is the difference between MQL and SQL?", answer: "A Marketing Qualified Lead (MQL) shows interest through marketing engagement. A Sales Qualified Lead (SQL) has been vetted and is ready for direct sales contact. SQL typically have higher lead scores and buying intent." },
  ],
  formula: "Lead Score = Demographic Score (40%) + Behavioral Score (60%)",
};
