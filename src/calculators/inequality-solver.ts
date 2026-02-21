import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const inequalitySolverCalculator: CalculatorDefinition = {
  slug: "inequality-solver",
  title: "Inequality Solver Calculator",
  description:
    "Free inequality solver calculator. Solve linear inequalities of the form ax + b > c, showing the solution set and number line description.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "inequality solver",
    "linear inequality",
    "solve inequality",
    "algebra",
    "number line",
  ],
  variants: [
    {
      id: "solve",
      name: "Solve Linear Inequality",
      fields: [
        {
          name: "a",
          label: "Coefficient a",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "b",
          label: "Constant b",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "op",
          label: "Operator (1: >, 2: <, 3: ≥, 4: ≤)",
          type: "number",
          placeholder: "e.g. 1 for >",
        },
        {
          name: "c",
          label: "Right side c",
          type: "number",
          placeholder: "e.g. 7",
        },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const opCode = inputs.op as number;
        const c = inputs.c as number;
        if (a === undefined || b === undefined || !opCode || c === undefined)
          return null;
        if (a === 0) return null;

        const operators: Record<number, string> = {
          1: ">",
          2: "<",
          3: "≥",
          4: "≤",
        };
        const op = operators[opCode] || ">";

        // ax + b op c  =>  ax op c - b  =>  x op (c - b)/a
        const boundary = (c - b) / a;

        // When dividing by negative a, the inequality flips
        let resultOp = op;
        if (a < 0) {
          if (op === ">") resultOp = "<";
          else if (op === "<") resultOp = ">";
          else if (op === "≥") resultOp = "≤";
          else if (op === "≤") resultOp = "≥";
        }

        const solution = `x ${resultOp} ${formatNumber(boundary, 4)}`;
        const inclusive = resultOp === "≥" || resultOp === "≤";
        const direction = resultOp === ">" || resultOp === "≥" ? "right" : "left";
        const bracketType = inclusive ? "closed" : "open";
        const numberLine = `${bracketType} circle at ${formatNumber(boundary, 4)}, shading to the ${direction}`;

        return {
          primary: { label: "Solution", value: solution },
          details: [
            {
              label: "Inequality",
              value: `${formatNumber(a)}x + ${formatNumber(b)} ${op} ${formatNumber(c)}`,
            },
            { label: "Boundary", value: formatNumber(boundary, 4) },
            { label: "Number line", value: numberLine },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "polynomial-calculator",
    "summation-calculator",
    "interpolation-calculator",
  ],
  faq: [
    {
      question: "What happens when you multiply or divide an inequality by a negative number?",
      answer:
        "When you multiply or divide both sides of an inequality by a negative number, the direction of the inequality sign flips. For example, -2x > 4 becomes x < -2.",
    },
  ],
  formula: "ax + b > c  →  x > (c - b) / a  (flip sign if a < 0)",
};
