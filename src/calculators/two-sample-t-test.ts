import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const twoSampleTTestCalculator: CalculatorDefinition = {
  slug: "two-sample-t-test-calculator",
  title: "Two-Sample T-Test Calculator",
  description:
    "Free two-sample t-test calculator. Compare the means of two independent groups with t-statistic, degrees of freedom, and significance estimation.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "two-sample t-test calculator",
    "independent t-test",
    "t-test",
    "compare two means",
    "student t-test",
    "hypothesis testing",
  ],
  variants: [
    {
      id: "summary",
      name: "From Summary Statistics",
      description: "Enter means, standard deviations, and sample sizes",
      fields: [
        { name: "n1", label: "Group A Sample Size", type: "number", placeholder: "e.g. 30", min: 2 },
        { name: "mean1", label: "Group A Mean", type: "number", placeholder: "e.g. 75.2" },
        { name: "sd1", label: "Group A Std Dev", type: "number", placeholder: "e.g. 8.5", min: 0 },
        { name: "n2", label: "Group B Sample Size", type: "number", placeholder: "e.g. 30", min: 2 },
        { name: "mean2", label: "Group B Mean", type: "number", placeholder: "e.g. 80.1" },
        { name: "sd2", label: "Group B Std Dev", type: "number", placeholder: "e.g. 9.0", min: 0 },
        {
          name: "tails",
          label: "Tails",
          type: "select",
          options: [
            { label: "Two-tailed", value: "two" },
            { label: "One-tailed", value: "one" },
          ],
          defaultValue: "two",
        },
      ],
      calculate: (inputs) => {
        const n1 = inputs.n1 as number, mean1 = inputs.mean1 as number, sd1 = inputs.sd1 as number;
        const n2 = inputs.n2 as number, mean2 = inputs.mean2 as number, sd2 = inputs.sd2 as number;
        const tails = (inputs.tails as string) || "two";
        if ([n1, mean1, sd1, n2, mean2, sd2].some((v) => v === undefined || isNaN(v))) return null;
        if (n1 < 2 || n2 < 2) return null;
        const se = Math.sqrt((sd1 * sd1) / n1 + (sd2 * sd2) / n2);
        const t = se === 0 ? Infinity : (mean1 - mean2) / se;
        const dfNum = Math.pow(sd1 * sd1 / n1 + sd2 * sd2 / n2, 2);
        const dfDen =
          Math.pow(sd1 * sd1 / n1, 2) / (n1 - 1) +
          Math.pow(sd2 * sd2 / n2, 2) / (n2 - 1);
        const df = dfDen === 0 ? n1 + n2 - 2 : dfNum / dfDen;
        const absT = Math.abs(t);
        const tailLabel = tails === "one" ? "one-tailed" : "two-tailed";
        const pApprox =
          absT > 3.5 ? "< 0.01" : absT > 2.0 ? "< 0.05" : absT > 1.7 ? "borderline (~0.05-0.10)" : "> 0.10";
        const pooledSD = Math.sqrt(((n1 - 1) * sd1 * sd1 + (n2 - 1) * sd2 * sd2) / (n1 + n2 - 2));
        const cohensD = pooledSD === 0 ? Infinity : (mean1 - mean2) / pooledSD;
        return {
          primary: { label: "t-Statistic", value: formatNumber(t, 4) },
          details: [
            { label: "Mean Difference", value: formatNumber(mean1 - mean2, 4) },
            { label: "Standard Error", value: formatNumber(se, 4) },
            { label: "Degrees of Freedom (Welch)", value: formatNumber(df, 2) },
            { label: "p-value approx (" + tailLabel + ")", value: pApprox },
            { label: "Cohen's d", value: formatNumber(cohensD, 4) },
            { label: "Pooled Std Dev", value: formatNumber(pooledSD, 4) },
          ],
        };
      },
    },
    {
      id: "raw-data",
      name: "From Raw Data (3 values each)",
      description: "Enter individual values for each group",
      fields: [
        { name: "a1", label: "Group A Value 1", type: "number", placeholder: "e.g. 5" },
        { name: "a2", label: "Group A Value 2", type: "number", placeholder: "e.g. 7" },
        { name: "a3", label: "Group A Value 3", type: "number", placeholder: "e.g. 6" },
        { name: "b1", label: "Group B Value 1", type: "number", placeholder: "e.g. 9" },
        { name: "b2", label: "Group B Value 2", type: "number", placeholder: "e.g. 11" },
        { name: "b3", label: "Group B Value 3", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const a = [inputs.a1 as number, inputs.a2 as number, inputs.a3 as number];
        const b = [inputs.b1 as number, inputs.b2 as number, inputs.b3 as number];
        if ([...a, ...b].some((v) => v === undefined || isNaN(v))) return null;
        const meanA = a.reduce((s, v) => s + v, 0) / a.length;
        const meanB = b.reduce((s, v) => s + v, 0) / b.length;
        const varA = a.reduce((s, v) => s + Math.pow(v - meanA, 2), 0) / (a.length - 1);
        const varB = b.reduce((s, v) => s + Math.pow(v - meanB, 2), 0) / (b.length - 1);
        const se = Math.sqrt(varA / a.length + varB / b.length);
        const t = se === 0 ? Infinity : (meanA - meanB) / se;
        const df = a.length + b.length - 2;
        const absT = Math.abs(t);
        const pApprox =
          absT > 3.5 ? "< 0.01" : absT > 2.0 ? "< 0.05" : absT > 1.7 ? "borderline (~0.05-0.10)" : "> 0.10";
        return {
          primary: { label: "t-Statistic", value: formatNumber(t, 4) },
          details: [
            { label: "Mean A", value: formatNumber(meanA, 4) },
            { label: "Mean B", value: formatNumber(meanB, 4) },
            { label: "Mean Difference", value: formatNumber(meanA - meanB, 4) },
            { label: "Standard Error", value: formatNumber(se, 4) },
            { label: "Degrees of Freedom", value: formatNumber(df) },
            { label: "p-value (approx, two-tailed)", value: pApprox },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["paired-t-test-calculator", "one-way-anova-calculator", "mann-whitney-calculator", "effect-size-calculator"],
  faq: [
    {
      question: "What is a two-sample t-test?",
      answer: "A two-sample t-test compares the means of two independent groups to determine if they are statistically significantly different from each other.",
    },
    {
      question: "What is the difference between pooled and Welch t-test?",
      answer: "The pooled t-test assumes equal variances. The Welch t-test does not assume equal variances and adjusts the degrees of freedom accordingly. Welch is generally more robust.",
    },
  ],
  formula: "t = (mean1 - mean2) / sqrt(s1^2/n1 + s2^2/n2)",
};
