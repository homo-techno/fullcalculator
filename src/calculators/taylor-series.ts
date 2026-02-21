import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

export const taylorSeriesCalculator: CalculatorDefinition = {
  slug: "taylor-series-calculator",
  title: "Taylor Series Calculator",
  description: "Free Taylor and Maclaurin series calculator. Expand common functions into Taylor series and compute approximations at a given point.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["taylor series calculator", "maclaurin series", "taylor expansion", "power series", "series approximation"],
  variants: [
    {
      id: "common-series",
      name: "Common Taylor/Maclaurin Series",
      description: "Expand a common function into its Maclaurin series (centered at 0)",
      fields: [
        { name: "func", label: "Function", type: "select", options: [
          { label: "eˣ", value: "exp" },
          { label: "sin(x)", value: "sin" },
          { label: "cos(x)", value: "cos" },
          { label: "ln(1+x)", value: "ln1x" },
          { label: "1/(1-x)", value: "geometric" },
        ], defaultValue: "exp" },
        { name: "x", label: "Evaluate at x", type: "number", placeholder: "e.g. 1" },
        { name: "terms", label: "Number of terms", type: "select", options: [
          { label: "3 terms", value: "3" },
          { label: "5 terms", value: "5" },
          { label: "7 terms", value: "7" },
          { label: "10 terms", value: "10" },
        ], defaultValue: "5" },
      ],
      calculate: (inputs) => {
        const func = inputs.func as string;
        const x = inputs.x as number;
        const n = parseInt(inputs.terms as string) || 5;
        if (x === undefined) return null;

        let approx = 0;
        let exact = 0;
        let seriesStr = "";

        switch (func) {
          case "exp":
            exact = Math.exp(x);
            for (let k = 0; k < n; k++) {
              approx += Math.pow(x, k) / factorial(k);
            }
            seriesStr = "1 + x + x²/2! + x³/3! + x⁴/4! + ...";
            break;
          case "sin":
            exact = Math.sin(x);
            for (let k = 0; k < n; k++) {
              approx += Math.pow(-1, k) * Math.pow(x, 2 * k + 1) / factorial(2 * k + 1);
            }
            seriesStr = "x - x³/3! + x⁵/5! - x⁷/7! + ...";
            break;
          case "cos":
            exact = Math.cos(x);
            for (let k = 0; k < n; k++) {
              approx += Math.pow(-1, k) * Math.pow(x, 2 * k) / factorial(2 * k);
            }
            seriesStr = "1 - x²/2! + x⁴/4! - x⁶/6! + ...";
            break;
          case "ln1x":
            if (x <= -1 || x > 1) return null;
            exact = Math.log(1 + x);
            for (let k = 1; k <= n; k++) {
              approx += Math.pow(-1, k + 1) * Math.pow(x, k) / k;
            }
            seriesStr = "x - x²/2 + x³/3 - x⁴/4 + ...";
            break;
          case "geometric":
            if (Math.abs(x) >= 1) return null;
            exact = 1 / (1 - x);
            for (let k = 0; k < n; k++) {
              approx += Math.pow(x, k);
            }
            seriesStr = "1 + x + x² + x³ + x⁴ + ...";
            break;
        }

        const error = Math.abs(exact - approx);

        return {
          primary: { label: `${n}-term approximation at x=${x}`, value: formatNumber(approx, 10) },
          details: [
            { label: "Series", value: seriesStr },
            { label: "Exact value", value: formatNumber(exact, 10) },
            { label: "Approximation error", value: error.toExponential(4) },
            { label: "Terms used", value: String(n) },
          ],
        };
      },
    },
    {
      id: "taylor-point",
      name: "Taylor Series (centered at a)",
      description: "Approximate f(x) = eˣ using Taylor series centered at point a",
      fields: [
        { name: "x", label: "Evaluate at x", type: "number", placeholder: "e.g. 1.5" },
        { name: "a", label: "Center point a", type: "number", placeholder: "e.g. 1" },
        { name: "terms", label: "Number of terms", type: "select", options: [
          { label: "3 terms", value: "3" },
          { label: "5 terms", value: "5" },
          { label: "8 terms", value: "8" },
        ], defaultValue: "5" },
      ],
      calculate: (inputs) => {
        const x = inputs.x as number;
        const a = inputs.a as number;
        const n = parseInt(inputs.terms as string) || 5;
        if (x === undefined || a === undefined) return null;

        const exact = Math.exp(x);
        const ea = Math.exp(a);
        let approx = 0;
        for (let k = 0; k < n; k++) {
          approx += ea * Math.pow(x - a, k) / factorial(k);
        }
        const error = Math.abs(exact - approx);

        return {
          primary: { label: `eˣ at x=${x}, centered at a=${a}`, value: formatNumber(approx, 10) },
          details: [
            { label: "Exact eˣ", value: formatNumber(exact, 10) },
            { label: "Approximation error", value: error.toExponential(4) },
            { label: "Formula", value: `Σ eᵃ·(x-a)ⁿ/n! for n=0 to ${n - 1}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["derivative-calculator", "integral-calculator", "limit-calculator"],
  faq: [
    { question: "What is a Taylor series?", answer: "A Taylor series represents a function as an infinite sum of terms calculated from the function's derivatives at a single point. f(x) = Σ f⁽ⁿ⁾(a)/n! · (x-a)ⁿ. When centered at a=0, it's called a Maclaurin series." },
    { question: "What is the difference between Taylor and Maclaurin series?", answer: "A Maclaurin series is simply a Taylor series centered at a = 0. Both are power series expansions, but Maclaurin uses derivatives evaluated at x = 0." },
  ],
  formula: "f(x) = Σ f⁽ⁿ⁾(a)/n! · (x-a)ⁿ | Maclaurin: a = 0 | eˣ = Σ xⁿ/n!",
};
