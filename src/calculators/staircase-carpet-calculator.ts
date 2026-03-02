import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const staircaseCarpetCalculator: CalculatorDefinition = {
  slug: "staircase-carpet-calculator",
  title: "Staircase Carpet Calculator",
  description: "Calculate carpet needed for stairs including treads and risers.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["staircase carpet","stair carpet calculator"],
  variants: [{
    id: "standard",
    name: "Staircase Carpet",
    description: "Calculate carpet needed for stairs including treads and risers.",
    fields: [
      { name: "steps", label: "Number of Steps", type: "number", min: 1, max: 50, defaultValue: 13 },
      { name: "treadDepth", label: "Tread Depth (in)", type: "number", min: 6, max: 24, defaultValue: 10 },
      { name: "riserHeight", label: "Riser Height (in)", type: "number", min: 4, max: 12, defaultValue: 7 },
      { name: "stairWidth", label: "Stair Width (in)", type: "number", min: 24, max: 60, defaultValue: 36 },
    ],
    calculate: (inputs) => {
      const steps = inputs.steps as number;
      const tread = inputs.treadDepth as number;
      const riser = inputs.riserHeight as number;
      const width = inputs.stairWidth as number;
      if (!steps || !tread || !riser || !width) return null;
      const perStep = (tread + riser + 2) / 12;
      const totalLength = Math.round(perStep * steps * 100) / 100;
      const sqFt = Math.round(totalLength * (width / 12) * 100) / 100;
      const withWaste = Math.round(sqFt * 1.1 * 100) / 100;
      return {
        primary: { label: "Carpet Needed", value: formatNumber(withWaste) + " sq ft" },
        details: [
          { label: "Carpet Length", value: formatNumber(totalLength) + " ft" },
          { label: "Area Without Waste", value: formatNumber(sqFt) + " sq ft" },
          { label: "Waste Allowance (10%)", value: formatNumber(Math.round((withWaste - sqFt) * 100) / 100) + " sq ft" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How much extra carpet should I buy for stairs?", answer: "Add 10% to 15% extra for waste, cuts, and alignment." },
    { question: "Can I carpet stairs myself?", answer: "Yes, but professional install is recommended for safety." },
  ],
  formula: "Carpet Length = (Tread + Riser + 2 in) / 12 x Steps",
};
