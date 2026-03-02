import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fabricShrinkageCalculator: CalculatorDefinition = {
  slug: "fabric-shrinkage-calculator",
  title: "Fabric Shrinkage Calculator",
  description: "Calculate how much extra fabric to buy before pre-shrinking.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["fabric shrinkage","pre-shrink calculator"],
  variants: [{
    id: "standard",
    name: "Fabric Shrinkage",
    description: "Calculate how much extra fabric to buy before pre-shrinking.",
    fields: [
      { name: "finishedLength", label: "Finished Length Needed (inches)", type: "number", min: 1, max: 500, defaultValue: 45 },
      { name: "finishedWidth", label: "Finished Width Needed (inches)", type: "number", min: 1, max: 120, defaultValue: 36 },
      { name: "shrinkLength", label: "Length Shrinkage (%)", type: "number", min: 0, max: 20, defaultValue: 5 },
      { name: "shrinkWidth", label: "Width Shrinkage (%)", type: "number", min: 0, max: 20, defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const fl = inputs.finishedLength as number;
      const fw = inputs.finishedWidth as number;
      const sl = inputs.shrinkLength as number;
      const sw = inputs.shrinkWidth as number;
      if (!fl || !fw) return null;
      const cutLength = Math.round((fl / (1 - sl / 100)) * 100) / 100;
      const cutWidth = Math.round((fw / (1 - sw / 100)) * 100) / 100;
      const extraL = Math.round((cutLength - fl) * 100) / 100;
      const extraW = Math.round((cutWidth - fw) * 100) / 100;
      return {
        primary: { label: "Cut Length Before Wash", value: formatNumber(cutLength) + " in" },
        details: [
          { label: "Cut Width Before Wash", value: formatNumber(cutWidth) + " in" },
          { label: "Extra Length", value: formatNumber(extraL) + " in" },
          { label: "Extra Width", value: formatNumber(extraW) + " in" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How much does cotton shrink?", answer: "Cotton typically shrinks 3 to 5 percent in length and 2 to 3 percent in width." },
    { question: "Should I always pre-shrink fabric?", answer: "Yes. Pre-shrink washable fabrics before cutting to avoid a too-small finished item." },
  ],
  formula: "Cut Length = Finished Length / (1 - Shrinkage%)",
};
