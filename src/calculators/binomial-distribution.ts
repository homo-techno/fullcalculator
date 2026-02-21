import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function combination(n: number, r: number): number {
  if (r > n || r < 0) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

function binomialPmf(k: number, n: number, p: number): number {
  return combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

export const binomialDistributionCalculator: CalculatorDefinition = {
  slug: "binomial-distribution-calculator",
  title: "Binomial Distribution Calculator",
  description: "Free binomial distribution calculator. Calculate binomial probabilities, cumulative probability, mean, variance, and standard deviation.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["binomial distribution calculator", "binomial probability", "binomial formula", "n trials k successes", "bernoulli trials"],
  variants: [
    {
      id: "exact",
      name: "Exact Binomial Probability P(X = k)",
      description: "Probability of exactly k successes in n trials",
      fields: [
        { name: "n", label: "n (number of trials)", type: "number", placeholder: "e.g. 10", min: 1, max: 100 },
        { name: "k", label: "k (number of successes)", type: "number", placeholder: "e.g. 3", min: 0 },
        { name: "p", label: "p (probability of success)", type: "number", placeholder: "e.g. 0.5", min: 0, max: 1, step: 0.01 },
      ],
      calculate: (inputs) => {
        const n = inputs.n as number;
        const k = inputs.k as number;
        const p = inputs.p as number;
        if (n === undefined || k === undefined || p === undefined || k > n || p < 0 || p > 1) return null;

        const prob = binomialPmf(k, n, p);
        const mean = n * p;
        const variance = n * p * (1 - p);
        const stdDev = Math.sqrt(variance);

        // Cumulative probabilities
        let cumLessEq = 0;
        for (let i = 0; i <= k; i++) cumLessEq += binomialPmf(i, n, p);

        return {
          primary: { label: `P(X = ${k})`, value: formatNumber(prob * 100, 6), suffix: "%" },
          details: [
            { label: "P(X = k) decimal", value: formatNumber(prob, 8) },
            { label: `P(X ≤ ${k})`, value: formatNumber(cumLessEq * 100, 6) + "%" },
            { label: `P(X > ${k})`, value: formatNumber((1 - cumLessEq) * 100, 6) + "%" },
            { label: `P(X ≥ ${k})`, value: formatNumber((1 - cumLessEq + prob) * 100, 6) + "%" },
            { label: "Mean (np)", value: formatNumber(mean, 4) },
            { label: "Variance (np(1-p))", value: formatNumber(variance, 4) },
            { label: "Std deviation", value: formatNumber(stdDev, 4) },
            { label: `C(${n},${k})`, value: formatNumber(combination(n, k), 0) },
          ],
        };
      },
    },
    {
      id: "cumulative",
      name: "Cumulative Binomial P(X ≤ k)",
      description: "Probability of at most k successes",
      fields: [
        { name: "n", label: "n (number of trials)", type: "number", placeholder: "e.g. 20", min: 1, max: 100 },
        { name: "k", label: "k (at most this many successes)", type: "number", placeholder: "e.g. 5", min: 0 },
        { name: "p", label: "p (probability of success)", type: "number", placeholder: "e.g. 0.3", min: 0, max: 1, step: 0.01 },
      ],
      calculate: (inputs) => {
        const n = inputs.n as number;
        const k = inputs.k as number;
        const p = inputs.p as number;
        if (n === undefined || k === undefined || p === undefined || k > n || p < 0 || p > 1) return null;

        let cumProb = 0;
        for (let i = 0; i <= k; i++) cumProb += binomialPmf(i, n, p);

        // Most likely value (mode)
        const mode = Math.floor((n + 1) * p);

        return {
          primary: { label: `P(X ≤ ${k})`, value: formatNumber(cumProb * 100, 6), suffix: "%" },
          details: [
            { label: `P(X > ${k})`, value: formatNumber((1 - cumProb) * 100, 6) + "%" },
            { label: `P(X = ${k})`, value: formatNumber(binomialPmf(k, n, p) * 100, 6) + "%" },
            { label: "Mean", value: formatNumber(n * p, 4) },
            { label: "Mode (most likely)", value: String(mode) },
            { label: "Std deviation", value: formatNumber(Math.sqrt(n * p * (1 - p)), 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["poisson-distribution-calculator", "normal-distribution-calculator", "probability-calculator"],
  faq: [
    { question: "What is the binomial distribution?", answer: "The binomial distribution models the number of successes in n independent trials, each with probability p. Examples: number of heads in 10 coin flips, number of defective items in a batch, or passing/failing students on an exam." },
    { question: "What are the conditions for binomial distribution?", answer: "Four conditions must hold: (1) Fixed number of trials n, (2) Each trial has exactly two outcomes (success/failure), (3) Probability p is constant across trials, (4) Trials are independent." },
  ],
  formula: "P(X=k) = C(n,k) × pᵏ × (1-p)^(n-k) | Mean = np | Variance = np(1-p)",
};
