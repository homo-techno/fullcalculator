import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const typeIIIErrorCalculator: CalculatorDefinition = {
  slug: "type-i-ii-error-calculator",
  title: "Type I and Type II Error Calculator",
  description: "Free Type I and Type II error calculator. Understand the relationships between alpha, beta, power, and sample size in hypothesis testing.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["type i error", "type ii error", "alpha error", "beta error", "false positive", "false negative", "power"],
  variants: [
    {
      id: "error-rates",
      name: "Error Rate Analysis",
      fields: [
        { name: "alpha", label: "Alpha (Type I Error Rate)", type: "number", placeholder: "e.g. 0.05", min: 0.001, max: 0.5, step: 0.01, defaultValue: 0.05 },
        { name: "power", label: "Power (1 - Beta)", type: "number", placeholder: "e.g. 0.80", min: 0.01, max: 0.999, step: 0.01, defaultValue: 0.80 },
        { name: "nTests", label: "Number of Tests", type: "number", placeholder: "e.g. 1", min: 1, defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const alpha = inputs.alpha as number;
        const power = inputs.power as number;
        const nTests = inputs.nTests as number;
        if ([alpha, power, nTests].some((v) => v === undefined || isNaN(v))) return null;
        if (alpha <= 0 || alpha >= 1 || power <= 0 || power >= 1 || nTests < 1) return null;
        const beta = 1 - power;
        const familyAlpha = 1 - Math.pow(1 - alpha, nTests);
        const bonferroni = alpha / nTests;
        return {
          primary: { label: "Type II Error (Beta)", value: formatNumber(beta, 4) },
          details: [
            { label: "Type I Error (Alpha)", value: formatNumber(alpha, 4) },
            { label: "Power (1 - Beta)", value: formatNumber(power, 4) },
            { label: "Beta (Type II Error)", value: formatNumber(beta, 4) },
            { label: "Family-wise Error Rate (" + formatNumber(nTests) + " tests)", value: formatNumber(familyAlpha, 4) },
            { label: "Bonferroni-corrected Alpha", value: formatNumber(bonferroni, 6) },
            { label: "Odds of False Positive", value: "1 in " + formatNumber(Math.round(1 / alpha)) },
            { label: "Odds of False Negative", value: "1 in " + formatNumber(Math.round(1 / beta)) },
          ],
        };
      },
    },
    {
      id: "tradeoff",
      name: "Alpha-Beta Tradeoff",
      fields: [
        { name: "effectSize", label: "Effect Size (d)", type: "number", placeholder: "e.g. 0.5", min: 0.01 },
        { name: "n", label: "Sample Size per Group", type: "number", placeholder: "e.g. 30", min: 2 },
        { name: "alpha", label: "Alpha", type: "number", placeholder: "e.g. 0.05", min: 0.001, max: 0.5, defaultValue: 0.05 },
      ],
      calculate: (inputs) => {
        const es = inputs.effectSize as number;
        const n = inputs.n as number;
        const alpha = inputs.alpha as number;
        if ([es, n, alpha].some((v) => v === undefined || isNaN(v))) return null;
        if (es <= 0 || n < 2 || alpha <= 0 || alpha >= 1) return null;
        const za = 1.96;
        const ncp = es * Math.sqrt(n / 2);
        const zBeta = ncp - za;
        const approxPower = Math.min(0.999, Math.max(0.001, zBeta > 0 ? 0.5 + 0.5 * Math.min(1, zBeta * 0.4) : 0.5 - 0.5 * Math.min(1, Math.abs(zBeta) * 0.4)));
        const beta = 1 - approxPower;
        return {
          primary: { label: "Estimated Beta", value: formatNumber(beta, 4) },
          details: [
            { label: "Estimated Power", value: formatNumber(approxPower, 4) },
            { label: "Alpha", value: formatNumber(alpha, 4) },
            { label: "Effect Size", value: formatNumber(es, 4) },
            { label: "n per Group", value: formatNumber(n) },
            { label: "Non-centrality Parameter", value: formatNumber(ncp, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["power-analysis-calculator", "margin-of-error-calculator", "effect-size-calculator"],
  faq: [
    {
      question: "What is a Type I error?",
      answer: "A Type I error (false positive) occurs when you reject the null hypothesis when it is actually true. The probability is alpha, typically 0.05.",
    },
    {
      question: "What is a Type II error?",
      answer: "A Type II error (false negative) occurs when you fail to reject a false null hypothesis. The probability is beta. Power = 1 - beta.",
    },
  ],
  formula: "Beta = 1 - Power. Family-wise alpha = 1 - (1-alpha)^k. Bonferroni alpha = alpha/k",
};
