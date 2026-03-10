import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const promptEfficiencyCalculator: CalculatorDefinition = {
  slug: "prompt-efficiency-calculator",
  title: "Prompt Efficiency Calculator",
  description:
    "Calculate savings from optimizing prompts and reducing token usage. Estimate cost reduction through better prompt engineering.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "prompt engineering ROI",
    "token optimization",
    "prompt efficiency",
    "API cost reduction",
    "token usage optimization",
  ],
  variants: [
    {
      id: "savings",
      name: "Calculate Savings",
      description: "Estimate savings from prompt optimization",
      fields: [
        {
          name: "currentPromptTokens",
          label: "Current Prompt Tokens (Average)",
          type: "number",
          placeholder: "e.g. 500",
          suffix: "tokens",
        },
        {
          name: "optimizedPromptTokens",
          label: "Optimized Prompt Tokens",
          type: "number",
          placeholder: "e.g. 250",
          suffix: "tokens",
        },
        {
          name: "monthlyRequests",
          label: "Monthly Requests",
          type: "number",
          placeholder: "e.g. 100000",
          suffix: "requests",
        },
      ],
      calculate: (inputs) => {
        const currentPrompt = parseFloat(inputs.currentPromptTokens as string) || 500;
        const optimizedPrompt = parseFloat(inputs.optimizedPromptTokens as string) || 250;
        const monthlyRequests = parseFloat(inputs.monthlyRequests as string) || 100000;

        const tokenSavingsPerRequest = currentPrompt - optimizedPrompt;
        const monthlyTokenSavings = tokenSavingsPerRequest * monthlyRequests;
        const yearlyTokenSavings = monthlyTokenSavings * 12;

        // Cost savings (assuming $0.015 per M tokens average)
        const costPerMillionTokens = 0.015;
        const monthlyCostSavings = (monthlyTokenSavings / 1000000) * costPerMillionTokens;
        const yearlyCostSavings = monthlyCostSavings * 12;

        // Optimization cost (prompt engineering labor)
        const optimizationLaborHours = 20; // 1-2 days
        const laborRate = 100; // $/hour
        const optimizationCost = optimizationLaborHours * laborRate;

        const paybackMonths = optimizationCost / monthlyCostSavings;
        const roi = (yearlyCostSavings - optimizationCost) / optimizationCost;

        return {
          primary: { label: "Annual Savings", value: `$${formatNumber(yearlyCostSavings, 2)}` },
          details: [
            { label: "Current prompt size", value: `${currentPrompt} tokens` },
            { label: "Optimized prompt size", value: `${optimizedPrompt} tokens` },
            { label: "Tokens saved per request", value: formatNumber(tokenSavingsPerRequest) },
            { label: "Monthly token savings", value: formatNumber(monthlyTokenSavings) },
            { label: "Monthly cost savings", value: `$${formatNumber(monthlyCostSavings, 2)}` },
            { label: "Annual cost savings", value: `$${formatNumber(yearlyCostSavings, 2)}` },
            { label: "Optimization labor cost", value: `$${formatNumber(optimizationCost, 2)}` },
            { label: "Break-even period", value: `${formatNumber(paybackMonths, 1)} months` },
            { label: "Year 1 ROI", value: `${formatNumber(roi * 100, 0)}%` },
          ],
          note: "Assumes prompt optimization doesn't impact output quality. Test thoroughly before deploying to production.",
        };
      },
    },
    {
      id: "multiple",
      name: "Optimization Techniques",
      description: "Compare different prompt engineering approaches",
      fields: [
        {
          name: "monthlyRequests",
          label: "Monthly Requests",
          type: "number",
          placeholder: "e.g. 100000",
          suffix: "requests",
        },
        {
          name: "currentCostPerM",
          label: "Current Cost Per 1M Tokens",
          type: "number",
          placeholder: "e.g. 0.015",
          prefix: "$",
        },
      ],
      calculate: (inputs) => {
        const monthlyRequests = parseFloat(inputs.monthlyRequests as string) || 100000;
        const costPerM = parseFloat(inputs.currentCostPerM as string) || 0.015;

        const techniques = [
          { name: "Few-shot examples reduction", reduction: 0.1, labor: 800 },
          { name: "System prompt refinement", reduction: 0.15, labor: 1000 },
          { name: "Few-shot + System prompt", reduction: 0.25, labor: 1500 },
          { name: "Chain-of-thought caching", reduction: 0.2, labor: 2000 },
          { name: "Model downgrade (GPT-3.5 vs GPT-4)", reduction: 0.85, labor: 2000 },
        ];

        let details: { label: string; value: string }[] = [];

        techniques.forEach((t) => {
          const avgPromptSize = 500; // Average
          const reducedSize = avgPromptSize * (1 - t.reduction);
          const monthlySavings = ((avgPromptSize - reducedSize) * monthlyRequests / 1000000) * costPerM;
          const yearlySavings = monthlySavings * 12;
          const roi = ((yearlySavings - t.labor) / t.labor) * 100;

          details.push({
            label: t.name,
            value: `${formatNumber(t.reduction * 100, 0)}% reduction (-$${formatNumber(yearlySavings, 0)}/yr, ROI: ${formatNumber(Math.max(-100, roi), 0)}%)`
          });
        });

        return {
          primary: { label: "Best ROI Optimization", value: "Few-shot examples reduction" },
          details,
          note: "ROI depends on current costs and request volume. Model downgrade has highest savings but biggest quality risk.",
        };
      },
    },
  ],
  relatedSlugs: ["llm-api-cost-calculator", "ai-token-counter"],
  faq: [
    {
      question: "How much can prompt optimization reduce token usage?",
      answer:
        "Typical optimizations save 10-25% of tokens. Aggressive optimization (system prompt + few-shot reduction) can save 30-50%. Model downgrade saves 85%+ but affects quality.",
    },
    {
      question: "What's the easiest optimization to implement?",
      answer:
        "Remove redundant instructions, eliminate example explanations, use structured formats (JSON instead of prose). These typically save 10-15% with minimal effort.",
    },
    {
      question: "Does optimization affect output quality?",
      answer:
        "Usually no with careful optimization. Test with A/B testing on representative samples. Some quality metrics (length, creativity) may change. Validate before production rollout.",
    },
  ],
  formula: "Annual Savings = (Token Reduction × Monthly Requests × 12 × Cost Per Million Tokens) - Optimization Labor Cost",
};
