import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const derivativeCalculator: CalculatorDefinition = {
  slug: "derivative-calculator",
  title: "Derivative Calculator",
  description: "Free derivative calculator. Calculate derivatives of common functions with step-by-step rules shown including power rule, chain rule, and product rule.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["derivative calculator", "differentiation calculator", "calculus derivative", "power rule", "chain rule"],
  variants: [
    {
      id: "power-rule",
      name: "Power Rule (d/dx xⁿ)",
      description: "Find the derivative of xⁿ using the power rule",
      fields: [
        { name: "coefficient", label: "Coefficient (a)", type: "number", placeholder: "e.g. 3" },
        { name: "exponent", label: "Exponent (n)", type: "number", placeholder: "e.g. 4" },
      ],
      calculate: (inputs) => {
        const a = inputs.coefficient as number;
        const n = inputs.exponent as number;
        if (a === undefined || n === undefined) return null;

        const newCoeff = a * n;
        const newExp = n - 1;

        let derivStr: string;
        if (newExp === 0) derivStr = `${formatNumber(newCoeff)}`;
        else if (newExp === 1) derivStr = `${formatNumber(newCoeff)}x`;
        else derivStr = `${formatNumber(newCoeff)}x^${formatNumber(newExp)}`;

        return {
          primary: { label: `d/dx [${a}x^${n}]`, value: derivStr },
          details: [
            { label: "Original function", value: `f(x) = ${a}x^${n}` },
            { label: "Rule applied", value: "Power Rule: d/dx [axⁿ] = a·n·x^(n-1)" },
            { label: "New coefficient", value: `${a} × ${n} = ${formatNumber(newCoeff)}` },
            { label: "New exponent", value: `${n} - 1 = ${formatNumber(newExp)}` },
          ],
        };
      },
    },
    {
      id: "polynomial",
      name: "Polynomial Derivative (ax³ + bx² + cx + d)",
      description: "Find the derivative of a cubic polynomial",
      fields: [
        { name: "a", label: "a (x³ coefficient)", type: "number", placeholder: "e.g. 2" },
        { name: "b", label: "b (x² coefficient)", type: "number", placeholder: "e.g. -3" },
        { name: "c", label: "c (x coefficient)", type: "number", placeholder: "e.g. 5" },
        { name: "d", label: "d (constant)", type: "number", placeholder: "e.g. -1" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const c = inputs.c as number;
        const d = inputs.d as number;
        if (a === undefined || b === undefined || c === undefined || d === undefined) return null;

        const da = 3 * a;
        const db = 2 * b;
        const dc = c;

        const terms: string[] = [];
        if (da !== 0) terms.push(`${da}x²`);
        if (db !== 0) terms.push(`${db >= 0 && terms.length > 0 ? "+" : ""}${db}x`);
        if (dc !== 0) terms.push(`${dc >= 0 && terms.length > 0 ? "+" : ""}${dc}`);
        const derivStr = terms.length > 0 ? terms.join(" ") : "0";

        return {
          primary: { label: "f'(x)", value: derivStr },
          details: [
            { label: "Original f(x)", value: `${a}x³ + ${b}x² + ${c}x + ${d}` },
            { label: "d/dx [ax³]", value: `${formatNumber(da)}x²` },
            { label: "d/dx [bx²]", value: `${formatNumber(db)}x` },
            { label: "d/dx [cx]", value: formatNumber(dc) },
            { label: "d/dx [d]", value: "0" },
          ],
        };
      },
    },
    {
      id: "trig-deriv",
      name: "Trigonometric Derivative",
      description: "Find derivatives of common trig functions",
      fields: [
        { name: "func", label: "Function", type: "select", options: [
          { label: "sin(x)", value: "sin" },
          { label: "cos(x)", value: "cos" },
          { label: "tan(x)", value: "tan" },
          { label: "sec(x)", value: "sec" },
          { label: "csc(x)", value: "csc" },
          { label: "cot(x)", value: "cot" },
        ], defaultValue: "sin" },
        { name: "coefficient", label: "Coefficient (a)", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const func = inputs.func as string;
        const a = (inputs.coefficient as number) || 1;

        const derivatives: Record<string, string> = {
          sin: `${a}cos(x)`,
          cos: `${-a}sin(x)`,
          tan: `${a}sec²(x)`,
          sec: `${a}sec(x)tan(x)`,
          csc: `${-a}csc(x)cot(x)`,
          cot: `${-a}csc²(x)`,
        };

        const rules: Record<string, string> = {
          sin: "d/dx [sin(x)] = cos(x)",
          cos: "d/dx [cos(x)] = -sin(x)",
          tan: "d/dx [tan(x)] = sec²(x)",
          sec: "d/dx [sec(x)] = sec(x)tan(x)",
          csc: "d/dx [csc(x)] = -csc(x)cot(x)",
          cot: "d/dx [cot(x)] = -csc²(x)",
        };

        return {
          primary: { label: `d/dx [${a}${func}(x)]`, value: derivatives[func] || "0" },
          details: [
            { label: "Rule", value: rules[func] || "" },
            { label: "Original", value: `f(x) = ${a}${func}(x)` },
          ],
        };
      },
    },
    {
      id: "exponential-deriv",
      name: "Exponential / Logarithmic Derivative",
      description: "Find derivatives of eˣ, aˣ, ln(x), log(x)",
      fields: [
        { name: "func", label: "Function", type: "select", options: [
          { label: "eˣ", value: "exp" },
          { label: "aˣ (general)", value: "ax" },
          { label: "ln(x)", value: "ln" },
          { label: "log₁₀(x)", value: "log10" },
        ], defaultValue: "exp" },
        { name: "coefficient", label: "Coefficient", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
        { name: "base", label: "Base a (for aˣ only)", type: "number", placeholder: "e.g. 2" },
      ],
      calculate: (inputs) => {
        const func = inputs.func as string;
        const c = (inputs.coefficient as number) || 1;
        const base = inputs.base as number;

        let deriv: string;
        let rule: string;

        switch (func) {
          case "exp":
            deriv = `${c}eˣ`;
            rule = "d/dx [eˣ] = eˣ";
            break;
          case "ax":
            if (!base || base <= 0 || base === 1) return null;
            deriv = `${formatNumber(c)}·${base}ˣ·ln(${base})`;
            rule = `d/dx [aˣ] = aˣ·ln(a), ln(${base}) ≈ ${formatNumber(Math.log(base), 6)}`;
            break;
          case "ln":
            deriv = `${formatNumber(c)}/x`;
            rule = "d/dx [ln(x)] = 1/x";
            break;
          case "log10":
            deriv = `${formatNumber(c)}/(x·ln(10))`;
            rule = "d/dx [log₁₀(x)] = 1/(x·ln(10))";
            break;
          default:
            return null;
        }

        return {
          primary: { label: "Derivative", value: deriv },
          details: [
            { label: "Rule", value: rule },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["integral-calculator", "limit-calculator", "taylor-series-calculator"],
  faq: [
    { question: "What is a derivative?", answer: "A derivative measures the rate of change of a function. f'(x) = lim(h→0) [f(x+h) - f(x)] / h. It gives the slope of the tangent line at any point on the curve." },
    { question: "What is the power rule?", answer: "The power rule states: d/dx [xⁿ] = n·x^(n-1). Multiply by the exponent, then reduce the exponent by 1. For example, d/dx [x³] = 3x²." },
    { question: "What is the chain rule?", answer: "The chain rule is used for composite functions: d/dx [f(g(x))] = f'(g(x)) · g'(x). For example, d/dx [sin(3x)] = cos(3x) · 3 = 3cos(3x)." },
  ],
  formula: "Power: d/dx [xⁿ] = nxⁿ⁻¹ | Product: (fg)' = f'g + fg' | Chain: d/dx [f(g(x))] = f'(g(x))·g'(x)",
};
