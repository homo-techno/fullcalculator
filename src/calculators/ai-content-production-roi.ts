import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aiContentProductionRoi: CalculatorDefinition = {
  slug: "ai-content-production-roi",
  title: "AI Content Production ROI Calculator",
  description:
    "Calculate return on investment for using AI tools for content creation. Compare AI-generated content costs vs human writers, editors, and designers.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "content creation ROI",
    "AI writing tools cost",
    "content production cost",
    "AI copywriting ROI",
    "content automation savings",
  ],
  variants: [
    {
      id: "production",
      name: "AI vs Human Content",
      description: "Compare AI content production to hiring writers",
      fields: [
        {
          name: "articlesPerMonth",
          label: "Articles Per Month",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "articles",
        },
        {
          name: "articleLength",
          label: "Average Article Length",
          type: "number",
          placeholder: "e.g. 2000",
          suffix: "words",
        },
        {
          name: "writerRate",
          label: "Freelance Writer Rate",
          type: "number",
          placeholder: "e.g. 0.10",
          prefix: "$",
          suffix: "/word",
        },
        {
          name: "editorRate",
          label: "Editor Rate",
          type: "number",
          placeholder: "e.g. 50",
          prefix: "$",
          suffix: "/hour",
        },
      ],
      calculate: (inputs) => {
        const articlesPerMonth = parseFloat(inputs.articlesPerMonth as string) || 20;
        const articleLength = parseFloat(inputs.articleLength as string) || 2000;
        const writerRate = parseFloat(inputs.writerRate as string) || 0.10;
        const editorRate = parseFloat(inputs.editorRate as string) || 50;

        // Human content production costs
        const writerCostPerArticle = articleLength * writerRate;
        const totalWritingCost = writerCostPerArticle * articlesPerMonth;

        // Editing: ~2 hours per 2000 words
        const editorHoursPerArticle = (articleLength / 2000) * 2;
        const editorCostPerArticle = editorHoursPerArticle * editorRate;
        const totalEditorCost = editorCostPerArticle * articlesPerMonth;

        const humanMonthlyTotal = totalWritingCost + totalEditorCost;
        const humanYearlyTotal = humanMonthlyTotal * 12;

        // AI content production costs
        // Assumption: Claude API 3 Sonnet at ~$0.003 per M tokens
        // 2000 words ≈ 2600 tokens
        const tokensPerArticle = articleLength * 1.3;
        const apiCostPerArticle = (tokensPerArticle / 1000000) * 0.003;
        const aiMonthlyApiCost = apiCostPerArticle * articlesPerMonth;

        // AI editing tool cost (Grammarly, etc) + human review
        const aiToolCost = 50; // Tool subscription
        const humanReviewHours = editorHoursPerArticle * 0.5; // 50% less editing needed
        const humanReviewCost = humanReviewHours * editorRate * articlesPerMonth;

        const aiMonthlyTotal = aiMonthlyApiCost + aiToolCost + humanReviewCost;
        const aiYearlyTotal = aiMonthlyTotal * 12;

        // ROI
        const monthlySavings = humanMonthlyTotal - aiMonthlyTotal;
        const yearlySavings = humanYearlyTotal - aiYearlyTotal;
        const roi = (yearlySavings / (10000 + aiYearlyTotal)) * 100; // +$10k setup

        return {
          primary: { label: "Annual Savings", value: `$${formatNumber(yearlySavings, 2)}` },
          details: [
            { label: "Human writing cost/article", value: `$${formatNumber(writerCostPerArticle, 2)}` },
            { label: "Human editing cost/article", value: `$${formatNumber(editorCostPerArticle, 2)}` },
            { label: "Human total/month", value: `$${formatNumber(humanMonthlyTotal, 2)}` },
            { label: "", value: "---" },
            { label: "AI API cost/article", value: `$${formatNumber(apiCostPerArticle, 4)}` },
            { label: "AI tool subscription", value: `$${formatNumber(aiToolCost, 2)}/mo` },
            { label: "Human review cost/month", value: `$${formatNumber(humanReviewCost, 2)}` },
            { label: "AI total/month", value: `$${formatNumber(aiMonthlyTotal, 2)}` },
            { label: "", value: "---" },
            { label: "Monthly savings", value: `$${formatNumber(monthlySavings, 2)}` },
            { label: "Annual savings", value: `$${formatNumber(yearlySavings, 2)}` },
            { label: "ROI (Year 1)", value: `${formatNumber(Math.max(-100, roi), 0)}%` },
          ],
          note: "AI content still needs human review for quality/brand fit. Best for bulk, commodity content (listicles, guides, FAQs).",
        };
      },
    },
    {
      id: "scale",
      name: "Scale-Based Analysis",
      description: "See how ROI improves with content volume",
      fields: [
        {
          name: "articlesPerMonth",
          label: "Articles Per Month",
          type: "number",
          placeholder: "e.g. 50",
          suffix: "articles",
        },
      ],
      calculate: (inputs) => {
        const articlesPerMonth = parseFloat(inputs.articlesPerMonth as string) || 50;

        // Assumed costs
        const writerCostPerArticle = 400; // 2000 words at $0.20/word avg
        const editorCostPerArticle = 100; // ~2 hours at $50/hr
        const humanCostPerArticle = writerCostPerArticle + editorCostPerArticle;

        const aiApiCostPerArticle = 0.10; // Rough estimate
        const aiToolCost = 50;
        const aiReviewCostPerArticle = 25;

        // Different article volumes
        const volumes = [10, 20, 50, 100, 200];
        let details: { label: string; value: string }[] = [];

        volumes.forEach((vol) => {
          const humanMonthly = vol * humanCostPerArticle;
          const aiMonthly = (vol * (aiApiCostPerArticle + aiReviewCostPerArticle)) + aiToolCost;
          const savings = humanMonthly - aiMonthly;
          const roi = (savings * 12 / 15000) * 100; // Assuming $15k setup

          details.push({
            label: `${vol} articles/month`,
            value: `Human: $${formatNumber(humanMonthly, 0)}/mo | AI: $${formatNumber(aiMonthly, 0)}/mo | Savings: $${formatNumber(savings, 0)}/mo`
          });
        });

        return {
          primary: { label: "ROI Improves With Scale", value: "See volume breakdown" },
          details,
          note: "At 200+ articles/month, AI costs become negligible. ROI becomes 800%+. Content quality critical at scale.",
        };
      },
    },
  ],
  relatedSlugs: ["ai-vs-human-labor-cost", "llm-api-cost-calculator"],
  faq: [
    {
      question: "When is AI content cheaper than hiring writers?",
      answer:
        "Always, for volume production. Single article: AI = $1-5 vs human = $400-1000. Key: AI works for commodity content (listicles, how-tos, FAQs), not original/branded content.",
    },
    {
      question: "Does AI content quality matter for SEO?",
      answer:
        "Increasingly yes. Google favors E-E-A-T (Experience, Expertise, Authority, Trustworthiness). AI-only content ranks poorly unless well-reviewed by human experts. Hybrid approach (AI draft + expert review) works best.",
    },
    {
      question: "What content should NOT be AI-generated?",
      answer:
        "Avoid: opinion pieces, brand voice/storytelling, highly technical content, anything with liability/legal risk, creative fiction. AI works for: research summaries, educational basics, data compilations, multilingual content.",
    },
  ],
  formula: "Annual Savings = (Human Cost Per Article - AI Cost Per Article) × Articles Per Month × 12",
};
