import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const conversionRateCalculator: CalculatorDefinition = {
  slug: "conversion-rate-calculator",
  title: "Conversion Rate Calculator",
  description: "Free conversion rate calculator. Calculate conversion rates, required traffic, and A/B test significance for marketing and e-commerce.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["conversion rate calculator", "conversion rate", "ecommerce conversion", "website conversion", "ctr calculator"],
  variants: [
    {
      id: "rate",
      name: "Calculate Conversion Rate",
      fields: [
        { name: "conversions", label: "Number of Conversions", type: "number", placeholder: "e.g. 150" },
        { name: "visitors", label: "Total Visitors / Impressions", type: "number", placeholder: "e.g. 5000" },
      ],
      calculate: (inputs) => {
        const conv = inputs.conversions as number, vis = inputs.visitors as number;
        if (!conv || !vis) return null;
        const rate = (conv / vis) * 100;
        return {
          primary: { label: "Conversion Rate", value: `${formatNumber(rate, 2)}%` },
          details: [
            { label: "Conversions", value: formatNumber(conv, 0) },
            { label: "Total visitors", value: formatNumber(vis, 0) },
            { label: "Non-converters", value: formatNumber(vis - conv, 0) },
            { label: "Ratio", value: `1 in ${formatNumber(vis / conv, 1)}` },
          ],
        };
      },
    },
    {
      id: "needed",
      name: "Traffic Needed",
      fields: [
        { name: "targetConv", label: "Desired Conversions", type: "number", placeholder: "e.g. 500" },
        { name: "rate", label: "Expected Conversion Rate (%)", type: "number", suffix: "%", placeholder: "e.g. 3" },
      ],
      calculate: (inputs) => {
        const target = inputs.targetConv as number, rate = inputs.rate as number;
        if (!target || !rate) return null;
        const traffic = target / (rate / 100);
        return {
          primary: { label: "Traffic Needed", value: formatNumber(traffic, 0) },
          details: [
            { label: "Target conversions", value: formatNumber(target, 0) },
            { label: "At rate", value: `${formatNumber(rate, 2)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["roi-calculator", "percentage-calculator", "break-even-calculator"],
  faq: [{ question: "What is a good conversion rate?", answer: "Average e-commerce conversion rates are 2-3%. Top performers reach 5-10%. Landing pages average 5-15%. The 'good' rate depends on industry, traffic source, and what you're converting (email signup vs purchase)." }],
  formula: "Conversion Rate = (Conversions / Visitors) × 100",
};
