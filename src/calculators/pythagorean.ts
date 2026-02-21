import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pythagoreanCalculator: CalculatorDefinition = {
  slug: "pythagorean-theorem-calculator",
  title: "Pythagorean Theorem Calculator",
  description: "Free Pythagorean theorem calculator. Find the missing side of a right triangle. Calculate hypotenuse or leg length from two known sides.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["pythagorean theorem calculator", "hypotenuse calculator", "right triangle calculator", "a2 b2 c2 calculator", "triangle side calculator"],
  variants: [
    {
      id: "hypotenuse",
      name: "Find Hypotenuse (c)",
      description: "Calculate hypotenuse from two legs: c = √(a² + b²)",
      fields: [
        { name: "a", label: "Side a", type: "number", placeholder: "e.g. 3" },
        { name: "b", label: "Side b", type: "number", placeholder: "e.g. 4" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        if (!a || !b) return null;
        const c = Math.sqrt(a * a + b * b);
        const area = (a * b) / 2;
        const perimeter = a + b + c;
        const angleA = (Math.atan(a / b) * 180) / Math.PI;
        const angleB = 90 - angleA;
        return {
          primary: { label: "Hypotenuse (c)", value: formatNumber(c, 6) },
          details: [
            { label: "a² + b²", value: `${formatNumber(a * a)} + ${formatNumber(b * b)} = ${formatNumber(a * a + b * b)}` },
            { label: "Area", value: formatNumber(area, 4) },
            { label: "Perimeter", value: formatNumber(perimeter, 4) },
            { label: "Angle A (opposite a)", value: `${formatNumber(angleA, 2)}°` },
            { label: "Angle B (opposite b)", value: `${formatNumber(angleB, 2)}°` },
          ],
        };
      },
    },
    {
      id: "leg",
      name: "Find Missing Leg",
      description: "Calculate a missing leg from hypotenuse and one leg: a = √(c² - b²)",
      fields: [
        { name: "c", label: "Hypotenuse (c)", type: "number", placeholder: "e.g. 13" },
        { name: "b", label: "Known Side (b)", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const c = inputs.c as number;
        const b = inputs.b as number;
        if (!c || !b || c <= b) return null;
        const a = Math.sqrt(c * c - b * b);
        const area = (a * b) / 2;
        const perimeter = a + b + c;
        return {
          primary: { label: "Missing Side (a)", value: formatNumber(a, 6) },
          details: [
            { label: "c² - b²", value: `${formatNumber(c * c)} - ${formatNumber(b * b)} = ${formatNumber(c * c - b * b)}` },
            { label: "Area", value: formatNumber(area, 4) },
            { label: "Perimeter", value: formatNumber(perimeter, 4) },
          ],
        };
      },
    },
    {
      id: "check",
      name: "Check Right Triangle",
      description: "Verify if three sides form a right triangle",
      fields: [
        { name: "a", label: "Side a", type: "number", placeholder: "e.g. 3" },
        { name: "b", label: "Side b", type: "number", placeholder: "e.g. 4" },
        { name: "c", label: "Side c (longest)", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const c = inputs.c as number;
        if (!a || !b || !c) return null;
        const sides = [a, b, c].sort((x, y) => x - y);
        const isRight = Math.abs(sides[0] * sides[0] + sides[1] * sides[1] - sides[2] * sides[2]) < 0.0001;
        const sumSq = sides[0] * sides[0] + sides[1] * sides[1];
        const cSq = sides[2] * sides[2];
        return {
          primary: { label: "Right Triangle?", value: isRight ? "Yes" : "No" },
          details: [
            { label: "a² + b²", value: formatNumber(sumSq) },
            { label: "c²", value: formatNumber(cSq) },
            { label: "Difference", value: formatNumber(Math.abs(sumSq - cSq), 4) },
            { label: "Triangle type", value: isRight ? "Right (90°)" : sumSq > cSq ? "Acute (all angles < 90°)" : "Obtuse (one angle > 90°)" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["scientific-calculator", "quadratic-equation-calculator", "square-footage-calculator"],
  faq: [
    { question: "What is the Pythagorean theorem?", answer: "In a right triangle, the square of the hypotenuse (c) equals the sum of squares of the other two sides: a² + b² = c². For example, a 3-4-5 triangle: 9 + 16 = 25 = 5²." },
    { question: "What are Pythagorean triples?", answer: "Pythagorean triples are sets of three positive integers that satisfy a² + b² = c². Common ones: (3,4,5), (5,12,13), (8,15,17), (7,24,25). Any multiple of a triple is also a triple: (6,8,10) = 2×(3,4,5)." },
  ],
  formula: "a² + b² = c² | c = √(a² + b²) | a = √(c² - b²)",
};
