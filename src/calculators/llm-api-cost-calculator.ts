import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const llmApiCostCalculator: CalculatorDefinition = {
  slug: "llm-api-cost-calculator",
  title: "LLM API Cost Calculator",
  description:
    "Calculate API costs for OpenAI, Anthropic, Google Gemini, and other LLM providers. Compare token pricing across models and estimate monthly expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "LLM API cost calculator",
    "OpenAI API pricing",
    "Claude API cost",
    "Gemini API pricing",
    "token cost calculator",
  ],
  variants: [
    {
      id: "estimate",
      name: "Estimate API Cost",
      description: "Calculate total cost for your LLM API usage",
      fields: [
        {
          name: "provider",
          label: "LLM Provider",
          type: "select",
          options: [
            { label: "OpenAI (GPT-4)", value: "gpt4" },
            { label: "OpenAI (GPT-4 Turbo)", value: "gpt4turbo" },
            { label: "OpenAI (GPT-3.5)", value: "gpt35" },
            { label: "Anthropic (Claude 3 Opus)", value: "claude3opus" },
            { label: "Anthropic (Claude 3 Sonnet)", value: "claude3sonnet" },
            { label: "Google Gemini (Pro)", value: "geminipro" },
            { label: "Custom Model", value: "custom" },
          ],
          defaultValue: "gpt4",
        },
        {
          name: "inputTokens",
          label: "Input Tokens (Monthly)",
          type: "number",
          placeholder: "e.g. 1000000",
          suffix: "tokens",
        },
        {
          name: "outputTokens",
          label: "Output Tokens (Monthly)",
          type: "number",
          placeholder: "e.g. 500000",
          suffix: "tokens",
        },
        {
          name: "inputPrice",
          label: "Input Price per 1M tokens ($)",
          type: "number",
          placeholder: "e.g. 0.03",
          step: 0.00001,
        },
        {
          name: "outputPrice",
          label: "Output Price per 1M tokens ($)",
          type: "number",
          placeholder: "e.g. 0.06",
          step: 0.00001,
        },
      ],
      calculate: (inputs) => {
        const provider = inputs.provider as string;
        const inputTokens = parseFloat(inputs.inputTokens as string) || 0;
        const outputTokens = parseFloat(inputs.outputTokens as string) || 0;
        let inputPrice = parseFloat(inputs.inputPrice as string) || 0;
        let outputPrice = parseFloat(inputs.outputPrice as string) || 0;

        // Default pricing for selected provider (as of March 2026)
        if (provider === "gpt4") {
          inputPrice = 0.03;
          outputPrice = 0.06;
        } else if (provider === "gpt4turbo") {
          inputPrice = 0.01;
          outputPrice = 0.03;
        } else if (provider === "gpt35") {
          inputPrice = 0.0005;
          outputPrice = 0.0015;
        } else if (provider === "claude3opus") {
          inputPrice = 0.015;
          outputPrice = 0.075;
        } else if (provider === "claude3sonnet") {
          inputPrice = 0.003;
          outputPrice = 0.015;
        } else if (provider === "geminipro") {
          inputPrice = 0.0025;
          outputPrice = 0.0075;
        }

        const inputCost = (inputTokens / 1000000) * inputPrice;
        const outputCost = (outputTokens / 1000000) * outputPrice;
        const totalCost = inputCost + outputCost;
        const costPer1kRequests = (inputTokens + outputTokens) > 0
          ? (totalCost / ((inputTokens + outputTokens) / 1000))
          : 0;

        return {
          primary: { label: "Monthly API Cost", value: `$${formatNumber(totalCost, 2)}` },
          details: [
            { label: "Input tokens cost", value: `$${formatNumber(inputCost, 4)}` },
            { label: "Output tokens cost", value: `$${formatNumber(outputCost, 4)}` },
            { label: "Cost per 1k tokens", value: `$${formatNumber((totalCost / ((inputTokens + outputTokens) / 1000)), 6)}` },
            { label: "Total tokens/month", value: formatNumber(inputTokens + outputTokens) },
            { label: "Yearly cost projection", value: `$${formatNumber(totalCost * 12, 2)}` },
          ],
          note: "Prices are approximate and may vary. Check official API documentation for current rates.",
        };
      },
    },
    {
      id: "compare",
      name: "Compare Providers",
      description: "Compare costs across different LLM providers for same usage",
      fields: [
        {
          name: "inputTokens",
          label: "Monthly Input Tokens",
          type: "number",
          placeholder: "e.g. 1000000",
          suffix: "tokens",
        },
        {
          name: "outputTokens",
          label: "Monthly Output Tokens",
          type: "number",
          placeholder: "e.g. 500000",
          suffix: "tokens",
        },
      ],
      calculate: (inputs) => {
        const inputTokens = parseFloat(inputs.inputTokens as string) || 0;
        const outputTokens = parseFloat(inputs.outputTokens as string) || 0;

        const providers = [
          { name: "GPT-4", input: 0.03, output: 0.06 },
          { name: "GPT-4 Turbo", input: 0.01, output: 0.03 },
          { name: "GPT-3.5", input: 0.0005, output: 0.0015 },
          { name: "Claude 3 Opus", input: 0.015, output: 0.075 },
          { name: "Claude 3 Sonnet", input: 0.003, output: 0.015 },
          { name: "Gemini Pro", input: 0.0025, output: 0.0075 },
        ];

        let details: { label: string; value: string }[] = [];
        let cheapest = { name: "", cost: Infinity };

        providers.forEach((p) => {
          const cost = (inputTokens / 1000000) * p.input + (outputTokens / 1000000) * p.output;
          details.push({ label: p.name, value: `$${formatNumber(cost, 4)}/month` });
          if (cost < cheapest.cost) {
            cheapest = { name: p.name, cost };
          }
        });

        return {
          primary: { label: "Cheapest Provider", value: `${cheapest.name} ($${formatNumber(cheapest.cost, 2)}/mo)` },
          details,
          note: "Prices updated March 2026. Actual rates may vary with volume discounts and API tier.",
        };
      },
    },
  ],
  relatedSlugs: ["ai-token-counter", "ai-image-generation-cost"],
  faq: [
    {
      question: "How are LLM API tokens calculated?",
      answer:
        "Tokens are roughly 4 characters of text. OpenAI estimates ~100 tokens per 75 words. Different providers may tokenize differently, so check their documentation for accuracy.",
    },
    {
      question: "What's the difference between input and output tokens?",
      answer:
        "Input tokens are the prompt you send to the API. Output tokens are the response generated by the model. Output tokens typically cost 2-5x more than input tokens.",
    },
    {
      question: "Are there volume discounts for high usage?",
      answer:
        "Yes, most providers offer volume discounts. OpenAI has tiered pricing for high-volume users. Contact the provider's enterprise sales team for custom rates.",
    },
  ],
  formula: "Total Cost = (Input Tokens / 1,000,000) × Input Price + (Output Tokens / 1,000,000) × Output Price",
};
