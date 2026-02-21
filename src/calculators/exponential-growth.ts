import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const exponentialGrowthCalculator: CalculatorDefinition = {
  slug: "exponential-growth-calculator",
  title: "Exponential Growth Calculator",
  description: "Free exponential growth and decay calculator. Calculate future values, growth rates, doubling time, and half-life for exponential models.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["exponential growth calculator", "exponential decay", "doubling time calculator", "half-life calculator", "growth rate"],
  variants: [
    {
      id: "growth",
      name: "Exponential Growth/Decay",
      description: "Calculate A = A₀ × eʳᵗ or A = A₀ × (1+r)ᵗ",
      fields: [
        { name: "initial", label: "Initial Value (A₀)", type: "number", placeholder: "e.g. 1000" },
        { name: "rate", label: "Growth Rate (%)", type: "number", placeholder: "e.g. 5", step: 0.1 },
        { name: "time", label: "Time (t)", type: "number", placeholder: "e.g. 10" },
        { name: "model", label: "Model", type: "select", options: [
          { label: "Continuous (eʳᵗ)", value: "continuous" },
          { label: "Discrete ((1+r)ᵗ)", value: "discrete" },
        ], defaultValue: "continuous" },
      ],
      calculate: (inputs) => {
        const A0 = inputs.initial as number;
        const rPct = inputs.rate as number;
        const t = inputs.time as number;
        const model = inputs.model as string;
        if (A0 === undefined || rPct === undefined || t === undefined) return null;

        const r = rPct / 100;
        let result: number;
        let formula: string;

        if (model === "continuous") {
          result = A0 * Math.exp(r * t);
          formula = `${A0} × e^(${formatNumber(r, 4)} × ${t})`;
        } else {
          result = A0 * Math.pow(1 + r, t);
          formula = `${A0} × (1 + ${formatNumber(r, 4)})^${t}`;
        }

        const doublingTime = r > 0 ? (model === "continuous" ? Math.log(2) / r : Math.log(2) / Math.log(1 + r)) : Infinity;
        const halfLife = r < 0 ? (model === "continuous" ? Math.log(2) / Math.abs(r) : Math.log(2) / Math.log(1 / (1 + r))) : Infinity;
        const totalChange = result - A0;
        const pctChange = ((result - A0) / Math.abs(A0)) * 100;

        return {
          primary: { label: "Final Value A(t)", value: formatNumber(result, 4) },
          details: [
            { label: "Formula", value: formula },
            { label: "Total change", value: formatNumber(totalChange, 4) },
            { label: "Percentage change", value: formatNumber(pctChange, 2) + "%" },
            { label: "Growth type", value: r > 0 ? "Growth" : r < 0 ? "Decay" : "No change" },
            { label: r > 0 ? "Doubling time" : "Half-life", value: r !== 0 ? formatNumber(r > 0 ? doublingTime : halfLife, 4) : "N/A" },
          ],
        };
      },
    },
    {
      id: "find-rate",
      name: "Find Growth Rate",
      description: "Find the rate given initial value, final value, and time",
      fields: [
        { name: "initial", label: "Initial Value (A₀)", type: "number", placeholder: "e.g. 500" },
        { name: "final", label: "Final Value (A)", type: "number", placeholder: "e.g. 1200" },
        { name: "time", label: "Time (t)", type: "number", placeholder: "e.g. 5" },
        { name: "model", label: "Model", type: "select", options: [
          { label: "Continuous (eʳᵗ)", value: "continuous" },
          { label: "Discrete ((1+r)ᵗ)", value: "discrete" },
        ], defaultValue: "continuous" },
      ],
      calculate: (inputs) => {
        const A0 = inputs.initial as number;
        const A = inputs.final as number;
        const t = inputs.time as number;
        const model = inputs.model as string;
        if (!A0 || !A || !t || A0 <= 0 || A <= 0 || t === 0) return null;

        let r: number;
        if (model === "continuous") {
          r = Math.log(A / A0) / t;
        } else {
          r = Math.pow(A / A0, 1 / t) - 1;
        }

        return {
          primary: { label: "Growth Rate", value: formatNumber(r * 100, 6), suffix: "%" },
          details: [
            { label: "Rate (decimal)", value: formatNumber(r, 8) },
            { label: "Ratio A/A₀", value: formatNumber(A / A0, 6) },
            { label: "Doubling time", value: r > 0 ? formatNumber(Math.log(2) / (model === "continuous" ? r : Math.log(1 + r)), 4) : "N/A (not growing)" },
            { label: "Rule of 72 estimate", value: r > 0 ? formatNumber(72 / (r * 100), 2) : "N/A" },
          ],
        };
      },
    },
    {
      id: "doubling-halflife",
      name: "Doubling Time / Half-Life",
      description: "Calculate doubling time or half-life from a rate",
      fields: [
        { name: "rate", label: "Rate (%)", type: "number", placeholder: "e.g. 7", step: 0.1 },
        { name: "type", label: "Calculate", type: "select", options: [
          { label: "Doubling time (growth)", value: "doubling" },
          { label: "Half-life (decay)", value: "halflife" },
        ], defaultValue: "doubling" },
      ],
      calculate: (inputs) => {
        const rPct = inputs.rate as number;
        const type = inputs.type as string;
        if (rPct === undefined || rPct === 0) return null;

        const r = Math.abs(rPct) / 100;
        const exact = Math.log(2) / r;
        const rule72 = 72 / Math.abs(rPct);
        const rule70 = 70 / Math.abs(rPct);

        const label = type === "doubling" ? "Doubling Time" : "Half-Life";

        return {
          primary: { label, value: formatNumber(exact, 4) },
          details: [
            { label: "Exact (ln(2)/r)", value: formatNumber(exact, 6) },
            { label: "Rule of 72", value: formatNumber(rule72, 2) },
            { label: "Rule of 70", value: formatNumber(rule70, 2) },
            { label: "Rate used", value: formatNumber(r * 100, 4) + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["logarithm-calculator", "compound-interest-calculator", "logarithm-solver-calculator"],
  faq: [
    { question: "What is exponential growth?", answer: "Exponential growth occurs when a quantity increases at a rate proportional to its current value. The formula is A(t) = A₀eʳᵗ (continuous) or A(t) = A₀(1+r)ᵗ (discrete). Examples: population growth, compound interest, viral spread." },
    { question: "What is the Rule of 72?", answer: "The Rule of 72 is a quick estimate: doubling time ≈ 72 / growth rate (%). For example, at 8% growth, the doubling time is approximately 72/8 = 9 periods. It's most accurate for rates between 2% and 12%." },
  ],
  formula: "A(t) = A₀eʳᵗ | Doubling: t = ln(2)/r | Half-life: t₁/₂ = ln(2)/|r| | Rule of 72: t ≈ 72/r%",
};
