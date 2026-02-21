import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const partialFractionsCalculator: CalculatorDefinition = {
  slug: "partial-fractions-calculator",
  title: "Partial Fractions Calculator",
  description: "Free partial fraction decomposition calculator. Decompose rational expressions into partial fractions for integration and Laplace transforms.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["partial fractions calculator", "partial fraction decomposition", "partial fractions integration", "rational expression", "decompose fractions"],
  variants: [
    {
      id: "linear-factors",
      name: "Two Distinct Linear Factors",
      description: "Decompose (px + q) / ((x - a)(x - b)) into A/(x-a) + B/(x-b)",
      fields: [
        { name: "p", label: "p (numerator x coeff)", type: "number", placeholder: "e.g. 3" },
        { name: "q", label: "q (numerator constant)", type: "number", placeholder: "e.g. 5" },
        { name: "a", label: "a (first root, x - a)", type: "number", placeholder: "e.g. 1" },
        { name: "b", label: "b (second root, x - b)", type: "number", placeholder: "e.g. -2" },
      ],
      calculate: (inputs) => {
        const p = inputs.p as number;
        const q = inputs.q as number;
        const a = inputs.a as number;
        const b = inputs.b as number;
        if (p === undefined || q === undefined || a === undefined || b === undefined) return null;
        if (a === b) return null;

        // (px + q) / ((x-a)(x-b)) = A/(x-a) + B/(x-b)
        // A = (pa + q) / (a - b)
        // B = (pb + q) / (b - a)
        const A = (p * a + q) / (a - b);
        const B = (p * b + q) / (b - a);

        const aSign = a >= 0 ? `(x - ${a})` : `(x + ${-a})`;
        const bSign = b >= 0 ? `(x - ${b})` : `(x + ${-b})`;

        return {
          primary: { label: "Decomposition", value: `${formatNumber(A, 6)}/${aSign} + ${formatNumber(B, 6)}/${bSign}` },
          details: [
            { label: "Original", value: `(${p}x + ${q}) / ${aSign}${bSign}` },
            { label: "A", value: formatNumber(A, 6) },
            { label: "B", value: formatNumber(B, 6) },
            { label: "Method", value: "Cover-up: A = f(a)/(a-b), B = f(b)/(b-a)" },
            { label: "Verification", value: `A(x-${b}) + B(x-${a}) should equal ${p}x + ${q}` },
          ],
        };
      },
    },
    {
      id: "repeated-linear",
      name: "Repeated Linear Factor",
      description: "Decompose (px + q) / (x - a)² into A/(x-a) + B/(x-a)²",
      fields: [
        { name: "p", label: "p (numerator x coeff)", type: "number", placeholder: "e.g. 2" },
        { name: "q", label: "q (numerator constant)", type: "number", placeholder: "e.g. 3" },
        { name: "a", label: "a (repeated root, x - a)", type: "number", placeholder: "e.g. 1" },
      ],
      calculate: (inputs) => {
        const p = inputs.p as number;
        const q = inputs.q as number;
        const a = inputs.a as number;
        if (p === undefined || q === undefined || a === undefined) return null;

        // (px + q) / (x-a)² = A/(x-a) + B/(x-a)²
        // B = pa + q (set x = a)
        // A = p (compare x coefficients)
        const A = p;
        const B = p * a + q;

        const factor = a >= 0 ? `(x - ${a})` : `(x + ${-a})`;

        return {
          primary: { label: "Decomposition", value: `${formatNumber(A)}/${factor} + ${formatNumber(B)}/${factor}²` },
          details: [
            { label: "Original", value: `(${p}x + ${q}) / ${factor}²` },
            { label: "A", value: formatNumber(A) },
            { label: "B", value: formatNumber(B) },
            { label: "Method", value: "B found by substituting x = a; A by comparing coefficients" },
          ],
        };
      },
    },
    {
      id: "quadratic-factor",
      name: "Linear + Irreducible Quadratic",
      description: "Decompose N / ((x - a)(x² + bx + c)) format",
      fields: [
        { name: "num", label: "Numerator constant N", type: "number", placeholder: "e.g. 1" },
        { name: "a", label: "a (linear root, x - a)", type: "number", placeholder: "e.g. 0" },
        { name: "b", label: "b (quadratic x coeff)", type: "number", placeholder: "e.g. 0" },
        { name: "c", label: "c (quadratic constant)", type: "number", placeholder: "e.g. 1" },
      ],
      calculate: (inputs) => {
        const N = inputs.num as number;
        const a = inputs.a as number;
        const b = inputs.b as number;
        const c = inputs.c as number;
        if (N === undefined || a === undefined || b === undefined || c === undefined) return null;

        // N / ((x-a)(x²+bx+c)) = A/(x-a) + (Bx+C)/(x²+bx+c)
        // A = N / (a² + ba + c)
        const denomAtA = a * a + b * a + c;
        if (denomAtA === 0) return null;

        const A = N / denomAtA;
        // From coefficient matching: A + B = 0 → B = -A
        const B = -A;
        // From constant term: -Aa + Cc = N... actually let's do it properly
        // N = A(x²+bx+c) + (Bx+C)(x-a)
        // Comparing x² coefficients: 0 = A + B → B = -A
        // Comparing x⁰: N = Ac - Ca → C = (Ac - N) / a ... if a ≠ 0
        // Comparing x¹: 0 = Ab + C - Ba = Ab + C + Aa
        const C_val = -(A * b + A * a);

        return {
          primary: { label: "Decomposition", value: `${formatNumber(A, 6)}/(x-${a}) + (${formatNumber(B, 6)}x + ${formatNumber(C_val, 6)})/(x²+${b}x+${c})` },
          details: [
            { label: "A", value: formatNumber(A, 6) },
            { label: "B", value: formatNumber(B, 6) },
            { label: "C", value: formatNumber(C_val, 6) },
            { label: "Form", value: "A/(x-a) + (Bx+C)/(x²+bx+c)" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["integral-calculator", "polynomial-calculator", "synthetic-division-calculator"],
  faq: [
    { question: "What is partial fraction decomposition?", answer: "Partial fraction decomposition breaks a complex rational expression into simpler fractions. For example, (3x+5)/((x-1)(x+2)) = A/(x-1) + B/(x+2). It's essential for integration of rational functions and inverse Laplace transforms." },
    { question: "When do you use partial fractions?", answer: "Use partial fractions when integrating rational functions, computing inverse Laplace transforms, or simplifying transfer functions in control theory. The denominator must be factorable into linear and/or irreducible quadratic factors." },
  ],
  formula: "Distinct linear: A/(x-a) + B/(x-b) | Repeated: A/(x-a) + B/(x-a)² | Irreducible quadratic: (Bx+C)/(x²+bx+c)",
};
