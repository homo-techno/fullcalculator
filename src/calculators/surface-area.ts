import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const surfaceAreaCalculator: CalculatorDefinition = {
  slug: "surface-area-calculator",
  title: "Surface Area Calculator",
  description: "Free surface area calculator. Calculate the surface area of cubes, rectangular prisms, spheres, cylinders, and cones.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["surface area calculator", "surface area of cube", "surface area of sphere", "surface area of cylinder", "lateral area"],
  variants: [
    {
      id: "cube",
      name: "Cube",
      fields: [
        { name: "side", label: "Side Length", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const s = inputs.side as number;
        if (!s) return null;
        const sa = 6 * s * s;
        return {
          primary: { label: "Surface Area", value: formatNumber(sa, 6) },
          details: [
            { label: "Volume", value: formatNumber(s * s * s, 6) },
            { label: "Face area", value: formatNumber(s * s, 6) },
            { label: "Formula", value: `6 × ${s}² = ${formatNumber(sa, 6)}` },
          ],
        };
      },
    },
    {
      id: "box",
      name: "Rectangular Prism",
      fields: [
        { name: "l", label: "Length", type: "number", placeholder: "e.g. 5" },
        { name: "w", label: "Width", type: "number", placeholder: "e.g. 3" },
        { name: "h", label: "Height", type: "number", placeholder: "e.g. 4" },
      ],
      calculate: (inputs) => {
        const l = inputs.l as number, w = inputs.w as number, h = inputs.h as number;
        if (!l || !w || !h) return null;
        const sa = 2 * (l * w + l * h + w * h);
        return {
          primary: { label: "Surface Area", value: formatNumber(sa, 6) },
          details: [
            { label: "Volume", value: formatNumber(l * w * h, 6) },
            { label: "Lateral area", value: formatNumber(2 * h * (l + w), 6) },
          ],
        };
      },
    },
    {
      id: "sphere",
      name: "Sphere",
      fields: [
        { name: "r", label: "Radius", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const r = inputs.r as number;
        if (!r) return null;
        const sa = 4 * Math.PI * r * r;
        return {
          primary: { label: "Surface Area", value: formatNumber(sa, 6) },
          details: [
            { label: "Volume", value: formatNumber((4 / 3) * Math.PI * r * r * r, 6) },
            { label: "Diameter", value: formatNumber(2 * r) },
          ],
        };
      },
    },
    {
      id: "cylinder",
      name: "Cylinder",
      fields: [
        { name: "r", label: "Radius", type: "number", placeholder: "e.g. 3" },
        { name: "h", label: "Height", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const r = inputs.r as number, h = inputs.h as number;
        if (!r || !h) return null;
        const lateral = 2 * Math.PI * r * h;
        const sa = lateral + 2 * Math.PI * r * r;
        return {
          primary: { label: "Total Surface Area", value: formatNumber(sa, 6) },
          details: [
            { label: "Lateral area", value: formatNumber(lateral, 6) },
            { label: "Volume", value: formatNumber(Math.PI * r * r * h, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["volume-calculator", "area-of-circle-calculator", "circumference-calculator"],
  faq: [{ question: "What is surface area?", answer: "Surface area is the total area of all faces/surfaces of a 3D object. For a cube: SA = 6s². For a sphere: SA = 4πr². For a cylinder: SA = 2πr² + 2πrh." }],
  formula: "Cube: 6s² | Box: 2(lw+lh+wh) | Sphere: 4πr² | Cylinder: 2πr²+2πrh",
};
