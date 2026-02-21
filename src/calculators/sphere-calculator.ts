import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sphereCalculator: CalculatorDefinition = {
  slug: "sphere-calculator",
  title: "Sphere Calculator",
  description: "Free sphere calculator. Calculate volume, surface area, and diameter of a sphere from radius, diameter, circumference, or volume.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["sphere calculator", "sphere volume", "sphere surface area", "volume of sphere", "sphere formula"],
  variants: [
    {
      id: "fromRadius",
      name: "From Radius",
      fields: [
        { name: "r", label: "Radius", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const r = inputs.r as number;
        if (!r) return null;
        const vol = (4 / 3) * Math.PI * r * r * r;
        const sa = 4 * Math.PI * r * r;
        const circ = 2 * Math.PI * r;
        return {
          primary: { label: "Volume", value: formatNumber(vol, 6) },
          details: [
            { label: "Surface area", value: formatNumber(sa, 6) },
            { label: "Diameter", value: formatNumber(2 * r, 6) },
            { label: "Great circle circumference", value: formatNumber(circ, 6) },
          ],
        };
      },
    },
    {
      id: "fromVolume",
      name: "From Volume",
      fields: [
        { name: "vol", label: "Volume", type: "number", placeholder: "e.g. 523.6" },
      ],
      calculate: (inputs) => {
        const vol = inputs.vol as number;
        if (!vol) return null;
        const r = Math.pow((3 * vol) / (4 * Math.PI), 1 / 3);
        return {
          primary: { label: "Radius", value: formatNumber(r, 6) },
          details: [
            { label: "Diameter", value: formatNumber(2 * r, 6) },
            { label: "Surface area", value: formatNumber(4 * Math.PI * r * r, 6) },
            { label: "Volume", value: formatNumber(vol, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["volume-calculator", "surface-area-calculator", "area-of-circle-calculator"],
  faq: [{ question: "How do you calculate the volume of a sphere?", answer: "Volume = (4/3)πr³. For a sphere with radius 5: V = (4/3) × π × 125 ≈ 523.6. Surface area = 4πr². A sphere has the smallest surface area for a given volume of any shape." }],
  formula: "V = (4/3)πr³ | SA = 4πr²",
};
