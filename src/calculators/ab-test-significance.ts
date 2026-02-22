import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const abTestSignificanceCalculator: CalculatorDefinition = {
  slug: "ab-test-significance",
  title: "A/B Test Statistical Significance",
  description: "Free A/B test significance calculator. Determine if your A/B test results are statistically significant using conversion rates and sample sizes.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["ab test", "statistical significance", "split test", "conversion test", "hypothesis testing", "p-value"],
  variants: [
    {
      id: "basic",
      name: "A/B Test Significance",
      fields: [
        { name: "visitorsA", label: "Control (A) Visitors", type: "number", placeholder: "e.g. 5000" },
        { name: "conversionsA", label: "Control (A) Conversions", type: "number", placeholder: "e.g. 150" },
        { name: "visitorsB", label: "Variation (B) Visitors", type: "number", placeholder: "e.g. 5000" },
        { name: "conversionsB", label: "Variation (B) Conversions", type: "number", placeholder: "e.g. 185" },
      ],
      calculate: (inputs) => {
        const visitorsA = inputs.visitorsA as number;
        const conversionsA = inputs.conversionsA as number;
        const visitorsB = inputs.visitorsB as number;
        const conversionsB = inputs.conversionsB as number;
        if (!visitorsA || !conversionsA || !visitorsB || !conversionsB) return null;
        const rateA = conversionsA / visitorsA;
        const rateB = conversionsB / visitorsB;
        const pooledRate = (conversionsA + conversionsB) / (visitorsA + visitorsB);
        const se = Math.sqrt(pooledRate * (1 - pooledRate) * (1 / visitorsA + 1 / visitorsB));
        const zScore = (rateB - rateA) / se;
        const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));
        const significant = pValue < 0.05;
        const confidence = (1 - pValue) * 100;
        const lift = ((rateB - rateA) / rateA) * 100;
        function normalCDF(x: number) {
          const t = 1 / (1 + 0.2316419 * Math.abs(x));
          const d = 0.3989422804014327;
          const p = d * Math.exp(-x * x / 2) * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.8212560 + t * 1.3302744))));
          return x > 0 ? 1 - p : p;
        }
        return {
          primary: { label: "Statistical Significance", value: significant ? "Yes (p < 0.05)" : "No (p >= 0.05)" },
          details: [
            { label: "Control Conversion Rate", value: `${formatNumber(rateA * 100, 2)}%` },
            { label: "Variation Conversion Rate", value: `${formatNumber(rateB * 100, 2)}%` },
            { label: "Relative Lift", value: `${formatNumber(lift, 2)}%` },
            { label: "Confidence Level", value: `${formatNumber(confidence, 2)}%` },
            { label: "Z-Score", value: formatNumber(zScore, 4) },
            { label: "P-Value", value: formatNumber(pValue, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ctr-calculator", "bounce-rate", "sales-funnel"],
  faq: [
    { question: "What is statistical significance in A/B testing?", answer: "Statistical significance means the difference in results between your control and variation is unlikely due to chance. A p-value below 0.05 (95% confidence) is the standard threshold for declaring significance." },
    { question: "How long should I run an A/B test?", answer: "Run your test until you have enough sample size for statistical significance, typically at least 1-2 weeks. Ending tests too early can lead to false positives. Aim for at least 100 conversions per variation." },
  ],
  formula: "Z = (Rate_B - Rate_A) / sqrt(P_pooled * (1 - P_pooled) * (1/n_A + 1/n_B))",
};
