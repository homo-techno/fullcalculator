import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const llmTokenCalculator: CalculatorDefinition = {
  slug: "llm-token-calculator",
  title: "LLM Token Count & Cost Calculator",
  description:
    "Calculate the number of tokens in your text and estimate costs across different LLM providers and models.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "llm tokens",
    "token counter",
    "token cost",
    "gpt tokens",
    "claude tokens",
    "tokenizer",
    "word to token",
    "ai pricing",
  ],
  variants: [
    {
      slug: "llm-token-calculator",
      title: "LLM Token Count & Cost Calculator",
      description:
        "Estimate token counts from word count and calculate costs for different LLM models.",
      fields: [
        {
          id: "wordCount",
          label: "Word Count",
          type: "number",
          defaultValue: 1000,
        },
        {
          id: "model",
          label: "LLM Model",
          type: "select",
          options: [
            { label: "GPT-4o", value: "gpt4o" },
            { label: "GPT-4o Mini", value: "gpt4o_mini" },
            { label: "Claude Sonnet", value: "claude_sonnet" },
            { label: "Claude Opus", value: "claude_opus" },
            { label: "Gemini Pro", value: "gemini_pro" },
          ],
          defaultValue: "gpt4o",
        },
        {
          id: "direction",
          label: "Token Direction",
          type: "select",
          options: [
            { label: "Input Tokens", value: "input" },
            { label: "Output Tokens", value: "output" },
          ],
          defaultValue: "input",
        },
        {
          id: "numberOfCalls",
          label: "Number of API Calls",
          type: "number",
          defaultValue: 100,
        },
      ],
      calculate(inputs) {
        const wordCount = parseFloat(inputs.wordCount as string);
        const model = inputs.model as string;
        const direction = inputs.direction as string;
        const numberOfCalls = parseFloat(inputs.numberOfCalls as string);

        // Approximate: 1 word ~ 1.33 tokens for English text
        const tokensPerWord = 1.33;
        const estimatedTokens = Math.ceil(wordCount * tokensPerWord);

        const pricing: Record<string, { input: number; output: number }> = {
          gpt4o: { input: 2.5, output: 10 },
          gpt4o_mini: { input: 0.15, output: 0.6 },
          claude_sonnet: { input: 3, output: 15 },
          claude_opus: { input: 15, output: 75 },
          gemini_pro: { input: 1.25, output: 5 },
        };

        const rates = pricing[model] || pricing["gpt4o"];
        const ratePerMillion =
          direction === "input" ? rates.input : rates.output;
        const costPerCall = (estimatedTokens / 1_000_000) * ratePerMillion;
        const totalCost = costPerCall * numberOfCalls;

        return {
          "Estimated Tokens": formatNumber(estimatedTokens),
          "Tokens per Word Ratio": formatNumber(tokensPerWord),
          "Rate per 1M Tokens": "$" + formatNumber(ratePerMillion),
          "Cost per Call": "$" + formatNumber(costPerCall),
          "Total Cost (All Calls)": "$" + formatNumber(totalCost),
          "Total Tokens (All Calls)": formatNumber(
            estimatedTokens * numberOfCalls
          ),
          Characters: formatNumber(wordCount * 5),
        };
      },
    },
    {
      slug: "llm-token-batch-cost",
      title: "Batch Processing Token Cost",
      description:
        "Calculate costs for processing large batches of documents through an LLM.",
      fields: [
        {
          id: "numberOfDocuments",
          label: "Number of Documents",
          type: "number",
          defaultValue: 500,
        },
        {
          id: "avgWordsPerDoc",
          label: "Average Words per Document",
          type: "number",
          defaultValue: 2000,
        },
        {
          id: "avgResponseWords",
          label: "Average Response Words",
          type: "number",
          defaultValue: 500,
        },
        {
          id: "model",
          label: "LLM Model",
          type: "select",
          options: [
            { label: "GPT-4o", value: "gpt4o" },
            { label: "GPT-4o Mini", value: "gpt4o_mini" },
            { label: "Claude Sonnet", value: "claude_sonnet" },
            { label: "Claude Opus", value: "claude_opus" },
          ],
          defaultValue: "gpt4o_mini",
        },
      ],
      calculate(inputs) {
        const numberOfDocuments = parseFloat(
          inputs.numberOfDocuments as string
        );
        const avgWordsPerDoc = parseFloat(inputs.avgWordsPerDoc as string);
        const avgResponseWords = parseFloat(inputs.avgResponseWords as string);
        const model = inputs.model as string;

        const tokensPerWord = 1.33;
        const inputTokensPerDoc = Math.ceil(avgWordsPerDoc * tokensPerWord);
        const outputTokensPerDoc = Math.ceil(avgResponseWords * tokensPerWord);

        const pricing: Record<string, { input: number; output: number }> = {
          gpt4o: { input: 2.5, output: 10 },
          gpt4o_mini: { input: 0.15, output: 0.6 },
          claude_sonnet: { input: 3, output: 15 },
          claude_opus: { input: 15, output: 75 },
        };

        const rates = pricing[model] || pricing["gpt4o_mini"];
        const totalInputTokens = inputTokensPerDoc * numberOfDocuments;
        const totalOutputTokens = outputTokensPerDoc * numberOfDocuments;
        const inputCost = (totalInputTokens / 1_000_000) * rates.input;
        const outputCost = (totalOutputTokens / 1_000_000) * rates.output;
        const totalCost = inputCost + outputCost;

        return {
          "Input Tokens per Doc": formatNumber(inputTokensPerDoc),
          "Output Tokens per Doc": formatNumber(outputTokensPerDoc),
          "Total Input Tokens": formatNumber(totalInputTokens),
          "Total Output Tokens": formatNumber(totalOutputTokens),
          "Input Cost": "$" + formatNumber(inputCost),
          "Output Cost": "$" + formatNumber(outputCost),
          "Total Batch Cost": "$" + formatNumber(totalCost),
          "Cost per Document": "$" + formatNumber(totalCost / numberOfDocuments),
        };
      },
    },
  ],
  relatedSlugs: [
    "ai-api-cost",
    "ai-image-cost",
    "ai-training-cost",
    "cloud-hosting-cost",
  ],
  faq: [
    {
      question: "How many tokens are in a word?",
      answer:
        "On average, one English word is approximately 1.33 tokens. This ratio varies by language and content type. Technical text or code may have different ratios. Most tokenizers split words into subword pieces.",
    },
    {
      question:
        "Why do input and output tokens have different prices?",
      answer:
        "Output tokens cost more because generating text requires more computational resources than processing input. The model must perform sequential inference for each output token, while input tokens can be processed in parallel.",
    },
  ],
  formula:
    "Estimated Tokens = Word Count x 1.33. Cost = (Tokens / 1,000,000) x Rate per Million Tokens. Total Cost = Cost per Call x Number of Calls.",
};
