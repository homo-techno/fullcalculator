import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aiStartupComputeBudget: CalculatorDefinition = {
  slug: "ai-startup-compute-budget",
  title: "AI Startup Compute Budget Calculator",
  description:
    "Plan monthly infrastructure costs for AI startups. Calculate API costs, GPU hours, storage, and bandwidth for small to mid-scale operations.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "startup compute budget",
    "AI infrastructure cost",
    "MLOps expenses",
    "cloud compute budget",
    "AI operations cost",
  ],
  variants: [
    {
      id: "budget",
      name: "Build Budget",
      description: "Create monthly compute budget for AI startup",
      fields: [
        {
          name: "apiRequests",
          label: "Monthly API Requests",
          type: "number",
          placeholder: "e.g. 1000000",
          suffix: "requests",
        },
        {
          name: "avgTokens",
          label: "Avg Tokens Per Request",
          type: "number",
          placeholder: "e.g. 500",
          suffix: "tokens",
        },
        {
          name: "gpuHours",
          label: "Monthly GPU Hours (Training/Inference)",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "hours",
        },
        {
          name: "storageGb",
          label: "Data Storage Size",
          type: "number",
          placeholder: "e.g. 500",
          suffix: "GB",
        },
        {
          name: "bandwidthGb",
          label: "Monthly Data Transfer",
          type: "number",
          placeholder: "e.g. 1000",
          suffix: "GB",
        },
      ],
      calculate: (inputs) => {
        const apiRequests = parseFloat(inputs.apiRequests as string) || 0;
        const avgTokens = parseFloat(inputs.avgTokens as string) || 0;
        const gpuHours = parseFloat(inputs.gpuHours as string) || 0;
        const storageGb = parseFloat(inputs.storageGb as string) || 0;
        const bandwidthGb = parseFloat(inputs.bandwidthGb as string) || 0;

        // API costs (assuming Claude/GPT-4 mix)
        const totalTokens = apiRequests * avgTokens;
        const apiCost = (totalTokens / 1000000) * 0.015; // ~$0.015 per M tokens average

        // GPU costs (A100 avg)
        const gpuCost = gpuHours * 1.6;

        // Storage costs ($0.023/GB/month for general purpose)
        const storageCost = storageGb * 0.023;

        // Bandwidth costs ($0.09/GB after free tier)
        const bandwidthCost = Math.max(0, bandwidthGb - 100) * 0.09;

        // Miscellaneous (monitoring, logging, databases) - ~20% of other costs
        const miscCost = (apiCost + gpuCost + storageCost + bandwidthCost) * 0.2;

        const totalCost = apiCost + gpuCost + storageCost + bandwidthCost + miscCost;

        return {
          primary: { label: "Monthly Compute Budget", value: `$${formatNumber(totalCost, 2)}` },
          details: [
            { label: "API costs", value: `$${formatNumber(apiCost, 2)}` },
            { label: "GPU compute costs", value: `$${formatNumber(gpuCost, 2)}` },
            { label: "Storage costs", value: `$${formatNumber(storageCost, 2)}` },
            { label: "Bandwidth costs", value: `$${formatNumber(bandwidthCost, 2)}` },
            { label: "Misc (monitoring, etc)", value: `$${formatNumber(miscCost, 2)}` },
            { label: "Annual projection", value: `$${formatNumber(totalCost * 12, 2)}` },
            { label: "Cost per API request", value: `$${formatNumber(totalCost / (apiRequests || 1), 6)}` },
          ],
          note: "Excludes labour, licensing, and software. Assumes on-demand pricing (no reserved instances or volume discounts).",
        };
      },
    },
    {
      id: "compare",
      name: "Compare Architectures",
      description: "Compare costs of different AI infrastructure architectures",
      fields: [
        {
          name: "dailyUsers",
          label: "Daily Active Users",
          type: "number",
          placeholder: "e.g. 10000",
          suffix: "users",
        },
        {
          name: "avgRequestsPerUser",
          label: "Avg Requests Per User Per Day",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "requests",
        },
      ],
      calculate: (inputs) => {
        const dailyUsers = parseFloat(inputs.dailyUsers as string) || 1000;
        const requestsPerUser = parseFloat(inputs.avgRequestsPerUser as string) || 5;
        const monthlyRequests = dailyUsers * requestsPerUser * 30;

        const architectures = [
          { name: "Full API-based", apiCost: monthlyRequests * 500 * 0.00001, gpuCost: 0, totalTokens: monthlyRequests * 500 },
          { name: "Self-hosted (1 A100)", apiCost: 0, gpuCost: 1.6 * 730, totalTokens: monthlyRequests * 500 },
          { name: "Hybrid (API + cache)", apiCost: (monthlyRequests * 500 * 0.00001) * 0.4, gpuCost: 1.6 * 100, totalTokens: monthlyRequests * 500 },
        ];

        let details: { label: string; value: string }[] = [];
        architectures.forEach((a) => {
          const cost = a.apiCost + a.gpuCost;
          details.push({
            label: a.name,
            value: `$${formatNumber(cost, 2)}/mo`
          });
        });

        return {
          primary: {
            label: "Recommended",
            value: architectures[2].name
          },
          details,
          note: "Costs vary based on model selection, caching strategy, and optimization level.",
        };
      },
    },
  ],
  relatedSlugs: ["llm-api-cost-calculator", "gpu-rental-cost-calculator"],
  faq: [
    {
      question: "What's a typical AI startup compute budget?",
      answer:
        "Early stage (MVP): $500-2000/month. Growth stage: $5000-20000/month. Scale: $50000+/month. Varies wildly by use case (chatbot vs image generation vs data pipeline).",
    },
    {
      question: "Should I use APIs or run my own models?",
      answer:
        "APIs are cheaper initially and faster to market (<1M requests/month). Self-hosted becomes cheaper after ~2-5M requests/month depending on model. Consider latency, privacy, and customization needs.",
    },
    {
      question: "How can AI startups reduce costs?",
      answer:
        "Use cheaper models (Claude Haiku vs Opus). Implement caching/memoization. Optimize prompts. Use batching for non-real-time workloads. Negotiate volume discounts. Consider model distillation for smaller, cheaper models.",
    },
  ],
  formula: "Total = API Costs + GPU Compute + Storage + Bandwidth + Miscellaneous",
};
