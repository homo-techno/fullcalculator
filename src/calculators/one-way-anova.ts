import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const oneWayAnovaCalculator: CalculatorDefinition = {
  slug: "one-way-anova-calculator",
  title: "One-Way ANOVA Calculator",
  description:
    "Free one-way ANOVA calculator. Compare means across multiple groups with F-statistic, p-value estimation, and between/within group variance analysis.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "one-way anova calculator",
    "anova",
    "analysis of variance",
    "f-test",
    "compare group means",
    "between group variance",
  ],
  variants: [
    {
      id: "three-groups",
      name: "Three Groups",
      description: "ANOVA for three groups (3 values each)",
      fields: [
        { name: "g1v1", label: "Group 1 Value 1", type: "number", placeholder: "e.g. 5" },
        { name: "g1v2", label: "Group 1 Value 2", type: "number", placeholder: "e.g. 7" },
        { name: "g1v3", label: "Group 1 Value 3", type: "number", placeholder: "e.g. 6" },
        { name: "g2v1", label: "Group 2 Value 1", type: "number", placeholder: "e.g. 10" },
        { name: "g2v2", label: "Group 2 Value 2", type: "number", placeholder: "e.g. 12" },
        { name: "g2v3", label: "Group 2 Value 3", type: "number", placeholder: "e.g. 11" },
        { name: "g3v1", label: "Group 3 Value 1", type: "number", placeholder: "e.g. 15" },
        { name: "g3v2", label: "Group 3 Value 2", type: "number", placeholder: "e.g. 14" },
        { name: "g3v3", label: "Group 3 Value 3", type: "number", placeholder: "e.g. 16" },
      ],
      calculate: (inputs) => {
        const g1 = [inputs.g1v1 as number, inputs.g1v2 as number, inputs.g1v3 as number];
        const g2 = [inputs.g2v1 as number, inputs.g2v2 as number, inputs.g2v3 as number];
        const g3 = [inputs.g3v1 as number, inputs.g3v2 as number, inputs.g3v3 as number];
        for (const v of [...g1, ...g2, ...g3]) {
          if (v === undefined || isNaN(v)) return null;
        }
        const all = [...g1, ...g2, ...g3];
        const N = all.length;
        const k = 3;
        const grandMean = all.reduce((a, b) => a + b, 0) / N;
        const groups = [g1, g2, g3];
        const groupMeans = groups.map((g) => g.reduce((a, b) => a + b, 0) / g.length);
        const SSB = groups.reduce(
          (sum, g, i) => sum + g.length * Math.pow(groupMeans[i] - grandMean, 2),
          0
        );
        const SSW = groups.reduce(
          (sum, g, i) =>
            sum + g.reduce((s, v) => s + Math.pow(v - groupMeans[i], 2), 0),
          0
        );
        const dfBetween = k - 1;
        const dfWithin = N - k;
        const MSB = SSB / dfBetween;
        const MSW = SSW / dfWithin;
        const F = MSW === 0 ? Infinity : MSB / MSW;
        const pApprox =
          F > 5
            ? "< 0.05 (likely significant)"
            : F > 3
              ? "borderline (~0.05-0.10)"
              : "> 0.10 (not significant)";
        return {
          primary: { label: "F-Statistic", value: formatNumber(F, 4) },
          details: [
            { label: "Grand Mean", value: formatNumber(grandMean, 4) },
            { label: "Group 1 Mean", value: formatNumber(groupMeans[0], 4) },
            { label: "Group 2 Mean", value: formatNumber(groupMeans[1], 4) },
            { label: "Group 3 Mean", value: formatNumber(groupMeans[2], 4) },
            { label: "SS Between", value: formatNumber(SSB, 4) },
            { label: "SS Within", value: formatNumber(SSW, 4) },
            { label: "MS Between", value: formatNumber(MSB, 4) },
            { label: "MS Within", value: formatNumber(MSW, 4) },
            { label: "df (between)", value: formatNumber(dfBetween) },
            { label: "df (within)", value: formatNumber(dfWithin) },
            { label: "p-value (approx)", value: pApprox },
          ],
        };
      },
    },
    {
      id: "summary-stats",
      name: "From Summary Statistics",
      description: "ANOVA from group means, std devs, and sample sizes",
      fields: [
        { name: "n1", label: "Group 1 n", type: "number", placeholder: "e.g. 30", min: 2 },
        { name: "mean1", label: "Group 1 Mean", type: "number", placeholder: "e.g. 10.5" },
        { name: "sd1", label: "Group 1 Std Dev", type: "number", placeholder: "e.g. 2.1", min: 0 },
        { name: "n2", label: "Group 2 n", type: "number", placeholder: "e.g. 30", min: 2 },
        { name: "mean2", label: "Group 2 Mean", type: "number", placeholder: "e.g. 12.3" },
        { name: "sd2", label: "Group 2 Std Dev", type: "number", placeholder: "e.g. 2.4", min: 0 },
        { name: "n3", label: "Group 3 n", type: "number", placeholder: "e.g. 30", min: 2 },
        { name: "mean3", label: "Group 3 Mean", type: "number", placeholder: "e.g. 14.1" },
        { name: "sd3", label: "Group 3 Std Dev", type: "number", placeholder: "e.g. 2.0", min: 0 },
      ],
      calculate: (inputs) => {
        const n1 = inputs.n1 as number, mean1 = inputs.mean1 as number, sd1 = inputs.sd1 as number;
        const n2 = inputs.n2 as number, mean2 = inputs.mean2 as number, sd2 = inputs.sd2 as number;
        const n3 = inputs.n3 as number, mean3 = inputs.mean3 as number, sd3 = inputs.sd3 as number;
        if ([n1, mean1, sd1, n2, mean2, sd2, n3, mean3, sd3].some((v) => v === undefined || isNaN(v))) return null;
        if (n1 < 2 || n2 < 2 || n3 < 2) return null;
        const N = n1 + n2 + n3;
        const grandMean = (n1 * mean1 + n2 * mean2 + n3 * mean3) / N;
        const SSB =
          n1 * Math.pow(mean1 - grandMean, 2) +
          n2 * Math.pow(mean2 - grandMean, 2) +
          n3 * Math.pow(mean3 - grandMean, 2);
        const SSW = (n1 - 1) * sd1 * sd1 + (n2 - 1) * sd2 * sd2 + (n3 - 1) * sd3 * sd3;
        const dfB = 2;
        const dfW = N - 3;
        const MSB = SSB / dfB;
        const MSW = SSW / dfW;
        const F = MSW === 0 ? Infinity : MSB / MSW;
        return {
          primary: { label: "F-Statistic", value: formatNumber(F, 4) },
          details: [
            { label: "Grand Mean", value: formatNumber(grandMean, 4) },
            { label: "SS Between", value: formatNumber(SSB, 4) },
            { label: "SS Within", value: formatNumber(SSW, 4) },
            { label: "MS Between", value: formatNumber(MSB, 4) },
            { label: "MS Within", value: formatNumber(MSW, 4) },
            { label: "df (between)", value: formatNumber(dfB) },
            { label: "df (within)", value: formatNumber(dfW) },
            { label: "Total N", value: formatNumber(N) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "two-sample-t-test-calculator",
    "kruskal-wallis-calculator",
    "effect-size-calculator",
  ],
  faq: [
    {
      question: "What is one-way ANOVA?",
      answer:
        "One-way analysis of variance (ANOVA) tests whether there are statistically significant differences between the means of three or more independent groups.",
    },
    {
      question: "When should I use ANOVA instead of multiple t-tests?",
      answer:
        "When comparing three or more groups, ANOVA controls the overall Type I error rate. Running multiple t-tests inflates the chance of a false positive.",
    },
  ],
  formula:
    "F = MS_between / MS_within, where MS = SS / df",
};
