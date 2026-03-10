import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const llmCostComparison: CalculatorDefinition = {
  slug: "llm-cost-comparison",
  title: "ChatGPT vs Claude vs Gemini Cost Comparison",
  description:
    "Compare API costs across OpenAI ChatGPT, Anthropic Claude, and Google Gemini for identical usage. Find the most cost-effective provider for your workload.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "ChatGPT vs Claude",
    "LLM provider comparison",
    "API pricing comparison",
    "Gemini vs GPT",
    "cheapest LLM provider",
  ],
  variants: [
    {
      id: "compare",
      name: "Compare Providers",
      description: "Compare costs for your monthly token usage",
      fields: [
        {
          name: "inputTokens",
          label: "Monthly Input Tokens",
          type: "number",
          placeholder: "e.g. 10000000",
          suffix: "tokens",
        },
        {
          name: "outputTokens",
          label: "Monthly Output Tokens",
          type: "number",
          placeholder: "e.g. 5000000",
          suffix: "tokens",
        },
      ],
      calculate: (inputs) => {
        const inputTokens = parseFloat(inputs.inputTokens as string) || 0;
        const outputTokens = parseFloat(inputs.outputTokens as string) || 0;
        const totalTokens = inputTokens + outputTokens;

        const providers = [
          { name: "GPT-4", in: 0.03, out: 0.06, tier: "Frontier" },
          { name: "GPT-4 Turbo", in: 0.01, out: 0.03, tier: "Advanced" },
          { name: "GPT-3.5 Turbo", in: 0.0005, out: 0.0015, tier: "Budget" },
          { name: "Claude 3 Opus", in: 0.015, out: 0.075, tier: "Frontier" },
          { name: "Claude 3 Sonnet", in: 0.003, out: 0.015, tier: "Advanced" },
          { name: "Claude 3 Haiku", in: 0.00025, out: 0.00125, tier: "Budget" },
          { name: "Gemini 1.5 Pro", in: 0.00175, out: 0.007, tier: "Advanced" },
          { name: "Gemini 1.5 Flash", in: 0.00005, out: 0.00015, tier: "Budget" },
        ];

        let details: { label: string; value: string }[] = [];
        let cheapest = { name: "", cost: Infinity };
        let mostExpensive = { name: "", cost: 0 };

        providers.forEach((p) => {
          const cost = (inputTokens / 1000000) * p.in + (outputTokens / 1000000) * p.out;
          const yearly = cost * 12;
          details.push({
            label: `${p.name} (${p.tier})`,
            value: `$${formatNumber(cost, 2)}/mo ($${formatNumber(yearly, 0)}/yr)`
          });
          if (cost < cheapest.cost) {
            cheapest = { name: p.name, cost };
          }
          if (cost > mostExpensive.cost) {
            mostExpensive = { name: p.name, cost };
          }
        });

        const savings = mostExpensive.cost - cheapest.cost;
        const savingsPercent = (savings / mostExpensive.cost) * 100;

        return {
          primary: {
            label: "Most Cost-Effective",
            value: `${cheapest.name} ($${formatNumber(cheapest.cost, 2)}/mo)`
          },
          details: [
            ...details,
            { label: "Savings vs most expensive", value: `$${formatNumber(savings, 2)}/mo (${formatNumber(savingsPercent, 1)}%)` },
          ],
          note: "Prices updated March 2026. Consider model capabilities, latency, and context window limits beyond cost.",
        };
      },
    },
    {
      id: "breakdown",
      name: "Cost Breakdown",
      description: "Detailed cost analysis for specific provider",
      fields: [
        {
          name: "provider",
          label: "Provider",
          type: "select",
          options: [
            { label: "OpenAI GPT-4", value: "gpt4" },
            { label: "OpenAI GPT-4 Turbo", value: "gpt4t" },
            { label: "Anthropic Claude 3 Opus", value: "opus" },
            { label: "Anthropic Claude 3 Sonnet", value: "sonnet" },
            { label: "Google Gemini Pro", value: "gemini" },
          ],
          defaultValue: "gpt4",
        },
        {
          name: "inputTokens",
          label: "Monthly Input Tokens",
          type: "number",
          placeholder: "e.g. 10000000",
          suffix: "tokens",
        },
        {
          name: "outputTokens",
          label: "Monthly Output Tokens",
          type: "number",
          placeholder: "e.g. 5000000",
          suffix: "tokens",
        },
      ],
      calculate: (inputs) => {
        const provider = inputs.provider as string;
        const inputTokens = parseFloat(inputs.inputTokens as string) || 0;
        const outputTokens = parseFloat(inputs.outputTokens as string) || 0;

        const pricing = {
          gpt4: { name: "GPT-4", input: 0.03, output: 0.06, context: 8192 },
          gpt4t: { name: "GPT-4 Turbo", input: 0.01, output: 0.03, context: 128000 },
          opus: { name: "Claude 3 Opus", input: 0.015, output: 0.075, context: 200000 },
          sonnet: { name: "Claude 3 Sonnet", input: 0.003, output: 0.015, context: 200000 },
          gemini: { name: "Gemini 1.5 Pro", input: 0.00175, output: 0.007, context: 2000000 },
        };

        const p = pricing[provider as keyof typeof pricing] || pricing.gpt4;
        const inputCost = (inputTokens / 1000000) * p.input;
        const outputCost = (outputTokens / 1000000) * p.output;
        const totalCost = inputCost + outputCost;
        const costPerMillionTokens = (totalCost / (inputTokens + outputTokens)) * 1000000;

        return {
          primary: { label: "Monthly Cost", value: `$${formatNumber(totalCost, 2)}` },
          details: [
            { label: "Provider", value: p.name },
            { label: "Input tokens", value: formatNumber(inputTokens) },
            { label: "Output tokens", value: formatNumber(outputTokens) },
            { label: "Total tokens", value: formatNumber(inputTokens + outputTokens) },
            { label: "Input cost", value: `$${formatNumber(inputCost, 4)}` },
            { label: "Output cost", value: `$${formatNumber(outputCost, 4)}` },
            { label: "Cost per 1M tokens", value: `$${formatNumber(costPerMillionTokens, 2)}` },
            { label: "Yearly projection", value: `$${formatNumber(totalCost * 12, 2)}` },
            { label: "Max context window", value: `${formatNumber(p.context)} tokens` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["llm-api-cost-calculator", "ai-token-counter"],
  faq: [
    {
      question: "Which LLM provider is cheapest?",
      answer:
        "For budget-conscious users, Claude Haiku (~$0.00025/$0.00125 per M tokens) and Gemini Flash are cheapest. For advanced use cases with larger contexts, pricing varies. Compare based on your actual usage pattern.",
    },
    {
      question: "Do output tokens really cost more?",
      answer:
        "Yes. Output generation requires more computation than input processing. Providers typically charge 2-5x more for output tokens. This incentivizes efficient prompt engineering.",
    },
    {
      question: "What about batch processing discounts?",
      answer:
        "OpenAI offers 50% discounts for batch API jobs (non-real-time). Other providers may offer volume discounts for high-volume enterprise customers. Contact their sales teams for custom pricing.",
    },
  ],
  formula: "Total Cost = (Input Tokens / 1,000,000) × Input Price + (Output Tokens / 1,000,000) × Output Price",
};
