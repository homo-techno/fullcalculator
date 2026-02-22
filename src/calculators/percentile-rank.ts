import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const percentileRankCalculator: CalculatorDefinition = {
  slug: "percentile-rank-calculator",
  title: "Percentile Rank Calculator",
  description: "Free percentile rank calculator. Determine the percentile rank of a value within a dataset or calculate the value at a given percentile.",
  category: "Math", categorySlug: "math", icon: "+",
  keywords: ["percentile rank calculator", "percentile", "rank", "percentile score"],
  variants: [
    {
      id: "find-rank", name: "Find Percentile Rank of a Value",
      fields: [
        { name: "target", label: "Target Value", type: "number", placeholder: "e.g. 75" },
        { name: "v1", label: "Data 1", type: "number", placeholder: "e.g. 55" },
        { name: "v2", label: "Data 2", type: "number", placeholder: "e.g. 60" },
        { name: "v3", label: "Data 3", type: "number", placeholder: "e.g. 68" },
        { name: "v4", label: "Data 4", type: "number", placeholder: "e.g. 72" },
        { name: "v5", label: "Data 5", type: "number", placeholder: "e.g. 75" },
        { name: "v6", label: "Data 6", type: "number", placeholder: "e.g. 80" },
        { name: "v7", label: "Data 7", type: "number", placeholder: "e.g. 85" },
        { name: "v8", label: "Data 8", type: "number", placeholder: "e.g. 90" },
      ],
      calculate: (inputs) => {
        const target = inputs.target as number;
        const data = [inputs.v1, inputs.v2, inputs.v3, inputs.v4, inputs.v5, inputs.v6, inputs.v7, inputs.v8].filter((v) => v !== undefined && !isNaN(v as number)) as number[];
        if (target === undefined || isNaN(target) || data.length < 2) return null;
        data.sort((a, b) => a - b);
        const below = data.filter((v) => v < target).length;
        const equal = data.filter((v) => v === target).length;
        const pr = ((below + 0.5 * equal) / data.length) * 100;
        return {
          primary: { label: "Percentile Rank", value: formatNumber(pr, 2) + "%" },
          details: [
            { label: "Values Below", value: formatNumber(below) },
            { label: "Values Equal", value: formatNumber(equal) },
            { label: "Total Values", value: formatNumber(data.length) },
            { label: "Min", value: formatNumber(data[0], 4) },
            { label: "Max", value: formatNumber(data[data.length - 1], 4) },
          ],
        };
      },
    },
    {
      id: "from-normal", name: "From Normal Distribution",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 110" },
        { name: "mean", label: "Mean", type: "number", placeholder: "e.g. 100" },
        { name: "sd", label: "Std Dev", type: "number", placeholder: "e.g. 15", min: 0.001 },
      ],
      calculate: (inputs) => {
        const x = inputs.value as number, mu = inputs.mean as number, sd = inputs.sd as number;
        if ([x, mu, sd].some((v) => v === undefined || isNaN(v))) return null;
        if (sd <= 0) return null;
        const z = (x - mu) / sd;
        const t = 1 / (1 + 0.2316419 * Math.abs(z));
        const dd = 0.3989422804 * Math.exp(-z * z / 2);
        const p = dd * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        const cdf = z > 0 ? 1 - p : p;
        return {
          primary: { label: "Percentile", value: formatNumber(cdf * 100, 2) + "%" },
          details: [
            { label: "z-Score", value: formatNumber(z, 4) },
            { label: "Value", value: formatNumber(x, 4) },
            { label: "Mean", value: formatNumber(mu, 4) },
            { label: "Std Dev", value: formatNumber(sd, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["interquartile-range-calculator", "box-plot-calculator"],
  faq: [{ question: "What is a percentile rank?", answer: "The percentile rank indicates the percentage of values in the dataset at or below a given value. The 75th percentile means 75% of values are at or below it." }],
  formula: "PR = ((L + 0.5*S) / N) * 100",
};
