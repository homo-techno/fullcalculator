import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const steelWeightCalculator: CalculatorDefinition = {
  slug: "steel-weight-calc",
  title: "Steel Weight Calculator",
  description:
    "Free online steel weight calculator. Estimate the weight of steel plates, round bars, tubes, and structural shapes.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "steel",
    "weight",
    "plate",
    "bar",
    "tube",
    "pipe",
    "structural",
    "metal",
  ],
  variants: [
    {
      id: "steel-plate",
      name: "Steel Plate / Sheet",
      description: "Calculate weight of a rectangular steel plate",
      fields: [
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
          placeholder: "e.g. 0.25",
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
        const length = parseFloat(inputs.length as string) || 0;
        const width = parseFloat(inputs.width as string) || 0;
        const thickness = parseFloat(inputs.thickness as string) || 0;
        const quantity = parseFloat(inputs.quantity as string) || 1;

        if (length <= 0 || width <= 0 || thickness <= 0) return null;

        // Steel density: 0.2836 lbs per cubic inch
        const density = 0.2836;
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
            {
              label: "Volume each",
              value: formatNumber(volumeCuIn) + " cu in",
            },
            { label: "Quantity", value: formatNumber(quantity) },
            {
              label: "Total weight (kg)",
              value: formatNumber(totalWeight * 0.4536) + " kg",
            },
          ],
        };
      },
    },
    {
      id: "steel-round-bar",
      name: "Steel Round Bar",
      description: "Calculate weight of a solid round steel bar",
      fields: [
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
        const diameter = parseFloat(inputs.diameter as string) || 0;
        const length = parseFloat(inputs.length as string) || 0;
        const quantity = parseFloat(inputs.quantity as string) || 1;

        if (diameter <= 0 || length <= 0) return null;

        const density = 0.2836;
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
              label: "Total weight (kg)",
              value: formatNumber(totalWeight * 0.4536) + " kg",
            },
          ],
        };
      },
    },
    {
      id: "steel-tube",
      name: "Steel Tube / Pipe",
      description: "Calculate weight of a hollow steel tube or pipe",
      fields: [
        {
          name: "outerDiameter",
          label: "Outer Diameter",
          type: "number",
          placeholder: "e.g. 2",
          suffix: "in",
        },
        {
          name: "wallThickness",
          label: "Wall Thickness",
          type: "number",
          placeholder: "e.g. 0.125",
          suffix: "in",
        },
        {
          name: "length",
          label: "Length",
          type: "number",
          placeholder: "e.g. 120",
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
        const outerDiameter = parseFloat(inputs.outerDiameter as string) || 0;
        const wallThickness = parseFloat(inputs.wallThickness as string) || 0;
        const length = parseFloat(inputs.length as string) || 0;
        const quantity = parseFloat(inputs.quantity as string) || 1;

        if (outerDiameter <= 0 || wallThickness <= 0 || length <= 0) return null;

        const density = 0.2836;
        const outerRadius = outerDiameter / 2;
        const innerRadius = outerRadius - wallThickness;
        if (innerRadius <= 0) return null;

        const volumeCuIn =
          Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius) * length;
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
            {
              label: "Inner diameter",
              value: formatNumber(innerRadius * 2) + " in",
            },
            { label: "Quantity", value: formatNumber(quantity) },
            {
              label: "Total weight (kg)",
              value: formatNumber(totalWeight * 0.4536) + " kg",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["metal-weight-calc", "rebar-calculator", "lumber-weight-calc"],
  faq: [
    {
      question: "How do I calculate steel weight?",
      answer:
        "Calculate the volume in cubic inches, then multiply by the steel density of 0.2836 lbs/cu in (or 490 lbs/cu ft). For plates: L x W x T x 0.2836. For round bars: pi x r^2 x L x 0.2836.",
    },
    {
      question: "What is the density of steel?",
      answer:
        "Carbon steel has a density of approximately 0.2836 lbs per cubic inch (490 lbs per cubic foot, or 7,850 kg per cubic meter). Stainless steel is slightly higher at about 0.289 lbs per cubic inch.",
    },
  ],
  formula:
    "Weight = Volume × 0.2836 lb/in^3; Plate: V = L×W×T; Round: V = pi×r^2×L; Tube: V = pi×(R^2-r^2)×L",
};
