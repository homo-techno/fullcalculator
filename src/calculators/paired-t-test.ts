import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pairedTTestCalculator: CalculatorDefinition = {
  slug: "paired-t-test-calculator",
  title: "Paired T-Test Calculator",
  description:
    "Free paired t-test calculator. Compare before-and-after measurements or matched pairs with t-statistic, degrees of freedom, and significance estimation.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["paired t-test calculator", "dependent t-test", "matched pairs t-test", "before after test", "repeated measures"],
  variants: [
    {
      id: "raw-pairs",
      name: "Raw Paired Data (5 pairs)",
      description: "Enter matched before/after values",
      fields: [
        { name: "before1", label: "Before 1", type: "number", placeholder: "e.g. 120" },
        { name: "after1", label: "After 1", type: "number", placeholder: "e.g. 110" },
        { name: "before2", label: "Before 2", type: "number", placeholder: "e.g. 135" },
        { name: "after2", label: "After 2", type: "number", placeholder: "e.g. 125" },
        { name: "before3", label: "Before 3", type: "number", placeholder: "e.g. 128" },
        { name: "after3", label: "After 3", type: "number", placeholder: "e.g. 118" },
        { name: "before4", label: "Before 4", type: "number", placeholder: "e.g. 140" },
        { name: "after4", label: "After 4", type: "number", placeholder: "e.g. 132" },
        { name: "before5", label: "Before 5", type: "number", placeholder: "e.g. 132" },
        { name: "after5", label: "After 5", type: "number", placeholder: "e.g. 120" },
      ],
      calculate: (inputs) => {
        const before = [inputs.before1, inputs.before2, inputs.before3, inputs.before4, inputs.before5] as number[];
        const after = [inputs.after1, inputs.after2, inputs.after3, inputs.after4, inputs.after5] as number[];
        if ([...before, ...after].some((v) => v === undefined || isNaN(v))) return null;
        const diffs = before.map((b, i) => b - after[i]);
        const n = diffs.length;
        const meanD = diffs.reduce((s, dd) => s + dd, 0) / n;
        const sdD = Math.sqrt(diffs.reduce((s, dd) => s + Math.pow(dd - meanD, 2), 0) / (n - 1));
        const se = sdD / Math.sqrt(n);
        const t = se === 0 ? Infinity : meanD / se;
        const df = n - 1;
        const absT = Math.abs(t);
        const pApprox = absT > 4.0 ? "< 0.01" : absT > 2.5 ? "< 0.05" : absT > 2.0 ? "borderline (~0.05-0.10)" : "> 0.10";
        return {
          primary: { label: "t-Statistic", value: formatNumber(t, 4) },
          details: [
            { label: "Mean Difference", value: formatNumber(meanD, 4) },
            { label: "Std Dev of Differences", value: formatNumber(sdD, 4) },
            { label: "Standard Error", value: formatNumber(se, 4) },
            { label: "Degrees of Freedom", value: formatNumber(df) },
            { label: "Number of Pairs", value: formatNumber(n) },
            { label: "p-value (approx, two-tailed)", value: pApprox },
          ],
        };
      },
    },
    {
      id: "summary",
      name: "From Summary Statistics",
      fields: [
        { name: "meanDiff", label: "Mean Difference", type: "number", placeholder: "e.g. -5.2" },
        { name: "sdDiff", label: "Std Dev of Differences", type: "number", placeholder: "e.g. 3.8", min: 0 },
        { name: "n", label: "Number of Pairs", type: "number", placeholder: "e.g. 25", min: 2 },
      ],
      calculate: (inputs) => {
        const meanD = inputs.meanDiff as number;
        const sdD = inputs.sdDiff as number;
        const n = inputs.n as number;
        if ([meanD, sdD, n].some((v) => v === undefined || isNaN(v))) return null;
        if (n < 2 || sdD < 0) return null;
        const se = sdD / Math.sqrt(n);
        const t = se === 0 ? Infinity : meanD / se;
        const df = n - 1;
        const absT = Math.abs(t);
        const pApprox = absT > 3.5 ? "< 0.01" : absT > 2.0 ? "< 0.05" : absT > 1.7 ? "borderline (~0.05-0.10)" : "> 0.10";
        return {
          primary: { label: "t-Statistic", value: formatNumber(t, 4) },
          details: [
            { label: "Mean Difference", value: formatNumber(meanD, 4) },
            { label: "Standard Error", value: formatNumber(se, 4) },
            { label: "Degrees of Freedom", value: formatNumber(df) },
            { label: "p-value (approx, two-tailed)", value: pApprox },
            { label: "95% CI Lower", value: formatNumber(meanD - 2.045 * se, 4) },
            { label: "95% CI Upper", value: formatNumber(meanD + 2.045 * se, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["two-sample-t-test-calculator", "wilcoxon-test-calculator", "effect-size-calculator"],
  faq: [
    {
      question: "What is a paired t-test?",
      answer: "A paired t-test compares two related measurements, such as before-and-after observations on the same subjects. It tests whether the mean difference between paired observations is significantly different from zero.",
    },
    {
      question: "When should I use a paired t-test vs an independent t-test?",
      answer: "Use a paired t-test when observations are naturally paired (e.g., same person measured twice). Use an independent t-test when comparing two separate, unrelated groups.",
    },
  ],
  formula: "t = mean_d / (sd_d / sqrt(n)), df = n - 1",
};
