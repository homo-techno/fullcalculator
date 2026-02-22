import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boxPlotCalculator: CalculatorDefinition = {
  slug: "box-plot-calculator",
  title: "Box Plot Calculator (5-Number Summary)",
  description: "Free box plot calculator. Compute the 5-number summary (min, Q1, median, Q3, max) and detect outliers for box-and-whisker plots.",
  category: "Math", categorySlug: "math", icon: "+",
  keywords: ["box plot calculator", "box and whisker", "five number summary", "outlier detection"],
  variants: [{
    id: "data-entry", name: "From Data (10 values)",
    fields: [
      { name: "v1", label: "Value 1", type: "number", placeholder: "e.g. 5" },
      { name: "v2", label: "Value 2", type: "number", placeholder: "e.g. 12" },
      { name: "v3", label: "Value 3", type: "number", placeholder: "e.g. 15" },
      { name: "v4", label: "Value 4", type: "number", placeholder: "e.g. 18" },
      { name: "v5", label: "Value 5", type: "number", placeholder: "e.g. 22" },
      { name: "v6", label: "Value 6", type: "number", placeholder: "e.g. 25" },
      { name: "v7", label: "Value 7", type: "number", placeholder: "e.g. 28" },
      { name: "v8", label: "Value 8", type: "number", placeholder: "e.g. 32" },
      { name: "v9", label: "Value 9", type: "number", placeholder: "e.g. 35" },
      { name: "v10", label: "Value 10", type: "number", placeholder: "e.g. 50" },
    ],
    calculate: (inputs) => {
      const data = [inputs.v1, inputs.v2, inputs.v3, inputs.v4, inputs.v5, inputs.v6, inputs.v7, inputs.v8, inputs.v9, inputs.v10].filter((v) => v !== undefined && !isNaN(v as number)) as number[];
      if (data.length < 4) return null;
      data.sort((a, b) => a - b);
      const n = data.length;
      function pct(arr: number[], p: number) { const i = (p / 100) * (arr.length - 1); const lo = Math.floor(i), hi = Math.ceil(i); return lo === hi ? arr[lo] : arr[lo] + (arr[hi] - arr[lo]) * (i - lo); }
      const mn = data[0], mx = data[n - 1];
      const q1 = pct(data, 25), med = pct(data, 50), q3 = pct(data, 75);
      const iqr = q3 - q1;
      const lf = q1 - 1.5 * iqr, uf = q3 + 1.5 * iqr;
      const outliers = data.filter((v) => v < lf || v > uf);
      return {
        primary: { label: "Median (Q2)", value: formatNumber(med, 4) },
        details: [
          { label: "Minimum", value: formatNumber(mn, 4) },
          { label: "Q1 (25th)", value: formatNumber(q1, 4) },
          { label: "Q3 (75th)", value: formatNumber(q3, 4) },
          { label: "Maximum", value: formatNumber(mx, 4) },
          { label: "IQR", value: formatNumber(iqr, 4) },
          { label: "Lower Whisker", value: formatNumber(Math.max(mn, lf), 4) },
          { label: "Upper Whisker", value: formatNumber(Math.min(mx, uf), 4) },
          { label: "Outliers", value: outliers.length > 0 ? outliers.map((v) => formatNumber(v)).join(", ") : "None" },
          { label: "n", value: formatNumber(n) },
        ],
      };
    },
  }],
  relatedSlugs: ["interquartile-range-calculator", "percentile-rank-calculator", "stem-leaf-plot-calculator"],
  faq: [{ question: "What is a box plot?", answer: "A box plot displays the 5-number summary: min, Q1, median, Q3, max. The box spans Q1 to Q3, with whiskers to the farthest non-outlier points." }],
  formula: "5-Number Summary: Min, Q1, Median, Q3, Max. Fences: Q1-1.5*IQR, Q3+1.5*IQR",
};
