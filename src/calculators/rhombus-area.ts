import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rhombusAreaCalculator: CalculatorDefinition = {
  slug: "rhombus-area-calculator",
  title: "Rhombus Area Calculator",
  description: "Free rhombus area calculator. Calculate the area, perimeter, and diagonals of a rhombus from various inputs.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["rhombus area calculator", "rhombus calculator", "area of rhombus", "rhombus perimeter", "rhombus diagonals"],
  variants: [
    {
      id: "fromDiagonals",
      name: "From Diagonals",
      fields: [
        { name: "d1", label: "Diagonal 1 (d1)", type: "number", placeholder: "e.g. 10" },
        { name: "d2", label: "Diagonal 2 (d2)", type: "number", placeholder: "e.g. 8" },
      ],
      calculate: (inputs) => {
        const d1 = inputs.d1 as number, d2 = inputs.d2 as number;
        if (!d1 || !d2) return null;
        const area = (d1 * d2) / 2;
        const side = Math.sqrt((d1 / 2) * (d1 / 2) + (d2 / 2) * (d2 / 2));
        const perimeter = 4 * side;
        return {
          primary: { label: "Area", value: formatNumber(area, 6) },
          details: [
            { label: "Side length", value: formatNumber(side, 6) },
            { label: "Perimeter", value: formatNumber(perimeter, 6) },
            { label: "Diagonal 1", value: formatNumber(d1, 6) },
            { label: "Diagonal 2", value: formatNumber(d2, 6) },
          ],
        };
      },
    },
    {
      id: "fromSideAngle",
      name: "From Side & Angle",
      fields: [
        { name: "side", label: "Side Length", type: "number", placeholder: "e.g. 6.4" },
        { name: "angle", label: "Angle (degrees)", type: "number", placeholder: "e.g. 60" },
      ],
      calculate: (inputs) => {
        const s = inputs.side as number, angle = inputs.angle as number;
        if (!s || !angle || angle <= 0 || angle >= 180) return null;
        const rad = (angle * Math.PI) / 180;
        const area = s * s * Math.sin(rad);
        const perimeter = 4 * s;
        const d1 = 2 * s * Math.sin(rad / 2);
        const d2 = 2 * s * Math.cos(rad / 2);
        return {
          primary: { label: "Area", value: formatNumber(area, 6) },
          details: [
            { label: "Perimeter", value: formatNumber(perimeter, 6) },
            { label: "Diagonal 1", value: formatNumber(d1, 6) },
            { label: "Diagonal 2", value: formatNumber(d2, 6) },
            { label: "Supplementary angle", value: formatNumber(180 - angle, 6) + "\u00b0" },
          ],
        };
      },
    },
    {
      id: "fromSideHeight",
      name: "From Side & Height",
      fields: [
        { name: "side", label: "Side Length", type: "number", placeholder: "e.g. 6.4" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 5.54" },
      ],
      calculate: (inputs) => {
        const s = inputs.side as number, h = inputs.height as number;
        if (!s || !h || h > s) return null;
        const area = s * h;
        const perimeter = 4 * s;
        const sinA = h / s;
        const angleDeg = (Math.asin(sinA) * 180) / Math.PI;
        return {
          primary: { label: "Area", value: formatNumber(area, 6) },
          details: [
            { label: "Perimeter", value: formatNumber(perimeter, 6) },
            { label: "Acute angle", value: formatNumber(angleDeg, 6) + "\u00b0" },
            { label: "Obtuse angle", value: formatNumber(180 - angleDeg, 6) + "\u00b0" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["parallelogram-area-calculator", "rectangle-area-calculator", "trapezoid-area-calculator"],
  faq: [
    { question: "How do you calculate the area of a rhombus?", answer: "There are several methods: Area = (d1 * d2) / 2 using diagonals, Area = s^2 * sin(angle) using side and angle, or Area = side * height." },
    { question: "What is the difference between a rhombus and a square?", answer: "A square is a special case of a rhombus where all angles are 90 degrees. A rhombus has all sides equal but angles can vary." },
  ],
  formula: "A = (d1*d2)/2 | A = s^2*sin(angle) | A = s*h | P = 4s",
};
