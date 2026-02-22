import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mannWhitneyCalculator: CalculatorDefinition = {
  slug: "mann-whitney-calculator",
  title: "Mann-Whitney U Test Calculator",
  description:
    "Free Mann-Whitney U test calculator. Non-parametric test to compare two independent groups using ranks. Calculate U-statistic and z-approximation.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["mann-whitney u test", "wilcoxon rank-sum test", "non-parametric test", "compare two groups", "rank test"],
  variants: [
    {
      id: "raw-data",
      name: "Raw Data (4 values each)",
      fields: [
        { name: "a1", label: "Group A Value 1", type: "number", placeholder: "e.g. 3" },
        { name: "a2", label: "Group A Value 2", type: "number", placeholder: "e.g. 5" },
        { name: "a3", label: "Group A Value 3", type: "number", placeholder: "e.g. 7" },
        { name: "a4", label: "Group A Value 4", type: "number", placeholder: "e.g. 9" },
        { name: "b1", label: "Group B Value 1", type: "number", placeholder: "e.g. 2" },
        { name: "b2", label: "Group B Value 2", type: "number", placeholder: "e.g. 4" },
        { name: "b3", label: "Group B Value 3", type: "number", placeholder: "e.g. 6" },
        { name: "b4", label: "Group B Value 4", type: "number", placeholder: "e.g. 8" },
      ],
      calculate: (inputs) => {
        const a = [inputs.a1 as number, inputs.a2 as number, inputs.a3 as number, inputs.a4 as number];
        const b = [inputs.b1 as number, inputs.b2 as number, inputs.b3 as number, inputs.b4 as number];
        if ([...a, ...b].some((v) => v === undefined || isNaN(v))) return null;
        const n1 = a.length;
        const n2 = b.length;
        const combined: { v: number; group: string; rank: number }[] = [
          ...a.map((v) => ({ v, group: "A", rank: 0 })),
          ...b.map((v) => ({ v, group: "B", rank: 0 })),
        ].sort((x, y) => x.v - y.v);
        let i = 0;
        while (i < combined.length) {
          let j = i;
          while (j < combined.length && combined[j].v === combined[i].v) j++;
          const avgRank = (i + 1 + j) / 2;
          for (let k = i; k < j; k++) combined[k].rank = avgRank;
          i = j;
        }
        const R1 = combined.filter((c) => c.group === "A").reduce((s, c) => s + c.rank, 0);
        const R2 = combined.filter((c) => c.group === "B").reduce((s, c) => s + c.rank, 0);
        const U1 = R1 - (n1 * (n1 + 1)) / 2;
        const U2 = R2 - (n2 * (n2 + 1)) / 2;
        const U = Math.min(U1, U2);
        const meanU = (n1 * n2) / 2;
        const sigmaU = Math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12);
        const z = sigmaU === 0 ? 0 : (U - meanU) / sigmaU;
        const absZ = Math.abs(z);
        const pApprox = absZ > 2.58 ? "< 0.01" : absZ > 1.96 ? "< 0.05" : absZ > 1.65 ? "borderline (~0.05-0.10)" : "> 0.10";
        return {
          primary: { label: "U-Statistic", value: formatNumber(U, 0) },
          details: [
            { label: "U1 (Group A)", value: formatNumber(U1, 2) },
            { label: "U2 (Group B)", value: formatNumber(U2, 2) },
            { label: "Rank Sum A (R1)", value: formatNumber(R1, 2) },
            { label: "Rank Sum B (R2)", value: formatNumber(R2, 2) },
            { label: "z-approximation", value: formatNumber(z, 4) },
            { label: "p-value (approx, two-tailed)", value: pApprox },
          ],
        };
      },
    },
    {
      id: "from-u",
      name: "From U-Statistic",
      fields: [
        { name: "u", label: "U-Statistic", type: "number", placeholder: "e.g. 45", min: 0 },
        { name: "n1", label: "Sample Size Group A", type: "number", placeholder: "e.g. 10", min: 1 },
        { name: "n2", label: "Sample Size Group B", type: "number", placeholder: "e.g. 12", min: 1 },
      ],
      calculate: (inputs) => {
        const u = inputs.u as number;
        const n1 = inputs.n1 as number;
        const n2 = inputs.n2 as number;
        if ([u, n1, n2].some((v) => v === undefined || isNaN(v))) return null;
        const meanU = (n1 * n2) / 2;
        const sigmaU = Math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12);
        const z = sigmaU === 0 ? 0 : (u - meanU) / sigmaU;
        const absZ = Math.abs(z);
        const pApprox = absZ > 2.58 ? "< 0.01" : absZ > 1.96 ? "< 0.05" : absZ > 1.65 ? "borderline (~0.05-0.10)" : "> 0.10";
        return {
          primary: { label: "z-approximation", value: formatNumber(z, 4) },
          details: [
            { label: "U-Statistic", value: formatNumber(u) },
            { label: "Expected U (mean)", value: formatNumber(meanU, 2) },
            { label: "Std Dev of U", value: formatNumber(sigmaU, 4) },
            { label: "p-value (approx, two-tailed)", value: pApprox },
            { label: "Effect Size r", value: formatNumber(absZ / Math.sqrt(n1 + n2), 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["two-sample-t-test-calculator", "wilcoxon-test-calculator", "kruskal-wallis-calculator"],
  faq: [
    {
      question: "What is the Mann-Whitney U test?",
      answer: "The Mann-Whitney U test is a non-parametric test that compares two independent groups without assuming normal distributions. It tests whether one group tends to have larger values than the other by ranking all observations.",
    },
    {
      question: "When should I use Mann-Whitney instead of a t-test?",
      answer: "Use the Mann-Whitney U test when your data violates the normality assumption, when dealing with ordinal data, or when sample sizes are very small. It is more robust to outliers.",
    },
  ],
  formula: "U = R - n(n+1)/2, z = (U - n1*n2/2) / sqrt(n1*n2*(n1+n2+1)/12)",
};
