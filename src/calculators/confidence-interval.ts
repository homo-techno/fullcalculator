import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const confidenceIntervalCalculator: CalculatorDefinition = {
  slug: "confidence-interval-calculator",
  title: "Confidence Interval Calculator",
  description:
    "Free confidence interval calculator. Calculate the confidence interval for a population mean using the z-method.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "confidence interval",
    "margin of error",
    "statistics",
    "population mean",
    "z interval",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate Confidence Interval",
      fields: [
        {
          name: "mean",
          label: "Sample Mean (x̄)",
          type: "number",
          placeholder: "e.g. 50",
        },
        {
          name: "stddev",
          label: "Standard Deviation (σ)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "n",
          label: "Sample Size (n)",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "confidence",
          label: "Confidence Level (90, 95, or 99)",
          type: "number",
          placeholder: "e.g. 95",
        },
      ],
      calculate: (inputs) => {
        const mean = inputs.mean as number;
        const stddev = inputs.stddev as number;
        const n = inputs.n as number;
        const confidence = inputs.confidence as number;
        if (mean === undefined || !stddev || !n || !confidence) return null;
        if (n <= 0 || stddev <= 0) return null;

        const zMap: Record<number, number> = {
          90: 1.645,
          95: 1.96,
          99: 2.576,
        };
        const z = zMap[confidence];
        if (!z) return null;

        const marginOfError = z * (stddev / Math.sqrt(n));
        const lower = mean - marginOfError;
        const upper = mean + marginOfError;

        return {
          primary: {
            label: "Confidence Interval",
            value: `[${formatNumber(lower, 4)}, ${formatNumber(upper, 4)}]`,
          },
          details: [
            { label: "Margin of Error", value: formatNumber(marginOfError, 4) },
            { label: "Lower Bound", value: formatNumber(lower, 4) },
            { label: "Upper Bound", value: formatNumber(upper, 4) },
            { label: "Z-value", value: String(z) },
            { label: "Confidence Level", value: `${confidence}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "sample-size-calculator",
    "z-score-calculator",
    "normal-distribution-calculator",
  ],
  faq: [
    {
      question: "What is a confidence interval?",
      answer:
        "A confidence interval is a range of values that is likely to contain the true population parameter with a given level of confidence. A 95% CI means that if we repeated the experiment many times, about 95% of the intervals would contain the true mean.",
    },
  ],
  formula: "CI = x̄ ± z × (σ / √n)",
};
