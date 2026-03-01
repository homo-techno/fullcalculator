import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const anchorRodeCalculator: CalculatorDefinition = {
  slug: "anchor-rode-calculator",
  title: "Anchor Rode Calculator",
  description: "Calculate anchor line length for safe anchoring.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["anchor rode length","anchor scope calculator"],
  variants: [{
    id: "standard",
    name: "Anchor Rode",
    description: "Calculate anchor line length for safe anchoring.",
    fields: [
      { name: "waterDepth", label: "Water Depth (ft)", type: "number", min: 1, max: 200, defaultValue: 15 },
      { name: "tideRange", label: "Tide Range (ft)", type: "number", min: 0, max: 30, defaultValue: 4 },
      { name: "scope", label: "Scope Ratio", type: "number", min: 3, max: 10, defaultValue: 7 },
    ],
    calculate: (inputs) => {
      const depth = inputs.waterDepth as number;
      const tide = inputs.tideRange as number;
      const scope = inputs.scope as number;
      if (!depth || !scope) return null;
      const maxDepth = depth + tide;
      const bowHeight = 4;
      const totalDepth = maxDepth + bowHeight;
      const rodeLength = totalDepth * scope;
      const swingRadius = Math.sqrt(rodeLength * rodeLength - totalDepth * totalDepth);
      return {
        primary: { label: "Rode Needed", value: formatNumber(Math.round(rodeLength)) + " ft" },
        details: [
          { label: "Max Depth (with tide)", value: formatNumber(maxDepth) + " ft" },
          { label: "Total Depth (with bow)", value: formatNumber(totalDepth) + " ft" },
          { label: "Swing Radius", value: formatNumber(Math.round(swingRadius)) + " ft" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What scope ratio should I use?", answer: "Use 7:1 for normal conditions and 10:1 for storms." },
    { question: "What is anchor rode?", answer: "Rode is the line and chain connecting your anchor to the boat." },
  ],
  formula: "Rode = (Water Depth + Tide + Bow Height) x Scope Ratio",
};
