import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const squareFootageCalculator: CalculatorDefinition = {
  slug: "square-footage-calculator",
  title: "Square Footage Calculator",
  description:
    "Free square footage calculator. Calculate area in square feet for rooms, homes, flooring, and landscaping. Supports rectangular, circular, and triangular shapes.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["square footage calculator", "sq ft calculator", "area calculator", "room size calculator", "flooring calculator"],
  variants: [
    {
      id: "rectangle",
      name: "Rectangle / Square",
      description: "Calculate area of a rectangular space",
      fields: [
        { name: "length", label: "Length", type: "number", placeholder: "e.g. 12", suffix: "ft" },
        { name: "width", label: "Width", type: "number", placeholder: "e.g. 10", suffix: "ft" },
      ],
      calculate: (inputs) => {
        const l = inputs.length as number;
        const w = inputs.width as number;
        if (!l || !w) return null;
        const sqft = l * w;
        return {
          primary: { label: "Area", value: formatNumber(sqft), suffix: "sq ft" },
          details: [
            { label: "In square meters", value: `${formatNumber(sqft * 0.0929, 2)} m²` },
            { label: "In acres", value: formatNumber(sqft / 43560, 4) },
          ],
        };
      },
    },
    {
      id: "circle",
      name: "Circle",
      description: "Calculate area of a circular space",
      fields: [
        { name: "radius", label: "Radius", type: "number", placeholder: "e.g. 5", suffix: "ft" },
      ],
      calculate: (inputs) => {
        const r = inputs.radius as number;
        if (!r) return null;
        const sqft = Math.PI * r * r;
        return {
          primary: { label: "Area", value: formatNumber(sqft), suffix: "sq ft" },
          details: [
            { label: "Diameter", value: `${formatNumber(r * 2)} ft` },
            { label: "Circumference", value: `${formatNumber(2 * Math.PI * r)} ft` },
          ],
        };
      },
    },
    {
      id: "triangle",
      name: "Triangle",
      description: "Calculate area of a triangular space",
      fields: [
        { name: "base", label: "Base", type: "number", placeholder: "e.g. 8", suffix: "ft" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 6", suffix: "ft" },
      ],
      calculate: (inputs) => {
        const b = inputs.base as number;
        const h = inputs.height as number;
        if (!b || !h) return null;
        const sqft = (b * h) / 2;
        return {
          primary: { label: "Area", value: formatNumber(sqft), suffix: "sq ft" },
          details: [{ label: "In square meters", value: `${formatNumber(sqft * 0.0929, 2)} m²` }],
        };
      },
    },
    {
      id: "flooring",
      name: "Flooring Cost",
      description: "Estimate flooring cost for a room",
      fields: [
        { name: "length", label: "Room Length", type: "number", placeholder: "e.g. 15", suffix: "ft" },
        { name: "width", label: "Room Width", type: "number", placeholder: "e.g. 12", suffix: "ft" },
        { name: "pricePerSqFt", label: "Price per sq ft", type: "number", placeholder: "e.g. 3.50", prefix: "$", step: 0.01 },
        { name: "waste", label: "Waste Factor", type: "number", placeholder: "e.g. 10", suffix: "%", defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const l = inputs.length as number;
        const w = inputs.width as number;
        const price = inputs.pricePerSqFt as number;
        const waste = (inputs.waste as number) || 10;
        if (!l || !w || !price) return null;
        const sqft = l * w;
        const withWaste = sqft * (1 + waste / 100);
        const cost = withWaste * price;
        return {
          primary: { label: "Total Cost", value: `$${formatNumber(cost)}` },
          details: [
            { label: "Room area", value: `${formatNumber(sqft)} sq ft` },
            { label: "Material needed (with waste)", value: `${formatNumber(withWaste)} sq ft` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "percentage-calculator"],
  faq: [
    { question: "How do I calculate square footage?", answer: "For a rectangle: multiply length by width. For example, a 12 ft x 10 ft room = 120 sq ft. For a circle: multiply pi (3.14159) by radius squared." },
    { question: "How many square feet in an acre?", answer: "One acre equals 43,560 square feet. A football field (including end zones) is about 57,600 sq ft or 1.32 acres." },
  ],
  formula: "Rectangle: A = L x W | Circle: A = π x r² | Triangle: A = (b x h) / 2",
};
