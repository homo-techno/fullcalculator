import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const llmContextWindowCost: CalculatorDefinition = {
  slug: "llm-context-window-cost",
  title: "LLM Context Window Cost Calculator",
  description:
    "Calculate the cost of using large context windows in LLM models. Compare pricing for long-context models like Claude 200K and GPT-4 Turbo 128K.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "context window cost",
    "long context pricing",
    "Claude 200K cost",
    "GPT-4 Turbo pricing",
    "large context model cost",
  ],
  variants: [
    {
      id: "compare",
      name: "Compare Context Windows",
      description: "Compare cost of different context window sizes",
      fields: [
        {
          name: "contextTokens",
          label: "Context Tokens Used",
          type: "number",
          placeholder: "e.g. 50000",
          suffix: "tokens",
        },
        {
          name: "outputTokens",
          label: "Output Tokens Generated",
          type: "number",
          placeholder: "e.g. 2000",
          suffix: "tokens",
        },
        {
          name: "monthlyRequests",
          label: "Monthly Requests",
          type: "number",
          placeholder: "e.g. 1000",
          suffix: "requests",
        },
      ],
      calculate: (inputs) => {
        const contextTokens = parseFloat(inputs.contextTokens as string) || 50000;
        const outputTokens = parseFloat(inputs.outputTokens as string) || 2000;
        const monthlyRequests = parseFloat(inputs.monthlyRequests as string) || 1000;

        const models = [
          { name: "GPT-4 (8K context)", inPrice: 0.03, outPrice: 0.06, maxContext: 8000 },
          { name: "GPT-4 Turbo (128K)", inPrice: 0.01, outPrice: 0.03, maxContext: 128000 },
          { name: "Claude 3 Opus (200K)", inPrice: 0.015, outPrice: 0.075, maxContext: 200000 },
          { name: "Claude 3 Sonnet (200K)", inPrice: 0.003, outPrice: 0.015, maxContext: 200000 },
          { name: "Gemini 1.5 Pro (2M)", inPrice: 0.00175, outPrice: 0.007, maxContext: 2000000 },
        ];

        let details: { label: string; value: string }[] = [];

        models.forEach((m) => {
          const contextFit = contextTokens <= m.maxContext ? "✓" : "✗";
          const monthlyInput = contextTokens * monthlyRequests;
          const monthlyOutput = outputTokens * monthlyRequests;
          const cost = ((monthlyInput / 1000000) * m.inPrice) + ((monthlyOutput / 1000000) * m.outPrice);

          details.push({
            label: `${m.name} ${contextFit}`,
            value: `$${formatNumber(cost, 2)}/mo ($${formatNumber(cost * 12, 2)}/yr)`
          });
        });

        return {
          primary: { label: "Cost Comparison", value: "See details below" },
          details,
          note: "✓ = Model supports context size, ✗ = Exceeds model limit. Larger contexts essential for document analysis, long conversations, RAG systems.",
        };
      },
    },
    {
      id: "analyze",
      name: "Long Context ROI",
      description: "Analyze whether long context is worth the cost",
      fields: [
        {
          name: "documentPages",
          label: "Average Document Pages",
          type: "number",
          placeholder: "e.g. 50",
          suffix: "pages",
        },
        {
          name: "monthlyRequests",
          label: "Monthly Document Requests",
          type: "number",
          placeholder: "e.g. 1000",
          suffix: "requests",
        },
        {
          name: "apiRequests",
          label: "API Calls Per Document",
          type: "number",
          placeholder: "e.g. 1",
          suffix: "calls",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const pages = parseFloat(inputs.documentPages as string) || 50;
        const monthlyRequests = parseFloat(inputs.monthlyRequests as string) || 1000;
        const apiCallsPerDoc = parseFloat(inputs.apiRequests as string) || 1;

        // Estimate: ~300 tokens per page
        const tokensPerDoc = pages * 300;
        const monthlyTokens = tokensPerDoc * monthlyRequests * apiCallsPerDoc;

        // Short context approach (need to chunk + multiple API calls)
        const shortContextCallsPerDoc = Math.ceil(tokensPerDoc / 8000); // Using 8K models
        const shortContextCost = (monthlyTokens / 1000000) * 0.015 * shortContextCallsPerDoc;

        // Long context approach (one call)
        const longContextCost = (monthlyTokens / 1000000) * 0.015;

        const monthlySavings = shortContextCost - longContextCost;
        const yearlySavings = monthlySavings * 12;

        return {
          primary: { label: "Annual Savings (Long Context)", value: `$${formatNumber(yearlySavings, 2)}` },
          details: [
            { label: "Document size", value: `${pages} pages (~${formatNumber(tokensPerDoc)} tokens)` },
            { label: "Chunking required (8K model)", value: `${shortContextCallsPerDoc} chunks` },
            { label: "Short context approach cost", value: `$${formatNumber(shortContextCost, 2)}/mo` },
            { label: "Long context approach cost", value: `$${formatNumber(longContextCost, 2)}/mo` },
            { label: "Monthly savings", value: `$${formatNumber(monthlySavings, 2)}` },
            { label: "Annual savings", value: `$${formatNumber(yearlySavings, 2)}` },
            { label: "Worth upgrading?", value: yearlySavings > 5000 ? "YES ✓" : "Marginal" },
          ],
          note: "Long context also improves quality (no context loss), which can save on retries and corrections.",
        };
      },
    },
  ],
  relatedSlugs: ["llm-api-cost-calculator", "rag-system-monthly-cost"],
  faq: [
    {
      question: "Is Claude 200K context worth paying more?",
      answer:
        "For document analysis, code reviews, long conversations: YES. You eliminate chunking complexity and potential context loss. For short prompts: NO, use cheaper models. Break-even around 50K+ context per request.",
    },
    {
      question: "What's the practical benefit of 200K vs 8K context?",
      answer:
        "8K model: ~50 pages of context max. 200K: ~500+ pages. For single-document analysis, 200K handles entire documents. For RAG systems, less need for clever chunking. For code, can include entire codebases.",
    },
    {
      question: "How do I calculate if long context is needed?",
      answer:
        "If most requests require > 8K tokens of context OR you're chunking/splitting documents, upgrade to 128K+. Calculate the cost of chunking (extra API calls + dev complexity) vs long-context pricing.",
    },
  ],
  formula: "Cost = (Context Tokens × Monthly Requests × Price Per M) + (Output Tokens × Monthly Requests × Price Per M)",
};
