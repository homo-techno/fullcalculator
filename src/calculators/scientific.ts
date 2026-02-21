import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const scientificCalculator: CalculatorDefinition = {
  slug: "scientific-calculator",
  title: "Scientific Calculator",
  description: "Free online scientific calculator. Calculate trigonometric functions, logarithms, powers, roots, and factorials instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["scientific calculator", "trig calculator", "logarithm calculator", "sin cos tan calculator", "exponent calculator"],
  variants: [
    {
      id: "trig",
      name: "Trigonometry",
      description: "Calculate sin, cos, tan and their inverses",
      fields: [
        { name: "angle", label: "Angle Value", type: "number", placeholder: "e.g. 45" },
        { name: "unit", label: "Angle Unit", type: "select", options: [
          { label: "Degrees", value: "deg" },
          { label: "Radians", value: "rad" },
        ], defaultValue: "deg" },
      ],
      calculate: (inputs) => {
        const angle = inputs.angle as number;
        const unit = inputs.unit as string;
        if (angle === undefined) return null;
        const rad = unit === "deg" ? (angle * Math.PI) / 180 : angle;
        const sin = Math.sin(rad);
        const cos = Math.cos(rad);
        const tan = Math.abs(cos) < 1e-10 ? undefined : Math.tan(rad);
        return {
          primary: { label: `sin(${angle}${unit === "deg" ? "°" : " rad"})`, value: formatNumber(sin, 8) },
          details: [
            { label: `cos(${angle}${unit === "deg" ? "°" : " rad"})`, value: formatNumber(cos, 8) },
            { label: `tan(${angle}${unit === "deg" ? "°" : " rad"})`, value: tan !== undefined ? formatNumber(tan, 8) : "undefined" },
            { label: "Radians", value: unit === "deg" ? formatNumber(rad, 6) : `${angle}` },
            { label: "Degrees", value: unit === "rad" ? formatNumber((angle * 180) / Math.PI, 6) : `${angle}` },
          ],
        };
      },
    },
    {
      id: "log",
      name: "Logarithms & Powers",
      description: "Calculate logarithms, exponents, and roots",
      fields: [
        { name: "value", label: "Number", type: "number", placeholder: "e.g. 100" },
        { name: "operation", label: "Operation", type: "select", options: [
          { label: "Natural log (ln)", value: "ln" },
          { label: "Log base 10", value: "log10" },
          { label: "Log base 2", value: "log2" },
          { label: "Square root", value: "sqrt" },
          { label: "Cube root", value: "cbrt" },
        ], defaultValue: "ln" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const op = inputs.operation as string;
        if (value === undefined) return null;

        const operations: Record<string, { label: string; fn: (x: number) => number }> = {
          ln: { label: "ln", fn: Math.log },
          log10: { label: "log₁₀", fn: Math.log10 },
          log2: { label: "log₂", fn: Math.log2 },
          sqrt: { label: "√", fn: Math.sqrt },
          cbrt: { label: "∛", fn: Math.cbrt },
        };
        const selected = operations[op] || operations.ln;
        const result = selected.fn(value);

        if (isNaN(result)) return { primary: { label: "Result", value: "Undefined (invalid input)" }, details: [] };

        return {
          primary: { label: `${selected.label}(${value})`, value: formatNumber(result, 10) },
          details: [
            { label: "e^x", value: formatNumber(Math.exp(value), 6) },
            { label: "x²", value: formatNumber(value * value, 6) },
            { label: "x³", value: formatNumber(value * value * value, 6) },
            { label: "1/x", value: value !== 0 ? formatNumber(1 / value, 10) : "undefined" },
            { label: "|x|", value: formatNumber(Math.abs(value), 6) },
          ],
        };
      },
    },
    {
      id: "power",
      name: "Power / Root",
      description: "Calculate x raised to power y, or yth root of x",
      fields: [
        { name: "base", label: "Base (x)", type: "number", placeholder: "e.g. 2" },
        { name: "exponent", label: "Exponent (y)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const base = inputs.base as number;
        const exp = inputs.exponent as number;
        if (base === undefined || exp === undefined) return null;
        const power = Math.pow(base, exp);
        const root = exp !== 0 ? Math.pow(base, 1 / exp) : undefined;
        return {
          primary: { label: `${base}^${exp}`, value: formatNumber(power, 10) },
          details: [
            ...(root !== undefined ? [{ label: `${exp}th root of ${base}`, value: formatNumber(root, 10) }] : []),
            { label: `${base}^2`, value: formatNumber(base * base, 6) },
            { label: `√${base}`, value: formatNumber(Math.sqrt(base), 10) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "quadratic-equation-calculator", "pythagorean-theorem-calculator"],
  faq: [
    { question: "What is a natural logarithm?", answer: "The natural logarithm (ln) uses base e ≈ 2.71828. ln(x) asks: 'e raised to what power equals x?' For example, ln(e) = 1, ln(1) = 0, ln(e²) = 2." },
    { question: "How do I convert degrees to radians?", answer: "Multiply degrees by π/180. For example: 90° = 90 × π/180 = π/2 ≈ 1.5708 radians. To convert back: multiply radians by 180/π." },
  ],
  formula: "sin²θ + cos²θ = 1 | logₐ(xy) = logₐx + logₐy | aⁿ × aᵐ = aⁿ⁺ᵐ",
};
