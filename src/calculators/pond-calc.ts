import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pondCalculator: CalculatorDefinition = {
  slug: "pond-calc",
  title: "Pond Volume & Liner Calculator",
  description:
    "Free online pond calculator. Estimate pond volume in gallons, liner size needed, and pump flow rate for your garden or koi pond.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "pond",
    "volume",
    "liner",
    "gallons",
    "koi",
    "garden",
    "water feature",
    "pump",
  ],
  variants: [
    {
      id: "rectangular-pond",
      name: "Rectangular Pond",
      description: "Calculate volume and liner for a rectangular pond",
      fields: [
        {
          name: "length",
          label: "Pond Length",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "ft",
        },
        {
          name: "width",
          label: "Pond Width",
          type: "number",
          placeholder: "e.g. 6",
          suffix: "ft",
        },
        {
          name: "depth",
          label: "Pond Depth",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "ft",
        },
      ],
      calculate: (inputs) => {
        const length = parseFloat(inputs.length as string) || 0;
        const width = parseFloat(inputs.width as string) || 0;
        const depth = parseFloat(inputs.depth as string) || 0;

        if (length <= 0 || width <= 0 || depth <= 0) return null;

        const cubicFeet = length * width * depth;
        const gallons = cubicFeet * 7.481;
        // Liner size: length + 2*depth + 2 ft overlap on each side
        const linerLength = length + 2 * depth + 2;
        const linerWidth = width + 2 * depth + 2;
        const linerAreaSqFt = linerLength * linerWidth;
        // Recommended pump: circulate total volume once per hour
        const pumpGPH = Math.ceil(gallons);

        return {
          primary: {
            label: "Pond Volume",
            value: formatNumber(gallons) + " gallons",
          },
          details: [
            { label: "Volume (cubic feet)", value: formatNumber(cubicFeet) },
            { label: "Volume (gallons)", value: formatNumber(gallons) },
            {
              label: "Liner size needed",
              value: formatNumber(linerLength) + " x " + formatNumber(linerWidth) + " ft",
            },
            {
              label: "Liner area",
              value: formatNumber(linerAreaSqFt) + " sq ft",
            },
            {
              label: "Recommended pump (GPH)",
              value: formatNumber(pumpGPH),
            },
          ],
        };
      },
    },
    {
      id: "circular-pond",
      name: "Circular Pond",
      description: "Calculate volume and liner for a circular pond",
      fields: [
        {
          name: "diameter",
          label: "Pond Diameter",
          type: "number",
          placeholder: "e.g. 8",
          suffix: "ft",
        },
        {
          name: "depth",
          label: "Pond Depth",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "ft",
        },
      ],
      calculate: (inputs) => {
        const diameter = parseFloat(inputs.diameter as string) || 0;
        const depth = parseFloat(inputs.depth as string) || 0;

        if (diameter <= 0 || depth <= 0) return null;

        const radius = diameter / 2;
        const cubicFeet = Math.PI * radius * radius * depth;
        const gallons = cubicFeet * 7.481;
        // Liner: diameter + 2*depth + 2 ft overlap
        const linerDiameter = diameter + 2 * depth + 2;
        const linerAreaSqFt = Math.PI * (linerDiameter / 2) * (linerDiameter / 2);
        const pumpGPH = Math.ceil(gallons);

        return {
          primary: {
            label: "Pond Volume",
            value: formatNumber(gallons) + " gallons",
          },
          details: [
            { label: "Volume (cubic feet)", value: formatNumber(cubicFeet) },
            { label: "Volume (gallons)", value: formatNumber(gallons) },
            {
              label: "Liner diameter needed",
              value: formatNumber(linerDiameter) + " ft",
            },
            {
              label: "Liner area",
              value: formatNumber(linerAreaSqFt) + " sq ft",
            },
            {
              label: "Recommended pump (GPH)",
              value: formatNumber(pumpGPH),
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pool-volume-calc", "topsoil-calculator"],
  faq: [
    {
      question: "How do I calculate pond liner size?",
      answer:
        "Add twice the depth plus 2 feet of overlap to both the length and width of the pond. For example, a 10x6 pond that is 3 feet deep needs a liner that is (10+6+2) x (6+6+2) = 18 x 14 feet.",
    },
    {
      question: "How many gallons is my pond?",
      answer:
        "For a rectangular pond: Length x Width x Depth (in feet) x 7.481 = gallons. For a circular pond: pi x radius^2 x Depth x 7.481 = gallons.",
    },
  ],
  formula:
    "Gallons = Length × Width × Depth × 7.481; Liner = (L + 2D + 2) × (W + 2D + 2)",
};
