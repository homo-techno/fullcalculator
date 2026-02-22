import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const spearmanCorrelationCalculator: CalculatorDefinition = {
  slug: "spearman-correlation-calculator",
  title: "Spearman Rank Correlation Calculator",
  description: "Free Spearman rank correlation calculator. Calculate the monotonic relationship between two ranked variables.",
  category: "Math", categorySlug: "math", icon: "+",
  keywords: ["spearman correlation", "rank correlation", "spearman rho", "monotonic relationship"],
  variants: [{
    id: "raw-data", name: "From Paired Data (6 pairs)",
    fields: [
      { name: "x1", label: "X1", type: "number", placeholder: "e.g. 1" },
      { name: "y1", label: "Y1", type: "number", placeholder: "e.g. 10" },
      { name: "x2", label: "X2", type: "number", placeholder: "e.g. 2" },
      { name: "y2", label: "Y2", type: "number", placeholder: "e.g. 20" },
      { name: "x3", label: "X3", type: "number", placeholder: "e.g. 3" },
      { name: "y3", label: "Y3", type: "number", placeholder: "e.g. 30" },
      { name: "x4", label: "X4", type: "number", placeholder: "e.g. 4" },
      { name: "y4", label: "Y4", type: "number", placeholder: "e.g. 25" },
      { name: "x5", label: "X5", type: "number", placeholder: "e.g. 5" },
      { name: "y5", label: "Y5", type: "number", placeholder: "e.g. 35" },
      { name: "x6", label: "X6", type: "number", placeholder: "e.g. 6" },
      { name: "y6", label: "Y6", type: "number", placeholder: "e.g. 40" },
    ],
    calculate: (inputs) => {
      const x = [inputs.x1, inputs.x2, inputs.x3, inputs.x4, inputs.x5, inputs.x6] as number[];
      const y = [inputs.y1, inputs.y2, inputs.y3, inputs.y4, inputs.y5, inputs.y6] as number[];
      if ([...x, ...y].some((v) => v === undefined || isNaN(v))) return null;
      const n = x.length;
      function rank(arr: number[]) {
        const sorted = arr.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
        const ranks = new Array(n);
        let i = 0;
        while (i < n) { let j = i; while (j < n && sorted[j].v === sorted[i].v) j++; const avg = (i + 1 + j) / 2; for (let k = i; k < j; k++) ranks[sorted[k].i] = avg; i = j; }
        return ranks;
      }
      const rx = rank(x), ry = rank(y);
      const dSq = rx.reduce((s, r, i) => s + Math.pow(r - ry[i], 2), 0);
      const rho = 1 - (6 * dSq) / (n * (n * n - 1));
      const t = rho * Math.sqrt((n - 2) / (1 - rho * rho));
      const absT = Math.abs(t);
      const pApprox = absT > 3.5 ? "< 0.01" : absT > 2.0 ? "< 0.05" : "> 0.10";
      const strength = Math.abs(rho) >= 0.7 ? "Strong" : Math.abs(rho) >= 0.4 ? "Moderate" : Math.abs(rho) >= 0.2 ? "Weak" : "Negligible";
      return {
        primary: { label: "Spearman rho", value: formatNumber(rho, 4) },
        details: [
          { label: "Sum of d^2", value: formatNumber(dSq, 4) },
          { label: "t-Statistic", value: formatNumber(t, 4) },
          { label: "p-value (approx)", value: pApprox },
          { label: "Strength", value: strength },
          { label: "n", value: formatNumber(n) },
        ],
      };
    },
  }],
  relatedSlugs: ["interquartile-range-calculator", "percentile-rank-calculator"],
  faq: [{ question: "What is Spearman rank correlation?", answer: "Spearman rho measures the strength and direction of a monotonic relationship between two variables using ranks, without assuming linearity." }],
  formula: "rho = 1 - 6*sum(d^2) / (n*(n^2-1))",
};
