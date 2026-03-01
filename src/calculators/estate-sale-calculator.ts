import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const estateSaleCalculator: CalculatorDefinition = {
  slug: "estate-sale-calculator",
  title: "Estate Sale Calculator",
  description: "Estimate total revenue and net proceeds from an estate sale based on inventory value.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["estate sale calculator", "estate sale revenue", "estate liquidation estimate"],
  variants: [{
    id: "standard",
    name: "Estate Sale",
    description: "Estimate total revenue and net proceeds from an estate sale based on inventory value",
    fields: [
      { name: "estimatedValue", label: "Estimated Total Inventory Value", type: "number", prefix: "$", min: 500, max: 500000, defaultValue: 15000 },
      { name: "saleType", label: "Sale Type", type: "select", options: [{value:"diy",label:"DIY (Self-Run)"},{value:"professional",label:"Professional Estate Company"},{value:"auction",label:"Auction House"}], defaultValue: "professional" },
      { name: "itemCount", label: "Approximate Number of Items", type: "number", suffix: "items", min: 20, max: 5000, defaultValue: 200 },
    ],
    calculate: (inputs) => {
      const value = inputs.estimatedValue as number;
      const saleType = inputs.saleType as string;
      const items = inputs.itemCount as number;
      if (!value || value <= 0) return null;
      const sellRates: Record<string, number> = { diy: 0.60, professional: 0.75, auction: 0.70 };
      const commissions: Record<string, number> = { diy: 0, professional: 0.35, auction: 0.25 };
      const grossRevenue = value * (sellRates[saleType] || 0.75);
      const commission = grossRevenue * (commissions[saleType] || 0.35);
      const netProceeds = grossRevenue - commission;
      const avgPerItem = grossRevenue / items;
      return {
        primary: { label: "Estimated Net Proceeds", value: "$" + formatNumber(Math.round(netProceeds)) },
        details: [
          { label: "Gross Revenue", value: "$" + formatNumber(Math.round(grossRevenue)) },
          { label: "Commission/Fees", value: "$" + formatNumber(Math.round(commission)) },
          { label: "Average per Item", value: "$" + formatNumber(Math.round(avgPerItem * 100) / 100) },
        ],
      };
    },
  }],
  relatedSlugs: ["garage-sale-pricing-calculator", "power-outage-cost-calculator"],
  faq: [
    { question: "How much does an estate sale company charge?", answer: "Estate sale companies typically charge 25 to 40 percent of gross sales as commission. This covers pricing, advertising, setup, staffing, and cleanup." },
    { question: "How much can you expect to make at an estate sale?", answer: "Most estate sales generate 50 to 75 percent of the estimated retail value of items. A well-run professional sale typically yields more than a DIY sale." },
  ],
  formula: "Net Proceeds = (Inventory Value x Sell Rate) - (Gross Revenue x Commission Rate)",
};
