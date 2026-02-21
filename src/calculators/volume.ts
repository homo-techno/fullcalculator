import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const volumeCalculator: CalculatorDefinition = {
  slug: "volume-calculator",
  title: "Volume Calculator",
  description: "Free volume calculator. Calculate volume of a box, cylinder, sphere, and cone. Convert between gallons, liters, and cubic feet.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["volume calculator", "cubic feet calculator", "tank volume calculator", "cylinder volume", "sphere volume"],
  variants: [
    {
      id: "box",
      name: "Box / Rectangular",
      fields: [
        { name: "length", label: "Length", type: "number", placeholder: "e.g. 10" },
        { name: "width", label: "Width", type: "number", placeholder: "e.g. 5" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 3" },
        { name: "unit", label: "Unit", type: "select", options: [{ label: "feet", value: "ft" }, { label: "inches", value: "in" }, { label: "cm", value: "cm" }, { label: "meters", value: "m" }], defaultValue: "ft" },
      ],
      calculate: (inputs) => {
        const l = inputs.length as number; const w = inputs.width as number; const h = inputs.height as number;
        if (!l || !w || !h) return null;
        const vol = l * w * h;
        const unit = inputs.unit as string;
        const toCubicMeters: Record<string, number> = { ft: 0.0283168, in: 0.0000163871, cm: 0.000001, m: 1 };
        const cubicM = vol * (toCubicMeters[unit] || 1);
        const liters = cubicM * 1000;
        const gallons = liters * 0.264172;
        return {
          primary: { label: "Volume", value: formatNumber(vol, 2), suffix: `${unit}³` },
          details: [{ label: "Liters", value: formatNumber(liters, 1) }, { label: "US Gallons", value: formatNumber(gallons, 1) }],
        };
      },
    },
    {
      id: "cylinder",
      name: "Cylinder",
      fields: [
        { name: "radius", label: "Radius", type: "number", placeholder: "e.g. 3" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 10" },
        { name: "unit", label: "Unit", type: "select", options: [{ label: "feet", value: "ft" }, { label: "inches", value: "in" }, { label: "cm", value: "cm" }, { label: "meters", value: "m" }], defaultValue: "ft" },
      ],
      calculate: (inputs) => {
        const r = inputs.radius as number; const h = inputs.height as number;
        if (!r || !h) return null;
        const vol = Math.PI * r * r * h;
        const unit = inputs.unit as string;
        const toCubicMeters: Record<string, number> = { ft: 0.0283168, in: 0.0000163871, cm: 0.000001, m: 1 };
        const liters = vol * (toCubicMeters[unit] || 1) * 1000;
        return {
          primary: { label: "Volume", value: formatNumber(vol, 2), suffix: `${unit}³` },
          details: [{ label: "Liters", value: formatNumber(liters, 1) }, { label: "US Gallons", value: formatNumber(liters * 0.264172, 1) }],
        };
      },
    },
    {
      id: "sphere",
      name: "Sphere",
      fields: [
        { name: "radius", label: "Radius", type: "number", placeholder: "e.g. 5" },
        { name: "unit", label: "Unit", type: "select", options: [{ label: "feet", value: "ft" }, { label: "inches", value: "in" }, { label: "cm", value: "cm" }, { label: "meters", value: "m" }], defaultValue: "ft" },
      ],
      calculate: (inputs) => {
        const r = inputs.radius as number;
        if (!r) return null;
        const vol = (4 / 3) * Math.PI * r * r * r;
        const unit = inputs.unit as string;
        const toCubicMeters: Record<string, number> = { ft: 0.0283168, in: 0.0000163871, cm: 0.000001, m: 1 };
        const liters = vol * (toCubicMeters[unit] || 1) * 1000;
        return {
          primary: { label: "Volume", value: formatNumber(vol, 2), suffix: `${unit}³` },
          details: [{ label: "Liters", value: formatNumber(liters, 1) }],
        };
      },
    },
  ],
  relatedSlugs: ["square-footage-calculator", "unit-converter"],
  faq: [
    { question: "How do I calculate volume of a box?", answer: "Volume = Length x Width x Height. All measurements must be in the same unit." },
    { question: "How do I calculate volume of a cylinder?", answer: "Volume = π x radius² x height. For example, a cylinder with radius 3 ft and height 10 ft: 3.14159 x 9 x 10 = 282.74 cubic feet." },
  ],
  formula: "Box: V = L x W x H | Cylinder: V = πr²h | Sphere: V = (4/3)πr³",
};
