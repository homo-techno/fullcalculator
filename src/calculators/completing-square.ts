import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const completingSquareCalculator: CalculatorDefinition = {
  slug: "completing-square-calculator",
  title: "Completing the Square Calculator",
  description: "Free completing the square calculator. Convert ax² + bx + c to vertex form a(x - h)² + k and find the vertex, axis of symmetry, and roots.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["completing the square calculator", "vertex form calculator", "standard to vertex form", "complete the square", "quadratic vertex"],
  variants: [
    {
      id: "complete",
      name: "Complete the Square",
      description: "Convert ax² + bx + c to a(x - h)² + k",
      fields: [
        { name: "a", label: "a (x² coefficient)", type: "number", placeholder: "e.g. 1" },
        { name: "b", label: "b (x coefficient)", type: "number", placeholder: "e.g. -6" },
        { name: "c", label: "c (constant)", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const c = inputs.c as number;
        if (a === undefined || b === undefined || c === undefined || a === 0) return null;

        const h = -b / (2 * a);
        const k = c - (b * b) / (4 * a);
        const discriminant = b * b - 4 * a * c;

        const hSign = h >= 0 ? "-" : "+";
        const hAbs = Math.abs(h);
        const vertexForm = a === 1
          ? `(x ${hSign} ${formatNumber(hAbs, 6)})² + ${formatNumber(k, 6)}`
          : `${formatNumber(a)}(x ${hSign} ${formatNumber(hAbs, 6)})² + ${formatNumber(k, 6)}`;

        const details: { label: string; value: string }[] = [
          { label: "Vertex form", value: vertexForm },
          { label: "h (x of vertex)", value: formatNumber(h, 6) },
          { label: "k (y of vertex)", value: formatNumber(k, 6) },
          { label: "Vertex", value: `(${formatNumber(h, 6)}, ${formatNumber(k, 6)})` },
          { label: "Axis of symmetry", value: `x = ${formatNumber(h, 6)}` },
          { label: "Opens", value: a > 0 ? "Upward (minimum at vertex)" : "Downward (maximum at vertex)" },
        ];

        if (discriminant > 0) {
          const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
          const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
          details.push({ label: "x-intercepts", value: `x = ${formatNumber(x1, 6)}, x = ${formatNumber(x2, 6)}` });
        } else if (discriminant === 0) {
          details.push({ label: "x-intercept", value: `x = ${formatNumber(h, 6)} (tangent)` });
        } else {
          details.push({ label: "x-intercepts", value: "None (parabola doesn't cross x-axis)" });
        }

        details.push({ label: "y-intercept", value: `y = ${formatNumber(c)}` });

        return {
          primary: { label: "Vertex Form", value: vertexForm },
          details,
        };
      },
    },
    {
      id: "solve-by-completing",
      name: "Solve by Completing the Square",
      description: "Solve ax² + bx + c = 0 step by step",
      fields: [
        { name: "a", label: "a (x² coefficient)", type: "number", placeholder: "e.g. 2" },
        { name: "b", label: "b (x coefficient)", type: "number", placeholder: "e.g. 8" },
        { name: "c", label: "c (constant)", type: "number", placeholder: "e.g. -10" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const c = inputs.c as number;
        if (a === undefined || b === undefined || c === undefined || a === 0) return null;

        const halfB = b / (2 * a);
        const squareTerm = halfB * halfB;
        const rhs = squareTerm - c / a;

        const details: { label: string; value: string }[] = [
          { label: "Step 1: Divide by a", value: `x² + ${formatNumber(b / a)}x + ${formatNumber(c / a)} = 0` },
          { label: "Step 2: Move constant", value: `x² + ${formatNumber(b / a)}x = ${formatNumber(-c / a)}` },
          { label: "Step 3: Half of b/a", value: `(${formatNumber(b / a)}) / 2 = ${formatNumber(halfB)}` },
          { label: "Step 4: Square it", value: `(${formatNumber(halfB)})² = ${formatNumber(squareTerm)}` },
          { label: "Step 5: Add both sides", value: `(x + ${formatNumber(halfB)})² = ${formatNumber(rhs)}` },
        ];

        let rootsStr: string;
        if (rhs > 0) {
          const sqrtRhs = Math.sqrt(rhs);
          const x1 = -halfB + sqrtRhs;
          const x2 = -halfB - sqrtRhs;
          rootsStr = `x = ${formatNumber(x1, 6)}, x = ${formatNumber(x2, 6)}`;
          details.push({ label: "Step 6: Take square root", value: `x + ${formatNumber(halfB)} = ±${formatNumber(sqrtRhs, 6)}` });
          details.push({ label: "x₁", value: formatNumber(x1, 6) });
          details.push({ label: "x₂", value: formatNumber(x2, 6) });
        } else if (rhs === 0) {
          rootsStr = `x = ${formatNumber(-halfB, 6)}`;
          details.push({ label: "x (double root)", value: formatNumber(-halfB, 6) });
        } else {
          rootsStr = `${formatNumber(-halfB, 4)} ± ${formatNumber(Math.sqrt(-rhs), 4)}i`;
          details.push({ label: "Complex roots", value: rootsStr });
        }

        return {
          primary: { label: "Solutions", value: rootsStr },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["quadratic-equation-calculator", "polynomial-calculator", "derivative-calculator"],
  faq: [
    { question: "What is completing the square?", answer: "Completing the square converts a quadratic expression ax² + bx + c into vertex form a(x - h)² + k. The vertex (h, k) is found by h = -b/(2a) and k = c - b²/(4a). This reveals the parabola's vertex directly." },
    { question: "Why is completing the square useful?", answer: "It's useful for finding the vertex of a parabola, solving quadratic equations, deriving the quadratic formula, converting to vertex form for graphing, and integrating certain expressions in calculus." },
  ],
  formula: "a(x - h)² + k where h = -b/(2a), k = c - b²/(4a)",
};
