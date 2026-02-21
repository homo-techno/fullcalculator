import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const laplaceTransformCalculator: CalculatorDefinition = {
  slug: "laplace-transform-calculator",
  title: "Laplace Transform Calculator",
  description: "Free Laplace transform calculator. Find Laplace transforms and inverse Laplace transforms of common functions used in differential equations and engineering.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["laplace transform calculator", "inverse laplace transform", "differential equations", "transfer function", "s-domain"],
  variants: [
    {
      id: "common-transforms",
      name: "Common Laplace Transforms",
      description: "Find the Laplace transform of standard functions",
      fields: [
        { name: "func", label: "Function f(t)", type: "select", options: [
          { label: "1 (unit step)", value: "step" },
          { label: "t (ramp)", value: "t" },
          { label: "tⁿ (power)", value: "tn" },
          { label: "eᵃᵗ (exponential)", value: "exp" },
          { label: "sin(ωt)", value: "sin" },
          { label: "cos(ωt)", value: "cos" },
          { label: "t·eᵃᵗ", value: "texp" },
          { label: "eᵃᵗ·sin(ωt)", value: "expsin" },
        ], defaultValue: "step" },
        { name: "param1", label: "Parameter (a, n, or ω)", type: "number", placeholder: "e.g. 2" },
      ],
      calculate: (inputs) => {
        const func = inputs.func as string;
        const p = inputs.param1 as number;

        const transforms: Record<string, { result: string; formula: string; condition: string }> = {
          step: { result: "1/s", formula: "L{1} = 1/s", condition: "s > 0" },
          t: { result: "1/s²", formula: "L{t} = 1/s²", condition: "s > 0" },
          tn: { result: p !== undefined ? `${factorial(p)}/s^${p + 1}` : "n!/s^(n+1)", formula: "L{tⁿ} = n!/s^(n+1)", condition: `s > 0, n = ${p}` },
          exp: { result: p !== undefined ? `1/(s - ${p})` : "1/(s-a)", formula: "L{eᵃᵗ} = 1/(s-a)", condition: `s > ${p || "a"}` },
          sin: { result: p !== undefined ? `${p}/(s² + ${p * p})` : "ω/(s²+ω²)", formula: "L{sin(ωt)} = ω/(s²+ω²)", condition: "s > 0" },
          cos: { result: p !== undefined ? `s/(s² + ${p * p})` : "s/(s²+ω²)", formula: "L{cos(ωt)} = s/(s²+ω²)", condition: "s > 0" },
          texp: { result: p !== undefined ? `1/(s - ${p})²` : "1/(s-a)²", formula: "L{t·eᵃᵗ} = 1/(s-a)²", condition: `s > ${p || "a"}` },
          expsin: { result: p !== undefined ? `Uses combined formula` : "ω/((s-a)²+ω²)", formula: "L{eᵃᵗsin(ωt)} = ω/((s-a)²+ω²)", condition: "s > a" },
        };

        const t = transforms[func];
        if (!t) return null;

        return {
          primary: { label: "L{f(t)} = F(s)", value: t.result },
          details: [
            { label: "Formula", value: t.formula },
            { label: "Region of convergence", value: t.condition },
            { label: "Parameter", value: p !== undefined ? formatNumber(p) : "Not specified" },
          ],
        };
      },
    },
    {
      id: "inverse-laplace",
      name: "Inverse Laplace Transform",
      description: "Find the inverse Laplace transform of common F(s) forms",
      fields: [
        { name: "form", label: "F(s) form", type: "select", options: [
          { label: "1/s → 1", value: "1s" },
          { label: "1/s² → t", value: "1s2" },
          { label: "1/(s-a) → eᵃᵗ", value: "1sa" },
          { label: "ω/(s²+ω²) → sin(ωt)", value: "sin" },
          { label: "s/(s²+ω²) → cos(ωt)", value: "cos" },
          { label: "1/(s-a)² → t·eᵃᵗ", value: "texp" },
        ], defaultValue: "1s" },
        { name: "param", label: "Parameter (a or ω)", type: "number", placeholder: "e.g. 3" },
      ],
      calculate: (inputs) => {
        const form = inputs.form as string;
        const p = inputs.param as number;

        const inverses: Record<string, { result: string; Fs: string }> = {
          "1s": { result: "u(t) = 1", Fs: "1/s" },
          "1s2": { result: "t", Fs: "1/s²" },
          "1sa": { result: p !== undefined ? `e^(${p}t)` : "eᵃᵗ", Fs: p !== undefined ? `1/(s - ${p})` : "1/(s-a)" },
          sin: { result: p !== undefined ? `sin(${p}t)` : "sin(ωt)", Fs: p !== undefined ? `${p}/(s² + ${p * p})` : "ω/(s²+ω²)" },
          cos: { result: p !== undefined ? `cos(${p}t)` : "cos(ωt)", Fs: p !== undefined ? `s/(s² + ${p * p})` : "s/(s²+ω²)" },
          texp: { result: p !== undefined ? `t·e^(${p}t)` : "t·eᵃᵗ", Fs: p !== undefined ? `1/(s - ${p})²` : "1/(s-a)²" },
        };

        const inv = inverses[form];
        if (!inv) return null;

        return {
          primary: { label: "L⁻¹{F(s)} = f(t)", value: inv.result },
          details: [
            { label: "F(s)", value: inv.Fs },
            { label: "For t ≥ 0", value: "Function is 0 for t < 0" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["derivative-calculator", "integral-calculator", "system-of-equations-calculator"],
  faq: [
    { question: "What is the Laplace transform?", answer: "The Laplace transform converts a function of time f(t) into a function of complex frequency F(s) = ∫₀^∞ f(t)e^(-st)dt. It is widely used to solve differential equations by converting them to algebraic equations in the s-domain." },
    { question: "When is the Laplace transform used?", answer: "It is commonly used in engineering for control systems, circuit analysis, signal processing, and solving linear ODEs with constant coefficients. It simplifies differential equations into algebraic ones that are easier to solve." },
  ],
  formula: "L{f(t)} = ∫₀^∞ f(t)e^(-st)dt | L{eᵃᵗ} = 1/(s-a) | L{sin(ωt)} = ω/(s²+ω²)",
};

function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}
