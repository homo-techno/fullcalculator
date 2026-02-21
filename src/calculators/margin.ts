import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const marginCalculator: CalculatorDefinition = {
  slug: "margin-calculator",
  title: "Margin Calculator",
  description: "Free margin calculator. Calculate profit margin, markup, and gross margin for your business. Convert between margin and markup percentages.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["margin calculator", "profit margin calculator", "markup calculator", "gross margin calculator", "margin vs markup"],
  variants: [
    {
      id: "margin",
      name: "Profit Margin",
      description: "Calculate profit margin from cost and revenue (or selling price)",
      fields: [
        { name: "cost", label: "Cost Price", type: "number", placeholder: "e.g. 30", prefix: "$" },
        { name: "revenue", label: "Selling Price", type: "number", placeholder: "e.g. 50", prefix: "$" },
      ],
      calculate: (inputs) => {
        const cost = inputs.cost as number;
        const revenue = inputs.revenue as number;
        if (!cost || !revenue) return null;
        const profit = revenue - cost;
        const margin = (profit / revenue) * 100;
        const markup = (profit / cost) * 100;
        return {
          primary: { label: "Profit Margin", value: formatNumber(margin), suffix: "%" },
          details: [
            { label: "Profit", value: `$${formatNumber(profit)}` },
            { label: "Markup", value: `${formatNumber(markup)}%` },
            { label: "Cost", value: `$${formatNumber(cost)}` },
            { label: "Revenue", value: `$${formatNumber(revenue)}` },
          ],
        };
      },
    },
    {
      id: "fromMargin",
      name: "Price from Margin",
      description: "Calculate selling price to achieve a target profit margin",
      fields: [
        { name: "cost", label: "Cost Price", type: "number", placeholder: "e.g. 30", prefix: "$" },
        { name: "margin", label: "Desired Margin", type: "number", placeholder: "e.g. 40", suffix: "%" },
      ],
      calculate: (inputs) => {
        const cost = inputs.cost as number;
        const margin = inputs.margin as number;
        if (!cost || margin === undefined || margin >= 100) return null;
        const price = cost / (1 - margin / 100);
        const profit = price - cost;
        const markup = (profit / cost) * 100;
        return {
          primary: { label: "Selling Price", value: `$${formatNumber(price)}` },
          details: [
            { label: "Profit per unit", value: `$${formatNumber(profit)}` },
            { label: "Margin", value: `${formatNumber(margin)}%` },
            { label: "Equivalent markup", value: `${formatNumber(markup)}%` },
          ],
        };
      },
    },
    {
      id: "fromMarkup",
      name: "Price from Markup",
      description: "Calculate selling price using a markup percentage on cost",
      fields: [
        { name: "cost", label: "Cost Price", type: "number", placeholder: "e.g. 30", prefix: "$" },
        { name: "markup", label: "Markup %", type: "number", placeholder: "e.g. 50", suffix: "%" },
      ],
      calculate: (inputs) => {
        const cost = inputs.cost as number;
        const markup = inputs.markup as number;
        if (!cost || markup === undefined) return null;
        const price = cost * (1 + markup / 100);
        const profit = price - cost;
        const margin = (profit / price) * 100;
        return {
          primary: { label: "Selling Price", value: `$${formatNumber(price)}` },
          details: [
            { label: "Profit per unit", value: `$${formatNumber(profit)}` },
            { label: "Markup", value: `${formatNumber(markup)}%` },
            { label: "Equivalent margin", value: `${formatNumber(margin)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "discount-calculator", "roi-calculator"],
  faq: [
    { question: "What is the difference between margin and markup?", answer: "Margin is profit as a percentage of selling price (profit/revenue). Markup is profit as a percentage of cost (profit/cost). A 50% markup = 33.3% margin. Margin is always lower than markup for the same transaction." },
    { question: "What is a good profit margin?", answer: "It varies by industry. Retail: 2-5%. Software/SaaS: 70-90%. Restaurants: 3-9%. Manufacturing: 5-10%. Service businesses: 15-25%. Higher margins generally indicate stronger competitive positioning." },
  ],
  formula: "Margin = (Revenue - Cost) / Revenue × 100 | Markup = (Revenue - Cost) / Cost × 100",
};
