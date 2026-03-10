import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aiSaasPricingModel: CalculatorDefinition = {
  slug: "ai-saas-pricing-model",
  title: "AI SaaS Pricing Model Calculator",
  description:
    "Design pricing tiers for AI SaaS products. Calculate prices that cover LLM costs while maintaining healthy margins. Test different pricing strategies.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "SaaS pricing strategy",
    "AI product pricing",
    "token-based pricing",
    "subscription pricing",
    "pricing model design",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate Pricing Tiers",
      description: "Design pricing based on usage and costs",
      fields: [
        {
          name: "costPerMTokens",
          label: "Your LLM Cost (per 1M tokens)",
          type: "number",
          placeholder: "e.g. 0.015",
          prefix: "$",
        },
        {
          name: "targetMargin",
          label: "Target Gross Margin",
          type: "number",
          placeholder: "e.g. 70",
          suffix: "%",
          min: 30,
          max: 90,
        },
        {
          name: "monthlyTokensTier",
          label: "Monthly Tokens Per Tier",
          type: "number",
          placeholder: "e.g. 1000000",
          suffix: "tokens",
        },
      ],
      calculate: (inputs) => {
        const costPerM = parseFloat(inputs.costPerMTokens as string) || 0.015;
        const targetMargin = parseFloat(inputs.targetMargin as string) || 70;
        const monthlyTokens = parseFloat(inputs.monthlyTokensTier as string) || 1000000;

        // Calculate cost per tier
        const tierCost = (monthlyTokens / 1000000) * costPerM;

        // Calculate minimum price to hit margin
        // Price = Cost / (1 - Margin%)
        const minPrice = tierCost / (1 - targetMargin / 100);

        // Create pricing tiers with markup
        const tiers = [
          { name: "Starter", tokens: monthlyTokens * 0.5, multiplier: 1.5 },
          { name: "Professional", tokens: monthlyTokens * 2, multiplier: 1.3 },
          { name: "Enterprise", tokens: monthlyTokens * 10, multiplier: 1.15 },
        ];

        let details: { label: string; value: string }[] = [];
        details.push({ label: "Your LLM cost per 1M tokens", value: `$${costPerM}` });
        details.push({ label: "Target gross margin", value: `${targetMargin}%` });
        details.push({ label: "", value: "---" });

        tiers.forEach((t, idx) => {
          const cost = (t.tokens / 1000000) * costPerM;
          const price = cost * t.multiplier;
          const actualMargin = ((price - cost) / price) * 100;

          details.push({
            label: `${t.name}: ${formatNumber(t.tokens / 1000000, 1)}M tokens`,
            value: `$${formatNumber(price, 2)}/mo (margin: ${formatNumber(actualMargin, 0)}%)`
          });
        });

        return {
          primary: { label: "Recommended Base Price (70% margin)", value: `$${formatNumber(minPrice, 2)}/1M tokens` },
          details,
          note: "Adjust multipliers based on market positioning. Premium positioning: 2-3x markup. Budget: 1.2x markup.",
        };
      },
    },
    {
      id: "compare",
      name: "Pricing Strategy Comparison",
      description: "Compare token-based vs subscription pricing",
      fields: [
        {
          name: "expectedMonthlyTokens",
          label: "Expected Monthly Tokens (Customer)",
          type: "number",
          placeholder: "e.g. 5000000",
          suffix: "tokens",
        },
        {
          name: "costPerMTokens",
          label: "Your LLM Cost per 1M",
          type: "number",
          placeholder: "e.g. 0.015",
          prefix: "$",
        },
      ],
      calculate: (inputs) => {
        const customerTokens = parseFloat(inputs.expectedMonthlyTokens as string) || 5000000;
        const costPerM = parseFloat(inputs.costPerMTokens as string) || 0.015;

        const baseCost = (customerTokens / 1000000) * costPerM;

        // Pricing strategies
        const strategies = [
          {
            name: "Token-based ($0.02 per 1M)",
            customerPrice: (customerTokens / 1000000) * 0.02,
            profit: (customerTokens / 1000000) * 0.02 - baseCost,
          },
          {
            name: "Fixed subscription ($99/month)",
            customerPrice: 99,
            profit: 99 - baseCost,
          },
          {
            name: "Hybrid (tiered + fixed)",
            customerPrice: 49 + (customerTokens / 1000000) * 0.01,
            profit: (49 + (customerTokens / 1000000) * 0.01) - baseCost,
          },
          {
            name: "Usage-based with cap ($199/month max)",
            customerPrice: Math.min((customerTokens / 1000000) * 0.025, 199),
            profit: Math.min((customerTokens / 1000000) * 0.025, 199) - baseCost,
          },
        ];

        let details: { label: string; value: string }[] = [];
        let bestStrategy = strategies[0];

        strategies.forEach((s) => {
          const margin = (s.profit / s.customerPrice) * 100;
          details.push({
            label: s.name,
            value: `Price: $${formatNumber(s.customerPrice, 2)}/mo | Profit: $${formatNumber(s.profit, 2)} (margin: ${formatNumber(Math.max(0, margin), 0)}%)`
          });

          if (s.profit > bestStrategy.profit) {
            bestStrategy = s;
          }
        });

        return {
          primary: {
            label: "Best Strategy for This Customer",
            value: bestStrategy.name
          },
          details,
          note: "Choose based on customer segment: price-sensitive → token-based, predictable budget → fixed, flexibility → hybrid.",
        };
      },
    },
  ],
  relatedSlugs: ["llm-api-cost-calculator", "ai-startup-compute-budget"],
  faq: [
    {
      question: "Should I use token-based or subscription pricing?",
      answer:
        "Token-based: Good if usage varies widely (chatbots, search). Subscription: Good if usage is predictable (writing assistants, coding helpers). Hybrid: Best of both worlds.",
    },
    {
      question: "What's a healthy SaaS gross margin for AI products?",
      answer:
        "Target 60-75% gross margin. This covers sales, support, infra, R&D. Below 60%: unsustainable. Above 80%: possibly underpricing. Balance profitability with market competitiveness.",
    },
    {
      question: "How do I handle variable costs with fixed pricing?",
      answer:
        "Set pricing based on 80th percentile usage (assume worst case). Add safeguards: monthly token limits, rate throttling, or pay-as-you-go overages. Monitor and adjust quarterly.",
    },
  ],
  formula: "Price = Cost / (1 - Target Margin %) or Price = Fixed Subscription + (Token Usage × Price Per Token)",
};
