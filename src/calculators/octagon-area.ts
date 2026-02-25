import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const octagonAreaCalculator: CalculatorDefinition = {
  slug: "octagon-area-calculator",
  title: "Octagon Area Calculator",
  description: "Free octagon area calculator. Calculate the area, perimeter, and apothem of a regular octagon from side length.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["octagon area calculator", "octagon calculator", "area of octagon", "regular octagon", "octagon perimeter"],
  variants: [
    {
      id: "fromSide",
      name: "From Side Length",
      fields: [
        { name: "side", label: "Side Length", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const s = inputs.side as number;
        if (!s) return null;
        const area = 2 * (1 + Math.sqrt(2)) * s * s;
        const perimeter = 8 * s;
        const apothem = (s / 2) * (1 + Math.sqrt(2));
        return {
          primary: { label: "Area", value: formatNumber(area, 6) },
          details: [
            { label: "Perimeter", value: formatNumber(perimeter, 6) },
            { label: "Apothem", value: formatNumber(apothem, 6) },
            { label: "Interior angle", value: "135\u00b0" },
            { label: "Number of diagonals", value: "20" },
          ],
        };
      },
    },
    {
      id: "fromApothem",
      name: "From Apothem",
      fields: [
        { name: "apothem", label: "Apothem", type: "number", placeholder: "e.g. 6.04" },
      ],
      calculate: (inputs) => {
        const a = inputs.apothem as number;
        if (!a) return null;
        const s = (2 * a) / (1 + Math.sqrt(2));
        const perimeter = 8 * s;
        const area = 0.5 * perimeter * a;
        return {
          primary: { label: "Area", value: formatNumber(area, 6) },
          details: [
            { label: "Side length", value: formatNumber(s, 6) },
            { label: "Perimeter", value: formatNumber(perimeter, 6) },
            { label: "Apothem", value: formatNumber(a, 6) },
          ],
        };
      },
    },
    {
      id: "fromPerimeter",
      name: "From Perimeter",
      fields: [
        { name: "perimeter", label: "Perimeter", type: "number", placeholder: "e.g. 40" },
      ],
      calculate: (inputs) => {
        const p = inputs.perimeter as number;
        if (!p) return null;
        const s = p / 8;
        const area = 2 * (1 + Math.sqrt(2)) * s * s;
        const apothem = (s / 2) * (1 + Math.sqrt(2));
        return {
          primary: { label: "Area", value: formatNumber(area, 6) },
          details: [
            { label: "Side length", value: formatNumber(s, 6) },
            { label: "Perimeter", value: formatNumber(p, 6) },
            { label: "Apothem", value: formatNumber(apothem, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["hexagon-area-calculator", "pentagon-area-calculator", "regular-polygon-calculator"],
  faq: [
    { question: "How do you calculate the area of a regular octagon?", answer: "Area = 2(1 + sqrt(2)) * s^2, where s is the side length. This comes from dividing the octagon into triangles and rectangles." },
    { question: "What is the interior angle of a regular octagon?", answer: "Each interior angle of a regular octagon is 135 degrees. The sum of all interior angles is 1080 degrees." },
  ],
  formula: "A = 2(1+sqrt(2))*s^2 | P = 8s | apothem = (s/2)(1+sqrt(2))",
};
