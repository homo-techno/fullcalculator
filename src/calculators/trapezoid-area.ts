import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const trapezoidAreaCalculator: CalculatorDefinition = {
  slug: "trapezoid-area-calculator",
  title: "Trapezoid Area Calculator",
  description: "Free trapezoid area calculator. Calculate the area, perimeter, and height of a trapezoid from bases and height or all four sides.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["trapezoid area calculator", "trapezoid calculator", "area of trapezoid", "trapezium calculator"],
  variants: [
    {
      id: "basesHeight",
      name: "From Bases & Height",
      fields: [
        { name: "a", label: "Base a (top)", type: "number", placeholder: "e.g. 6" },
        { name: "b", label: "Base b (bottom)", type: "number", placeholder: "e.g. 10" },
        { name: "h", label: "Height", type: "number", placeholder: "e.g. 4" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number, b = inputs.b as number, h = inputs.h as number;
        if (!a || !b || !h) return null;
        const area = 0.5 * (a + b) * h;
        const median = (a + b) / 2;
        return {
          primary: { label: "Area", value: formatNumber(area, 6) },
          details: [
            { label: "Formula", value: `½ × (${a} + ${b}) × ${h}` },
            { label: "Median (midsegment)", value: formatNumber(median, 6) },
            { label: "Type", value: a === b ? "Rectangle" : "Trapezoid" },
          ],
        };
      },
    },
    {
      id: "allSides",
      name: "From All 4 Sides (Isosceles)",
      fields: [
        { name: "a", label: "Base a (top)", type: "number", placeholder: "e.g. 6" },
        { name: "b", label: "Base b (bottom)", type: "number", placeholder: "e.g. 10" },
        { name: "c", label: "Leg c", type: "number", placeholder: "e.g. 5" },
        { name: "d", label: "Leg d", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number, b = inputs.b as number;
        const c = inputs.c as number, d = inputs.d as number;
        if (!a || !b || !c || !d) return null;
        const s = (a + b + c + d) / 2;
        const perim = a + b + c + d;
        const areaSquared = ((s-a)*(s-b)*(s-a-c)*(s-a-d)) / ((b-a)*(b-a)) * (b-a) * (b-a);
        const areaAlt = Math.sqrt(Math.abs(((a+b)*(a+b))*(c+d-b+a)*(c+d+b-a) - ((a*a-b*b)+(c*c-d*d))*((a*a-b*b)+(c*c-d*d))) / 16);
        const h = (2 * areaAlt) / Math.abs(b - a || 1);
        return {
          primary: { label: "Area", value: formatNumber(areaAlt, 6) },
          details: [
            { label: "Perimeter", value: formatNumber(perim, 6) },
            { label: "Height (approx)", value: formatNumber(b !== a ? h : c, 6) },
            { label: "Type", value: c === d ? "Isosceles trapezoid" : "Scalene trapezoid" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["triangle-area-calculator", "parallelogram-area-calculator", "square-footage-calculator"],
  faq: [{ question: "How do you find the area of a trapezoid?", answer: "Area = ½ × (base₁ + base₂) × height. The two parallel sides are the bases. For example, bases 6 and 10 with height 4: A = ½ × (6+10) × 4 = 32." }],
  formula: "A = ½(a + b) × h",
};
