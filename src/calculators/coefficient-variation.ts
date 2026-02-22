import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const coefficientVariationCalculator: CalculatorDefinition = {
  slug: "coefficient-variation-calculator",
  title: "Coefficient of Variation Calculator",
  description: "Free coefficient of variation calculator. Measure relative variability as a percentage of the mean.",
  category: "Math", categorySlug: "math", icon: "+",
  keywords: ["coefficient of variation", "cv calculator", "relative variability", "relative standard deviation"],
  variants: [
    {
      id: "from-stats", name: "From Mean and Std Dev",
      fields: [
        { name: "mean", label: "Mean", type: "number", placeholder: "e.g. 50" },
        { name: "sd", label: "Standard Deviation", type: "number", placeholder: "e.g. 10", min: 0 },
      ],
      calculate: (inputs) => {
        const mean = inputs.mean as number, sd = inputs.sd as number;
        if ([mean, sd].some((v) => v === undefined || isNaN(v))) return null;
        if (mean === 0) return null;
        const cv = (sd / Math.abs(mean)) * 100;
        return {
          primary: { label: "CV (%)", value: formatNumber(cv, 4) },
          details: [
            { label: "Mean", value: formatNumber(mean, 4) },
            { label: "Std Dev", value: formatNumber(sd, 4) },
            { label: "CV (decimal)", value: formatNumber(cv / 100, 4) },
          ],
        };
      },
    },
    {
      id: "from-data", name: "From Data (6 values)",
      fields: [
        { name: "v1", label: "Value 1", type: "number", placeholder: "e.g. 10" },
        { name: "v2", label: "Value 2", type: "number", placeholder: "e.g. 12" },
        { name: "v3", label: "Value 3", type: "number", placeholder: "e.g. 14" },
        { name: "v4", label: "Value 4", type: "number", placeholder: "e.g. 11" },
        { name: "v5", label: "Value 5", type: "number", placeholder: "e.g. 13" },
        { name: "v6", label: "Value 6", type: "number", placeholder: "e.g. 15" },
      ],
      calculate: (inputs) => {
        const data = [inputs.v1, inputs.v2, inputs.v3, inputs.v4, inputs.v5, inputs.v6].filter((v) => v !== undefined && !isNaN(v as number)) as number[];
        if (data.length < 2) return null;
        const n = data.length;
        const mean = data.reduce((s, v) => s + v, 0) / n;
        if (mean === 0) return null;
        const sd = Math.sqrt(data.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (n - 1));
        const cv = (sd / Math.abs(mean)) * 100;
        return {
          primary: { label: "CV (%)", value: formatNumber(cv, 4) },
          details: [{ label: "Mean", value: formatNumber(mean, 4) }, { label: "Std Dev", value: formatNumber(sd, 4) }, { label: "n", value: formatNumber(n) }],
        };
      },
    },
  ],
  relatedSlugs: ["skewness-kurtosis-calculator", "interquartile-range-calculator"],
  faq: [{ question: "What is the coefficient of variation?", answer: "CV expresses standard deviation as a percentage of the mean, allowing comparison of variability between datasets with different units or scales." }],
  formula: "CV = (SD / |Mean|) * 100%",
};
