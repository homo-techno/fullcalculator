import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rectangularPrismCalculator: CalculatorDefinition = {
  slug: "rectangular-prism-calculator",
  title: "Rectangular Prism Volume Calculator",
  description: "Free rectangular prism calculator. Calculate the volume, surface area, and space diagonal of a rectangular prism (cuboid).",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["rectangular prism calculator", "cuboid calculator", "box volume", "rectangular prism volume", "cuboid surface area"],
  variants: [
    {
      id: "fromDimensions",
      name: "From Length, Width & Height",
      fields: [
        { name: "length", label: "Length", type: "number", placeholder: "e.g. 8" },
        { name: "width", label: "Width", type: "number", placeholder: "e.g. 5" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 3" },
      ],
      calculate: (inputs) => {
        const l = inputs.length as number, w = inputs.width as number, h = inputs.height as number;
        if (!l || !w || !h) return null;
        const volume = l * w * h;
        const surfaceArea = 2 * (l * w + l * h + w * h);
        const spaceDiag = Math.sqrt(l * l + w * w + h * h);
        return {
          primary: { label: "Volume", value: formatNumber(volume, 6) },
          details: [
            { label: "Surface area", value: formatNumber(surfaceArea, 6) },
            { label: "Space diagonal", value: formatNumber(spaceDiag, 6) },
            { label: "Base area", value: formatNumber(l * w, 6) },
            { label: "Lateral surface area", value: formatNumber(2 * h * (l + w), 6) },
          ],
        };
      },
    },
    {
      id: "fromVolumeLW",
      name: "From Volume, Length & Width",
      fields: [
        { name: "volume", label: "Volume", type: "number", placeholder: "e.g. 120" },
        { name: "length", label: "Length", type: "number", placeholder: "e.g. 8" },
        { name: "width", label: "Width", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const v = inputs.volume as number, l = inputs.length as number, w = inputs.width as number;
        if (!v || !l || !w) return null;
        const h = v / (l * w);
        const surfaceArea = 2 * (l * w + l * h + w * h);
        const spaceDiag = Math.sqrt(l * l + w * w + h * h);
        return {
          primary: { label: "Height", value: formatNumber(h, 6) },
          details: [
            { label: "Volume", value: formatNumber(v, 6) },
            { label: "Surface area", value: formatNumber(surfaceArea, 6) },
            { label: "Space diagonal", value: formatNumber(spaceDiag, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cube-volume-calculator", "cylinder-volume-calculator", "pyramid-volume-calculator"],
  faq: [
    { question: "How do you calculate the volume of a rectangular prism?", answer: "Volume = length x width x height. For dimensions 8 x 5 x 3, volume = 120 cubic units." },
    { question: "What is a rectangular prism?", answer: "A rectangular prism (also called a cuboid) is a 3D shape with 6 rectangular faces. A cube is a special case where all edges are equal." },
  ],
  formula: "V = l*w*h | SA = 2(lw + lh + wh) | diagonal = sqrt(l^2 + w^2 + h^2)",
};
