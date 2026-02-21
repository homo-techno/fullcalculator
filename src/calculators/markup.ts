import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const markupCalculator: CalculatorDefinition = {
  slug: "markup-calculator",
  title: "Markup Calculator",
  description: "Free markup calculator. Calculate selling price, markup percentage, and profit from cost and desired margin or markup.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["markup calculator", "markup vs margin", "selling price calculator", "cost markup", "profit markup"],
  variants: [
    {
      id: "fromMarkup",
      name: "Cost + Markup %",
      fields: [
        { name: "cost", label: "Cost Price", type: "number", prefix: "$", placeholder: "e.g. 50" },
        { name: "markup", label: "Markup %", type: "number", suffix: "%", placeholder: "e.g. 40" },
      ],
      calculate: (inputs) => {
        const cost = inputs.cost as number, markup = inputs.markup as number;
        if (!cost || markup === undefined) return null;
        const price = cost * (1 + markup / 100);
        const profit = price - cost;
        const margin = (profit / price) * 100;
        return {
          primary: { label: "Selling Price", value: `$${formatNumber(price, 2)}` },
          details: [
            { label: "Profit", value: `$${formatNumber(profit, 2)}` },
            { label: "Markup", value: `${formatNumber(markup, 2)}%` },
            { label: "Margin", value: `${formatNumber(margin, 2)}%` },
          ],
        };
      },
    },
    {
      id: "fromPrices",
      name: "From Cost & Selling Price",
      fields: [
        { name: "cost", label: "Cost Price", type: "number", prefix: "$", placeholder: "e.g. 50" },
        { name: "price", label: "Selling Price", type: "number", prefix: "$", placeholder: "e.g. 70" },
      ],
      calculate: (inputs) => {
        const cost = inputs.cost as number, price = inputs.price as number;
        if (!cost || !price) return null;
        const profit = price - cost;
        const markup = (profit / cost) * 100;
        const margin = (profit / price) * 100;
        return {
          primary: { label: "Markup", value: `${formatNumber(markup, 2)}%` },
          details: [
            { label: "Profit", value: `$${formatNumber(profit, 2)}` },
            { label: "Margin", value: `${formatNumber(margin, 2)}%` },
            { label: "Cost ratio", value: `${formatNumber((cost / price) * 100, 1)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["margin-calculator", "discount-calculator", "break-even-calculator"],
  faq: [{ question: "What's the difference between markup and margin?", answer: "Markup is based on cost: (Price-Cost)/Cost × 100. Margin is based on selling price: (Price-Cost)/Price × 100. A 50% markup = 33.3% margin. A 50% margin = 100% markup." }],
  formula: "Markup % = (Price-Cost)/Cost × 100 | Margin % = (Price-Cost)/Price × 100",
};
