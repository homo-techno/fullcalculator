import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const metalWeightCalculator: CalculatorDefinition = {
  slug: "metal-weight-calc",
  title: "Metal Weight Calculator",
  description:
    "Free online metal weight calculator. Estimate the weight of various metals and alloys including aluminum, copper, brass, titanium, and stainless steel.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "metal",
    "weight",
    "aluminum",
    "copper",
    "brass",
    "titanium",
    "stainless",
    "alloy",
    "density",
  ],
  variants: [
    {
      id: "plate-sheet",
      name: "Plate / Sheet",
      description: "Calculate weight of a rectangular metal plate or sheet",
      fields: [
        {
          name: "metal",
          label: "Metal Type",
          type: "select",
          options: [
            { label: "Carbon Steel (0.2836 lb/in\u00B3)", value: "0.2836" },
            { label: "Stainless Steel 304 (0.289 lb/in\u00B3)", value: "0.289" },
            { label: "Aluminum 6061 (0.0975 lb/in\u00B3)", value: "0.0975" },
            { label: "Copper (0.323 lb/in\u00B3)", value: "0.323" },
            { label: "Brass (0.307 lb/in\u00B3)", value: "0.307" },
            { label: "Bronze (0.320 lb/in\u00B3)", value: "0.320" },
            { label: "Titanium (0.163 lb/in\u00B3)", value: "0.163" },
            { label: "Cast Iron (0.260 lb/in\u00B3)", value: "0.260" },
            { label: "Lead (0.410 lb/in\u00B3)", value: "0.410" },
            { label: "Zinc (0.258 lb/in\u00B3)", value: "0.258" },
          ],
          defaultValue: "0.0975",
        },
        {
          name: "length",
          label: "Length",
          type: "number",
          placeholder: "e.g. 48",
          suffix: "in",
        },
        {
          name: "width",
          label: "Width",
          type: "number",
          placeholder: "e.g. 24",
          suffix: "in",
        },
        {
          name: "thickness",
          label: "Thickness",
          type: "number",
          placeholder: "e.g. 0.125",
          suffix: "in",
        },
        {
          name: "quantity",
          label: "Quantity",
          type: "number",
          placeholder: "e.g. 1",
          defaultValue: 1,
        },
      ],
      calculate: (inputs) => {
        const density = parseFloat(inputs.metal as string) || 0.2836;
        const length = parseFloat(inputs.length as string) || 0;
        const width = parseFloat(inputs.width as string) || 0;
        const thickness = parseFloat(inputs.thickness as string) || 0;
        const quantity = parseFloat(inputs.quantity as string) || 1;

        if (length <= 0 || width <= 0 || thickness <= 0) return null;

        const volumeCuIn = length * width * thickness;
        const weightEach = volumeCuIn * density;
        const totalWeight = weightEach * quantity;

        return {
          primary: {
            label: "Total Weight",
            value: formatNumber(totalWeight) + " lbs",
          },
          details: [
            { label: "Weight each", value: formatNumber(weightEach) + " lbs" },
            { label: "Volume", value: formatNumber(volumeCuIn) + " cu in" },
            {
              label: "Density",
              value: formatNumber(density, 4) + " lb/in\u00B3",
            },
            { label: "Quantity", value: formatNumber(quantity) },
            {
              label: "Total (kg)",
              value: formatNumber(totalWeight * 0.4536) + " kg",
            },
          ],
        };
      },
    },
    {
      id: "round-bar",
      name: "Round Bar / Rod",
      description: "Calculate weight of a solid round metal bar",
      fields: [
        {
          name: "metal",
          label: "Metal Type",
          type: "select",
          options: [
            { label: "Carbon Steel (0.2836 lb/in\u00B3)", value: "0.2836" },
            { label: "Stainless Steel 304 (0.289 lb/in\u00B3)", value: "0.289" },
            { label: "Aluminum 6061 (0.0975 lb/in\u00B3)", value: "0.0975" },
            { label: "Copper (0.323 lb/in\u00B3)", value: "0.323" },
            { label: "Brass (0.307 lb/in\u00B3)", value: "0.307" },
            { label: "Bronze (0.320 lb/in\u00B3)", value: "0.320" },
            { label: "Titanium (0.163 lb/in\u00B3)", value: "0.163" },
          ],
          defaultValue: "0.0975",
        },
        {
          name: "diameter",
          label: "Diameter",
          type: "number",
          placeholder: "e.g. 1",
          suffix: "in",
        },
        {
          name: "length",
          label: "Length",
          type: "number",
          placeholder: "e.g. 72",
          suffix: "in",
        },
        {
          name: "quantity",
          label: "Quantity",
          type: "number",
          placeholder: "e.g. 1",
          defaultValue: 1,
        },
      ],
      calculate: (inputs) => {
        const density = parseFloat(inputs.metal as string) || 0.0975;
        const diameter = parseFloat(inputs.diameter as string) || 0;
        const length = parseFloat(inputs.length as string) || 0;
        const quantity = parseFloat(inputs.quantity as string) || 1;

        if (diameter <= 0 || length <= 0) return null;

        const radius = diameter / 2;
        const volumeCuIn = Math.PI * radius * radius * length;
        const weightEach = volumeCuIn * density;
        const totalWeight = weightEach * quantity;

        return {
          primary: {
            label: "Total Weight",
            value: formatNumber(totalWeight) + " lbs",
          },
          details: [
            { label: "Weight each", value: formatNumber(weightEach) + " lbs" },
            {
              label: "Weight per foot",
              value: formatNumber((weightEach / length) * 12) + " lb/ft",
            },
            { label: "Quantity", value: formatNumber(quantity) },
            {
              label: "Total (kg)",
              value: formatNumber(totalWeight * 0.4536) + " kg",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["steel-weight-calc", "lumber-weight-calc", "rebar-calculator"],
  faq: [
    {
      question: "How do I calculate metal weight?",
      answer:
        "Calculate the volume of the shape in cubic inches, then multiply by the metal's density (in lbs/cu in). Common densities: Steel = 0.2836, Aluminum = 0.0975, Copper = 0.323, Brass = 0.307.",
    },
    {
      question: "Which metal is the lightest?",
      answer:
        "Among commonly used metals, aluminum is the lightest at about 0.0975 lbs/cu in, roughly one-third the weight of steel. Titanium is about 0.163 lbs/cu in, roughly 57% the weight of steel.",
    },
  ],
  formula:
    "Weight = Volume × Density; Plate: V = L×W×T; Round Bar: V = pi×r^2×L",
};
