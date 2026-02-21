import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const parallelogramAreaCalculator: CalculatorDefinition = {
  slug: "parallelogram-area-calculator",
  title: "Parallelogram Area Calculator",
  description: "Free parallelogram area calculator. Calculate area using base and height, two sides and angle, or diagonals and angle.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["parallelogram area calculator", "parallelogram calculator", "area of parallelogram", "rhombus area"],
  variants: [
    {
      id: "baseHeight",
      name: "Base × Height",
      fields: [
        { name: "base", label: "Base", type: "number", placeholder: "e.g. 8" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const b = inputs.base as number, h = inputs.height as number;
        if (!b || !h) return null;
        return {
          primary: { label: "Area", value: formatNumber(b * h, 6) },
          details: [
            { label: "Formula", value: `${b} × ${h} = ${formatNumber(b * h, 6)}` },
            { label: "Perimeter", value: "Need side length" },
          ],
        };
      },
    },
    {
      id: "sidesAngle",
      name: "Two Sides & Included Angle",
      fields: [
        { name: "a", label: "Side a", type: "number", placeholder: "e.g. 8" },
        { name: "b", label: "Side b", type: "number", placeholder: "e.g. 6" },
        { name: "angle", label: "Included Angle (degrees)", type: "number", placeholder: "e.g. 60" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number, b = inputs.b as number, angle = inputs.angle as number;
        if (!a || !b || !angle) return null;
        const rad = angle * Math.PI / 180;
        const area = a * b * Math.sin(rad);
        const h = b * Math.sin(rad);
        return {
          primary: { label: "Area", value: formatNumber(area, 6) },
          details: [
            { label: "Height", value: formatNumber(h, 6) },
            { label: "Perimeter", value: formatNumber(2 * (a + b), 6) },
            { label: "Type", value: a === b ? (angle === 90 ? "Square" : "Rhombus") : (angle === 90 ? "Rectangle" : "Parallelogram") },
          ],
        };
      },
    },
    {
      id: "diagonals",
      name: "From Diagonals & Angle",
      fields: [
        { name: "d1", label: "Diagonal d₁", type: "number", placeholder: "e.g. 10" },
        { name: "d2", label: "Diagonal d₂", type: "number", placeholder: "e.g. 8" },
        { name: "angle", label: "Angle Between Diagonals (degrees)", type: "number", placeholder: "e.g. 60" },
      ],
      calculate: (inputs) => {
        const d1 = inputs.d1 as number, d2 = inputs.d2 as number, angle = inputs.angle as number;
        if (!d1 || !d2 || !angle) return null;
        const area = 0.5 * d1 * d2 * Math.sin(angle * Math.PI / 180);
        return {
          primary: { label: "Area", value: formatNumber(area, 6) },
          details: [
            { label: "Formula", value: `½ × ${d1} × ${d2} × sin(${angle}°)` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["trapezoid-area-calculator", "triangle-area-calculator", "square-footage-calculator"],
  faq: [{ question: "How do you calculate parallelogram area?", answer: "Three methods: 1) A = base × height. 2) A = a × b × sin(θ) where θ is the included angle. 3) A = ½ × d₁ × d₂ × sin(α) where α is angle between diagonals." }],
  formula: "A = b×h | A = ab·sin(θ) | A = ½d₁d₂·sin(α)",
};
