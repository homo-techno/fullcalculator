import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const interpolationCalculator: CalculatorDefinition = {
  slug: "interpolation-calculator",
  title: "Interpolation Calculator",
  description:
    "Free linear interpolation calculator. Find an intermediate value between two known data points using linear interpolation.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "interpolation",
    "linear interpolation",
    "lerp",
    "estimate value",
    "data points",
  ],
  variants: [
    {
      id: "calculate",
      name: "Linear Interpolation",
      fields: [
        { name: "x1", label: "x₁", type: "number", placeholder: "e.g. 1" },
        { name: "y1", label: "y₁", type: "number", placeholder: "e.g. 10" },
        { name: "x2", label: "x₂", type: "number", placeholder: "e.g. 5" },
        { name: "y2", label: "y₂", type: "number", placeholder: "e.g. 30" },
        { name: "x", label: "x (target)", type: "number", placeholder: "e.g. 3" },
      ],
      calculate: (inputs) => {
        const x1 = inputs.x1 as number;
        const y1 = inputs.y1 as number;
        const x2 = inputs.x2 as number;
        const y2 = inputs.y2 as number;
        const x = inputs.x as number;
        if (
          x1 === undefined || y1 === undefined ||
          x2 === undefined || y2 === undefined ||
          x === undefined
        )
          return null;
        if (x1 === x2) return null;

        const y = y1 + ((x - x1) * (y2 - y1)) / (x2 - x1);
        const slope = (y2 - y1) / (x2 - x1);

        // Check if extrapolating
        const isExtrapolating =
          (x < Math.min(x1, x2) || x > Math.max(x1, x2));

        return {
          primary: { label: "y", value: formatNumber(y, 6) },
          details: [
            { label: "Slope", value: formatNumber(slope, 6) },
            { label: "Point 1", value: `(${formatNumber(x1)}, ${formatNumber(y1)})` },
            { label: "Point 2", value: `(${formatNumber(x2)}, ${formatNumber(y2)})` },
            { label: "Target x", value: formatNumber(x) },
            { label: "Note", value: isExtrapolating ? "Extrapolation (x outside range)" : "Interpolation" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "regression-calculator",
    "polynomial-calculator",
    "correlation-calculator",
  ],
  faq: [
    {
      question: "What is linear interpolation?",
      answer:
        "Linear interpolation estimates a value between two known data points by assuming a straight line between them. Given points (x₁, y₁) and (x₂, y₂), the value at x is: y = y₁ + (x - x₁)(y₂ - y₁)/(x₂ - x₁). When x falls outside the known range, it becomes extrapolation.",
    },
  ],
  formula: "y = y₁ + (x - x₁) × (y₂ - y₁) / (x₂ - x₁)",
};
