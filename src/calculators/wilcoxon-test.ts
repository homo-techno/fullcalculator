import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wilcoxonTestCalculator: CalculatorDefinition = {
  slug: "wilcoxon-test-calculator",
  title: "Wilcoxon Signed-Rank Test Calculator",
  description:
    "Free Wilcoxon signed-rank test calculator. Non-parametric paired test alternative to the paired t-test. Calculate W-statistic and z-approximation.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["wilcoxon signed-rank test", "non-parametric paired test", "wilcoxon test", "signed rank test"],
  variants: [
    {
      id: "raw-pairs",
      name: "Raw Paired Data (5 pairs)",
      fields: [
        { name: "b1", label: "Before 1", type: "number", placeholder: "e.g. 120" },
        { name: "a1", label: "After 1", type: "number", placeholder: "e.g. 115" },
        { name: "b2", label: "Before 2", type: "number", placeholder: "e.g. 130" },
        { name: "a2", label: "After 2", type: "number", placeholder: "e.g. 122" },
        { name: "b3", label: "Before 3", type: "number", placeholder: "e.g. 125" },
        { name: "a3", label: "After 3", type: "number", placeholder: "e.g. 118" },
        { name: "b4", label: "Before 4", type: "number", placeholder: "e.g. 140" },
        { name: "a4", label: "After 4", type: "number", placeholder: "e.g. 135" },
        { name: "b5", label: "Before 5", type: "number", placeholder: "e.g. 133" },
        { name: "a5", label: "After 5", type: "number", placeholder: "e.g. 128" },
      ],
      calculate: (inputs) => {
        const before = [inputs.b1, inputs.b2, inputs.b3, inputs.b4, inputs.b5] as number[];
        const after = [inputs.a1, inputs.a2, inputs.a3, inputs.a4, inputs.a5] as number[];
        if ([...before, ...after].some((v) => v === undefined || isNaN(v))) return null;
        const diffs = before.map((bv, i) => bv - after[i]).filter((dd) => dd !== 0);
        if (diffs.length === 0) return null;
        const items = diffs.map((dd) => ({ diff: dd, abs: Math.abs(dd), sign: dd > 0 ? 1 : -1, rank: 0 }));
        items.sort((x, y) => x.abs - y.abs);
        let idx = 0;
        while (idx < items.length) {
          let j = idx;
          while (j < items.length && items[j].abs === items[idx].abs) j++;
          const avgRank = (idx + 1 + j) / 2;
          for (let k = idx; k < j; k++) items[k].rank = avgRank;
          idx = j;
        }
        const Wplus = items.filter((x) => x.sign === 1).reduce((s, x) => s + x.rank, 0);
        const Wminus = items.filter((x) => x.sign === -1).reduce((s, x) => s + x.rank, 0);
        const W = Math.min(Wplus, Wminus);
        const n = items.length;
        const meanW = (n * (n + 1)) / 4;
        const sigmaW = Math.sqrt((n * (n + 1) * (2 * n + 1)) / 24);
        const z = sigmaW === 0 ? 0 : (W - meanW) / sigmaW;
        const absZ = Math.abs(z);
        const pApprox = absZ > 2.58 ? "< 0.01" : absZ > 1.96 ? "< 0.05" : absZ > 1.65 ? "borderline" : "> 0.10";
        return {
          primary: { label: "W-Statistic", value: formatNumber(W, 2) },
          details: [
            { label: "W+ (positive ranks)", value: formatNumber(Wplus, 2) },
            { label: "W- (negative ranks)", value: formatNumber(Wminus, 2) },
            { label: "Non-zero pairs (n)", value: formatNumber(n) },
            { label: "z-approximation", value: formatNumber(z, 4) },
            { label: "p-value (approx)", value: pApprox },
            { label: "Effect Size r", value: formatNumber(absZ / Math.sqrt(n), 4) },
          ],
        };
      },
    },
    {
      id: "from-w",
      name: "From W-Statistic",
      fields: [
        { name: "w", label: "W-Statistic", type: "number", placeholder: "e.g. 5", min: 0 },
        { name: "n", label: "Number of Non-Zero Pairs", type: "number", placeholder: "e.g. 12", min: 1 },
      ],
      calculate: (inputs) => {
        const w = inputs.w as number;
        const n = inputs.n as number;
        if ([w, n].some((v) => v === undefined || isNaN(v))) return null;
        if (n < 1) return null;
        const meanW = (n * (n + 1)) / 4;
        const sigmaW = Math.sqrt((n * (n + 1) * (2 * n + 1)) / 24);
        const z = sigmaW === 0 ? 0 : (w - meanW) / sigmaW;
        const absZ = Math.abs(z);
        const pApprox = absZ > 2.58 ? "< 0.01" : absZ > 1.96 ? "< 0.05" : absZ > 1.65 ? "borderline" : "> 0.10";
        return {
          primary: { label: "z-approximation", value: formatNumber(z, 4) },
          details: [
            { label: "W-Statistic", value: formatNumber(w) },
            { label: "Expected W", value: formatNumber(meanW, 2) },
            { label: "Std Dev of W", value: formatNumber(sigmaW, 4) },
            { label: "p-value (approx)", value: pApprox },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["paired-t-test-calculator", "mann-whitney-calculator", "effect-size-calculator"],
  faq: [
    {
      question: "What is the Wilcoxon signed-rank test?",
      answer: "A non-parametric test for paired data that tests whether the median difference between pairs is zero.",
    },
    {
      question: "When should I use Wilcoxon instead of a paired t-test?",
      answer: "Use it when paired differences are not normally distributed, with ordinal data, or when you want robustness to outliers.",
    },
  ],
  formula: "W = min(W+, W-). z = (W - n(n+1)/4) / sqrt(n(n+1)(2n+1)/24)",
};
