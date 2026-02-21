import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const coneVolumeCalculator: CalculatorDefinition = {
  slug: "cone-volume-calculator",
  title: "Cone Volume Calculator",
  description: "Free cone volume calculator. Calculate the volume, surface area, and slant height of a cone from radius and height.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["cone volume calculator", "cone calculator", "volume of cone", "cone surface area", "slant height"],
  variants: [
    {
      id: "fromRH",
      name: "From Radius & Height",
      fields: [
        { name: "r", label: "Radius", type: "number", placeholder: "e.g. 4" },
        { name: "h", label: "Height", type: "number", placeholder: "e.g. 9" },
      ],
      calculate: (inputs) => {
        const r = inputs.r as number, h = inputs.h as number;
        if (!r || !h) return null;
        const vol = (1 / 3) * Math.PI * r * r * h;
        const slant = Math.sqrt(r * r + h * h);
        const lateral = Math.PI * r * slant;
        const total = lateral + Math.PI * r * r;
        return {
          primary: { label: "Volume", value: formatNumber(vol, 6) },
          details: [
            { label: "Slant height", value: formatNumber(slant, 6) },
            { label: "Lateral surface area", value: formatNumber(lateral, 6) },
            { label: "Total surface area", value: formatNumber(total, 6) },
            { label: "Base area", value: formatNumber(Math.PI * r * r, 6) },
          ],
        };
      },
    },
    {
      id: "fromRS",
      name: "From Radius & Slant Height",
      fields: [
        { name: "r", label: "Radius", type: "number", placeholder: "e.g. 4" },
        { name: "s", label: "Slant Height", type: "number", placeholder: "e.g. 9.85" },
      ],
      calculate: (inputs) => {
        const r = inputs.r as number, s = inputs.s as number;
        if (!r || !s || s <= r) return null;
        const h = Math.sqrt(s * s - r * r);
        const vol = (1 / 3) * Math.PI * r * r * h;
        return {
          primary: { label: "Volume", value: formatNumber(vol, 6) },
          details: [
            { label: "Height", value: formatNumber(h, 6) },
            { label: "Lateral surface area", value: formatNumber(Math.PI * r * s, 6) },
            { label: "Total surface area", value: formatNumber(Math.PI * r * (r + s), 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cylinder-volume-calculator", "volume-calculator", "surface-area-calculator"],
  faq: [{ question: "How do you calculate the volume of a cone?", answer: "Volume = ⅓πr²h. A cone is exactly one-third the volume of a cylinder with the same base and height. For r=4, h=9: V = ⅓ × π × 16 × 9 ≈ 150.8." }],
  formula: "V = ⅓πr²h | Slant = √(r²+h²)",
};
