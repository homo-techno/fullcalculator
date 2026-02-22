import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const interquartileRangeCalculator: CalculatorDefinition = {
  slug: "interquartile-range-calculator",
  title: "Interquartile Range Calculator",
  description: "Free IQR calculator. Calculate the interquartile range, quartiles, and identify potential outliers from a dataset.",
  category: "Math", categorySlug: "math", icon: "+",
  keywords: ["interquartile range calculator", "iqr", "quartiles", "q1 q3", "outlier detection"],
  variants: [{
    id: "data-entry", name: "From Data (8 values)",
    fields: [
      { name: "v1", label: "Value 1", type: "number", placeholder: "e.g. 2" },
      { name: "v2", label: "Value 2", type: "number", placeholder: "e.g. 5" },
      { name: "v3", label: "Value 3", type: "number", placeholder: "e.g. 7" },
      { name: "v4", label: "Value 4", type: "number", placeholder: "e.g. 10" },
      { name: "v5", label: "Value 5", type: "number", placeholder: "e.g. 12" },
      { name: "v6", label: "Value 6", type: "number", placeholder: "e.g. 15" },
      { name: "v7", label: "Value 7", type: "number", placeholder: "e.g. 18" },
      { name: "v8", label: "Value 8", type: "number", placeholder: "e.g. 22" },
    ],
    calculate: (inputs) => {
      const vals = [inputs.v1, inputs.v2, inputs.v3, inputs.v4, inputs.v5, inputs.v6, inputs.v7, inputs.v8] as number[];
      const data = vals.filter((v) => v !== undefined && !isNaN(v));
      if (data.length < 4) return null;
      data.sort((a, b) => a - b);
      const n = data.length;
      function pct(arr: number[], p: number) {
        const i = (p / 100) * (arr.length - 1);
        const lo = Math.floor(i), hi = Math.ceil(i);
        return lo === hi ? arr[lo] : arr[lo] + (arr[hi] - arr[lo]) * (i - lo);
      }
      const q1 = pct(data, 25), q2 = pct(data, 50), q3 = pct(data, 75);
      const iqr = q3 - q1;
      const lf = q1 - 1.5 * iqr, uf = q3 + 1.5 * iqr;
      const outliers = data.filter((v) => v < lf || v > uf);
      return {
        primary: { label: "IQR", value: formatNumber(iqr, 4) },
        details: [
          { label: "Q1 (25th)", value: formatNumber(q1, 4) },
          { label: "Q2 (Median)", value: formatNumber(q2, 4) },
          { label: "Q3 (75th)", value: formatNumber(q3, 4) },
          { label: "Lower Fence", value: formatNumber(lf, 4) },
          { label: "Upper Fence", value: formatNumber(uf, 4) },
          { label: "Outliers", value: outliers.length > 0 ? outliers.map((v) => formatNumber(v)).join(", ") : "None" },
          { label: "Min", value: formatNumber(data[0], 4) },
          { label: "Max", value: formatNumber(data[n - 1], 4) },
        ],
      };
    },
  }],
  relatedSlugs: ["box-plot-calculator", "percentile-rank-calculator", "skewness-kurtosis-calculator"],
  faq: [{ question: "What is the interquartile range?", answer: "The IQR is Q3 - Q1, measuring the spread of the middle 50% of data. It is robust to outliers." }],
  formula: "IQR = Q3 - Q1. Outlier fences: Q1-1.5*IQR and Q3+1.5*IQR",
};
