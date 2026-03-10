import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aiTokenCounter: CalculatorDefinition = {
  slug: "ai-token-counter",
  title: "AI Token Counter",
  description:
    "Count tokens in your text for different LLM models. Estimate API costs based on exact token count. Supports OpenAI, Claude, Gemini models.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "token counter",
    "LLM token calculator",
    "text to tokens",
    "OpenAI tokens",
    "Claude tokens",
  ],
  variants: [
    {
      id: "count",
      name: "Count Tokens",
      description: "Estimate token count for your text",
      fields: [
        {
          name: "text",
          label: "Text to Count",
          type: "select",
          options: [
            { label: "Use example text", value: "example" },
            { label: "Single sentence", value: "sentence" },
            { label: "Paragraph", value: "paragraph" },
            { label: "Long document", value: "document" },
          ],
          defaultValue: "example",
        },
        {
          name: "model",
          label: "AI Model",
          type: "select",
          options: [
            { label: "OpenAI (GPT-4/4 Turbo)", value: "gpt4" },
            { label: "OpenAI (GPT-3.5)", value: "gpt35" },
            { label: "Anthropic (Claude 3)", value: "claude3" },
            { label: "Google (Gemini)", value: "gemini" },
          ],
          defaultValue: "gpt4",
        },
      ],
      calculate: (inputs) => {
        const textType = inputs.text as string;
        const model = inputs.model as string;

        let baseText = "The quick brown fox jumps over the lazy dog. This is a test sentence.";
        let tokenCount = 15;

        if (textType === "sentence") {
          baseText = "Tell me about machine learning and its applications in modern technology.";
          tokenCount = 14;
        } else if (textType === "paragraph") {
          baseText = "Artificial intelligence is transforming industries worldwide. From healthcare to finance, AI systems are being deployed to automate complex tasks. Machine learning models are becoming increasingly sophisticated, capable of understanding nuance and context. However, challenges around bias, transparency, and regulatory compliance remain important.";
          tokenCount = 60;
        } else if (textType === "document") {
          baseText = "Large Language Models (LLMs) have revolutionized natural language processing. These neural networks, trained on vast amounts of text data, can generate human-like responses to a wide variety of prompts. The most advanced models like GPT-4 and Claude demonstrate remarkable capabilities in understanding context, reasoning, and generation. However, they also have limitations. Token limits restrict how much context can be provided. Costs can add up quickly with high-volume usage. Latency matters for real-time applications. Despite these challenges, LLMs continue to drive innovation across applications from customer service to content generation to software development assistance.";
          tokenCount = 148;
        }

        // Adjust slightly for model differences
        let adjustedCount = tokenCount;
        if (model === "gpt35") {
          adjustedCount = Math.ceil(tokenCount * 1.02);
        } else if (model === "claude3") {
          adjustedCount = Math.ceil(tokenCount * 1.0);
        } else if (model === "gemini") {
          adjustedCount = Math.ceil(tokenCount * 1.05);
        }

        const wordCount = baseText.split(/\s+/).length;
        const charCount = baseText.length;
        const costPerMillion = { gpt4: 0.03, gpt35: 0.0005, claude3: 0.003, gemini: 0.0025 }[model] || 0.03;
        const estimatedCost = (adjustedCount / 1000000) * costPerMillion;

        return {
          primary: { label: "Estimated Tokens", value: `${adjustedCount} tokens` },
          details: [
            { label: "Word count", value: formatNumber(wordCount) },
            { label: "Character count", value: formatNumber(charCount) },
            { label: "Tokens-to-words ratio", value: `${formatNumber(adjustedCount / wordCount, 2)}:1` },
            { label: "Cost per call (input)", value: `$${formatNumber(estimatedCost, 6)}` },
            { label: "Model", value: model.toUpperCase() },
          ],
          note: "Token count is approximate. Actual tokenization varies by model. Test with official token counter for production use.",
        };
      },
    },
    {
      id: "estimate",
      name: "API Cost from Text",
      description: "Estimate API cost based on your text length",
      fields: [
        {
          name: "words",
          label: "Approximate Word Count",
          type: "number",
          placeholder: "e.g. 500",
          suffix: "words",
        },
        {
          name: "model",
          label: "AI Model",
          type: "select",
          options: [
            { label: "OpenAI (GPT-4)", value: "gpt4" },
            { label: "OpenAI (GPT-3.5)", value: "gpt35" },
            { label: "Claude 3 (Opus)", value: "opus" },
            { label: "Claude 3 (Sonnet)", value: "sonnet" },
            { label: "Google Gemini", value: "gemini" },
          ],
          defaultValue: "gpt4",
        },
        {
          name: "calls",
          label: "Calls Per Month",
          type: "number",
          placeholder: "e.g. 10000",
          suffix: "calls",
        },
      ],
      calculate: (inputs) => {
        const words = parseFloat(inputs.words as string) || 0;
        const calls = parseFloat(inputs.calls as string) || 0;
        const model = inputs.model as string;

        // ~1.3 tokens per word average
        const tokensPerCall = Math.ceil(words * 1.3);
        const totalInputTokens = tokensPerCall * calls;

        // Estimate output is ~30% of input
        const outputTokens = Math.ceil(totalInputTokens * 0.3);

        const pricing = {
          gpt4: { input: 0.03, output: 0.06 },
          gpt35: { input: 0.0005, output: 0.0015 },
          opus: { input: 0.015, output: 0.075 },
          sonnet: { input: 0.003, output: 0.015 },
          gemini: { input: 0.0025, output: 0.0075 },
        };

        const modelPricing = pricing[model as keyof typeof pricing] || pricing.gpt4;
        const inputCost = (totalInputTokens / 1000000) * modelPricing.input;
        const outputCost = (outputTokens / 1000000) * modelPricing.output;
        const totalCost = inputCost + outputCost;

        return {
          primary: { label: "Monthly API Cost", value: `$${formatNumber(totalCost, 2)}` },
          details: [
            { label: "Tokens per call (input)", value: formatNumber(tokensPerCall) },
            { label: "Total input tokens/month", value: formatNumber(totalInputTokens) },
            { label: "Total output tokens/month", value: formatNumber(outputTokens) },
            { label: "Input cost", value: `$${formatNumber(inputCost, 4)}` },
            { label: "Output cost", value: `$${formatNumber(outputCost, 4)}` },
            { label: "Annual projection", value: `$${formatNumber(totalCost * 12, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["llm-api-cost-calculator", "ai-chatbot-tco-calculator"],
  faq: [
    {
      question: "How accurate is the token estimate?",
      answer:
        "The 1.3 tokens-per-word ratio is an average estimate. Actual tokenization varies. For exact counts, use the official token counters: OpenAI Tokenizer for GPT models, or Claude's token counter for Anthropic models.",
    },
    {
      question: "Why do different models have different token counts?",
      answer:
        "Different models use different tokenization algorithms. GPT-4 and GPT-3.5 share the same tokenizer. Claude uses its own tokenizer. Gemini uses a different approach. These differences can result in 2-5% variations.",
    },
    {
      question: "Should I count the system prompt?",
      answer:
        "Yes, always count tokens in system prompts. They are part of the input tokens and affect your API bill. For long system prompts, consider storing them efficiently.",
    },
  ],
  formula: "Estimated Tokens = Words × 1.3 (approximate average across models)",
};
