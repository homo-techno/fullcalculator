import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cubicYardsCalculator: CalculatorDefinition = {
  slug: "cubic-yards-calculator",
  title: "Cubic Yards Calculator",
  description:
    "Free cubic yards calculator. Calculate volume in cubic yards from dimensions in feet. Also converts cubic feet to cubic yards.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cubic yards",
    "cubic yard calculator",
    "cu yd",
    "yard calculator",
    "volume calculator",
    "mulch calculator",
    "gravel calculator",
  ],
  variants: [
    {
      id: "dimensions",
      name: "Calculate Cubic Yards from Dimensions",
      fields: [
        {
          name: "length",
          label: "Length (feet)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "width",
          label: "Width (feet)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "height",
          label: "Height / Depth (feet)",
          type: "number",
          placeholder: "e.g. 0.5",
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const height = inputs.height as number;
        if (!length || !width || !height) return null;
        const cubicFeet = length * width * height;
        const cubicYards = cubicFeet / 27;
        const cubicMeters = cubicFeet * 0.0283168;
        const liters = cubicFeet * 28.3168;
        const tons = cubicYards * 1.4; // approximate for most materials
        return {
          primary: {
            label: "Volume",
            value: `${formatNumber(cubicYards, 4)} cubic yards`,
          },
          details: [
            { label: "Cubic Yards", value: formatNumber(cubicYards, 4) },
            { label: "Cubic Feet", value: formatNumber(cubicFeet, 4) },
            { label: "Cubic Meters", value: formatNumber(cubicMeters, 4) },
            { label: "Liters", value: formatNumber(liters, 2) },
            { label: "Approx. Tons (avg material)", value: formatNumber(tons, 2) },
          ],
        };
      },
    },
    {
      id: "cuft-to-cuyd",
      name: "Cubic Feet to Cubic Yards",
      fields: [
        {
          name: "cubicFeet",
          label: "Cubic Feet",
          type: "number",
          placeholder: "e.g. 54",
        },
      ],
      calculate: (inputs) => {
        const cubicFeet = inputs.cubicFeet as number;
        if (cubicFeet === undefined || cubicFeet === null) return null;
        const cubicYards = cubicFeet / 27;
        const cubicMeters = cubicFeet * 0.0283168;
        const liters = cubicFeet * 28.3168;
        return {
          primary: {
            label: `${formatNumber(cubicFeet, 4)} cubic feet`,
            value: `${formatNumber(cubicYards, 4)} cubic yards`,
          },
          details: [
            { label: "Cubic Yards", value: formatNumber(cubicYards, 4) },
            { label: "Cubic Meters", value: formatNumber(cubicMeters, 4) },
            { label: "Liters", value: formatNumber(liters, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cubic-feet-calculator", "volume-calculator", "concrete-calculator"],
  faq: [
    {
      question: "How do I calculate cubic yards?",
      answer:
        "Calculate cubic feet first (length × width × height in feet), then divide by 27. For example, 12 ft × 10 ft × 0.5 ft = 60 cu ft / 27 = 2.22 cubic yards.",
    },
    {
      question: "How many cubic feet are in a cubic yard?",
      answer:
        "There are 27 cubic feet in 1 cubic yard (3 feet × 3 feet × 3 feet = 27 cubic feet).",
    },
  ],
  formula: "Cubic Yards = (Length × Width × Height) / 27 (all in feet)",
};
