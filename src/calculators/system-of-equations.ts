import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const systemOfEquationsCalculator: CalculatorDefinition = {
  slug: "system-of-equations-calculator",
  title: "System of Equations Calculator",
  description: "Free system of equations solver. Solve 2x2 and 3x3 systems of linear equations using Cramer's rule and elimination method.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["system of equations calculator", "simultaneous equations solver", "2x2 system solver", "3x3 system solver", "cramer's rule"],
  variants: [
    {
      id: "system2x2",
      name: "2×2 System of Equations",
      description: "Solve: a₁x + b₁y = c₁ and a₂x + b₂y = c₂",
      fields: [
        { name: "a1", label: "a₁ (Eq1: x coeff)", type: "number", placeholder: "e.g. 2" },
        { name: "b1", label: "b₁ (Eq1: y coeff)", type: "number", placeholder: "e.g. 3" },
        { name: "c1", label: "c₁ (Eq1: constant)", type: "number", placeholder: "e.g. 8" },
        { name: "a2", label: "a₂ (Eq2: x coeff)", type: "number", placeholder: "e.g. 4" },
        { name: "b2", label: "b₂ (Eq2: y coeff)", type: "number", placeholder: "e.g. -1" },
        { name: "c2", label: "c₂ (Eq2: constant)", type: "number", placeholder: "e.g. 2" },
      ],
      calculate: (inputs) => {
        const a1 = inputs.a1 as number;
        const b1 = inputs.b1 as number;
        const c1 = inputs.c1 as number;
        const a2 = inputs.a2 as number;
        const b2 = inputs.b2 as number;
        const c2 = inputs.c2 as number;
        if (a1 === undefined || b1 === undefined || c1 === undefined || a2 === undefined || b2 === undefined || c2 === undefined) return null;

        const det = a1 * b2 - a2 * b1;

        if (det === 0) {
          const cross = a1 * c2 - a2 * c1;
          return {
            primary: { label: "Solution", value: cross === 0 ? "Infinite solutions" : "No solution" },
            details: [
              { label: "Determinant", value: "0" },
              { label: "System type", value: cross === 0 ? "Dependent (same line)" : "Inconsistent (parallel lines)" },
            ],
          };
        }

        const x = (c1 * b2 - c2 * b1) / det;
        const y = (a1 * c2 - a2 * c1) / det;

        return {
          primary: { label: "Solution", value: `x = ${formatNumber(x, 6)}, y = ${formatNumber(y, 6)}` },
          details: [
            { label: "x", value: formatNumber(x, 6) },
            { label: "y", value: formatNumber(y, 6) },
            { label: "Determinant", value: formatNumber(det) },
            { label: "Method", value: "Cramer's Rule" },
            { label: "Equation 1", value: `${a1}x + ${b1}y = ${c1}` },
            { label: "Equation 2", value: `${a2}x + ${b2}y = ${c2}` },
          ],
        };
      },
    },
    {
      id: "system3x3",
      name: "3×3 System of Equations",
      description: "Solve: a₁x + b₁y + c₁z = d₁, etc.",
      fields: [
        { name: "a1", label: "a₁ (Eq1: x)", type: "number", placeholder: "1" },
        { name: "b1", label: "b₁ (Eq1: y)", type: "number", placeholder: "2" },
        { name: "c1", label: "c₁ (Eq1: z)", type: "number", placeholder: "-1" },
        { name: "d1", label: "d₁ (Eq1: =)", type: "number", placeholder: "3" },
        { name: "a2", label: "a₂ (Eq2: x)", type: "number", placeholder: "3" },
        { name: "b2", label: "b₂ (Eq2: y)", type: "number", placeholder: "-1" },
        { name: "c2", label: "c₂ (Eq2: z)", type: "number", placeholder: "2" },
        { name: "d2", label: "d₂ (Eq2: =)", type: "number", placeholder: "1" },
        { name: "a3", label: "a₃ (Eq3: x)", type: "number", placeholder: "2" },
        { name: "b3", label: "b₃ (Eq3: y)", type: "number", placeholder: "1" },
        { name: "c3", label: "c₃ (Eq3: z)", type: "number", placeholder: "3" },
        { name: "d3", label: "d₃ (Eq3: =)", type: "number", placeholder: "7" },
      ],
      calculate: (inputs) => {
        const g = (k: string) => inputs[k] as number;
        const keys = ["a1", "b1", "c1", "d1", "a2", "b2", "c2", "d2", "a3", "b3", "c3", "d3"];
        if (keys.some((k) => g(k) === undefined)) return null;

        const det3 = (
          r1c1: number, r1c2: number, r1c3: number,
          r2c1: number, r2c2: number, r2c3: number,
          r3c1: number, r3c2: number, r3c3: number
        ) =>
          r1c1 * (r2c2 * r3c3 - r2c3 * r3c2) -
          r1c2 * (r2c1 * r3c3 - r2c3 * r3c1) +
          r1c3 * (r2c1 * r3c2 - r2c2 * r3c1);

        const D = det3(g("a1"), g("b1"), g("c1"), g("a2"), g("b2"), g("c2"), g("a3"), g("b3"), g("c3"));

        if (D === 0) {
          return {
            primary: { label: "Solution", value: "No unique solution" },
            details: [
              { label: "Determinant", value: "0" },
              { label: "Result", value: "System may have no solution or infinitely many solutions" },
            ],
          };
        }

        const Dx = det3(g("d1"), g("b1"), g("c1"), g("d2"), g("b2"), g("c2"), g("d3"), g("b3"), g("c3"));
        const Dy = det3(g("a1"), g("d1"), g("c1"), g("a2"), g("d2"), g("c2"), g("a3"), g("d3"), g("c3"));
        const Dz = det3(g("a1"), g("b1"), g("d1"), g("a2"), g("b2"), g("d2"), g("a3"), g("b3"), g("d3"));

        const x = Dx / D;
        const y = Dy / D;
        const z = Dz / D;

        return {
          primary: { label: "Solution", value: `x = ${formatNumber(x, 6)}, y = ${formatNumber(y, 6)}, z = ${formatNumber(z, 6)}` },
          details: [
            { label: "x", value: formatNumber(x, 6) },
            { label: "y", value: formatNumber(y, 6) },
            { label: "z", value: formatNumber(z, 6) },
            { label: "det(A)", value: formatNumber(D) },
            { label: "det(Ax)", value: formatNumber(Dx) },
            { label: "det(Ay)", value: formatNumber(Dy) },
            { label: "det(Az)", value: formatNumber(Dz) },
            { label: "Method", value: "Cramer's Rule" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["matrix-calculator", "matrix-inverse-calculator", "linear-equation-calculator"],
  faq: [
    { question: "What is Cramer's Rule?", answer: "Cramer's Rule solves systems of linear equations using determinants. For a 2×2 system: x = det(Ax)/det(A) and y = det(Ay)/det(A), where Ax replaces the x-column with constants. It works when det(A) ≠ 0." },
    { question: "When does a system have no solution?", answer: "A system has no solution when the equations are inconsistent (e.g., parallel lines that never intersect). This happens when the determinant is 0 and the system is not dependent." },
  ],
  formula: "Cramer's Rule: x = det(Ax)/det(A) | y = det(Ay)/det(A) | z = det(Az)/det(A)",
};
