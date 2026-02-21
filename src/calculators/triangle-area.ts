import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const triangleAreaCalculator: CalculatorDefinition = {
  slug: "triangle-area-calculator",
  title: "Triangle Area Calculator",
  description: "Free triangle area calculator. Calculate the area of a triangle using base and height, three sides (Heron's formula), or two sides and an angle.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["triangle area calculator", "area of triangle", "heron's formula", "triangle calculator", "triangle perimeter"],
  variants: [
    {
      id: "baseHeight",
      name: "Base × Height",
      fields: [
        { name: "base", label: "Base", type: "number", placeholder: "e.g. 10" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 6" },
      ],
      calculate: (inputs) => {
        const b = inputs.base as number, h = inputs.height as number;
        if (!b || !h) return null;
        return {
          primary: { label: "Area", value: formatNumber(0.5 * b * h, 6) },
          details: [{ label: "Formula", value: `½ × ${b} × ${h}` }],
        };
      },
    },
    {
      id: "heron",
      name: "Three Sides (Heron's)",
      fields: [
        { name: "a", label: "Side a", type: "number", placeholder: "e.g. 5" },
        { name: "b", label: "Side b", type: "number", placeholder: "e.g. 6" },
        { name: "c", label: "Side c", type: "number", placeholder: "e.g. 7" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number, b = inputs.b as number, c = inputs.c as number;
        if (!a || !b || !c) return null;
        if (a + b <= c || a + c <= b || b + c <= a) return { primary: { label: "Error", value: "Not a valid triangle" }, details: [] };
        const s = (a + b + c) / 2;
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        const perimeter = a + b + c;
        return {
          primary: { label: "Area", value: formatNumber(area, 6) },
          details: [
            { label: "Perimeter", value: formatNumber(perimeter) },
            { label: "Semi-perimeter (s)", value: formatNumber(s) },
            { label: "Type", value: a === b && b === c ? "Equilateral" : a === b || b === c || a === c ? "Isosceles" : "Scalene" },
          ],
        };
      },
    },
    {
      id: "sas",
      name: "Two Sides + Angle (SAS)",
      fields: [
        { name: "a", label: "Side a", type: "number", placeholder: "e.g. 5" },
        { name: "b", label: "Side b", type: "number", placeholder: "e.g. 7" },
        { name: "angle", label: "Included Angle (degrees)", type: "number", placeholder: "e.g. 60" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number, b = inputs.b as number, angle = inputs.angle as number;
        if (!a || !b || !angle) return null;
        const rad = angle * Math.PI / 180;
        const area = 0.5 * a * b * Math.sin(rad);
        return {
          primary: { label: "Area", value: formatNumber(area, 6) },
          details: [{ label: "Formula", value: `½ × ${a} × ${b} × sin(${angle}°)` }],
        };
      },
    },
  ],
  relatedSlugs: ["pythagorean-theorem-calculator", "area-of-circle-calculator", "square-footage-calculator"],
  faq: [{ question: "How do I find the area of a triangle?", answer: "Method 1: Area = ½ × base × height. Method 2 (Heron's): s = (a+b+c)/2, Area = √(s(s-a)(s-b)(s-c)). Method 3 (SAS): Area = ½ab×sin(C)." }],
  formula: "A = ½bh | Heron: A = √(s(s-a)(s-b)(s-c)) | SAS: A = ½ab·sin(C)",
};
