import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const quadraticCalculator: CalculatorDefinition = {
  slug: "quadratic-equation-calculator",
  title: "Quadratic Equation Calculator",
  description: "Free quadratic equation calculator. Solve ax² + bx + c = 0 and find roots, vertex, discriminant, and axis of symmetry.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["quadratic equation calculator", "quadratic formula calculator", "solve quadratic equation", "find roots", "quadratic solver"],
  variants: [
    {
      id: "solve",
      name: "Solve Quadratic Equation",
      description: "Find roots of ax² + bx + c = 0",
      fields: [
        { name: "a", label: "a (x² coefficient)", type: "number", placeholder: "e.g. 1" },
        { name: "b", label: "b (x coefficient)", type: "number", placeholder: "e.g. -5" },
        { name: "c", label: "c (constant)", type: "number", placeholder: "e.g. 6" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const c = inputs.c as number;
        if (a === undefined || b === undefined || c === undefined || a === 0) return null;

        const discriminant = b * b - 4 * a * c;
        const vertexX = -b / (2 * a);
        const vertexY = a * vertexX * vertexX + b * vertexX + c;

        let rootsStr: string;
        const details: { label: string; value: string }[] = [];

        if (discriminant > 0) {
          const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
          const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
          rootsStr = `x₁ = ${formatNumber(x1, 6)}, x₂ = ${formatNumber(x2, 6)}`;
          details.push({ label: "Root x₁", value: formatNumber(x1, 6) });
          details.push({ label: "Root x₂", value: formatNumber(x2, 6) });
          details.push({ label: "Nature of roots", value: "Two distinct real roots" });
        } else if (discriminant === 0) {
          const x = -b / (2 * a);
          rootsStr = `x = ${formatNumber(x, 6)}`;
          details.push({ label: "Root (double)", value: formatNumber(x, 6) });
          details.push({ label: "Nature of roots", value: "One repeated real root" });
        } else {
          const realPart = -b / (2 * a);
          const imagPart = Math.sqrt(-discriminant) / (2 * a);
          rootsStr = `${formatNumber(realPart, 4)} ± ${formatNumber(imagPart, 4)}i`;
          details.push({ label: "Root x₁", value: `${formatNumber(realPart, 4)} + ${formatNumber(imagPart, 4)}i` });
          details.push({ label: "Root x₂", value: `${formatNumber(realPart, 4)} - ${formatNumber(imagPart, 4)}i` });
          details.push({ label: "Nature of roots", value: "Two complex conjugate roots" });
        }

        details.push({ label: "Discriminant (b²-4ac)", value: formatNumber(discriminant, 6) });
        details.push({ label: "Vertex", value: `(${formatNumber(vertexX, 4)}, ${formatNumber(vertexY, 4)})` });
        details.push({ label: "Axis of symmetry", value: `x = ${formatNumber(vertexX, 4)}` });
        details.push({ label: "Parabola opens", value: a > 0 ? "Upward (minimum)" : "Downward (maximum)" });

        const equation = `${a === 1 ? "" : a === -1 ? "-" : a}x² ${b >= 0 ? "+" : ""} ${b}x ${c >= 0 ? "+" : ""} ${c} = 0`;

        return {
          primary: { label: `Roots of ${equation}`, value: rootsStr },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["scientific-calculator", "percentage-calculator", "pythagorean-theorem-calculator"],
  faq: [
    { question: "What is the quadratic formula?", answer: "x = (-b ± √(b²-4ac)) / (2a). It solves any equation of the form ax² + bx + c = 0. The discriminant (b²-4ac) determines the nature of roots: positive = 2 real roots, zero = 1 repeated root, negative = 2 complex roots." },
    { question: "What is the vertex of a parabola?", answer: "The vertex is the highest or lowest point of the parabola. Its x-coordinate is -b/(2a), and the y-coordinate is found by plugging x back into the equation. If a > 0, the vertex is a minimum; if a < 0, it's a maximum." },
  ],
  formula: "x = (-b ± √(b²-4ac)) / 2a | Vertex: (-b/2a, f(-b/2a))",
};
