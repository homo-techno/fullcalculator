import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bayesTheoremCalculator: CalculatorDefinition = {
  slug: "bayes-theorem-calculator",
  title: "Bayes Theorem Calculator",
  description: "Free Bayes theorem calculator. Calculate conditional probability using Bayes' formula with prior, likelihood, and evidence probabilities.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["bayes theorem calculator", "conditional probability", "bayesian probability", "bayes rule", "posterior probability"],
  variants: [
    {
      id: "basic",
      name: "Basic Bayes' Theorem",
      description: "Calculate P(A|B) from P(B|A), P(A), and P(B)",
      fields: [
        { name: "pba", label: "P(B|A) - Likelihood (%)", type: "number", placeholder: "e.g. 90", min: 0, max: 100 },
        { name: "pa", label: "P(A) - Prior probability (%)", type: "number", placeholder: "e.g. 1", min: 0, max: 100 },
        { name: "pb", label: "P(B) - Evidence probability (%)", type: "number", placeholder: "e.g. 5", min: 0, max: 100 },
      ],
      calculate: (inputs) => {
        const pba = (inputs.pba as number) / 100;
        const pa = (inputs.pa as number) / 100;
        const pb = (inputs.pb as number) / 100;
        if (pba === undefined || pa === undefined || pb === undefined || pb === 0) return null;
        if (pba < 0 || pba > 1 || pa < 0 || pa > 1 || pb < 0 || pb > 1) return null;

        const pab = (pba * pa) / pb;
        const clampedPab = Math.min(pab, 1);

        return {
          primary: { label: "P(A|B) - Posterior", value: formatNumber(clampedPab * 100, 4), suffix: "%" },
          details: [
            { label: "P(B|A) × P(A)", value: formatNumber(pba * pa, 6) },
            { label: "P(B)", value: formatNumber(pb, 6) },
            { label: "P(A|B) decimal", value: formatNumber(clampedPab, 6) },
            { label: "Odds ratio", value: formatNumber(clampedPab / (1 - clampedPab), 4) },
            { label: "Formula", value: "P(A|B) = P(B|A) × P(A) / P(B)" },
          ],
        };
      },
    },
    {
      id: "two-hypothesis",
      name: "Two-Hypothesis Bayes",
      description: "Calculate P(A|B) when P(B) is computed from P(B|A) and P(B|not A)",
      fields: [
        { name: "pba", label: "P(B|A) - True positive rate (%)", type: "number", placeholder: "e.g. 99", min: 0, max: 100 },
        { name: "pbna", label: "P(B|not A) - False positive rate (%)", type: "number", placeholder: "e.g. 5", min: 0, max: 100 },
        { name: "pa", label: "P(A) - Prior / prevalence (%)", type: "number", placeholder: "e.g. 1", min: 0, max: 100 },
      ],
      calculate: (inputs) => {
        const pba = (inputs.pba as number) / 100;
        const pbna = (inputs.pbna as number) / 100;
        const pa = (inputs.pa as number) / 100;
        if (isNaN(pba) || isNaN(pbna) || isNaN(pa)) return null;

        const pb = pba * pa + pbna * (1 - pa);
        if (pb === 0) return null;
        const pab = (pba * pa) / pb;

        return {
          primary: { label: "P(A|B) - Posterior", value: formatNumber(pab * 100, 4), suffix: "%" },
          details: [
            { label: "P(B) total", value: formatNumber(pb * 100, 4) + "%" },
            { label: "True positives", value: formatNumber(pba * pa * 100, 4) + "%" },
            { label: "False positives", value: formatNumber(pbna * (1 - pa) * 100, 4) + "%" },
            { label: "Positive predictive value", value: formatNumber(pab * 100, 2) + "%" },
            { label: "P(not A|B)", value: formatNumber((1 - pab) * 100, 2) + "%" },
            { label: "Likelihood ratio", value: formatNumber(pba / pbna, 4) },
          ],
          note: "Example: Medical test with 99% sensitivity (P(B|A)) and 5% false positive rate (P(B|not A)) for a disease with 1% prevalence (P(A)).",
        };
      },
    },
  ],
  relatedSlugs: ["probability-calculator", "normal-distribution-calculator", "combinations-calculator"],
  faq: [
    { question: "What is Bayes' Theorem?", answer: "Bayes' Theorem calculates the probability of an event based on prior knowledge of related conditions. P(A|B) = P(B|A) × P(A) / P(B). It updates the probability of hypothesis A given new evidence B." },
    { question: "What is a real-world example of Bayes' Theorem?", answer: "Medical testing: If a disease affects 1% of people, a test is 99% accurate for positives and 5% false positive rate, then a positive test result means only ~17% chance of actually having the disease. The low prior probability significantly affects the posterior." },
  ],
  formula: "P(A|B) = P(B|A) × P(A) / P(B) | P(B) = P(B|A)P(A) + P(B|¬A)P(¬A)",
};
