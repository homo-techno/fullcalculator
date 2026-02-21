import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sandboxCalculator: CalculatorDefinition = {
  slug: "sandbox-calculator",
  title: "Sandbox Calculator",
  description:
    "Free sandbox calculator. Estimate cubic feet of sand and number of 50-pound bags to fill your sandbox.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["sandbox", "sand", "play area", "kids", "playground"],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "length",
          label: "Sandbox Length (feet)",
          type: "number",
          placeholder: "e.g. 6",
        },
        {
          name: "width",
          label: "Sandbox Width (feet)",
          type: "number",
          placeholder: "e.g. 6",
        },
        {
          name: "depth",
          label: "Sand Depth (feet)",
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
        // 50 lb bag of sand ≈ 0.5 cu ft
        const bagsNeeded = Math.ceil(cubicFeet / 0.5);
        const totalWeight = bagsNeeded * 50;

        return {
          primary: {
            label: "Sand Needed",
            value: formatNumber(cubicFeet, 1) + " cu ft",
          },
          details: [
            { label: "Sandbox Size", value: length + "' × " + width + "' × " + depth + "'" },
            { label: "Cubic Yards", value: formatNumber(cubicYards, 2) },
            { label: "50-lb Bags Needed", value: String(bagsNeeded) },
            { label: "Total Weight", value: formatNumber(totalWeight, 0) + " lbs" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["raised-garden-bed-calculator", "gravel-calculator"],
  faq: [
    {
      question: "How deep should sandbox sand be?",
      answer:
        "Fill a sandbox with at least 12 inches (1 foot) of sand for comfortable digging and play.",
    },
    {
      question: "How much does a 50-lb bag of sand fill?",
      answer:
        "A 50-pound bag of play sand fills approximately 0.5 cubic feet.",
    },
  ],
  formula:
    "Volume = Length × Width × Depth (cu ft). Bags = Volume ÷ 0.5. Weight = Bags × 50 lbs.",
};
