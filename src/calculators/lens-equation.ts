import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lensEquationCalculator: CalculatorDefinition = {
  slug: "lens-equation-calculator",
  title: "Thin Lens Equation Calculator",
  description: "Free thin lens equation calculator. Calculate focal length, image distance, object distance, and magnification for lenses and mirrors.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["lens equation calculator", "thin lens equation", "focal length calculator", "magnification calculator", "optics calculator"],
  variants: [
    {
      id: "findImage",
      name: "Find Image Distance",
      fields: [
        { name: "f", label: "Focal Length (cm)", type: "number", placeholder: "e.g. 10" },
        { name: "do", label: "Object Distance (cm)", type: "number", placeholder: "e.g. 25" },
      ],
      calculate: (inputs) => {
        const f = inputs.f as number, dObj = inputs.do as number;
        if (!f || !dObj) return null;
        if (Math.abs(dObj - f) < 0.0001) return { primary: { label: "Image", value: "At infinity (object at focal point)" }, details: [] };
        const di = 1 / (1 / f - 1 / dObj);
        const m = -di / dObj;
        return {
          primary: { label: "Image Distance", value: `${formatNumber(di, 4)} cm` },
          details: [
            { label: "Magnification", value: `${formatNumber(m, 4)}×` },
            { label: "Image type", value: di > 0 ? "Real" : "Virtual" },
            { label: "Orientation", value: m > 0 ? "Upright" : "Inverted" },
            { label: "Size", value: `${formatNumber(Math.abs(m), 4)}× original` },
          ],
        };
      },
    },
    {
      id: "findFocal",
      name: "Find Focal Length",
      fields: [
        { name: "do", label: "Object Distance (cm)", type: "number", placeholder: "e.g. 25" },
        { name: "di", label: "Image Distance (cm)", type: "number", placeholder: "e.g. 16.67" },
      ],
      calculate: (inputs) => {
        const dObj = inputs.do as number, di = inputs.di as number;
        if (!dObj || !di) return null;
        const f = 1 / (1 / dObj + 1 / di);
        const m = -di / dObj;
        return {
          primary: { label: "Focal Length", value: `${formatNumber(f, 4)} cm` },
          details: [
            { label: "Lens type", value: f > 0 ? "Converging (convex)" : "Diverging (concave)" },
            { label: "Magnification", value: `${formatNumber(m, 4)}×` },
            { label: "Power", value: `${formatNumber(100 / f, 4)} diopters` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wavelength-calculator", "frequency-calculator", "scientific-calculator"],
  faq: [{ question: "What is the thin lens equation?", answer: "1/f = 1/do + 1/di, where f is focal length, do is object distance, di is image distance. Magnification m = -di/do. Positive di means real image (other side), negative means virtual (same side)." }],
  formula: "1/f = 1/do + 1/di | m = -di/do",
};
