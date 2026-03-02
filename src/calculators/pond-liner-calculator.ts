import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pondLinerCalculator: CalculatorDefinition = {
  slug: "pond-liner-calculator",
  title: "Pond Liner Calculator",
  description: "Calculate pond liner dimensions needed.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pond liner size","pond liner dimensions"],
  variants: [{
    id: "standard",
    name: "Pond Liner",
    description: "Calculate pond liner dimensions needed.",
    fields: [
      { name: "length", label: "Pond Length (ft)", type: "number", min: 2, max: 200, defaultValue: 10 },
      { name: "width", label: "Pond Width (ft)", type: "number", min: 2, max: 200, defaultValue: 8 },
      { name: "maxDepth", label: "Maximum Depth (ft)", type: "number", min: 1, max: 20, defaultValue: 3 },
      { name: "overlap", label: "Edge Overlap (ft)", type: "number", min: 1, max: 4, defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const l = inputs.length as number;
      const w = inputs.width as number;
      const d = inputs.maxDepth as number;
      const o = inputs.overlap as number;
      const linerLength = l + 2 * d + 2 * o;
      const linerWidth = w + 2 * d + 2 * o;
      const area = linerLength * linerWidth;
      return {
        primary: { label: "Liner Size", value: formatNumber(Math.round(linerLength)) + " x " + formatNumber(Math.round(linerWidth)) + " ft" },
        details: [
          { label: "Total Area", value: formatNumber(Math.round(area)) + " sq ft" },
          { label: "Extra Per Side", value: formatNumber(d + o) + " ft" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What material is best for pond liners?", answer: "EPDM rubber is the most durable and flexible liner material." },
    { question: "How much overlap do I need?", answer: "Allow at least 1 to 2 feet of overlap on all edges." },
  ],
  formula: "Liner = (Length + 2xDepth + 2xOverlap) x (Width + 2xDepth + 2xOverlap)",
};
