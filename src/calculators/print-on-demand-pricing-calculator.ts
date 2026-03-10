import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const printOnDemandPricingCalculator: CalculatorDefinition = {
  slug: "print-on-demand-pricing-calculator",
  title: "Print-on-Demand Pricing Calculator",
  description:
    "Calculate optimal pricing for print-on-demand products. Set prices that balance competitiveness and profit margin for POD businesses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "print on demand pricing calculator",
    "POD product pricing guide",
    "how to price POD products",
    "print-on-demand profit margin",
    "POD pricing strategy",
  ],
  variants: [
    {
      id: "pricing",
      name: "Optimal Price Calculator",
      description: "Find the best price for your POD product",
      fields: [
        {
          name: "productionCost",
          label: "Production Cost (from POD provider)",
          type: "number",
          placeholder: "e.g. 12.95",
          prefix: "$",
        },
        {
          name: "platformFee",
          label: "Platform Fee %",
          type: "number",
          placeholder: "e.g. 6.5",
          suffix: "%",
          defaultValue: 6.5,
        },
        {
          name: "targetMargin",
          label: "Target Profit Margin",
          type: "number",
          placeholder: "e.g. 40",
          suffix: "%",
          defaultValue: 40,
        },
        {
          name: "adSpend",
          label: "Ad Spend per Sale (if running ads)",
          type: "number",
          placeholder: "e.g. 3",
          prefix: "$",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const cost = parseFloat(inputs.productionCost as string) || 0;
        const platformFee = parseFloat(inputs.platformFee as string) || 6.5;
        const margin = parseFloat(inputs.targetMargin as string) || 40;
        const adSpend = parseFloat(inputs.adSpend as string) || 0;

        const totalCost = cost + adSpend;
        // Price = TotalCost / (1 - PlatformFee% - TargetMargin%)
        const divisor = 1 - platformFee / 100 - margin / 100;
        const recommendedPrice = divisor > 0 ? totalCost / divisor : 0;
        const actualMargin = recommendedPrice > 0
          ? ((recommendedPrice * (1 - platformFee / 100) - totalCost) / recommendedPrice) * 100
          : 0;

        return {
          primary: { label: "Recommended Price", value: `$${formatNumber(recommendedPrice, 2)}` },
          details: [
            { label: "Production cost", value: `$${formatNumber(cost, 2)}` },
            { label: "Ad spend per sale", value: `$${formatNumber(adSpend, 2)}` },
            { label: "Platform fee", value: `${platformFee}%` },
            { label: "Target margin", value: `${margin}%` },
            { label: "Recommended price", value: `$${formatNumber(recommendedPrice, 2)}` },
            { label: "Profit per sale", value: `$${formatNumber(recommendedPrice * (margin / 100), 2)}` },
            { label: "Break-even price (0% margin)", value: `$${formatNumber(totalCost / (1 - platformFee / 100), 2)}` },
          ],
          note: "Check competitor pricing on your platform. If recommended price exceeds market rate by 20%+, consider a lower-cost POD provider.",
        };
      },
    },
  ],
  relatedSlugs: ["printful-profit-calculator", "etsy-fee-calculator", "redbubble-royalty-calculator"],
  faq: [
    {
      question: "What profit margin should POD products have?",
      answer:
        "Target 30–50% margins for organic sales. If running paid ads, you need 50–70% margins to remain profitable (ads typically cost $3–$10 per sale for POD). Lower margins only work with very high organic traffic.",
    },
    {
      question: "How do I compete on price with POD products?",
      answer:
        "Use lower-cost POD providers (Printify over Printful), focus on designs rather than competing on price, target niches with high willingness-to-pay (dog breeds, sports teams, professions), and sell in bundles.",
    },
    {
      question: "Is print-on-demand worth it in 2025?",
      answer:
        "Yes, but competition is intense. Success requires niching down, consistent new designs (100+ designs minimum), and either strong organic SEO or profitable paid ad campaigns. Average Etsy POD seller earns $200–$800/month.",
    },
  ],
  formula: "Price = (Production Cost + Ad Spend) ÷ (1 − Platform Fee% − Target Margin%)",
};
