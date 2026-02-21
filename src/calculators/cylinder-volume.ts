import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cylinderVolumeCalculator: CalculatorDefinition = {
  slug: "cylinder-volume-calculator",
  title: "Cylinder Volume Calculator",
  description: "Free cylinder volume calculator. Calculate the volume, surface area, and lateral area of a cylinder from radius and height.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["cylinder volume calculator", "cylinder calculator", "volume of cylinder", "cylinder surface area"],
  variants: [
    {
      id: "fromRH",
      name: "From Radius & Height",
      fields: [
        { name: "r", label: "Radius", type: "number", placeholder: "e.g. 5" },
        { name: "h", label: "Height", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const r = inputs.r as number, h = inputs.h as number;
        if (!r || !h) return null;
        const vol = Math.PI * r * r * h;
        const lateral = 2 * Math.PI * r * h;
        const total = lateral + 2 * Math.PI * r * r;
        return {
          primary: { label: "Volume", value: formatNumber(vol, 6) },
          details: [
            { label: "Lateral surface area", value: formatNumber(lateral, 6) },
            { label: "Total surface area", value: formatNumber(total, 6) },
            { label: "Base area", value: formatNumber(Math.PI * r * r, 6) },
            { label: "Diameter", value: formatNumber(2 * r) },
          ],
        };
      },
    },
    {
      id: "fromDH",
      name: "From Diameter & Height",
      fields: [
        { name: "d", label: "Diameter", type: "number", placeholder: "e.g. 10" },
        { name: "h", label: "Height", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const d = inputs.d as number, h = inputs.h as number;
        if (!d || !h) return null;
        const r = d / 2;
        const vol = Math.PI * r * r * h;
        return {
          primary: { label: "Volume", value: formatNumber(vol, 6) },
          details: [
            { label: "Radius", value: formatNumber(r) },
            { label: "Total surface area", value: formatNumber(2 * Math.PI * r * (r + h), 6) },
            { label: "Base area", value: formatNumber(Math.PI * r * r, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["volume-calculator", "cone-volume-calculator", "surface-area-calculator"],
  faq: [{ question: "How do you calculate the volume of a cylinder?", answer: "Volume = πr²h, where r is the radius and h is the height. For example, a cylinder with radius 5 and height 10: V = π × 25 × 10 ≈ 785.4." }],
  formula: "V = πr²h",
};
