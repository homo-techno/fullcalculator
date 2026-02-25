import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pyramidVolumeCalculator: CalculatorDefinition = {
  slug: "pyramid-volume-calculator",
  title: "Pyramid Volume Calculator",
  description: "Free pyramid volume calculator. Calculate the volume, surface area, and slant height of a pyramid with various base shapes.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["pyramid volume calculator", "pyramid calculator", "volume of pyramid", "pyramid surface area", "square pyramid"],
  variants: [
    {
      id: "squareBase",
      name: "Square Base Pyramid",
      fields: [
        { name: "base", label: "Base Side Length", type: "number", placeholder: "e.g. 6" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const b = inputs.base as number, h = inputs.height as number;
        if (!b || !h) return null;
        const baseArea = b * b;
        const volume = (1 / 3) * baseArea * h;
        const slantHeight = Math.sqrt(h * h + (b / 2) * (b / 2));
        const lateralArea = 2 * b * slantHeight;
        const totalArea = baseArea + lateralArea;
        return {
          primary: { label: "Volume", value: formatNumber(volume, 6) },
          details: [
            { label: "Base area", value: formatNumber(baseArea, 6) },
            { label: "Slant height", value: formatNumber(slantHeight, 6) },
            { label: "Lateral surface area", value: formatNumber(lateralArea, 6) },
            { label: "Total surface area", value: formatNumber(totalArea, 6) },
          ],
        };
      },
    },
    {
      id: "rectangularBase",
      name: "Rectangular Base Pyramid",
      fields: [
        { name: "length", label: "Base Length", type: "number", placeholder: "e.g. 8" },
        { name: "width", label: "Base Width", type: "number", placeholder: "e.g. 6" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const l = inputs.length as number, w = inputs.width as number, h = inputs.height as number;
        if (!l || !w || !h) return null;
        const baseArea = l * w;
        const volume = (1 / 3) * baseArea * h;
        const slantL = Math.sqrt(h * h + (w / 2) * (w / 2));
        const slantW = Math.sqrt(h * h + (l / 2) * (l / 2));
        const lateralArea = l * slantL + w * slantW;
        return {
          primary: { label: "Volume", value: formatNumber(volume, 6) },
          details: [
            { label: "Base area", value: formatNumber(baseArea, 6) },
            { label: "Slant height (along length)", value: formatNumber(slantL, 6) },
            { label: "Slant height (along width)", value: formatNumber(slantW, 6) },
            { label: "Lateral surface area", value: formatNumber(lateralArea, 6) },
            { label: "Total surface area", value: formatNumber(baseArea + lateralArea, 6) },
          ],
        };
      },
    },
    {
      id: "triangularBase",
      name: "Triangular Base Pyramid (Tetrahedron)",
      fields: [
        { name: "base", label: "Base Triangle Side", type: "number", placeholder: "e.g. 6" },
        { name: "height", label: "Pyramid Height", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const b = inputs.base as number, h = inputs.height as number;
        if (!b || !h) return null;
        const baseArea = (Math.sqrt(3) / 4) * b * b;
        const volume = (1 / 3) * baseArea * h;
        return {
          primary: { label: "Volume", value: formatNumber(volume, 6) },
          details: [
            { label: "Base area (equilateral)", value: formatNumber(baseArea, 6) },
            { label: "Height", value: formatNumber(h, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cone-volume-calculator", "frustum-volume-calculator", "rectangular-prism-calculator"],
  faq: [
    { question: "How do you calculate the volume of a pyramid?", answer: "Volume = (1/3) * base area * height. This works for any pyramid regardless of the base shape." },
    { question: "What is the slant height of a pyramid?", answer: "The slant height is the distance from the apex to the midpoint of a base edge, measured along a lateral face." },
  ],
  formula: "V = (1/3)*B*h | Slant height = sqrt(h^2 + (b/2)^2)",
};
