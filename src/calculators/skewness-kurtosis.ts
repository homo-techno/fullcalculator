import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const skewnessKurtosisCalculator: CalculatorDefinition = {
  slug: "skewness-kurtosis-calculator",
  title: "Skewness and Kurtosis Calculator",
  description: "Free skewness and kurtosis calculator. Measure the asymmetry and peakedness of a distribution from sample data.",
  category: "Math", categorySlug: "math", icon: "+",
  keywords: ["skewness calculator", "kurtosis calculator", "distribution shape", "asymmetry", "peakedness"],
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
      if (data.length < 3) return null;
      const n = data.length;
      const mean = data.reduce((s, v) => s + v, 0) / n;
      const m2 = data.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / n;
      const m3 = data.reduce((s, v) => s + Math.pow(v - mean, 3), 0) / n;
      const m4 = data.reduce((s, v) => s + Math.pow(v - mean, 4), 0) / n;
      const sd = Math.sqrt(m2);
      const skew = sd === 0 ? 0 : m3 / Math.pow(sd, 3);
      const kurt = sd === 0 ? 0 : m4 / Math.pow(sd, 4);
      const exKurt = kurt - 3;
      const skewI = Math.abs(skew) < 0.5 ? "Approximately symmetric" : skew > 0 ? "Right-skewed" : "Left-skewed";
      const kurtI = Math.abs(exKurt) < 1 ? "Mesokurtic (normal-like)" : exKurt > 0 ? "Leptokurtic (heavy-tailed)" : "Platykurtic (light-tailed)";
      return {
        primary: { label: "Skewness", value: formatNumber(skew, 4) },
        details: [
          { label: "Kurtosis", value: formatNumber(kurt, 4) },
          { label: "Excess Kurtosis", value: formatNumber(exKurt, 4) },
          { label: "Mean", value: formatNumber(mean, 4) },
          { label: "Std Dev", value: formatNumber(sd, 4) },
          { label: "Skewness Interpretation", value: skewI },
          { label: "Kurtosis Interpretation", value: kurtI },
          { label: "n", value: formatNumber(n) },
        ],
      };
    },
  }],
  relatedSlugs: ["interquartile-range-calculator", "coefficient-variation-calculator", "box-plot-calculator"],
  faq: [
    { question: "What is skewness?", answer: "Skewness measures asymmetry. Zero = symmetric, positive = right-skewed, negative = left-skewed." },
    { question: "What is kurtosis?", answer: "Kurtosis measures tailedness. Excess kurtosis > 0 = heavier tails than normal, < 0 = lighter tails." },
  ],
  formula: "Skewness = m3/sd^3, Kurtosis = m4/sd^4, Excess Kurtosis = Kurtosis - 3",
};
