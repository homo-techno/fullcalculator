import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const patreonIncomeCalculator: CalculatorDefinition = {
  slug: "patreon-income",
  title: "Patreon Income Estimator",
  description:
    "Estimate your Patreon income after platform fees, payment processing fees, and calculate earnings across different tier structures.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "patreon income",
    "patreon earnings",
    "patreon calculator",
    "patreon fees",
    "patreon revenue",
    "membership income",
    "patron earnings",
  ],
  variants: [
    {
      slug: "patreon-income",
      title: "Patreon Income After Fees",
      description:
        "Calculate your actual take-home income from Patreon after all fees.",
      fields: [
        {
          id: "totalPatrons",
          label: "Total Patrons",
          type: "number",
          defaultValue: 500,
        },
        {
          id: "avgPledge",
          label: "Average Pledge Amount ($)",
          type: "number",
          defaultValue: 7,
        },
        {
          id: "planType",
          label: "Patreon Plan",
          type: "select",
          options: [
            { label: "Lite (5% platform fee)", value: "lite" },
            { label: "Pro (8% platform fee)", value: "pro" },
            { label: "Premium (12% platform fee)", value: "premium" },
          ],
          defaultValue: "pro",
        },
        {
          id: "paymentProcessingRate",
          label: "Payment Processing Fee (%)",
          type: "number",
          defaultValue: 2.9,
        },
        {
          id: "paymentFixedFee",
          label: "Fixed Fee per Transaction ($)",
          type: "number",
          defaultValue: 0.3,
        },
      ],
      calculate(inputs) {
        const totalPatrons = parseFloat(inputs.totalPatrons as string);
        const avgPledge = parseFloat(inputs.avgPledge as string);
        const planType = inputs.planType as string;
        const paymentProcessingRate =
          parseFloat(inputs.paymentProcessingRate as string) / 100;
        const paymentFixedFee = parseFloat(inputs.paymentFixedFee as string);

        const platformFee: Record<string, number> = {
          lite: 0.05,
          pro: 0.08,
          premium: 0.12,
        };

        const grossRevenue = totalPatrons * avgPledge;
        const platformCut = grossRevenue * (platformFee[planType] || 0.08);
        const processingFees =
          grossRevenue * paymentProcessingRate +
          totalPatrons * paymentFixedFee;
        const totalFees = platformCut + processingFees;
        const netIncome = grossRevenue - totalFees;
        const feePercentage = (totalFees / grossRevenue) * 100;

        return {
          "Gross Monthly Revenue": "$" + formatNumber(grossRevenue),
          "Platform Fee": "$" + formatNumber(platformCut),
          "Payment Processing Fees": "$" + formatNumber(processingFees),
          "Total Fees": "$" + formatNumber(totalFees),
          "Net Monthly Income": "$" + formatNumber(netIncome),
          "Net Annual Income": "$" + formatNumber(netIncome * 12),
          "Effective Fee Rate": formatNumber(feePercentage) + "%",
          "Net per Patron": "$" + formatNumber(netIncome / totalPatrons),
        };
      },
    },
    {
      slug: "patreon-tier-planner",
      title: "Patreon Tier Revenue Planner",
      description:
        "Plan your Patreon tier structure and estimate total revenue.",
      fields: [
        {
          id: "tier1Patrons",
          label: "Tier 1 Patrons ($3/mo)",
          type: "number",
          defaultValue: 300,
        },
        {
          id: "tier2Patrons",
          label: "Tier 2 Patrons ($10/mo)",
          type: "number",
          defaultValue: 150,
        },
        {
          id: "tier3Patrons",
          label: "Tier 3 Patrons ($25/mo)",
          type: "number",
          defaultValue: 50,
        },
        {
          id: "planType",
          label: "Patreon Plan",
          type: "select",
          options: [
            { label: "Lite (5% fee)", value: "lite" },
            { label: "Pro (8% fee)", value: "pro" },
            { label: "Premium (12% fee)", value: "premium" },
          ],
          defaultValue: "pro",
        },
      ],
      calculate(inputs) {
        const tier1 = parseFloat(inputs.tier1Patrons as string);
        const tier2 = parseFloat(inputs.tier2Patrons as string);
        const tier3 = parseFloat(inputs.tier3Patrons as string);
        const planType = inputs.planType as string;

        const feeRate: Record<string, number> = {
          lite: 0.05,
          pro: 0.08,
          premium: 0.12,
        };

        const tier1Revenue = tier1 * 3;
        const tier2Revenue = tier2 * 10;
        const tier3Revenue = tier3 * 25;
        const grossTotal = tier1Revenue + tier2Revenue + tier3Revenue;
        const totalPatrons = tier1 + tier2 + tier3;

        const platformFee = grossTotal * (feeRate[planType] || 0.08);
        const processingFee = grossTotal * 0.029 + totalPatrons * 0.3;
        const netRevenue = grossTotal - platformFee - processingFee;

        return {
          "Tier 1 Revenue ($3)": "$" + formatNumber(tier1Revenue),
          "Tier 2 Revenue ($10)": "$" + formatNumber(tier2Revenue),
          "Tier 3 Revenue ($25)": "$" + formatNumber(tier3Revenue),
          "Gross Monthly Revenue": "$" + formatNumber(grossTotal),
          "Total Fees": "$" + formatNumber(platformFee + processingFee),
          "Net Monthly Income": "$" + formatNumber(netRevenue),
          "Total Patrons": formatNumber(totalPatrons),
          "Average Pledge": "$" + formatNumber(grossTotal / totalPatrons),
        };
      },
    },
  ],
  relatedSlugs: [
    "youtube-revenue",
    "newsletter-revenue",
    "sponsorship-rate",
    "course-pricing",
  ],
  faq: [
    {
      question: "How much does Patreon take from creators?",
      answer:
        "Patreon charges a platform fee (5% for Lite, 8% for Pro, 12% for Premium) plus payment processing fees (typically 2.9% + $0.30 per transaction). Total fees usually range from 8-16% of gross revenue depending on your plan and average pledge size.",
    },
    {
      question: "What is a good average pledge on Patreon?",
      answer:
        "The average Patreon pledge is around $7-$12 per month. Higher-value pledges ($10+) are common for creators offering substantial exclusive content. The key is offering clear value at each tier to encourage upgrades.",
    },
  ],
  formula:
    "Net Income = Gross Revenue - Platform Fee - Processing Fees. Platform Fee = Gross Revenue x Plan Rate. Processing Fees = (Gross Revenue x 2.9%) + (Patrons x $0.30).",
};
