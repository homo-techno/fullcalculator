import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bleedMarginCalculator: CalculatorDefinition = {
  slug: "bleed-margin-calculator",
  title: "Bleed Margin Calculator",
  description: "Calculate print document size with bleed margins.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["print bleed","bleed margin calculator"],
  variants: [{
    id: "standard",
    name: "Bleed Margin",
    description: "Calculate print document size with bleed margins.",
    fields: [
      { name: "docWidth", label: "Document Width (in)", type: "number", min: 0.5, max: 100, defaultValue: 8.5 },
      { name: "docHeight", label: "Document Height (in)", type: "number", min: 0.5, max: 100, defaultValue: 11 },
      { name: "bleed", label: "Bleed (in)", type: "number", min: 0.0625, max: 2, defaultValue: 0.125 },
    ],
    calculate: (inputs) => {
      const w = inputs.docWidth as number;
      const h = inputs.docHeight as number;
      const b = inputs.bleed as number;
      if (!w || !h || !b) return null;
      const totalW = Math.round((w + 2 * b) * 1000) / 1000;
      const totalH = Math.round((h + 2 * b) * 1000) / 1000;
      const safeW = Math.round((w - 2 * b) * 1000) / 1000;
      const safeH = Math.round((h - 2 * b) * 1000) / 1000;
      return {
        primary: { label: "Total Size With Bleed", value: totalW + " x " + totalH + " in" },
        details: [
          { label: "Safe Area", value: safeW + " x " + safeH + " in" },
          { label: "Bleed Per Side", value: b + " in" },
          { label: "Total Bleed Added", value: (2 * b) + " in each axis" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is a standard bleed size?", answer: "0.125 inches (1/8 inch) is the standard bleed for most printers." },
    { question: "Why is bleed needed?", answer: "Bleed prevents white edges after trimming printed documents." },
  ],
  formula: "Total Size = Document Size + (2 x Bleed)",
};
