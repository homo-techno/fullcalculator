import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const distanceFormulaCalculator: CalculatorDefinition = {
  slug: "distance-formula-calculator",
  title: "Distance Formula Calculator",
  description: "Free distance formula calculator. Calculate the distance between two points in 2D or 3D space.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["distance formula calculator", "distance between two points", "distance calculator", "2D distance", "3D distance"],
  variants: [
    {
      id: "twoD",
      name: "2D Distance",
      fields: [
        { name: "x1", label: "x1", type: "number", placeholder: "e.g. 1" },
        { name: "y1", label: "y1", type: "number", placeholder: "e.g. 2" },
        { name: "x2", label: "x2", type: "number", placeholder: "e.g. 4" },
        { name: "y2", label: "y2", type: "number", placeholder: "e.g. 6" },
      ],
      calculate: (inputs) => {
        const x1 = inputs.x1 as number, y1 = inputs.y1 as number;
        const x2 = inputs.x2 as number, y2 = inputs.y2 as number;
        if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined) return null;
        const dx = x2 - x1, dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2;
        const slope = dx !== 0 ? dy / dx : Infinity;
        return {
          primary: { label: "Distance", value: formatNumber(distance, 6) },
          details: [
            { label: "Horizontal distance (dx)", value: formatNumber(dx, 6) },
            { label: "Vertical distance (dy)", value: formatNumber(dy, 6) },
            { label: "Midpoint", value: "(" + formatNumber(midX, 6) + ", " + formatNumber(midY, 6) + ")" },
            { label: "Slope", value: dx !== 0 ? formatNumber(slope, 6) : "Undefined (vertical)" },
          ],
        };
      },
    },
    {
      id: "threeD",
      name: "3D Distance",
      fields: [
        { name: "x1", label: "x1", type: "number", placeholder: "e.g. 1" },
        { name: "y1", label: "y1", type: "number", placeholder: "e.g. 2" },
        { name: "z1", label: "z1", type: "number", placeholder: "e.g. 3" },
        { name: "x2", label: "x2", type: "number", placeholder: "e.g. 4" },
        { name: "y2", label: "y2", type: "number", placeholder: "e.g. 6" },
        { name: "z2", label: "z2", type: "number", placeholder: "e.g. 8" },
      ],
      calculate: (inputs) => {
        const x1 = inputs.x1 as number, y1 = inputs.y1 as number, z1 = inputs.z1 as number;
        const x2 = inputs.x2 as number, y2 = inputs.y2 as number, z2 = inputs.z2 as number;
        if (x1 === undefined || y1 === undefined || z1 === undefined || x2 === undefined || y2 === undefined || z2 === undefined) return null;
        const dx = x2 - x1, dy = y2 - y1, dz = z2 - z1;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2, midZ = (z1 + z2) / 2;
        return {
          primary: { label: "Distance", value: formatNumber(distance, 6) },
          details: [
            { label: "dx", value: formatNumber(dx, 6) },
            { label: "dy", value: formatNumber(dy, 6) },
            { label: "dz", value: formatNumber(dz, 6) },
            { label: "Midpoint", value: "(" + formatNumber(midX, 6) + ", " + formatNumber(midY, 6) + ", " + formatNumber(midZ, 6) + ")" },
          ],
        };
      },
    },
    {
      id: "manhattan",
      name: "Manhattan Distance (2D)",
      fields: [
        { name: "x1", label: "x1", type: "number", placeholder: "e.g. 1" },
        { name: "y1", label: "y1", type: "number", placeholder: "e.g. 2" },
        { name: "x2", label: "x2", type: "number", placeholder: "e.g. 4" },
        { name: "y2", label: "y2", type: "number", placeholder: "e.g. 6" },
      ],
      calculate: (inputs) => {
        const x1 = inputs.x1 as number, y1 = inputs.y1 as number;
        const x2 = inputs.x2 as number, y2 = inputs.y2 as number;
        if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined) return null;
        const manhattan = Math.abs(x2 - x1) + Math.abs(y2 - y1);
        const euclidean = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        return {
          primary: { label: "Manhattan Distance", value: formatNumber(manhattan, 6) },
          details: [
            { label: "Euclidean distance", value: formatNumber(euclidean, 6) },
            { label: "|dx|", value: formatNumber(Math.abs(x2 - x1), 6) },
            { label: "|dy|", value: formatNumber(Math.abs(y2 - y1), 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["midpoint-calculator", "slope-calculator", "equation-of-line-calculator"],
  faq: [
    { question: "What is the distance formula?", answer: "In 2D: d = sqrt((x2-x1)^2 + (y2-y1)^2). In 3D add the z component. It is derived from the Pythagorean theorem." },
    { question: "What is Manhattan distance?", answer: "Manhattan distance = |x2-x1| + |y2-y1|. It measures distance along grid lines (like city blocks), not in a straight line." },
  ],
  formula: "d = sqrt((x2-x1)^2 + (y2-y1)^2) | Manhattan = |x2-x1| + |y2-y1|",
};
