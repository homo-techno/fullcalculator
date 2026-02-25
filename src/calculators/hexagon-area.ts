import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hexagonAreaCalculator: CalculatorDefinition = {
  slug: "hexagon-area-calculator",
  title: "Hexagon Area Calculator",
  description: "Free hexagon area calculator. Calculate the area, perimeter, apothem, and diagonal of a regular hexagon.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["hexagon area calculator", "hexagon calculator", "area of hexagon", "regular hexagon", "hexagon perimeter"],
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
        const area = (3 * Math.sqrt(3) / 2) * s * s;
        const perimeter = 6 * s;
        const apothem = (s * Math.sqrt(3)) / 2;
        const longDiag = 2 * s;
        const shortDiag = s * Math.sqrt(3);
        return {
          primary: { label: "Area", value: formatNumber(area, 6) },
          details: [
            { label: "Perimeter", value: formatNumber(perimeter, 6) },
            { label: "Apothem", value: formatNumber(apothem, 6) },
            { label: "Long diagonal", value: formatNumber(longDiag, 6) },
            { label: "Short diagonal", value: formatNumber(shortDiag, 6) },
            { label: "Interior angle", value: "120\u00b0" },
          ],
        };
      },
    },
    {
      id: "fromApothem",
      name: "From Apothem",
      fields: [
        { name: "apothem", label: "Apothem", type: "number", placeholder: "e.g. 4.33" },
      ],
      calculate: (inputs) => {
        const a = inputs.apothem as number;
        if (!a) return null;
        const s = (2 * a) / Math.sqrt(3);
        const perimeter = 6 * s;
        const area = 0.5 * perimeter * a;
        return {
          primary: { label: "Area", value: formatNumber(area, 6) },
          details: [
            { label: "Side length", value: formatNumber(s, 6) },
            { label: "Perimeter", value: formatNumber(perimeter, 6) },
            { label: "Long diagonal", value: formatNumber(2 * s, 6) },
          ],
        };
      },
    },
    {
      id: "fromDiagonal",
      name: "From Diagonal",
      fields: [
        { name: "diagonal", label: "Long Diagonal (vertex to vertex)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const d = inputs.diagonal as number;
        if (!d) return null;
        const s = d / 2;
        const area = (3 * Math.sqrt(3) / 2) * s * s;
        const perimeter = 6 * s;
        const apothem = (s * Math.sqrt(3)) / 2;
        return {
          primary: { label: "Area", value: formatNumber(area, 6) },
          details: [
            { label: "Side length", value: formatNumber(s, 6) },
            { label: "Perimeter", value: formatNumber(perimeter, 6) },
            { label: "Apothem", value: formatNumber(apothem, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pentagon-area-calculator", "octagon-area-calculator", "regular-polygon-calculator"],
  faq: [
    { question: "How do you calculate the area of a regular hexagon?", answer: "Area = (3*sqrt(3)/2) * s^2, where s is the side length. A regular hexagon can be divided into 6 equilateral triangles." },
    { question: "What is the relationship between the side and diagonal?", answer: "The long diagonal (vertex to vertex) of a regular hexagon equals 2 * side length. The short diagonal equals s*sqrt(3)." },
  ],
  formula: "A = (3*sqrt(3)/2)*s^2 | P = 6s | apothem = s*sqrt(3)/2",
};
