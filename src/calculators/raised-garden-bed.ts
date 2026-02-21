import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const raisedGardenBedCalculator: CalculatorDefinition = {
  slug: "raised-garden-bed-calculator",
  title: "Raised Garden Bed Calculator",
  description:
    "Free raised garden bed calculator. Estimate cubic feet of soil and bags needed to fill your garden bed.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["raised bed", "garden", "soil", "planting", "gardening"],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "length",
          label: "Bed Length (feet)",
          type: "number",
          placeholder: "e.g. 8",
        },
        {
          name: "width",
          label: "Bed Width (feet)",
          type: "number",
          placeholder: "e.g. 4",
        },
        {
          name: "depth",
          label: "Bed Depth (feet)",
          type: "number",
          placeholder: "e.g. 1",
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const depth = inputs.depth as number;
        if (!length || !width || !depth) return null;

        const cubicFeet = length * width * depth;
        const cubicYards = cubicFeet / 27;
        const bagsNeeded = Math.ceil(cubicFeet / 1.5); // 1.5 cu ft per bag

        return {
          primary: {
            label: "Soil Needed",
            value: formatNumber(cubicFeet, 1) + " cu ft",
          },
          details: [
            { label: "Bed Dimensions", value: length + "' × " + width + "' × " + depth + "'" },
            { label: "Cubic Yards", value: formatNumber(cubicYards, 2) },
            { label: "Bags Needed (1.5 cu ft/bag)", value: String(bagsNeeded) },
            { label: "Growing Area", value: formatNumber(length * width, 1) + " sq ft" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["compost-calculator", "soil-mulch-calculator"],
  faq: [
    {
      question: "How deep should a raised garden bed be?",
      answer:
        "Most vegetables need at least 6-12 inches of soil depth. Root vegetables like carrots may need 12-18 inches.",
    },
    {
      question: "What size bag of soil should I buy?",
      answer:
        "Standard bags of garden soil or potting mix are typically 1.5 or 2 cubic feet. Bulk delivery is more economical for large beds.",
    },
  ],
  formula:
    "Volume = Length × Width × Depth (cu ft). Bags = Volume ÷ 1.5. Cubic Yards = Volume ÷ 27.",
};
