import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const realEstateCommissionCalculator: CalculatorDefinition = {
  slug: "real-estate-commission-calculator",
  title: "Real Estate Commission Calculator",
  description:
    "Free real estate commission calculator. Calculate agent commissions, net proceeds from sale, and compare different commission structures.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "real estate commission calculator",
    "realtor commission",
    "agent commission calculator",
    "seller net proceeds",
    "real estate fees",
  ],
  variants: [
    {
      id: "standard",
      name: "Standard Commission",
      description: "Calculate real estate agent commission and net proceeds",
      fields: [
        {
          name: "salePrice",
          label: "Sale Price",
          type: "number",
          placeholder: "e.g. 400000",
          prefix: "$",
          min: 0,
        },
        {
          name: "commissionRate",
          label: "Total Commission Rate",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          min: 0,
          max: 20,
          step: 0.1,
          defaultValue: 5,
        },
        {
          name: "listingAgentSplit",
          label: "Listing Agent Split",
          type: "number",
          placeholder: "e.g. 50",
          suffix: "%",
          min: 0,
          max: 100,
          step: 1,
          defaultValue: 50,
        },
        {
          name: "mortgageBalance",
          label: "Remaining Mortgage Balance",
          type: "number",
          placeholder: "e.g. 250000",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const salePrice = inputs.salePrice as number;
        const commissionRate = (inputs.commissionRate as number) || 5;
        const listingSplit = (inputs.listingAgentSplit as number) || 50;
        const mortgage = (inputs.mortgageBalance as number) || 0;
        if (!salePrice) return null;

        const totalCommission = salePrice * (commissionRate / 100);
        const listingAgentCommission = totalCommission * (listingSplit / 100);
        const buyerAgentCommission = totalCommission - listingAgentCommission;
        const netProceeds = salePrice - totalCommission - mortgage;

        return {
          primary: {
            label: "Total Commission",
            value: `$${formatNumber(totalCommission)}`,
          },
          details: [
            { label: "Listing agent commission", value: `$${formatNumber(listingAgentCommission)}` },
            { label: "Buyer agent commission", value: `$${formatNumber(buyerAgentCommission)}` },
            { label: "Net proceeds (after mortgage)", value: `$${formatNumber(netProceeds)}` },
            { label: "Commission as % of equity", value: `${formatNumber((totalCommission / (salePrice - mortgage)) * 100)}%` },
          ],
        };
      },
    },
    {
      id: "flat-fee",
      name: "Flat Fee vs Percentage",
      description: "Compare flat fee and percentage-based commissions",
      fields: [
        {
          name: "salePrice",
          label: "Sale Price",
          type: "number",
          placeholder: "e.g. 400000",
          prefix: "$",
          min: 0,
        },
        {
          name: "percentageRate",
          label: "Percentage Commission Rate",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          min: 0,
          max: 20,
          step: 0.1,
        },
        {
          name: "flatFee",
          label: "Flat Fee Amount",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const salePrice = inputs.salePrice as number;
        const rate = inputs.percentageRate as number;
        const flatFee = inputs.flatFee as number;
        if (!salePrice || !rate || !flatFee) return null;

        const percentageCommission = salePrice * (rate / 100);
        const savings = percentageCommission - flatFee;

        return {
          primary: {
            label: "Savings with Flat Fee",
            value: `$${formatNumber(savings)}`,
          },
          details: [
            { label: "Percentage commission", value: `$${formatNumber(percentageCommission)}` },
            { label: "Flat fee", value: `$${formatNumber(flatFee)}` },
            { label: "Flat fee as effective %", value: `${formatNumber((flatFee / salePrice) * 100)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "transfer-tax-calculator", "title-insurance-calculator"],
  faq: [
    {
      question: "What is the typical real estate commission?",
      answer:
        "Traditionally, total real estate commissions are around 5-6% of the sale price, split between the listing and buyer's agents. However, commissions are negotiable and have been trending lower, especially after recent industry changes.",
    },
    {
      question: "Who pays the real estate commission?",
      answer:
        "Historically, the seller pays the full commission which is split between listing and buyer agents. However, recent changes in real estate practices may shift some buyer agent costs to buyers. The commission is deducted from the sale proceeds at closing.",
    },
    {
      question: "Can I negotiate real estate commission?",
      answer:
        "Yes, real estate commissions are always negotiable. You can negotiate a lower rate, flat fee, or tiered structure. Some discount brokerages offer reduced rates. The key is to discuss commission before signing a listing agreement.",
    },
  ],
  formula: "Commission = Sale Price x Commission Rate",
};
