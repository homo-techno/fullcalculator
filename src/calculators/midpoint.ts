import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const midpointCalculator: CalculatorDefinition = {
  slug: "midpoint-calculator",
  title: "Midpoint Calculator",
  description: "Free midpoint calculator. Find the midpoint between two points, calculate distance, and get the equation of the perpendicular bisector.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["midpoint calculator", "midpoint formula", "find midpoint", "center point calculator", "midpoint between two points"],
  variants: [
    {
      id: "midpoint",
      name: "Midpoint Between Two Points",
      fields: [
        { name: "x1", label: "x₁", type: "number", placeholder: "e.g. 2" },
        { name: "y1", label: "y₁", type: "number", placeholder: "e.g. 3" },
        { name: "x2", label: "x₂", type: "number", placeholder: "e.g. 8" },
        { name: "y2", label: "y₂", type: "number", placeholder: "e.g. 7" },
      ],
      calculate: (inputs) => {
        const x1 = inputs.x1 as number, y1 = inputs.y1 as number;
        const x2 = inputs.x2 as number, y2 = inputs.y2 as number;
        if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined) return null;
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        return {
          primary: { label: "Midpoint", value: `(${formatNumber(mx, 4)}, ${formatNumber(my, 4)})` },
          details: [
            { label: "Distance", value: formatNumber(dist, 6) },
            { label: "Point 1", value: `(${x1}, ${y1})` },
            { label: "Point 2", value: `(${x2}, ${y2})` },
            { label: "Δx", value: formatNumber(x2 - x1) },
            { label: "Δy", value: formatNumber(y2 - y1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["slope-calculator", "pythagorean-theorem-calculator", "quadratic-equation-calculator"],
  faq: [
    { question: "What is the midpoint formula?", answer: "Midpoint = ((x₁+x₂)/2, (y₁+y₂)/2). Simply average the x-coordinates and the y-coordinates. For (2,3) and (8,7): midpoint = (5, 5)." },
  ],
  formula: "M = ((x₁+x₂)/2, (y₁+y₂)/2) | d = √((x₂-x₁)² + (y₂-y₁)²)",
};
