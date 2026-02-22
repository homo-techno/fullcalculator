import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const marginOfErrorCalculator: CalculatorDefinition = {
  slug: "margin-of-error-calculator",
  title: "Margin of Error Calculator",
  description: "Free margin of error calculator. Calculate the margin of error for surveys and polls based on sample size, confidence level, and proportion.",
  category: "Math", categorySlug: "math", icon: "+",
  keywords: ["margin of error calculator", "survey margin", "confidence interval", "poll accuracy"],
  variants: [
    {
      id: "proportion", name: "For Proportion (Survey/Poll)",
      fields: [
        { name: "n", label: "Sample Size", type: "number", placeholder: "e.g. 400", min: 2 },
        { name: "p", label: "Proportion (%)", type: "number", placeholder: "e.g. 50", min: 0, max: 100, defaultValue: 50 },
        { name: "confidence", label: "Confidence Level", type: "select", options: [{ label: "90%", value: "90" }, { label: "95%", value: "95" }, { label: "99%", value: "99" }], defaultValue: "95" },
      ],
      calculate: (inputs) => {
        const n = inputs.n as number;
        const p = (inputs.p as number) / 100;
        const conf = inputs.confidence as string || "95";
        if (n === undefined || isNaN(n) || n < 2) return null;
        if (p < 0 || p > 1) return null;
        const zMap: Record<string, number> = { "90": 1.645, "95": 1.96, "99": 2.576 };
        const z = zMap[conf] || 1.96;
        const moe = z * Math.sqrt((p * (1 - p)) / n);
        return {
          primary: { label: "Margin of Error", value: "+/- " + formatNumber(moe * 100, 2) + "%" },
          details: [
            { label: "CI Lower", value: formatNumber(Math.max(0, p - moe) * 100, 2) + "%" },
            { label: "CI Upper", value: formatNumber(Math.min(1, p + moe) * 100, 2) + "%" },
            { label: "z-Score", value: formatNumber(z, 4) },
            { label: "Sample Size", value: formatNumber(n) },
          ],
        };
      },
    },
    {
      id: "sample-size", name: "Required Sample Size",
      fields: [
        { name: "moe", label: "Desired MoE (%)", type: "number", placeholder: "e.g. 3", min: 0.1 },
        { name: "p", label: "Expected Proportion (%)", type: "number", placeholder: "e.g. 50", min: 0, max: 100, defaultValue: 50 },
        { name: "confidence", label: "Confidence Level", type: "select", options: [{ label: "90%", value: "90" }, { label: "95%", value: "95" }, { label: "99%", value: "99" }], defaultValue: "95" },
      ],
      calculate: (inputs) => {
        const moe = (inputs.moe as number) / 100;
        const p = (inputs.p as number) / 100;
        const conf = inputs.confidence as string || "95";
        if (isNaN(moe) || moe <= 0) return null;
        const zMap: Record<string, number> = { "90": 1.645, "95": 1.96, "99": 2.576 };
        const z = zMap[conf] || 1.96;
        const n = Math.ceil((z * z * p * (1 - p)) / (moe * moe));
        return {
          primary: { label: "Required Sample Size", value: formatNumber(n) },
          details: [
            { label: "Desired MoE", value: "+/- " + formatNumber(moe * 100, 2) + "%" },
            { label: "z-Score", value: formatNumber(z, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["power-analysis-calculator", "type-i-ii-error-calculator"],
  faq: [{ question: "What is margin of error?", answer: "Margin of error measures the range within which the true population parameter is expected to fall at a given confidence level." }],
  formula: "MoE = z * sqrt(p*(1-p)/n). n = z^2*p*(1-p)/MoE^2",
};
