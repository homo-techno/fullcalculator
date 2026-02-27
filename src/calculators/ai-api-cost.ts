import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aiApiCostCalculator: CalculatorDefinition = {
  slug: "ai-api-cost",
  title: "AI API Cost Estimator",
  description:
    "Estimate the cost of using AI APIs from OpenAI, Anthropic, and Google based on token usage, model selection, and request volume.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "ai api cost",
    "openai pricing",
    "anthropic pricing",
    "google ai pricing",
    "token cost",
    "gpt cost",
    "claude cost",
    "gemini cost",
    "llm api pricing",
  ],
  variants: [
    {
      slug: "ai-api-cost",
      title: "AI API Cost Estimator",
      description:
        "Calculate the cost of AI API calls based on provider, model, and token usage.",
      fields: [
        {
          id: "provider",
          label: "API Provider",
          type: "select",
          options: [
            { label: "OpenAI (GPT-4o)", value: "openai_gpt4o" },
            { label: "OpenAI (GPT-4o Mini)", value: "openai_gpt4o_mini" },
            { label: "Anthropic (Claude Sonnet)", value: "anthropic_sonnet" },
            { label: "Anthropic (Claude Opus)", value: "anthropic_opus" },
            { label: "Google (Gemini Pro)", value: "google_gemini_pro" },
            { label: "Google (Gemini Flash)", value: "google_gemini_flash" },
          ],
          defaultValue: "openai_gpt4o",
        },
        {
          id: "inputTokens",
          label: "Average Input Tokens per Request",
          type: "number",
          defaultValue: 500,
        },
        {
          id: "outputTokens",
          label: "Average Output Tokens per Request",
          type: "number",
          defaultValue: 300,
        },
        {
          id: "requestsPerDay",
          label: "Requests per Day",
          type: "number",
          defaultValue: 1000,
        },
        {
          id: "daysPerMonth",
          label: "Operating Days per Month",
          type: "number",
          defaultValue: 30,
        },
      ],
      calculate(inputs) {
        const provider = inputs.provider as string;
        const inputTokens = parseFloat(inputs.inputTokens as string);
        const outputTokens = parseFloat(inputs.outputTokens as string);
        const requestsPerDay = parseFloat(inputs.requestsPerDay as string);
        const daysPerMonth = parseFloat(inputs.daysPerMonth as string);

        // Pricing per 1M tokens (input / output)
        const pricing: Record<string, { input: number; output: number }> = {
          openai_gpt4o: { input: 2.5, output: 10 },
          openai_gpt4o_mini: { input: 0.15, output: 0.6 },
          anthropic_sonnet: { input: 3, output: 15 },
          anthropic_opus: { input: 15, output: 75 },
          google_gemini_pro: { input: 1.25, output: 5 },
          google_gemini_flash: { input: 0.075, output: 0.3 },
        };

        const rates = pricing[provider] || pricing["openai_gpt4o"];
        const totalRequests = requestsPerDay * daysPerMonth;
        const totalInputTokens = inputTokens * totalRequests;
        const totalOutputTokens = outputTokens * totalRequests;

        const inputCost = (totalInputTokens / 1_000_000) * rates.input;
        const outputCost = (totalOutputTokens / 1_000_000) * rates.output;
        const totalMonthlyCost = inputCost + outputCost;
        const costPerRequest = totalMonthlyCost / totalRequests;

        return {
          "Total Monthly Requests": formatNumber(totalRequests),
          "Total Input Tokens (Monthly)": formatNumber(totalInputTokens),
          "Total Output Tokens (Monthly)": formatNumber(totalOutputTokens),
          "Input Cost": "$" + formatNumber(inputCost),
          "Output Cost": "$" + formatNumber(outputCost),
          "Total Monthly Cost": "$" + formatNumber(totalMonthlyCost),
          "Cost per Request": "$" + formatNumber(costPerRequest),
          "Annual Cost Estimate": "$" + formatNumber(totalMonthlyCost * 12),
        };
      },
    },
    {
      slug: "ai-api-cost-budget",
      title: "AI API Budget Planner",
      description:
        "Plan how many API requests you can make within a given monthly budget.",
      fields: [
        {
          id: "provider",
          label: "API Provider",
          type: "select",
          options: [
            { label: "OpenAI (GPT-4o)", value: "openai_gpt4o" },
            { label: "OpenAI (GPT-4o Mini)", value: "openai_gpt4o_mini" },
            { label: "Anthropic (Claude Sonnet)", value: "anthropic_sonnet" },
            { label: "Anthropic (Claude Opus)", value: "anthropic_opus" },
            { label: "Google (Gemini Pro)", value: "google_gemini_pro" },
          ],
          defaultValue: "openai_gpt4o",
        },
        {
          id: "monthlyBudget",
          label: "Monthly Budget ($)",
          type: "number",
          defaultValue: 500,
        },
        {
          id: "avgInputTokens",
          label: "Average Input Tokens per Request",
          type: "number",
          defaultValue: 500,
        },
        {
          id: "avgOutputTokens",
          label: "Average Output Tokens per Request",
          type: "number",
          defaultValue: 300,
        },
      ],
      calculate(inputs) {
        const provider = inputs.provider as string;
        const monthlyBudget = parseFloat(inputs.monthlyBudget as string);
        const avgInputTokens = parseFloat(inputs.avgInputTokens as string);
        const avgOutputTokens = parseFloat(inputs.avgOutputTokens as string);

        const pricing: Record<string, { input: number; output: number }> = {
          openai_gpt4o: { input: 2.5, output: 10 },
          openai_gpt4o_mini: { input: 0.15, output: 0.6 },
          anthropic_sonnet: { input: 3, output: 15 },
          anthropic_opus: { input: 15, output: 75 },
          google_gemini_pro: { input: 1.25, output: 5 },
        };

        const rates = pricing[provider] || pricing["openai_gpt4o"];
        const costPerRequest =
          (avgInputTokens / 1_000_000) * rates.input +
          (avgOutputTokens / 1_000_000) * rates.output;
        const maxRequests = monthlyBudget / costPerRequest;
        const requestsPerDay = maxRequests / 30;

        return {
          "Cost per Request": "$" + formatNumber(costPerRequest),
          "Max Monthly Requests": formatNumber(Math.floor(maxRequests)),
          "Max Requests per Day": formatNumber(Math.floor(requestsPerDay)),
          "Max Requests per Hour": formatNumber(
            Math.floor(requestsPerDay / 24)
          ),
          "Monthly Budget": "$" + formatNumber(monthlyBudget),
        };
      },
    },
  ],
  relatedSlugs: [
    "llm-token-calculator",
    "ai-image-cost",
    "ai-training-cost",
    "cloud-hosting-cost",
  ],
  faq: [
    {
      question: "How are AI API costs calculated?",
      answer:
        "AI API costs are calculated based on the number of tokens processed. Each provider charges separately for input tokens (your prompt) and output tokens (the AI response). Prices vary significantly between models, with more capable models costing more per token.",
    },
    {
      question: "What is the cheapest AI API provider?",
      answer:
        "Pricing varies by model tier. For budget use cases, OpenAI GPT-4o Mini and Google Gemini Flash offer the lowest per-token rates. For high-capability models, pricing is competitive across OpenAI, Anthropic, and Google, each offering different strengths.",
    },
    {
      question: "How can I reduce AI API costs?",
      answer:
        "You can reduce costs by using smaller models for simpler tasks, caching frequent responses, optimizing prompt length, batching requests, and implementing token limits on outputs. Many providers also offer volume discounts.",
    },
  ],
  formula:
    "Monthly Cost = (Total Input Tokens / 1,000,000) x Input Rate + (Total Output Tokens / 1,000,000) x Output Rate. Total Tokens = Tokens per Request x Requests per Day x Days per Month.",
};
