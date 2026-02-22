import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const effectSizeCalculator: CalculatorDefinition = {
  slug: "effect-size-calculator",
  title: "Effect Size Calculator (Cohen's d)",
  description:
    "Free effect size calculator. Calculate Cohen's d, Hedges' g, and other effect size measures to quantify the magnitude of differences between groups.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["effect size calculator", "cohens d", "hedges g", "effect size", "magnitude of difference"],
  variants: [
    {
      id: "cohens-d",
      name: "Cohen's d from Summary Statistics",
      fields: [
        { name: "mean1", label: "Group 1 Mean", type: "number", placeholder: "e.g. 75" },
        { name: "mean2", label: "Group 2 Mean", type: "number", placeholder: "e.g. 80" },
        { name: "sd1", label: "Group 1 Std Dev", type: "number", placeholder: "e.g. 10", min: 0 },
        { name: "sd2", label: "Group 2 Std Dev", type: "number", placeholder: "e.g. 12", min: 0 },
        { name: "n1", label: "Group 1 n", type: "number", placeholder: "e.g. 30", min: 2 },
        { name: "n2", label: "Group 2 n", type: "number", placeholder: "e.g. 30", min: 2 },
      ],
      calculate: (inputs) => {
        const mean1 = inputs.mean1 as number, mean2 = inputs.mean2 as number;
        const sd1 = inputs.sd1 as number, sd2 = inputs.sd2 as number;
        const n1 = inputs.n1 as number, n2 = inputs.n2 as number;
        if ([mean1, mean2, sd1, sd2, n1, n2].some((v) => v === undefined || isNaN(v))) return null;
        if (n1 < 2 || n2 < 2) return null;
        const pooledSD = Math.sqrt(((n1 - 1) * sd1 * sd1 + (n2 - 1) * sd2 * sd2) / (n1 + n2 - 2));
        const cd = pooledSD === 0 ? 0 : (mean1 - mean2) / pooledSD;
        const correction = 1 - 3 / (4 * (n1 + n2 - 2) - 1);
        const hedgesG = cd * correction;
        const absD = Math.abs(cd);
        const interp = absD >= 0.8 ? "Large" : absD >= 0.5 ? "Medium" : absD >= 0.2 ? "Small" : "Negligible";
        return {
          primary: { label: "Cohen's d", value: formatNumber(cd, 4) },
          details: [
            { label: "Hedges' g", value: formatNumber(hedgesG, 4) },
            { label: "Pooled Std Dev", value: formatNumber(pooledSD, 4) },
            { label: "Mean Difference", value: formatNumber(mean1 - mean2, 4) },
            { label: "Interpretation", value: interp },
            { label: "|d|", value: formatNumber(absD, 4) },
          ],
        };
      },
    },
    {
      id: "from-t",
      name: "From t-statistic",
      fields: [
        { name: "t", label: "t-Statistic", type: "number", placeholder: "e.g. 2.45" },
        { name: "n1", label: "Group 1 n", type: "number", placeholder: "e.g. 30", min: 2 },
        { name: "n2", label: "Group 2 n", type: "number", placeholder: "e.g. 30", min: 2 },
      ],
      calculate: (inputs) => {
        const t = inputs.t as number, n1 = inputs.n1 as number, n2 = inputs.n2 as number;
        if ([t, n1, n2].some((v) => v === undefined || isNaN(v))) return null;
        const cd = t * Math.sqrt(1 / n1 + 1 / n2);
        const absD = Math.abs(cd);
        const interp = absD >= 0.8 ? "Large" : absD >= 0.5 ? "Medium" : absD >= 0.2 ? "Small" : "Negligible";
        return {
          primary: { label: "Cohen's d", value: formatNumber(cd, 4) },
          details: [
            { label: "|d|", value: formatNumber(absD, 4) },
            { label: "Interpretation", value: interp },
            { label: "r (effect size)", value: formatNumber(Math.sqrt(t * t / (t * t + n1 + n2 - 2)), 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["two-sample-t-test-calculator", "power-analysis-calculator"],
  faq: [
    {
      question: "What is Cohen's d?",
      answer: "Cohen's d quantifies the difference between two group means in standard deviation units. Values of 0.2, 0.5, and 0.8 are small, medium, and large effects.",
    },
    {
      question: "What is the difference between Cohen's d and Hedges' g?",
      answer: "Hedges' g corrects a small upward bias in Cohen's d, especially important with small sample sizes.",
    },
  ],
  formula: "d = (mean1 - mean2) / pooled_SD. g = d * (1 - 3/(4(n1+n2-2)-1))",
};
