import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function poissonPmf(k: number, lambda: number): number {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

export const poissonDistributionCalculator: CalculatorDefinition = {
  slug: "poisson-distribution-calculator",
  title: "Poisson Distribution Calculator",
  description: "Free Poisson distribution calculator. Calculate Poisson probabilities, cumulative distribution, mean, and variance for event counting problems.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["poisson distribution calculator", "poisson probability", "poisson formula", "event probability", "arrival rate"],
  variants: [
    {
      id: "exact",
      name: "Exact Poisson Probability P(X = k)",
      description: "Probability of exactly k events in an interval",
      fields: [
        { name: "lambda", label: "λ (average rate)", type: "number", placeholder: "e.g. 4", min: 0, step: 0.1 },
        { name: "k", label: "k (number of events)", type: "number", placeholder: "e.g. 6", min: 0, max: 170 },
      ],
      calculate: (inputs) => {
        const lambda = inputs.lambda as number;
        const k = inputs.k as number;
        if (lambda === undefined || k === undefined || lambda < 0 || k < 0 || !Number.isInteger(k)) return null;

        const prob = poissonPmf(k, lambda);

        // Cumulative P(X <= k)
        let cumProb = 0;
        for (let i = 0; i <= k; i++) {
          cumProb += poissonPmf(i, lambda);
        }

        return {
          primary: { label: `P(X = ${k})`, value: formatNumber(prob * 100, 6), suffix: "%" },
          details: [
            { label: "P(X = k) decimal", value: prob.toExponential(6) },
            { label: `P(X ≤ ${k})`, value: formatNumber(cumProb * 100, 6) + "%" },
            { label: `P(X > ${k})`, value: formatNumber((1 - cumProb) * 100, 6) + "%" },
            { label: "Mean (λ)", value: formatNumber(lambda) },
            { label: "Variance (λ)", value: formatNumber(lambda) },
            { label: "Std deviation", value: formatNumber(Math.sqrt(lambda), 6) },
            { label: "Formula", value: `e^(-${lambda}) × ${lambda}^${k} / ${k}!` },
          ],
        };
      },
    },
    {
      id: "range",
      name: "Poisson Range Probability",
      description: "Probability of events in a range P(a ≤ X ≤ b)",
      fields: [
        { name: "lambda", label: "λ (average rate)", type: "number", placeholder: "e.g. 5", min: 0, step: 0.1 },
        { name: "lower", label: "Lower bound (a)", type: "number", placeholder: "e.g. 3", min: 0 },
        { name: "upper", label: "Upper bound (b)", type: "number", placeholder: "e.g. 7", min: 0 },
      ],
      calculate: (inputs) => {
        const lambda = inputs.lambda as number;
        const a = inputs.lower as number;
        const b = inputs.upper as number;
        if (lambda === undefined || a === undefined || b === undefined || a > b || lambda < 0) return null;

        let prob = 0;
        for (let i = Math.floor(a); i <= Math.floor(b); i++) {
          prob += poissonPmf(i, lambda);
        }

        let cumLower = 0;
        for (let i = 0; i < Math.floor(a); i++) {
          cumLower += poissonPmf(i, lambda);
        }

        return {
          primary: { label: `P(${a} ≤ X ≤ ${b})`, value: formatNumber(prob * 100, 6), suffix: "%" },
          details: [
            { label: `P(X < ${a})`, value: formatNumber(cumLower * 100, 6) + "%" },
            { label: `P(X > ${b})`, value: formatNumber((1 - cumLower - prob) * 100, 6) + "%" },
            { label: "Mean", value: formatNumber(lambda) },
            { label: "Most likely value (mode)", value: lambda >= 1 ? `${Math.floor(lambda)} or ${Math.ceil(lambda)}` : "0" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["binomial-distribution-calculator", "normal-distribution-calculator", "probability-calculator"],
  faq: [
    { question: "What is the Poisson distribution?", answer: "The Poisson distribution models the number of events occurring in a fixed interval of time or space, given a known average rate (λ). Examples: calls per hour at a call center, typos per page, or accidents per month." },
    { question: "When should I use Poisson vs Binomial?", answer: "Use Poisson when counting events in a continuous interval with a known average rate. Use Binomial for a fixed number of independent trials each with the same probability. Poisson approximates Binomial when n is large and p is small (λ = np)." },
  ],
  formula: "P(X=k) = e^(-λ) × λᵏ / k! | Mean = λ | Variance = λ",
};
