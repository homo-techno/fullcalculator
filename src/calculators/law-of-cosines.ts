import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lawOfCosinesCalculator: CalculatorDefinition = {
  slug: "law-of-cosines-calculator",
  title: "Law of Cosines Calculator",
  description: "Free law of cosines calculator. Solve triangles using the law of cosines to find unknown sides and angles with step-by-step solutions.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["law of cosines calculator", "cosine rule calculator", "triangle solver", "SSS triangle", "SAS triangle"],
  variants: [
    {
      id: "find-side",
      name: "Find Side (SAS)",
      description: "Find side c given sides a, b and included angle C",
      fields: [
        { name: "a", label: "Side a", type: "number", placeholder: "e.g. 5", min: 0.001 },
        { name: "b", label: "Side b", type: "number", placeholder: "e.g. 7", min: 0.001 },
        { name: "C", label: "Angle C (degrees, between a and b)", type: "number", placeholder: "e.g. 60", min: 0.01, max: 179.99 },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const C = inputs.C as number;
        if (!a || !b || !C || C <= 0 || C >= 180) return null;

        const Crad = (C * Math.PI) / 180;
        const cSquared = a * a + b * b - 2 * a * b * Math.cos(Crad);
        if (cSquared < 0) return null;
        const c = Math.sqrt(cSquared);

        // Find remaining angles using law of cosines
        const cosA = (b * b + c * c - a * a) / (2 * b * c);
        const cosB = (a * a + c * c - b * b) / (2 * a * c);
        const A = (Math.acos(Math.max(-1, Math.min(1, cosA))) * 180) / Math.PI;
        const B = (Math.acos(Math.max(-1, Math.min(1, cosB))) * 180) / Math.PI;

        const area = 0.5 * a * b * Math.sin(Crad);
        const perimeter = a + b + c;

        return {
          primary: { label: "Side c", value: formatNumber(c, 6) },
          details: [
            { label: "Side c", value: formatNumber(c, 6) },
            { label: "Angle A", value: formatNumber(A, 4) + "°" },
            { label: "Angle B", value: formatNumber(B, 4) + "°" },
            { label: "Angle C", value: formatNumber(C, 4) + "°" },
            { label: "Sum of angles", value: formatNumber(A + B + C, 4) + "°" },
            { label: "Area", value: formatNumber(area, 4) },
            { label: "Perimeter", value: formatNumber(perimeter, 4) },
            { label: "Formula used", value: "c² = a² + b² - 2ab·cos(C)" },
          ],
        };
      },
    },
    {
      id: "find-angle",
      name: "Find Angle (SSS)",
      description: "Find all angles given three sides",
      fields: [
        { name: "a", label: "Side a", type: "number", placeholder: "e.g. 3", min: 0.001 },
        { name: "b", label: "Side b", type: "number", placeholder: "e.g. 4", min: 0.001 },
        { name: "c", label: "Side c", type: "number", placeholder: "e.g. 5", min: 0.001 },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const c = inputs.c as number;
        if (!a || !b || !c) return null;

        // Triangle inequality check
        if (a + b <= c || a + c <= b || b + c <= a) {
          return {
            primary: { label: "Error", value: "Not a valid triangle" },
            details: [
              { label: "Triangle inequality", value: "Sum of any two sides must exceed the third" },
            ],
          };
        }

        const cosA = (b * b + c * c - a * a) / (2 * b * c);
        const cosB = (a * a + c * c - b * b) / (2 * a * c);
        const cosC = (a * a + b * b - c * c) / (2 * a * b);

        const A = (Math.acos(Math.max(-1, Math.min(1, cosA))) * 180) / Math.PI;
        const B = (Math.acos(Math.max(-1, Math.min(1, cosB))) * 180) / Math.PI;
        const C = (Math.acos(Math.max(-1, Math.min(1, cosC))) * 180) / Math.PI;

        const s = (a + b + c) / 2;
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));

        let triangleType: string;
        if (Math.abs(A - 90) < 0.01 || Math.abs(B - 90) < 0.01 || Math.abs(C - 90) < 0.01) {
          triangleType = "Right triangle";
        } else if (A > 90 || B > 90 || C > 90) {
          triangleType = "Obtuse triangle";
        } else {
          triangleType = "Acute triangle";
        }

        return {
          primary: { label: "Angles", value: `A=${formatNumber(A, 4)}°, B=${formatNumber(B, 4)}°, C=${formatNumber(C, 4)}°` },
          details: [
            { label: "Angle A (opposite a)", value: formatNumber(A, 6) + "°" },
            { label: "Angle B (opposite b)", value: formatNumber(B, 6) + "°" },
            { label: "Angle C (opposite c)", value: formatNumber(C, 6) + "°" },
            { label: "Triangle type", value: triangleType },
            { label: "Area (Heron's)", value: formatNumber(area, 4) },
            { label: "Semi-perimeter", value: formatNumber(s, 4) },
            { label: "Formula", value: "cos(A) = (b²+c²-a²) / (2bc)" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["law-of-sines-calculator", "trig-calculator", "pythagorean-theorem-calculator"],
  faq: [
    { question: "What is the Law of Cosines?", answer: "The Law of Cosines states: c² = a² + b² - 2ab·cos(C), where C is the angle between sides a and b. It generalizes the Pythagorean theorem (when C = 90°, cos(90°) = 0, giving c² = a² + b²)." },
    { question: "When do I use Law of Cosines vs Law of Sines?", answer: "Use Law of Cosines for SSS (three sides) or SAS (two sides + included angle). Use Law of Sines for ASA (two angles + included side), AAS (two angles + non-included side), or SSA (ambiguous case)." },
  ],
  formula: "c² = a² + b² - 2ab·cos(C) | cos(A) = (b²+c²-a²)/(2bc) | Heron's: Area = √(s(s-a)(s-b)(s-c))",
};
