import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const logarithmSolverCalculator: CalculatorDefinition = {
  slug: "logarithm-solver-calculator",
  title: "Logarithm Equation Solver",
  description: "Free logarithm equation solver. Solve logarithmic equations, find unknowns in log expressions, and apply logarithm properties step by step.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["logarithm solver", "log equation solver", "solve log equations", "logarithmic equation", "log base solver"],
  variants: [
    {
      id: "solve-for-x",
      name: "Solve logₐ(x) = y",
      description: "Find x given log base a of x equals y",
      fields: [
        { name: "base", label: "Base (a)", type: "number", placeholder: "e.g. 10" },
        { name: "result", label: "Result (y)", type: "number", placeholder: "e.g. 3" },
      ],
      calculate: (inputs) => {
        const a = inputs.base as number;
        const y = inputs.result as number;
        if (a === undefined || y === undefined || a <= 0 || a === 1) return null;

        const x = Math.pow(a, y);

        return {
          primary: { label: `logₐ(x) = ${y} → x`, value: formatNumber(x, 8) },
          details: [
            { label: "Equation", value: `log_${a}(x) = ${y}` },
            { label: "Solution", value: `x = ${a}^${y} = ${formatNumber(x, 8)}` },
            { label: "Conversion", value: `log_${a}(x) = ${y} means ${a}^${y} = x` },
            { label: "Verification", value: `log_${a}(${formatNumber(x, 4)}) = ${formatNumber(Math.log(x) / Math.log(a), 6)}` },
          ],
        };
      },
    },
    {
      id: "solve-for-base",
      name: "Solve logₐ(x) = y for base a",
      description: "Find the base given x and y",
      fields: [
        { name: "x", label: "Argument (x)", type: "number", placeholder: "e.g. 1000" },
        { name: "y", label: "Result (y)", type: "number", placeholder: "e.g. 3" },
      ],
      calculate: (inputs) => {
        const x = inputs.x as number;
        const y = inputs.y as number;
        if (x === undefined || y === undefined || x <= 0 || y === 0) return null;

        const base = Math.pow(x, 1 / y);

        return {
          primary: { label: "Base (a)", value: formatNumber(base, 8) },
          details: [
            { label: "Equation", value: `log_a(${x}) = ${y}` },
            { label: "Solution", value: `a = ${x}^(1/${y}) = ${formatNumber(base, 8)}` },
            { label: "Meaning", value: `${formatNumber(base, 4)}^${y} = ${x}` },
          ],
        };
      },
    },
    {
      id: "change-of-base",
      name: "Change of Base",
      description: "Convert logₐ(x) to different bases",
      fields: [
        { name: "x", label: "Argument (x)", type: "number", placeholder: "e.g. 50" },
        { name: "fromBase", label: "Original base", type: "number", placeholder: "e.g. 5" },
        { name: "toBase", label: "Convert to base", type: "select", options: [
          { label: "Base 10 (common log)", value: "10" },
          { label: "Base e (natural log)", value: "e" },
          { label: "Base 2", value: "2" },
        ], defaultValue: "10" },
      ],
      calculate: (inputs) => {
        const x = inputs.x as number;
        const fromBase = inputs.fromBase as number;
        const toBaseStr = inputs.toBase as string;
        if (!x || x <= 0 || !fromBase || fromBase <= 0 || fromBase === 1) return null;

        const toBase = toBaseStr === "e" ? Math.E : parseFloat(toBaseStr);
        const originalLog = Math.log(x) / Math.log(fromBase);

        return {
          primary: { label: `log_${fromBase}(${x})`, value: formatNumber(originalLog, 8) },
          details: [
            { label: `log_${fromBase}(${x})`, value: formatNumber(originalLog, 8) },
            { label: `log₁₀(${x})`, value: formatNumber(Math.log10(x), 8) },
            { label: `ln(${x})`, value: formatNumber(Math.log(x), 8) },
            { label: `log₂(${x})`, value: formatNumber(Math.log2(x), 8) },
            { label: "Change of base formula", value: `log_a(x) = log_b(x) / log_b(a)` },
            { label: `log_${toBase === Math.E ? "e" : toBase}(${fromBase})`, value: formatNumber(Math.log(fromBase) / Math.log(toBase), 8) },
          ],
        };
      },
    },
    {
      id: "log-properties",
      name: "Logarithm Properties",
      description: "Apply log properties: product, quotient, power rules",
      fields: [
        { name: "property", label: "Property", type: "select", options: [
          { label: "Product: log(a×b) = log(a) + log(b)", value: "product" },
          { label: "Quotient: log(a/b) = log(a) - log(b)", value: "quotient" },
          { label: "Power: log(aⁿ) = n·log(a)", value: "power" },
        ], defaultValue: "product" },
        { name: "a", label: "Value a", type: "number", placeholder: "e.g. 100" },
        { name: "b", label: "Value b (or exponent n)", type: "number", placeholder: "e.g. 50" },
      ],
      calculate: (inputs) => {
        const prop = inputs.property as string;
        const a = inputs.a as number;
        const b = inputs.b as number;
        if (a === undefined || b === undefined || a <= 0) return null;

        switch (prop) {
          case "product": {
            if (b <= 0) return null;
            const logA = Math.log10(a);
            const logB = Math.log10(b);
            return {
              primary: { label: `log(${a} × ${b})`, value: formatNumber(logA + logB, 8) },
              details: [
                { label: `log(${a})`, value: formatNumber(logA, 8) },
                { label: `log(${b})`, value: formatNumber(logB, 8) },
                { label: "Sum", value: formatNumber(logA + logB, 8) },
                { label: "Verification", value: `log(${formatNumber(a * b)}) = ${formatNumber(Math.log10(a * b), 8)}` },
              ],
            };
          }
          case "quotient": {
            if (b <= 0) return null;
            const logA = Math.log10(a);
            const logB = Math.log10(b);
            return {
              primary: { label: `log(${a} / ${b})`, value: formatNumber(logA - logB, 8) },
              details: [
                { label: `log(${a})`, value: formatNumber(logA, 8) },
                { label: `log(${b})`, value: formatNumber(logB, 8) },
                { label: "Difference", value: formatNumber(logA - logB, 8) },
                { label: "Verification", value: `log(${formatNumber(a / b, 6)}) = ${formatNumber(Math.log10(a / b), 8)}` },
              ],
            };
          }
          case "power": {
            const logA = Math.log10(a);
            return {
              primary: { label: `log(${a}^${b})`, value: formatNumber(b * logA, 8) },
              details: [
                { label: `log(${a})`, value: formatNumber(logA, 8) },
                { label: `${b} × log(${a})`, value: formatNumber(b * logA, 8) },
                { label: `${a}^${b}`, value: formatNumber(Math.pow(a, b), 6) },
              ],
            };
          }
          default:
            return null;
        }
      },
    },
  ],
  relatedSlugs: ["logarithm-calculator", "exponential-growth-calculator", "exponent-calculator"],
  faq: [
    { question: "How do you solve logarithmic equations?", answer: "Convert to exponential form: logₐ(x) = y means aʸ = x. Use properties to combine or separate logs. The change of base formula logₐ(x) = ln(x)/ln(a) converts between bases." },
    { question: "What is the change of base formula?", answer: "logₐ(x) = logᵦ(x) / logᵦ(a). This lets you calculate any logarithm using a calculator's built-in log₁₀ or ln buttons. For example, log₅(100) = log₁₀(100)/log₁₀(5) = 2/0.699 ≈ 2.861." },
  ],
  formula: "logₐ(x) = y ↔ aʸ = x | Change of base: logₐ(x) = ln(x)/ln(a) | Product: log(ab) = log(a)+log(b)",
};
