import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const triangleInequalityCalculator: CalculatorDefinition = {
  slug: "triangle-inequality-calculator",
  title: "Triangle Inequality Calculator",
  description: "Free triangle inequality calculator. Check if three sides can form a valid triangle and classify the triangle type.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["triangle inequality calculator", "triangle inequality theorem", "valid triangle", "triangle check", "triangle classifier"],
  variants: [
    {
      id: "checkSides",
      name: "Check Three Sides",
      fields: [
        { name: "a", label: "Side a", type: "number", placeholder: "e.g. 5" },
        { name: "b", label: "Side b", type: "number", placeholder: "e.g. 7" },
        { name: "c", label: "Side c", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number, b = inputs.b as number, c = inputs.c as number;
        if (!a || !b || !c) return null;
        const valid = (a + b > c) && (a + c > b) && (b + c > a);
        if (!valid) {
          return {
            primary: { label: "Result", value: "NOT a valid triangle" },
            details: [
              { label: "a + b > c", value: (a + b > c) ? "Yes" : "No (FAILS)" },
              { label: "a + c > b", value: (a + c > b) ? "Yes" : "No (FAILS)" },
              { label: "b + c > a", value: (b + c > a) ? "Yes" : "No (FAILS)" },
            ],
          };
        }
        const sides = [a, b, c].sort((x, y) => x - y);
        let sideType = "Scalene";
        if (sides[0] === sides[1] && sides[1] === sides[2]) sideType = "Equilateral";
        else if (sides[0] === sides[1] || sides[1] === sides[2]) sideType = "Isosceles";
        let angleType = "Acute";
        if (Math.abs(sides[0] * sides[0] + sides[1] * sides[1] - sides[2] * sides[2]) < 0.0001) angleType = "Right";
        else if (sides[0] * sides[0] + sides[1] * sides[1] < sides[2] * sides[2]) angleType = "Obtuse";
        const s = (a + b + c) / 2;
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        const perimeter = a + b + c;
        return {
          primary: { label: "Result", value: "Valid " + sideType + " " + angleType + " Triangle" },
          details: [
            { label: "a + b > c", value: formatNumber(a + b, 6) + " > " + formatNumber(c, 6) + " \u2713" },
            { label: "a + c > b", value: formatNumber(a + c, 6) + " > " + formatNumber(b, 6) + " \u2713" },
            { label: "b + c > a", value: formatNumber(b + c, 6) + " > " + formatNumber(a, 6) + " \u2713" },
            { label: "Side classification", value: sideType },
            { label: "Angle classification", value: angleType },
            { label: "Area (Heron)", value: formatNumber(area, 6) },
            { label: "Perimeter", value: formatNumber(perimeter, 6) },
          ],
        };
      },
    },
    {
      id: "findRange",
      name: "Find Valid Range for Third Side",
      fields: [
        { name: "a", label: "Side a", type: "number", placeholder: "e.g. 5" },
        { name: "b", label: "Side b", type: "number", placeholder: "e.g. 7" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number, b = inputs.b as number;
        if (!a || !b) return null;
        const minC = Math.abs(a - b);
        const maxC = a + b;
        return {
          primary: { label: "Valid Range for Side c", value: formatNumber(minC, 6) + " < c < " + formatNumber(maxC, 6) },
          details: [
            { label: "Minimum (exclusive)", value: formatNumber(minC, 6) },
            { label: "Maximum (exclusive)", value: formatNumber(maxC, 6) },
            { label: "Side a", value: formatNumber(a, 6) },
            { label: "Side b", value: formatNumber(b, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["triangle-area-calculator", "heron-formula-calculator", "pythagorean-calculator"],
  faq: [
    { question: "What is the triangle inequality theorem?", answer: "The triangle inequality theorem states that the sum of any two sides of a triangle must be greater than the third side. All three conditions must hold: a+b>c, a+c>b, b+c>a." },
    { question: "How do you classify a triangle by its sides?", answer: "Equilateral: all three sides equal. Isosceles: exactly two sides equal. Scalene: all three sides different." },
  ],
  formula: "a + b > c AND a + c > b AND b + c > a",
};
