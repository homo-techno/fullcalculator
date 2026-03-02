import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sandboxSandCalculator: CalculatorDefinition = {
  slug: "sandbox-sand-calculator",
  title: "Sandbox Sand Calculator",
  description: "Calculate the volume of sand needed to fill a sandbox.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["sandbox","sand","volume","playground"],
  variants: [{
    id: "standard",
    name: "Sandbox Sand",
    description: "Calculate the volume of sand needed to fill a sandbox.",
    fields: [
      { name: "length", label: "Sandbox Length (ft)", type: "number", min: 2, max: 20, defaultValue: 6 },
      { name: "width", label: "Sandbox Width (ft)", type: "number", min: 2, max: 20, defaultValue: 6 },
      { name: "depth", label: "Sand Depth (inches)", type: "number", min: 3, max: 24, defaultValue: 12 },
      { name: "bagWeight", label: "Bag Weight (lbs)", type: "number", min: 25, max: 100, defaultValue: 50 },
    ],
    calculate: (inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const depth = inputs.depth as number;
    const bagWeight = inputs.bagWeight as number;
    const volumeCuFt = length * width * (depth / 12);
    const totalWeight = volumeCuFt * 100;
    const bags = Math.ceil(totalWeight / bagWeight);
    return {
      primary: { label: "Sand Volume", value: formatNumber(volumeCuFt) + " cu ft" },
      details: [
        { label: "Total Weight", value: formatNumber(totalWeight) + " lbs" },
        { label: "Bags Needed", value: formatNumber(bags) }
      ]
    };
  },
  }],
  relatedSlugs: ["swing-set-spacing-calculator","pergola-shade-calculator"],
  faq: [
    { question: "How deep should sandbox sand be?", answer: "Sandbox sand should be at least 12 inches deep for good play." },
    { question: "What type of sand is best for sandboxes?", answer: "Use washed play sand that is free of dust and contaminants." },
  ],
  formula: "Volume = Length x Width x (Depth / 12); Weight = Volume x 100 lbs per cu ft",
};
