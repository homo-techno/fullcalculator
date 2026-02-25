import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const heronFormulaCalculator: CalculatorDefinition = {
  slug: "heron-formula-calculator",
  title: "Herons Formula Calculator",
  description: "Free Herons formula calculator. Calculate the area of a triangle from the lengths of its three sides.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["heron formula calculator", "herons formula", "triangle area from sides", "hero formula", "triangle area three sides"],
  variants: [
    {
      id: "fromThreeSides",
      name: "From Three Side Lengths",
      fields: [
        { name: "a", label: "Side a", type: "number", placeholder: "e.g. 5" },
        { name: "b", label: "Side b", type: "number", placeholder: "e.g. 7" },
        { name: "c", label: "Side c", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number, b = inputs.b as number, c = inputs.c as number;
        if (!a || !b || !c) return null;
        if (a + b <= c || a + c <= b || b + c <= a) return null;
        const s = (a + b + c) / 2;
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        const perimeter = a + b + c;
        const inradius = area / s;
        const angleA = Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180 / Math.PI;
        const angleB = Math.acos((a * a + c * c - b * b) / (2 * a * c)) * 180 / Math.PI;
        const angleC = 180 - angleA - angleB;
        const circumradius = (a * b * c) / (4 * area);
        return {
          primary: { label: "Area", value: formatNumber(area, 6) },
          details: [
            { label: "Semi-perimeter (s)", value: formatNumber(s, 6) },
            { label: "Perimeter", value: formatNumber(perimeter, 6) },
            { label: "Inradius", value: formatNumber(inradius, 6) },
            { label: "Circumradius", value: formatNumber(circumradius, 6) },
            { label: "Angle A", value: formatNumber(angleA, 6) + "\u00b0" },
            { label: "Angle B", value: formatNumber(angleB, 6) + "\u00b0" },
            { label: "Angle C", value: formatNumber(angleC, 6) + "\u00b0" },
          ],
        };
      },
    },
    {
      id: "fromAreaTwoSides",
      name: "Find Third Side from Area and Two Sides",
      fields: [
        { name: "area", label: "Area", type: "number", placeholder: "e.g. 16.25" },
        { name: "a", label: "Side a", type: "number", placeholder: "e.g. 5" },
        { name: "b", label: "Side b", type: "number", placeholder: "e.g. 7" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number, a = inputs.a as number, b = inputs.b as number;
        if (!area || !a || !b) return null;
        const sinC = (2 * area) / (a * b);
        if (Math.abs(sinC) > 1) return null;
        const angleC = Math.asin(sinC);
        const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(angleC));
        if (a + b <= c || a + c <= b || b + c <= a) return null;
        const s = (a + b + c) / 2;
        const checkArea = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        return {
          primary: { label: "Side c", value: formatNumber(c, 6) },
          details: [
            { label: "Verified area", value: formatNumber(checkArea, 6) },
            { label: "Perimeter", value: formatNumber(a + b + c, 6) },
            { label: "Angle C", value: formatNumber(angleC * 180 / Math.PI, 6) + "\u00b0" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["triangle-area-calculator", "triangle-inequality-calculator", "pythagorean-calculator"],
  faq: [
    { question: "What is Herons formula?", answer: "Herons formula calculates the area of a triangle when you know all three side lengths: Area = sqrt(s(s-a)(s-b)(s-c)), where s = (a+b+c)/2 is the semi-perimeter." },
    { question: "When should you use Herons formula?", answer: "Use it when you know all three sides but not the height or angles. It is especially useful when finding the height would be difficult." },
  ],
  formula: "A = sqrt(s(s-a)(s-b)(s-c)) where s = (a+b+c)/2",
};
