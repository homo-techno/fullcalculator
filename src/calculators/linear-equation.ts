import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const linearEquationCalculator: CalculatorDefinition = {
  slug: "linear-equation-calculator",
  title: "Linear Equation Calculator",
  description: "Free linear equation calculator. Solve equations of the form ax + b = c, or systems of two linear equations.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["linear equation calculator", "solve for x", "equation solver", "system of equations", "simultaneous equations"],
  variants: [
    {
      id: "single",
      name: "Solve ax + b = c",
      fields: [
        { name: "a", label: "a (coefficient of x)", type: "number", placeholder: "e.g. 3" },
        { name: "b", label: "b (constant on left)", type: "number", placeholder: "e.g. 5" },
        { name: "c", label: "c (right side)", type: "number", placeholder: "e.g. 14" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number, b = inputs.b as number, c = inputs.c as number;
        if (a === undefined || b === undefined || c === undefined) return null;
        if (a === 0) {
          return b === c
            ? { primary: { label: "Solution", value: "Infinite solutions (identity)" }, details: [] }
            : { primary: { label: "Solution", value: "No solution (contradiction)" }, details: [] };
        }
        const x = (c - b) / a;
        return {
          primary: { label: "x =", value: formatNumber(x, 8) },
          details: [
            { label: "Equation", value: `${a}x + ${b} = ${c}` },
            { label: "Steps", value: `${a}x = ${c} - ${b} = ${formatNumber(c - b, 6)}` },
            { label: "Solution", value: `x = ${formatNumber(c - b, 6)} / ${a} = ${formatNumber(x, 8)}` },
          ],
        };
      },
    },
    {
      id: "system",
      name: "System of 2 Equations",
      description: "a₁x + b₁y = c₁ and a₂x + b₂y = c₂",
      fields: [
        { name: "a1", label: "a₁", type: "number", placeholder: "e.g. 2" },
        { name: "b1", label: "b₁", type: "number", placeholder: "e.g. 3" },
        { name: "c1", label: "c₁", type: "number", placeholder: "e.g. 8" },
        { name: "a2", label: "a₂", type: "number", placeholder: "e.g. 4" },
        { name: "b2", label: "b₂", type: "number", placeholder: "e.g. -1" },
        { name: "c2", label: "c₂", type: "number", placeholder: "e.g. 2" },
      ],
      calculate: (inputs) => {
        const a1 = inputs.a1 as number, b1 = inputs.b1 as number, c1 = inputs.c1 as number;
        const a2 = inputs.a2 as number, b2 = inputs.b2 as number, c2 = inputs.c2 as number;
        if ([a1,b1,c1,a2,b2,c2].some(v => v === undefined)) return null;
        const det = a1 * b2 - a2 * b1;
        if (det === 0) return { primary: { label: "Solution", value: "No unique solution (det = 0)" }, details: [] };
        const x = (c1 * b2 - c2 * b1) / det;
        const y = (a1 * c2 - a2 * c1) / det;
        return {
          primary: { label: "Solution", value: `x = ${formatNumber(x, 6)}, y = ${formatNumber(y, 6)}` },
          details: [
            { label: "x", value: formatNumber(x, 8) },
            { label: "y", value: formatNumber(y, 8) },
            { label: "Determinant", value: formatNumber(det) },
            { label: "Eq 1", value: `${a1}x + ${b1}y = ${c1}` },
            { label: "Eq 2", value: `${a2}x + ${b2}y = ${c2}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["quadratic-equation-calculator", "matrix-calculator", "slope-calculator"],
  faq: [{ question: "How do I solve a system of two linear equations?", answer: "Use Cramer's rule: for a₁x+b₁y=c₁ and a₂x+b₂y=c₂, find determinant D=a₁b₂-a₂b₁. Then x=(c₁b₂-c₂b₁)/D and y=(a₁c₂-a₂c₁)/D. If D=0, there's no unique solution." }],
  formula: "ax + b = c → x = (c-b)/a | Cramer's rule for systems",
};
