import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cubicEquationCalculator: CalculatorDefinition = {
  slug: "cubic-equation-calculator",
  title: "Cubic Equation Calculator",
  description: "Free cubic equation calculator. Solve ax³ + bx² + cx + d = 0 and find all real and complex roots with step-by-step solutions.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["cubic equation calculator", "cubic solver", "third degree equation", "cubic roots", "cubic formula"],
  variants: [
    {
      id: "solve-cubic",
      name: "Solve Cubic Equation",
      description: "Find all roots of ax³ + bx² + cx + d = 0",
      fields: [
        { name: "a", label: "a (x³ coefficient)", type: "number", placeholder: "e.g. 1" },
        { name: "b", label: "b (x² coefficient)", type: "number", placeholder: "e.g. -6" },
        { name: "c", label: "c (x coefficient)", type: "number", placeholder: "e.g. 11" },
        { name: "d", label: "d (constant)", type: "number", placeholder: "e.g. -6" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const c = inputs.c as number;
        const d = inputs.d as number;
        if (a === undefined || b === undefined || c === undefined || d === undefined || a === 0) return null;

        // Convert to depressed cubic: t³ + pt + q = 0 where x = t - b/(3a)
        const p = (3 * a * c - b * b) / (3 * a * a);
        const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
        const discriminant = -4 * p * p * p - 27 * q * q;
        const shift = -b / (3 * a);

        const details: { label: string; value: string }[] = [];
        let rootsStr: string;

        if (discriminant > 0) {
          // Three distinct real roots
          const m = 2 * Math.sqrt(-p / 3);
          const theta = Math.acos(3 * q / (p * m)) / 3;
          const x1 = m * Math.cos(theta) + shift;
          const x2 = m * Math.cos(theta - 2 * Math.PI / 3) + shift;
          const x3 = m * Math.cos(theta - 4 * Math.PI / 3) + shift;

          rootsStr = `x₁=${formatNumber(x1, 6)}, x₂=${formatNumber(x2, 6)}, x₃=${formatNumber(x3, 6)}`;
          details.push({ label: "x₁", value: formatNumber(x1, 6) });
          details.push({ label: "x₂", value: formatNumber(x2, 6) });
          details.push({ label: "x₃", value: formatNumber(x3, 6) });
          details.push({ label: "Nature", value: "Three distinct real roots" });
        } else if (discriminant === 0) {
          // Multiple root
          if (p === 0 && q === 0) {
            const x1 = shift;
            rootsStr = `x = ${formatNumber(x1, 6)} (triple root)`;
            details.push({ label: "Triple root", value: formatNumber(x1, 6) });
          } else {
            const x1 = 3 * q / p + shift;
            const x2 = -3 * q / (2 * p) + shift;
            rootsStr = `x₁=${formatNumber(x1, 6)}, x₂=${formatNumber(x2, 6)} (double)`;
            details.push({ label: "x₁ (single)", value: formatNumber(x1, 6) });
            details.push({ label: "x₂ (double)", value: formatNumber(x2, 6) });
          }
          details.push({ label: "Nature", value: "Has repeated root(s)" });
        } else {
          // One real root, two complex conjugate roots
          const sqrtVal = Math.sqrt(q * q / 4 + p * p * p / 27);
          const u = Math.cbrt(-q / 2 + sqrtVal);
          const v = Math.cbrt(-q / 2 - sqrtVal);
          const x1 = u + v + shift;
          const realPart = -(u + v) / 2 + shift;
          const imagPart = (u - v) * Math.sqrt(3) / 2;

          rootsStr = `x₁=${formatNumber(x1, 6)}`;
          details.push({ label: "x₁ (real)", value: formatNumber(x1, 6) });
          details.push({ label: "x₂ (complex)", value: `${formatNumber(realPart, 4)} + ${formatNumber(Math.abs(imagPart), 4)}i` });
          details.push({ label: "x₃ (complex)", value: `${formatNumber(realPart, 4)} - ${formatNumber(Math.abs(imagPart), 4)}i` });
          details.push({ label: "Nature", value: "One real, two complex conjugate roots" });
        }

        details.push({ label: "Discriminant", value: formatNumber(discriminant, 4) });
        details.push({ label: "Sum of roots", value: formatNumber(-b / a, 6) });
        details.push({ label: "Product of roots", value: formatNumber(-d / a, 6) });

        return {
          primary: { label: "Roots", value: rootsStr },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["quadratic-equation-calculator", "polynomial-calculator", "system-of-equations-calculator"],
  faq: [
    { question: "How many roots does a cubic equation have?", answer: "A cubic equation always has exactly 3 roots (counting multiplicity). These can be: 3 distinct real roots, 1 real + 2 complex conjugate roots, or roots with multiplicity (e.g., a triple root or a single + double root)." },
    { question: "What is the cubic formula?", answer: "The cubic formula (Cardano's formula) solves t³ + pt + q = 0 by: t = ∛(-q/2 + √(q²/4 + p³/27)) + ∛(-q/2 - √(q²/4 + p³/27)). First convert ax³+bx²+cx+d=0 to depressed form by substituting x = t - b/(3a)." },
  ],
  formula: "Depressed: t³ + pt + q = 0 | x = t - b/(3a) | Cardano: t = ∛(-q/2 + √D) + ∛(-q/2 - √D)",
};
