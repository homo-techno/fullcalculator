import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const slopeCalculator: CalculatorDefinition = {
  slug: "slope-calculator",
  title: "Slope Calculator",
  description: "Free slope calculator. Find the slope, distance, and midpoint between two points. Get the equation of the line in slope-intercept form.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["slope calculator", "slope of a line", "rise over run", "slope intercept form", "line equation calculator"],
  variants: [
    {
      id: "slope",
      name: "Slope Between Two Points",
      description: "Find slope, distance, midpoint, and line equation from (x₁,y₁) and (x₂,y₂)",
      fields: [
        { name: "x1", label: "x₁", type: "number", placeholder: "e.g. 1" },
        { name: "y1", label: "y₁", type: "number", placeholder: "e.g. 2" },
        { name: "x2", label: "x₂", type: "number", placeholder: "e.g. 4" },
        { name: "y2", label: "y₂", type: "number", placeholder: "e.g. 8" },
      ],
      calculate: (inputs) => {
        const x1 = inputs.x1 as number, y1 = inputs.y1 as number;
        const x2 = inputs.x2 as number, y2 = inputs.y2 as number;
        if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined) return null;
        const dx = x2 - x1, dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2;
        if (dx === 0) {
          return {
            primary: { label: "Slope", value: "Undefined (vertical line)" },
            details: [
              { label: "Line equation", value: `x = ${x1}` },
              { label: "Distance", value: formatNumber(distance, 6) },
              { label: "Midpoint", value: `(${formatNumber(midX)}, ${formatNumber(midY)})` },
            ],
          };
        }
        const slope = dy / dx;
        const b = y1 - slope * x1;
        const angle = (Math.atan(slope) * 180) / Math.PI;
        return {
          primary: { label: "Slope (m)", value: formatNumber(slope, 6) },
          details: [
            { label: "Equation (y=mx+b)", value: `y = ${formatNumber(slope, 4)}x ${b >= 0 ? "+" : ""} ${formatNumber(b, 4)}` },
            { label: "Distance", value: formatNumber(distance, 6) },
            { label: "Midpoint", value: `(${formatNumber(midX, 4)}, ${formatNumber(midY, 4)})` },
            { label: "Rise / Run", value: `${formatNumber(dy)} / ${formatNumber(dx)}` },
            { label: "Angle", value: `${formatNumber(angle, 2)}°` },
            { label: "Perpendicular slope", value: formatNumber(-1 / slope, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pythagorean-theorem-calculator", "quadratic-equation-calculator", "scientific-calculator"],
  faq: [
    { question: "How do I find slope?", answer: "Slope = rise/run = (y₂-y₁)/(x₂-x₁). Positive slope goes up-right, negative goes down-right, zero is horizontal, undefined is vertical." },
  ],
  formula: "m = (y₂-y₁)/(x₂-x₁) | y = mx + b | d = √((x₂-x₁)² + (y₂-y₁)²)",
};
