import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const contractorMarkupCalculator: CalculatorDefinition = {
  slug: "contractor-markup-calculator",
  title: "Contractor Markup Calculator",
  description: "Calculate the proper markup and final price for construction and contracting jobs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["contractor markup", "construction markup", "contractor pricing calculator"],
  variants: [{
    id: "standard",
    name: "Contractor Markup",
    description: "Calculate the proper markup and final price for construction and contracting jobs",
    fields: [
      { name: "directCost", label: "Direct Job Cost", type: "number", prefix: "$", min: 100, max: 1000000, defaultValue: 5000 },
      { name: "markupPercent", label: "Markup Percentage", type: "number", suffix: "%", min: 5, max: 100, defaultValue: 25 },
      { name: "overhead", label: "Overhead Percentage", type: "number", suffix: "%", min: 5, max: 50, defaultValue: 15 },
    ],
    calculate: (inputs) => {
      const cost = inputs.directCost as number;
      const markup = inputs.markupPercent as number;
      const overhead = inputs.overhead as number;
      if (!cost || cost <= 0) return null;
      const overheadAmount = cost * (overhead / 100);
      const totalCost = cost + overheadAmount;
      const markupAmount = totalCost * (markup / 100);
      const finalPrice = totalCost + markupAmount;
      const profitMargin = (markupAmount / finalPrice) * 100;
      return {
        primary: { label: "Final Client Price", value: "$" + formatNumber(Math.round(finalPrice * 100) / 100) },
        details: [
          { label: "Direct Cost + Overhead", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
          { label: "Markup Amount", value: "$" + formatNumber(Math.round(markupAmount * 100) / 100) },
          { label: "Profit Margin", value: formatNumber(Math.round(profitMargin * 10) / 10) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["electrician-rate-calculator", "handyman-pricing-calculator"],
  faq: [
    { question: "What is a typical contractor markup?", answer: "Most contractors use a markup of 15 to 35 percent on top of direct costs and overhead. The exact percentage depends on job complexity, market conditions, and specialization." },
    { question: "What is the difference between markup and margin?", answer: "Markup is the percentage added to cost to determine the selling price. Margin is the percentage of the selling price that is profit. A 25 percent markup equals about a 20 percent margin." },
  ],
  formula: "Final Price = (Direct Cost + Overhead) x (1 + Markup Percentage)",
};
