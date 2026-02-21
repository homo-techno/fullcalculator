import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const roiCalculator: CalculatorDefinition = {
  slug: "roi-calculator",
  title: "ROI Calculator",
  description: "Free ROI (Return on Investment) calculator. Calculate investment returns, ROI percentage, and annualized ROI.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["roi calculator", "return on investment", "investment return calculator", "profit calculator"],
  variants: [
    {
      id: "basic",
      name: "ROI",
      description: "Calculate return on investment",
      fields: [
        { name: "invested", label: "Amount Invested", type: "number", placeholder: "e.g. 10000", prefix: "$" },
        { name: "returned", label: "Amount Returned", type: "number", placeholder: "e.g. 13500", prefix: "$" },
        { name: "years", label: "Investment Period", type: "number", placeholder: "e.g. 3", suffix: "years", step: 0.1 },
      ],
      calculate: (inputs) => {
        const inv = inputs.invested as number;
        const ret = inputs.returned as number;
        const years = inputs.years as number;
        if (!inv || !ret) return null;
        const profit = ret - inv;
        const roi = (profit / inv) * 100;
        const annualized = years && years > 0 ? (Math.pow(ret / inv, 1 / years) - 1) * 100 : null;
        return {
          primary: { label: "ROI", value: formatNumber(roi), suffix: "%" },
          details: [
            { label: "Profit / Loss", value: `$${formatNumber(profit)}` },
            ...(annualized !== null ? [{ label: "Annualized ROI", value: `${formatNumber(annualized)}%` }] : []),
            { label: "Total return", value: `${formatNumber(ret / inv, 2)}x` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["compound-interest-calculator", "percentage-calculator"],
  faq: [
    { question: "How do I calculate ROI?", answer: "ROI = (Net Profit / Cost of Investment) x 100. For example, if you invested $10,000 and received $13,500, ROI = ($3,500 / $10,000) x 100 = 35%." },
    { question: "What is annualized ROI?", answer: "Annualized ROI adjusts the total return to a per-year rate, allowing fair comparison between investments held for different periods. Formula: ((Final/Initial)^(1/years) - 1) x 100." },
  ],
  formula: "ROI = ((Return - Investment) / Investment) x 100",
};
