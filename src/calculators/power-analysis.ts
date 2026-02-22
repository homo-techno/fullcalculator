import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const powerAnalysisCalculator: CalculatorDefinition = {
  slug: "power-analysis-calculator",
  title: "Statistical Power Analysis Calculator",
  description: "Free statistical power analysis calculator. Determine sample size, power, or minimum detectable effect size for hypothesis tests.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["power analysis calculator", "sample size calculator", "statistical power", "minimum detectable effect"],
  variants: [
    {
      id: "sample-size",
      name: "Sample Size for Two-Sample t-Test",
      fields: [
        { name: "effectSize", label: "Expected Effect Size (d)", type: "number", placeholder: "e.g. 0.5", min: 0.01 },
        { name: "alpha", label: "Significance Level", type: "number", placeholder: "e.g. 0.05", min: 0.001, max: 0.5, step: 0.01, defaultValue: 0.05 },
        { name: "power", label: "Desired Power", type: "number", placeholder: "e.g. 0.80", min: 0.5, max: 0.999, step: 0.01, defaultValue: 0.8 },
      ],
      calculate: (inputs) => {
        const es = inputs.effectSize as number;
        const alpha = inputs.alpha as number;
        const power = inputs.power as number;
        if ([es, alpha, power].some((v) => v === undefined || isNaN(v))) return null;
        if (es <= 0 || alpha <= 0 || alpha >= 1 || power <= 0 || power >= 1) return null;
        const za = alpha <= 0.01 ? 2.576 : alpha <= 0.05 ? 1.96 : 1.645;
        const zb = power >= 0.95 ? 1.645 : power >= 0.9 ? 1.282 : 0.842;
        const n = Math.ceil(2 * Math.pow((za + zb) / es, 2));
        return {
          primary: { label: "Required n per Group", value: formatNumber(n) },
          details: [
            { label: "Total Sample Size", value: formatNumber(n * 2) },
            { label: "Effect Size (d)", value: formatNumber(es, 4) },
            { label: "Alpha", value: formatNumber(alpha, 4) },
            { label: "Power", value: formatNumber(power, 4) },
          ],
        };
      },
    },
    {
      id: "compute-power",
      name: "Compute Power",
      fields: [
        { name: "effectSize", label: "Effect Size (d)", type: "number", placeholder: "e.g. 0.5", min: 0.01 },
        { name: "n", label: "Sample Size per Group", type: "number", placeholder: "e.g. 30", min: 2 },
        { name: "alpha", label: "Alpha", type: "number", placeholder: "e.g. 0.05", defaultValue: 0.05 },
      ],
      calculate: (inputs) => {
        const es = inputs.effectSize as number;
        const n = inputs.n as number;
        const alpha = inputs.alpha as number;
        if ([es, n, alpha].some((v) => v === undefined || isNaN(v))) return null;
        if (es <= 0 || n < 2) return null;
        const za = 1.96;
        const ncp = es * Math.sqrt(n / 2);
        const zBeta = ncp - za;
        const approxPower = Math.min(0.999, Math.max(0.001, 0.5 + 0.5 * (2 / Math.sqrt(Math.PI)) * (zBeta > 0 ? 1 : -1) * Math.sqrt(1 - Math.exp(-2 * zBeta * zBeta / Math.PI)) * 0.85));
        return {
          primary: { label: "Estimated Power", value: formatNumber(approxPower, 4) },
          details: [
            { label: "Effect Size (d)", value: formatNumber(es, 4) },
            { label: "n per Group", value: formatNumber(n) },
            { label: "Alpha", value: formatNumber(alpha, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["effect-size-calculator", "two-sample-t-test-calculator", "margin-of-error-calculator"],
  faq: [
    {
      question: "What is statistical power?",
      answer: "Power is the probability of correctly rejecting a false null hypothesis. A power of 0.80 means 80% chance of detecting a true effect.",
    },
  ],
  formula: "n = 2 * ((z_alpha + z_beta) / d)^2",
};
