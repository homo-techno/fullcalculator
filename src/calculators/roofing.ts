import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const roofingCalculator: CalculatorDefinition = {
  slug: "roofing-calculator",
  title: "Roofing Calculator",
  description:
    "Free roofing calculator. Estimate roof area with pitch, squares of shingles, and bundles needed.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["roofing", "shingles", "roof area", "pitch", "squares", "bundles"],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "length",
          label: "Roof Length (feet)",
          type: "number",
          placeholder: "e.g. 40",
        },
        {
          name: "width",
          label: "Roof Width (feet)",
          type: "number",
          placeholder: "e.g. 25",
        },
        {
          name: "pitch",
          label: "Roof Pitch",
          type: "select",
          options: [
            { label: "4/12", value: "4" },
            { label: "6/12", value: "6" },
            { label: "8/12", value: "8" },
            { label: "10/12", value: "10" },
            { label: "12/12", value: "12" },
          ],
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const pitch = inputs.pitch as string;
        if (!length || !width || !pitch) return null;

        const pitchMultipliers: Record<string, number> = {
          "4": 1.054,
          "6": 1.118,
          "8": 1.202,
          "10": 1.302,
          "12": 1.414,
        };

        const multiplier = pitchMultipliers[pitch] || 1.0;
        const flatArea = length * width;
        const actualArea = flatArea * multiplier;
        const squares = actualArea / 100;
        const bundles = Math.ceil(squares * 3);

        return {
          primary: {
            label: "Roof Area (adjusted for pitch)",
            value: formatNumber(actualArea, 1) + " sq ft",
          },
          details: [
            { label: "Flat Area", value: formatNumber(flatArea, 1) + " sq ft" },
            { label: "Pitch Multiplier", value: formatNumber(multiplier, 3) },
            { label: "Squares Needed", value: formatNumber(squares, 2) },
            { label: "Bundles (3 per square)", value: String(bundles) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["square-footage-calculator", "gutter-calculator"],
  faq: [
    {
      question: "What is a roofing square?",
      answer:
        "One roofing square equals 100 square feet of roof area. Shingles are sold in bundles, with 3 bundles covering 1 square.",
    },
    {
      question: "Why does roof pitch matter?",
      answer:
        "A steeper pitch increases the actual surface area compared to the flat footprint, requiring more material.",
    },
  ],
  formula:
    "Roof Area = Length × Width × Pitch Multiplier. Squares = Area ÷ 100. Bundles = Squares × 3.",
};
