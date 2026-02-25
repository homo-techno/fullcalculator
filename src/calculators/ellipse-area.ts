import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ellipseAreaCalculator: CalculatorDefinition = {
  slug: "ellipse-area-calculator",
  title: "Ellipse Area Calculator",
  description: "Free ellipse area and perimeter calculator. Calculate the area, perimeter, eccentricity, and foci of an ellipse.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["ellipse area calculator", "ellipse calculator", "area of ellipse", "ellipse perimeter", "ellipse eccentricity"],
  variants: [
    {
      id: "fromAxes",
      name: "From Semi-Axes",
      fields: [
        { name: "a", label: "Semi-Major Axis (a)", type: "number", placeholder: "e.g. 8" },
        { name: "b", label: "Semi-Minor Axis (b)", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number, b = inputs.b as number;
        if (!a || !b) return null;
        const major = Math.max(a, b), minor = Math.min(a, b);
        const area = Math.PI * major * minor;
        const h = Math.pow(major - minor, 2) / Math.pow(major + minor, 2);
        const perimeter = Math.PI * (major + minor) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
        const c = Math.sqrt(major * major - minor * minor);
        const eccentricity = c / major;
        return {
          primary: { label: "Area", value: formatNumber(area, 6) },
          details: [
            { label: "Perimeter (approx)", value: formatNumber(perimeter, 6) },
            { label: "Eccentricity", value: formatNumber(eccentricity, 6) },
            { label: "Linear eccentricity (c)", value: formatNumber(c, 6) },
            { label: "Semi-major axis", value: formatNumber(major, 6) },
            { label: "Semi-minor axis", value: formatNumber(minor, 6) },
          ],
        };
      },
    },
    {
      id: "fromAreaAxis",
      name: "From Area & Semi-Major Axis",
      fields: [
        { name: "area", label: "Area", type: "number", placeholder: "e.g. 125.66" },
        { name: "a", label: "Semi-Major Axis (a)", type: "number", placeholder: "e.g. 8" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number, a = inputs.a as number;
        if (!area || !a) return null;
        const b = area / (Math.PI * a);
        if (b > a) return null;
        const c = Math.sqrt(a * a - b * b);
        const eccentricity = c / a;
        return {
          primary: { label: "Semi-Minor Axis (b)", value: formatNumber(b, 6) },
          details: [
            { label: "Area", value: formatNumber(area, 6) },
            { label: "Eccentricity", value: formatNumber(eccentricity, 6) },
            { label: "Linear eccentricity (c)", value: formatNumber(c, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["area-of-circle-calculator", "ellipse-equation-calculator", "circle-circumference-calculator"],
  faq: [
    { question: "How do you calculate the area of an ellipse?", answer: "Area = pi * a * b, where a is the semi-major axis and b is the semi-minor axis. When a = b, this reduces to pi*r^2 for a circle." },
    { question: "How do you approximate the perimeter of an ellipse?", answer: "There is no exact closed-form formula. Ramanujans approximation is: P ~ pi(a+b)(1 + 3h/(10+sqrt(4-3h))), where h = ((a-b)/(a+b))^2." },
  ],
  formula: "A = pi*a*b | P ~ pi(a+b)(1+3h/(10+sqrt(4-3h))) | e = c/a where c = sqrt(a^2-b^2)",
};
