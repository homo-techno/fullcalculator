import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const logarithmCalculator: CalculatorDefinition = {
  slug: "logarithm-calculator",
  title: "Logarithm Calculator",
  description: "Free logarithm calculator. Calculate log base 10, natural log (ln), log base 2, and log of any base.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["logarithm calculator", "log calculator", "log base 10", "natural log calculator", "ln calculator"],
  variants: [
    {
      id: "log",
      name: "Calculate Logarithm",
      fields: [
        { name: "value", label: "Number (x)", type: "number", placeholder: "e.g. 100" },
        { name: "base", label: "Base", type: "select", options: [
          { label: "Base 10 (log)", value: "10" },
          { label: "Natural (ln, base e)", value: "e" },
          { label: "Base 2 (log₂)", value: "2" },
          { label: "Custom", value: "custom" },
        ], defaultValue: "10" },
        { name: "customBase", label: "Custom Base (if selected)", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const x = inputs.value as number;
        const baseStr = inputs.base as string;
        const customBase = inputs.customBase as number;
        if (!x || x <= 0) return null;
        let result: number;
        let label: string;
        if (baseStr === "e") { result = Math.log(x); label = `ln(${x})`; }
        else if (baseStr === "2") { result = Math.log2(x); label = `log₂(${x})`; }
        else if (baseStr === "custom" && customBase && customBase > 0 && customBase !== 1) {
          result = Math.log(x) / Math.log(customBase); label = `log${customBase}(${x})`;
        }
        else { result = Math.log10(x); label = `log₁₀(${x})`; }
        return {
          primary: { label, value: formatNumber(result, 10) },
          details: [
            { label: "log₁₀", value: formatNumber(Math.log10(x), 8) },
            { label: "ln (natural)", value: formatNumber(Math.log(x), 8) },
            { label: "log₂", value: formatNumber(Math.log2(x), 8) },
            { label: "Antilog (10^result)", value: formatNumber(Math.pow(10, result), 6) },
          ],
        };
      },
    },
    {
      id: "antilog",
      name: "Antilogarithm (10^x)",
      fields: [
        { name: "exponent", label: "Exponent (x)", type: "number", placeholder: "e.g. 3" },
        { name: "base", label: "Base", type: "select", options: [
          { label: "Base 10", value: "10" }, { label: "Base e (e^x)", value: "e" }, { label: "Base 2", value: "2" },
        ], defaultValue: "10" },
      ],
      calculate: (inputs) => {
        const exp = inputs.exponent as number;
        const base = inputs.base as string;
        if (exp === undefined) return null;
        const b = base === "e" ? Math.E : base === "2" ? 2 : 10;
        const result = Math.pow(b, exp);
        return {
          primary: { label: `${base === "e" ? "e" : b}^${exp}`, value: isFinite(result) ? formatNumber(result, 8) : result.toExponential(6) },
          details: [
            { label: "10^x", value: formatNumber(Math.pow(10, exp), 6) },
            { label: "e^x", value: formatNumber(Math.exp(exp), 6) },
            { label: "2^x", value: formatNumber(Math.pow(2, exp), 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["scientific-calculator", "exponent-calculator", "square-root-calculator"],
  faq: [
    { question: "What is a logarithm?", answer: "log_b(x) = y means b^y = x. 'b raised to what power equals x?' log₁₀(1000) = 3 because 10³ = 1000. ln(e) = 1 because e¹ = e." },
  ],
  formula: "log_b(x) = ln(x) / ln(b) | log(ab) = log(a) + log(b) | log(a/b) = log(a) - log(b)",
};
