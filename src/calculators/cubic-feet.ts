import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cubicFeetCalculator: CalculatorDefinition = {
  slug: "cubic-feet-calculator",
  title: "Cubic Feet Calculator",
  description:
    "Free cubic feet calculator. Calculate volume in cubic feet from length, width, and height. Also converts to cubic yards and liters.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cubic feet",
    "volume calculator",
    "cubic feet calculator",
    "cu ft",
    "cubic footage",
    "box volume",
  ],
  variants: [
    {
      id: "dimensions",
      name: "Calculate Cubic Feet from Dimensions",
      fields: [
        {
          name: "length",
          label: "Length (feet)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "width",
          label: "Width (feet)",
          type: "number",
          placeholder: "e.g. 8",
        },
        {
          name: "height",
          label: "Height (feet)",
          type: "number",
          placeholder: "e.g. 6",
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const height = inputs.height as number;
        if (!length || !width || !height) return null;
        const cubicFeet = length * width * height;
        const cubicYards = cubicFeet / 27;
        const liters = cubicFeet * 28.3168;
        const cubicMeters = cubicFeet * 0.0283168;
        const gallons = cubicFeet * 7.48052;
        return {
          primary: {
            label: "Volume",
            value: `${formatNumber(cubicFeet, 4)} cubic feet`,
          },
          details: [
            { label: "Cubic Feet", value: formatNumber(cubicFeet, 4) },
            { label: "Cubic Yards", value: formatNumber(cubicYards, 4) },
            { label: "Liters", value: formatNumber(liters, 2) },
            { label: "Cubic Meters", value: formatNumber(cubicMeters, 4) },
            { label: "Gallons (US)", value: formatNumber(gallons, 2) },
          ],
        };
      },
    },
    {
      id: "convert",
      name: "Convert Cubic Feet",
      fields: [
        {
          name: "cubicFeet",
          label: "Cubic Feet",
          type: "number",
          placeholder: "e.g. 100",
        },
      ],
      calculate: (inputs) => {
        const cubicFeet = inputs.cubicFeet as number;
        if (cubicFeet === undefined || cubicFeet === null) return null;
        const cubicYards = cubicFeet / 27;
        const liters = cubicFeet * 28.3168;
        const cubicMeters = cubicFeet * 0.0283168;
        const gallons = cubicFeet * 7.48052;
        const cubicInches = cubicFeet * 1728;
        return {
          primary: {
            label: `${formatNumber(cubicFeet, 4)} cu ft`,
            value: `${formatNumber(cubicYards, 4)} cubic yards`,
          },
          details: [
            { label: "Cubic Yards", value: formatNumber(cubicYards, 4) },
            { label: "Liters", value: formatNumber(liters, 2) },
            { label: "Cubic Meters", value: formatNumber(cubicMeters, 4) },
            { label: "Gallons (US)", value: formatNumber(gallons, 2) },
            { label: "Cubic Inches", value: formatNumber(cubicInches, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cubic-yards-calculator", "volume-calculator", "square-footage-calculator"],
  faq: [
    {
      question: "How do I calculate cubic feet?",
      answer:
        "Multiply length × width × height (all in feet). For example, a space that is 10 ft × 8 ft × 6 ft = 480 cubic feet.",
    },
    {
      question: "How many cubic feet are in a cubic yard?",
      answer:
        "There are 27 cubic feet in 1 cubic yard (3 × 3 × 3 = 27).",
    },
  ],
  formula: "Cubic Feet = Length (ft) × Width (ft) × Height (ft)",
};
