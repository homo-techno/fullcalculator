import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const polynomialCalculator2: CalculatorDefinition = {
  slug: "polynomial-calculator",
  title: "Polynomial Calculator",
  description:
    "Free polynomial calculator. Evaluate quadratic and cubic polynomials at any value of x.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "polynomial calculator",
    "evaluate polynomial",
    "quadratic",
    "cubic",
    "algebra",
  ],
  variants: [
    {
      id: "quadratic",
      name: "Evaluate ax² + bx + c",
      fields: [
        { name: "a", label: "Coefficient a", type: "number", placeholder: "e.g. 1" },
        { name: "b", label: "Coefficient b", type: "number", placeholder: "e.g. -3" },
        { name: "c", label: "Coefficient c", type: "number", placeholder: "e.g. 2" },
        { name: "x", label: "Value of x", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const c = inputs.c as number;
        const x = inputs.x as number;
        if (a === undefined || b === undefined || c === undefined || x === undefined)
          return null;

        const result = a * x * x + b * x + c;
        const discriminant = b * b - 4 * a * c;

        return {
          primary: { label: "f(x)", value: formatNumber(result, 6) },
          details: [
            { label: "Polynomial", value: `${formatNumber(a)}x² + ${formatNumber(b)}x + ${formatNumber(c)}` },
            { label: "x", value: formatNumber(x) },
            { label: "Discriminant", value: formatNumber(discriminant, 4) },
          ],
        };
      },
    },
    {
      id: "cubic",
      name: "Evaluate ax³ + bx² + cx + d",
      fields: [
        { name: "a", label: "Coefficient a", type: "number", placeholder: "e.g. 1" },
        { name: "b", label: "Coefficient b", type: "number", placeholder: "e.g. 0" },
        { name: "c", label: "Coefficient c", type: "number", placeholder: "e.g. -2" },
        { name: "d", label: "Coefficient d", type: "number", placeholder: "e.g. 1" },
        { name: "x", label: "Value of x", type: "number", placeholder: "e.g. 3" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const c = inputs.c as number;
        const d = inputs.d as number;
        const x = inputs.x as number;
        if (a === undefined || b === undefined || c === undefined || d === undefined || x === undefined)
          return null;

        const result = a * x * x * x + b * x * x + c * x + d;

        return {
          primary: { label: "f(x)", value: formatNumber(result, 6) },
          details: [
            {
              label: "Polynomial",
              value: `${formatNumber(a)}x³ + ${formatNumber(b)}x² + ${formatNumber(c)}x + ${formatNumber(d)}`,
            },
            { label: "x", value: formatNumber(x) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "inequality-solver",
    "interpolation-calculator",
    "summation-calculator",
  ],
  faq: [
    {
      question: "What is a polynomial?",
      answer:
        "A polynomial is a mathematical expression consisting of variables and coefficients combined using addition, subtraction, multiplication, and non-negative integer exponents. Examples include x² + 2x + 1 (quadratic) and x³ - 3x + 2 (cubic).",
    },
  ],
  formula: "f(x) = aₙxⁿ + aₙ₋₁xⁿ⁻¹ + ... + a₁x + a₀",
};
