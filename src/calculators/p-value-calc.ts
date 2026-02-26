import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

// Approximation of the standard normal CDF using Abramowitz and Stegun
function normalCDF(z: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.sqrt(2);
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1.0 + sign * y);
}

// Approximation of t-distribution CDF using regularized incomplete beta function
function tCDF(t: number, df: number): number {
  const x = df / (df + t * t);
  const a = df / 2;
  const b = 0.5;
  const ibeta = incompleteBeta(x, a, b);
  if (t >= 0) {
    return 1 - 0.5 * ibeta;
  } else {
    return 0.5 * ibeta;
  }
}

function incompleteBeta(x: number, a: number, b: number): number {
  // Continued fraction approximation
  const lnBeta = lgamma(a) + lgamma(b) - lgamma(a + b);
  const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lnBeta) / a;
  let f = 1, c = 1, d = 0;
  for (let i = 0; i <= 200; i++) {
    let m = Math.floor(i / 2);
    let numerator: number;
    if (i === 0) {
      numerator = 1;
    } else if (i % 2 === 0) {
      numerator = (m * (b - m) * x) / ((a + 2 * m - 1) * (a + 2 * m));
    } else {
      numerator = -((a + m) * (a + b + m) * x) / ((a + 2 * m) * (a + 2 * m + 1));
    }
    d = 1 + numerator * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    d = 1 / d;
    c = 1 + numerator / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    f *= c * d;
    if (Math.abs(c * d - 1) < 1e-10) break;
  }
  return front * (f - 1);
}

function lgamma(x: number): number {
  const cof = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.001208650973866179, -0.000005395239384953];
  let ser = 1.000000000190015;
  let tmp = x + 5.5;
  tmp -= (x - 0.5) * Math.log(tmp);
  for (let j = 0; j < 6; j++) {
    ser += cof[j] / (x + 1 + j);
  }
  return -tmp + Math.log(2.5066282746310005 * ser / x);
}

// Chi-square CDF approximation
function chiSquareCDF(x: number, k: number): number {
  if (x <= 0) return 0;
  return lowerGamma(k / 2, x / 2) / gamma(k / 2);
}

function gamma(z: number): number {
  return Math.exp(lgamma(z));
}

function lowerGamma(s: number, x: number): number {
  // Series expansion
  let sum = 0;
  let term = 1 / s;
  for (let n = 0; n < 200; n++) {
    sum += term;
    term *= x / (s + n + 1);
    if (Math.abs(term) < 1e-12) break;
  }
  return Math.pow(x, s) * Math.exp(-x) * sum;
}

export const pValueCalculator: CalculatorDefinition = {
  slug: "p-value-calculator",
  title: "P-Value Calculator",
  description: "Free P-value calculator from test statistic. Compute p-values for z-tests, t-tests, and chi-square tests with one or two-tailed options.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["p-value calculator", "z-test p-value", "t-test p-value", "chi-square p-value", "significance test", "hypothesis testing"],
  variants: [
    {
      id: "z-test",
      name: "Z-Test P-Value",
      description: "Calculate p-value from a z-score (standard normal distribution)",
      fields: [
        { name: "zScore", label: "Z-Score", type: "number", placeholder: "e.g. 1.96", step: 0.01 },
        {
          name: "tail",
          label: "Tail Type",
          type: "select",
          options: [
            { label: "Two-tailed", value: "two" },
            { label: "Left-tailed", value: "left" },
            { label: "Right-tailed", value: "right" },
          ],
          defaultValue: "two",
        },
      ],
      calculate: (inputs) => {
        const z = parseFloat(inputs.zScore as string);
        const tail = (inputs.tail as string) || "two";
        if (isNaN(z)) return null;

        let pValue: number;
        if (tail === "left") {
          pValue = normalCDF(z);
        } else if (tail === "right") {
          pValue = 1 - normalCDF(z);
        } else {
          pValue = 2 * (1 - normalCDF(Math.abs(z)));
        }
        const significant05 = pValue < 0.05 ? "Yes" : "No";
        const significant01 = pValue < 0.01 ? "Yes" : "No";

        return {
          primary: { label: "P-Value", value: formatNumber(pValue, 6) },
          details: [
            { label: "Z-Score", value: formatNumber(z, 4) },
            { label: "Tail Type", value: tail === "two" ? "Two-tailed" : tail === "left" ? "Left-tailed" : "Right-tailed" },
            { label: "Significant at 0.05?", value: significant05 },
            { label: "Significant at 0.01?", value: significant01 },
          ],
        };
      },
    },
    {
      id: "t-test",
      name: "T-Test P-Value",
      description: "Calculate p-value from a t-statistic and degrees of freedom",
      fields: [
        { name: "tStat", label: "T-Statistic", type: "number", placeholder: "e.g. 2.5", step: 0.01 },
        { name: "df", label: "Degrees of Freedom", type: "number", placeholder: "e.g. 20", min: 1 },
        {
          name: "tail",
          label: "Tail Type",
          type: "select",
          options: [
            { label: "Two-tailed", value: "two" },
            { label: "Left-tailed", value: "left" },
            { label: "Right-tailed", value: "right" },
          ],
          defaultValue: "two",
        },
      ],
      calculate: (inputs) => {
        const t = parseFloat(inputs.tStat as string);
        const df = parseFloat(inputs.df as string);
        const tail = (inputs.tail as string) || "two";
        if (isNaN(t) || isNaN(df) || df < 1) return null;

        const cdf = tCDF(t, df);
        let pValue: number;
        if (tail === "left") {
          pValue = cdf;
        } else if (tail === "right") {
          pValue = 1 - cdf;
        } else {
          pValue = 2 * Math.min(cdf, 1 - cdf);
        }
        pValue = Math.max(0, Math.min(1, pValue));
        const significant05 = pValue < 0.05 ? "Yes" : "No";

        return {
          primary: { label: "P-Value", value: formatNumber(pValue, 6) },
          details: [
            { label: "T-Statistic", value: formatNumber(t, 4) },
            { label: "Degrees of Freedom", value: formatNumber(df, 0) },
            { label: "Tail Type", value: tail === "two" ? "Two-tailed" : tail === "left" ? "Left-tailed" : "Right-tailed" },
            { label: "Significant at 0.05?", value: significant05 },
          ],
        };
      },
    },
    {
      id: "chi-square",
      name: "Chi-Square P-Value",
      description: "Calculate p-value from a chi-square statistic and degrees of freedom",
      fields: [
        { name: "chiSq", label: "Chi-Square Statistic", type: "number", placeholder: "e.g. 5.99", min: 0, step: 0.01 },
        { name: "df", label: "Degrees of Freedom", type: "number", placeholder: "e.g. 2", min: 1 },
      ],
      calculate: (inputs) => {
        const chiSq = parseFloat(inputs.chiSq as string);
        const df = parseFloat(inputs.df as string);
        if (isNaN(chiSq) || isNaN(df) || chiSq < 0 || df < 1) return null;

        const pValue = 1 - chiSquareCDF(chiSq, df);
        const significant05 = pValue < 0.05 ? "Yes" : "No";
        const significant01 = pValue < 0.01 ? "Yes" : "No";

        return {
          primary: { label: "P-Value", value: formatNumber(pValue, 6) },
          details: [
            { label: "Chi-Square Statistic", value: formatNumber(chiSq, 4) },
            { label: "Degrees of Freedom", value: formatNumber(df, 0) },
            { label: "Significant at 0.05?", value: significant05 },
            { label: "Significant at 0.01?", value: significant01 },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["standard-deviation-calculator", "probability-calculator", "percentage-calculator"],
  faq: [
    { question: "What is a p-value?", answer: "A p-value is the probability of observing a test statistic at least as extreme as the one computed, assuming the null hypothesis is true. A small p-value (typically < 0.05) indicates strong evidence against the null hypothesis." },
    { question: "What is the difference between one-tailed and two-tailed tests?", answer: "A two-tailed test checks for any significant difference (greater or less), while a one-tailed test checks for a difference in a specific direction. Two-tailed p-values are twice the one-tailed p-value." },
    { question: "When should I use a z-test vs a t-test?", answer: "Use a z-test when the population standard deviation is known or the sample size is large (n > 30). Use a t-test when the population standard deviation is unknown and the sample size is small." },
  ],
  formula: "Z-test: p = 2(1 - Φ(|z|)) | T-test: p = 2·P(T > |t|, df) | Chi-square: p = 1 - F(χ², df)",
};
