import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const circumferenceCalculator: CalculatorDefinition = {
  slug: "circumference-calculator",
  title: "Circumference Calculator",
  description: "Free circumference calculator. Calculate the circumference, diameter, and radius of a circle from any known measurement.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["circumference calculator", "circle circumference", "perimeter of circle", "circumference formula", "2 pi r"],
  variants: [
    {
      id: "fromRadius",
      name: "From Radius",
      fields: [{ name: "r", label: "Radius", type: "number", placeholder: "e.g. 7" }],
      calculate: (inputs) => {
        const r = inputs.r as number;
        if (!r) return null;
        return {
          primary: { label: "Circumference", value: formatNumber(2 * Math.PI * r, 6) },
          details: [
            { label: "Diameter", value: formatNumber(2 * r) },
            { label: "Area", value: formatNumber(Math.PI * r * r, 6) },
          ],
        };
      },
    },
    {
      id: "fromDiameter",
      name: "From Diameter",
      fields: [{ name: "d", label: "Diameter", type: "number", placeholder: "e.g. 14" }],
      calculate: (inputs) => {
        const d = inputs.d as number;
        if (!d) return null;
        return {
          primary: { label: "Circumference", value: formatNumber(Math.PI * d, 6) },
          details: [
            { label: "Radius", value: formatNumber(d / 2) },
            { label: "Area", value: formatNumber(Math.PI * (d / 2) * (d / 2), 6) },
          ],
        };
      },
    },
    {
      id: "fromCirc",
      name: "From Circumference",
      fields: [{ name: "c", label: "Circumference", type: "number", placeholder: "e.g. 43.98" }],
      calculate: (inputs) => {
        const c = inputs.c as number;
        if (!c) return null;
        const r = c / (2 * Math.PI);
        return {
          primary: { label: "Radius", value: formatNumber(r, 6) },
          details: [
            { label: "Diameter", value: formatNumber(2 * r, 6) },
            { label: "Area", value: formatNumber(Math.PI * r * r, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["area-of-circle-calculator", "pythagorean-theorem-calculator", "volume-calculator"],
  faq: [{ question: "What is circumference?", answer: "Circumference is the perimeter of a circle: C = 2πr = πd. For a circle with radius 7: C = 2 × 3.14159 × 7 ≈ 43.98." }],
  formula: "C = 2πr = πd",
};
