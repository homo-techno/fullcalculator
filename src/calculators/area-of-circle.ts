import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const areaOfCircleCalculator: CalculatorDefinition = {
  slug: "area-of-circle-calculator",
  title: "Area of Circle Calculator",
  description: "Free circle calculator. Calculate area, circumference, and diameter of a circle from radius, diameter, or area.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["area of circle", "circle calculator", "circumference calculator", "circle area formula", "pi r squared"],
  variants: [
    {
      id: "fromRadius",
      name: "From Radius",
      fields: [
        { name: "radius", label: "Radius", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const r = inputs.radius as number;
        if (!r) return null;
        const area = Math.PI * r * r;
        const circumference = 2 * Math.PI * r;
        const diameter = 2 * r;
        return {
          primary: { label: "Area", value: formatNumber(area, 6) },
          details: [
            { label: "Circumference", value: formatNumber(circumference, 6) },
            { label: "Diameter", value: formatNumber(diameter, 6) },
            { label: "Radius", value: formatNumber(r, 6) },
          ],
        };
      },
    },
    {
      id: "fromDiameter",
      name: "From Diameter",
      fields: [
        { name: "diameter", label: "Diameter", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const d = inputs.diameter as number;
        if (!d) return null;
        const r = d / 2;
        const area = Math.PI * r * r;
        const circumference = Math.PI * d;
        return {
          primary: { label: "Area", value: formatNumber(area, 6) },
          details: [
            { label: "Circumference", value: formatNumber(circumference, 6) },
            { label: "Radius", value: formatNumber(r, 6) },
          ],
        };
      },
    },
    {
      id: "fromArea",
      name: "From Area",
      fields: [
        { name: "area", label: "Area", type: "number", placeholder: "e.g. 78.54" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        if (!area) return null;
        const r = Math.sqrt(area / Math.PI);
        const circumference = 2 * Math.PI * r;
        return {
          primary: { label: "Radius", value: formatNumber(r, 6) },
          details: [
            { label: "Diameter", value: formatNumber(2 * r, 6) },
            { label: "Circumference", value: formatNumber(circumference, 6) },
            { label: "Area", value: formatNumber(area, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["square-footage-calculator", "volume-calculator", "pythagorean-theorem-calculator"],
  faq: [
    { question: "What is the area of a circle?", answer: "Area = πr² where r is the radius. For a circle with radius 5: Area = π × 25 ≈ 78.54. You can also use diameter: Area = π(d/2)² = πd²/4." },
  ],
  formula: "A = πr² | C = 2πr | d = 2r",
};
