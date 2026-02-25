import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rectangleAreaCalculator: CalculatorDefinition = {
  slug: "rectangle-area-calculator",
  title: "Rectangle Area Calculator",
  description: "Free rectangle area calculator. Calculate the area, perimeter, and diagonal of a rectangle from length and width.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["rectangle area calculator", "rectangle calculator", "area of rectangle", "rectangle perimeter", "rectangle diagonal"],
  variants: [
    {
      id: "fromLW",
      name: "From Length & Width",
      fields: [
        { name: "length", label: "Length", type: "number", placeholder: "e.g. 10" },
        { name: "width", label: "Width", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const l = inputs.length as number, w = inputs.width as number;
        if (!l || !w) return null;
        const area = l * w;
        const perimeter = 2 * (l + w);
        const diagonal = Math.sqrt(l * l + w * w);
        return {
          primary: { label: "Area", value: formatNumber(area, 6) },
          details: [
            { label: "Perimeter", value: formatNumber(perimeter, 6) },
            { label: "Diagonal", value: formatNumber(diagonal, 6) },
            { label: "Length", value: formatNumber(l, 6) },
            { label: "Width", value: formatNumber(w, 6) },
          ],
        };
      },
    },
    {
      id: "fromAreaL",
      name: "From Area & Length",
      fields: [
        { name: "area", label: "Area", type: "number", placeholder: "e.g. 50" },
        { name: "length", label: "Length", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const a = inputs.area as number, l = inputs.length as number;
        if (!a || !l) return null;
        const w = a / l;
        const perimeter = 2 * (l + w);
        const diagonal = Math.sqrt(l * l + w * w);
        return {
          primary: { label: "Width", value: formatNumber(w, 6) },
          details: [
            { label: "Area", value: formatNumber(a, 6) },
            { label: "Perimeter", value: formatNumber(perimeter, 6) },
            { label: "Diagonal", value: formatNumber(diagonal, 6) },
          ],
        };
      },
    },
    {
      id: "fromPerimeterL",
      name: "From Perimeter & Length",
      fields: [
        { name: "perimeter", label: "Perimeter", type: "number", placeholder: "e.g. 30" },
        { name: "length", label: "Length", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const p = inputs.perimeter as number, l = inputs.length as number;
        if (!p || !l) return null;
        const w = p / 2 - l;
        if (w <= 0) return null;
        const area = l * w;
        const diagonal = Math.sqrt(l * l + w * w);
        return {
          primary: { label: "Width", value: formatNumber(w, 6) },
          details: [
            { label: "Area", value: formatNumber(area, 6) },
            { label: "Perimeter", value: formatNumber(p, 6) },
            { label: "Diagonal", value: formatNumber(diagonal, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["area-of-circle-calculator", "triangle-area-calculator", "square-footage-calculator"],
  faq: [
    { question: "How do you calculate the area of a rectangle?", answer: "Area = length x width. For a rectangle with length 10 and width 5, the area is 10 x 5 = 50 square units." },
    { question: "How do you find the diagonal of a rectangle?", answer: "Diagonal = sqrt(length^2 + width^2). This uses the Pythagorean theorem on the right triangle formed by length, width, and diagonal." },
  ],
  formula: "A = l x w | P = 2(l + w) | d = sqrt(l^2 + w^2)",
};
