import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const frustumVolumeCalculator: CalculatorDefinition = {
  slug: "frustum-volume-calculator",
  title: "Frustum Volume Calculator",
  description: "Free frustum volume calculator. Calculate the volume, lateral surface area, and slant height of a frustum (truncated cone or pyramid).",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["frustum volume calculator", "frustum calculator", "truncated cone", "frustum surface area", "frustum of pyramid"],
  variants: [
    {
      id: "coneFrustum",
      name: "Cone Frustum (Circular)",
      fields: [
        { name: "R", label: "Bottom Radius (R)", type: "number", placeholder: "e.g. 6" },
        { name: "r", label: "Top Radius (r)", type: "number", placeholder: "e.g. 3" },
        { name: "h", label: "Height", type: "number", placeholder: "e.g. 8" },
      ],
      calculate: (inputs) => {
        const R = inputs.R as number, r = inputs.r as number, h = inputs.h as number;
        if (!R || !r || !h || r >= R) return null;
        const volume = (Math.PI * h / 3) * (R * R + R * r + r * r);
        const slant = Math.sqrt(h * h + (R - r) * (R - r));
        const lateralSA = Math.PI * (R + r) * slant;
        const totalSA = lateralSA + Math.PI * R * R + Math.PI * r * r;
        return {
          primary: { label: "Volume", value: formatNumber(volume, 6) },
          details: [
            { label: "Slant height", value: formatNumber(slant, 6) },
            { label: "Lateral surface area", value: formatNumber(lateralSA, 6) },
            { label: "Total surface area", value: formatNumber(totalSA, 6) },
            { label: "Bottom base area", value: formatNumber(Math.PI * R * R, 6) },
            { label: "Top base area", value: formatNumber(Math.PI * r * r, 6) },
          ],
        };
      },
    },
    {
      id: "pyramidFrustum",
      name: "Square Pyramid Frustum",
      fields: [
        { name: "B", label: "Bottom Side Length", type: "number", placeholder: "e.g. 10" },
        { name: "b", label: "Top Side Length", type: "number", placeholder: "e.g. 5" },
        { name: "h", label: "Height", type: "number", placeholder: "e.g. 8" },
      ],
      calculate: (inputs) => {
        const B = inputs.B as number, b = inputs.b as number, h = inputs.h as number;
        if (!B || !b || !h || b >= B) return null;
        const areaB = B * B, areab = b * b;
        const volume = (h / 3) * (areaB + areab + Math.sqrt(areaB * areab));
        const slant = Math.sqrt(h * h + ((B - b) / 2) * ((B - b) / 2));
        const lateralSA = 2 * (B + b) * slant;
        return {
          primary: { label: "Volume", value: formatNumber(volume, 6) },
          details: [
            { label: "Slant height", value: formatNumber(slant, 6) },
            { label: "Lateral surface area", value: formatNumber(lateralSA, 6) },
            { label: "Total surface area", value: formatNumber(lateralSA + areaB + areab, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cone-volume-calculator", "pyramid-volume-calculator", "cylinder-volume-calculator"],
  faq: [
    { question: "What is a frustum?", answer: "A frustum is the portion of a solid (usually a cone or pyramid) that lies between two parallel planes cutting it. Think of it as a cone or pyramid with the top cut off." },
    { question: "How do you calculate the volume of a frustum?", answer: "For a cone frustum: V = (pi*h/3)*(R^2 + R*r + r^2). For a pyramid frustum: V = (h/3)*(A1 + A2 + sqrt(A1*A2))." },
  ],
  formula: "V = (pi*h/3)*(R^2 + Rr + r^2) | Slant = sqrt(h^2 + (R-r)^2)",
};
