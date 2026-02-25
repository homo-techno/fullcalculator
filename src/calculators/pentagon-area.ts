import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pentagonAreaCalculator: CalculatorDefinition = {
  slug: "pentagon-area-calculator",
  title: "Pentagon Area Calculator",
  description: "Free pentagon area calculator. Calculate the area, perimeter, and apothem of a regular pentagon from side length.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["pentagon area calculator", "pentagon calculator", "area of pentagon", "regular pentagon", "pentagon perimeter"],
  variants: [
    {
      id: "fromSide",
      name: "From Side Length",
      fields: [
        { name: "side", label: "Side Length", type: "number", placeholder: "e.g. 6" },
      ],
      calculate: (inputs) => {
        const s = inputs.side as number;
        if (!s) return null;
        const area = (Math.sqrt(5 * (5 + 2 * Math.sqrt(5))) / 4) * s * s;
        const perimeter = 5 * s;
        const apothem = s / (2 * Math.tan(Math.PI / 5));
        const diagonal = s * (1 + Math.sqrt(5)) / 2;
        return {
          primary: { label: "Area", value: formatNumber(area, 6) },
          details: [
            { label: "Perimeter", value: formatNumber(perimeter, 6) },
            { label: "Apothem", value: formatNumber(apothem, 6) },
            { label: "Diagonal", value: formatNumber(diagonal, 6) },
            { label: "Interior angle", value: "108\u00b0" },
          ],
        };
      },
    },
    {
      id: "fromApothem",
      name: "From Apothem",
      fields: [
        { name: "apothem", label: "Apothem", type: "number", placeholder: "e.g. 4.13" },
      ],
      calculate: (inputs) => {
        const a = inputs.apothem as number;
        if (!a) return null;
        const s = 2 * a * Math.tan(Math.PI / 5);
        const perimeter = 5 * s;
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
      id: "fromArea",
      name: "From Area",
      fields: [
        { name: "area", label: "Area", type: "number", placeholder: "e.g. 61.94" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        if (!area) return null;
        const s = Math.sqrt((4 * area) / Math.sqrt(5 * (5 + 2 * Math.sqrt(5))));
        const perimeter = 5 * s;
        const apothem = s / (2 * Math.tan(Math.PI / 5));
        return {
          primary: { label: "Side Length", value: formatNumber(s, 6) },
          details: [
            { label: "Area", value: formatNumber(area, 6) },
            { label: "Perimeter", value: formatNumber(perimeter, 6) },
            { label: "Apothem", value: formatNumber(apothem, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["hexagon-area-calculator", "octagon-area-calculator", "regular-polygon-calculator"],
  faq: [
    { question: "How do you calculate the area of a regular pentagon?", answer: "Area = (sqrt(25 + 10*sqrt(5)) / 4) * s^2, where s is the side length. Alternatively, Area = 0.5 * perimeter * apothem." },
    { question: "What is the interior angle of a regular pentagon?", answer: "Each interior angle of a regular pentagon is 108 degrees. The sum of all interior angles is 540 degrees." },
  ],
  formula: "A = (sqrt(25+10*sqrt(5))/4) * s^2 | P = 5s | apothem = s/(2*tan(pi/5))",
};
