import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const regularPolygonCalculator: CalculatorDefinition = {
  slug: "regular-polygon-calculator",
  title: "Regular Polygon Calculator",
  description: "Free regular polygon calculator. Calculate the area, perimeter, apothem, and interior angles of any regular polygon.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["regular polygon calculator", "polygon calculator", "polygon area", "polygon apothem", "interior angle polygon"],
  variants: [
    {
      id: "fromSidesAndLength",
      name: "From Number of Sides & Side Length",
      fields: [
        { name: "n", label: "Number of Sides", type: "number", placeholder: "e.g. 7", min: 3 },
        { name: "side", label: "Side Length", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const n = inputs.n as number, s = inputs.side as number;
        if (!n || !s || n < 3) return null;
        const nInt = Math.floor(n);
        const apothem = s / (2 * Math.tan(Math.PI / nInt));
        const perimeter = nInt * s;
        const area = 0.5 * perimeter * apothem;
        const interiorAngle = ((nInt - 2) * 180) / nInt;
        const exteriorAngle = 360 / nInt;
        const circumradius = s / (2 * Math.sin(Math.PI / nInt));
        return {
          primary: { label: "Area", value: formatNumber(area, 6) },
          details: [
            { label: "Perimeter", value: formatNumber(perimeter, 6) },
            { label: "Apothem", value: formatNumber(apothem, 6) },
            { label: "Circumradius", value: formatNumber(circumradius, 6) },
            { label: "Interior angle", value: formatNumber(interiorAngle, 6) + "\u00b0" },
            { label: "Exterior angle", value: formatNumber(exteriorAngle, 6) + "\u00b0" },
            { label: "Sum of interior angles", value: formatNumber((nInt - 2) * 180, 6) + "\u00b0" },
            { label: "Number of diagonals", value: formatNumber(nInt * (nInt - 3) / 2, 0) },
          ],
        };
      },
    },
    {
      id: "fromSidesAndApothem",
      name: "From Number of Sides & Apothem",
      fields: [
        { name: "n", label: "Number of Sides", type: "number", placeholder: "e.g. 7", min: 3 },
        { name: "apothem", label: "Apothem", type: "number", placeholder: "e.g. 4.82" },
      ],
      calculate: (inputs) => {
        const n = inputs.n as number, a = inputs.apothem as number;
        if (!n || !a || n < 3) return null;
        const nInt = Math.floor(n);
        const s = 2 * a * Math.tan(Math.PI / nInt);
        const perimeter = nInt * s;
        const area = 0.5 * perimeter * a;
        const interiorAngle = ((nInt - 2) * 180) / nInt;
        return {
          primary: { label: "Area", value: formatNumber(area, 6) },
          details: [
            { label: "Side length", value: formatNumber(s, 6) },
            { label: "Perimeter", value: formatNumber(perimeter, 6) },
            { label: "Interior angle", value: formatNumber(interiorAngle, 6) + "\u00b0" },
          ],
        };
      },
    },
    {
      id: "fromSidesAndArea",
      name: "From Number of Sides & Area",
      fields: [
        { name: "n", label: "Number of Sides", type: "number", placeholder: "e.g. 7", min: 3 },
        { name: "area", label: "Area", type: "number", placeholder: "e.g. 84.3" },
      ],
      calculate: (inputs) => {
        const n = inputs.n as number, area = inputs.area as number;
        if (!n || !area || n < 3) return null;
        const nInt = Math.floor(n);
        const s = Math.sqrt((4 * area * Math.tan(Math.PI / nInt)) / nInt);
        const apothem = s / (2 * Math.tan(Math.PI / nInt));
        const perimeter = nInt * s;
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
  relatedSlugs: ["pentagon-area-calculator", "hexagon-area-calculator", "octagon-area-calculator"],
  faq: [
    { question: "How do you calculate the area of a regular polygon?", answer: "Area = (1/2) * perimeter * apothem, or Area = (n * s^2) / (4 * tan(pi/n)), where n is the number of sides and s is the side length." },
    { question: "What is the interior angle formula for a regular polygon?", answer: "Interior angle = ((n-2) * 180) / n degrees, where n is the number of sides. For example, a regular heptagon (7 sides) has interior angles of about 128.57 degrees." },
  ],
  formula: "A = (1/2)*P*a | a = s/(2*tan(pi/n)) | Interior = (n-2)*180/n",
};
