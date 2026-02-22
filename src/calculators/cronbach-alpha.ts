import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cronbachAlphaCalculator: CalculatorDefinition = {
  slug: "cronbach-alpha-calculator",
  title: "Cronbach's Alpha Calculator",
  description: "Free Cronbach's alpha calculator. Measure internal consistency reliability of a scale or test from item variances.",
  category: "Math", categorySlug: "math", icon: "+",
  keywords: ["cronbach alpha calculator", "internal consistency", "reliability", "scale reliability"],
  variants: [
    {
      id: "from-variances", name: "From Item and Total Variances",
      fields: [
        { name: "k", label: "Number of Items", type: "number", placeholder: "e.g. 10", min: 2 },
        { name: "sumItemVar", label: "Sum of Item Variances", type: "number", placeholder: "e.g. 15.5", min: 0 },
        { name: "totalVar", label: "Total Score Variance", type: "number", placeholder: "e.g. 45.2", min: 0 },
      ],
      calculate: (inputs) => {
        const k = inputs.k as number, siv = inputs.sumItemVar as number, tv = inputs.totalVar as number;
        if ([k, siv, tv].some((v) => v === undefined || isNaN(v))) return null;
        if (k < 2 || tv <= 0) return null;
        const alpha = (k / (k - 1)) * (1 - siv / tv);
        const interp = alpha >= 0.9 ? "Excellent" : alpha >= 0.8 ? "Good" : alpha >= 0.7 ? "Acceptable" : alpha >= 0.6 ? "Questionable" : "Poor";
        return {
          primary: { label: "Cronbach's Alpha", value: formatNumber(alpha, 4) },
          details: [
            { label: "Number of Items", value: formatNumber(k) },
            { label: "Sum of Item Variances", value: formatNumber(siv, 4) },
            { label: "Total Variance", value: formatNumber(tv, 4) },
            { label: "Interpretation", value: interp },
          ],
        };
      },
    },
    {
      id: "from-avg-r", name: "From Average Inter-Item Correlation",
      fields: [
        { name: "k", label: "Number of Items", type: "number", placeholder: "e.g. 10", min: 2 },
        { name: "avgR", label: "Average Inter-Item Correlation", type: "number", placeholder: "e.g. 0.35", min: -1, max: 1, step: 0.01 },
      ],
      calculate: (inputs) => {
        const k = inputs.k as number, avgR = inputs.avgR as number;
        if ([k, avgR].some((v) => v === undefined || isNaN(v))) return null;
        if (k < 2) return null;
        const alpha = (k * avgR) / (1 + (k - 1) * avgR);
        const interp = alpha >= 0.9 ? "Excellent" : alpha >= 0.8 ? "Good" : alpha >= 0.7 ? "Acceptable" : "Poor";
        return {
          primary: { label: "Cronbach's Alpha", value: formatNumber(alpha, 4) },
          details: [
            { label: "Number of Items", value: formatNumber(k) },
            { label: "Average r", value: formatNumber(avgR, 4) },
            { label: "Interpretation", value: interp },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["spearman-correlation-calculator", "coefficient-variation-calculator"],
  faq: [{ question: "What is Cronbach's alpha?", answer: "Cronbach's alpha measures internal consistency reliability, indicating how closely related a set of items are. Values range from 0 to 1, with 0.7+ generally acceptable." }],
  formula: "alpha = (k/(k-1)) * (1 - sum(item_var)/total_var)",
};
