import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rebarSpacingCalculator: CalculatorDefinition = {
  slug: "rebar-spacing-calculator",
  title: "Rebar Spacing Calculator",
  description: "Calculate rebar pieces needed for a concrete slab.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["rebar spacing","rebar calculator"],
  variants: [{
    id: "standard",
    name: "Rebar Spacing",
    description: "Calculate rebar pieces needed for a concrete slab.",
    fields: [
      { name: "slabLength", label: "Slab Length (ft)", type: "number", min: 1, max: 1000, defaultValue: 20 },
      { name: "slabWidth", label: "Slab Width (ft)", type: "number", min: 1, max: 1000, defaultValue: 20 },
      { name: "spacing", label: "Rebar Spacing (in)", type: "number", min: 4, max: 36, defaultValue: 12 },
    ],
    calculate: (inputs) => {
      const l = inputs.slabLength as number;
      const w = inputs.slabWidth as number;
      const sp = inputs.spacing as number;
      if (!l || !w || !sp) return null;
      const spFt = sp / 12;
      const lengthBars = Math.ceil(w / spFt) + 1;
      const widthBars = Math.ceil(l / spFt) + 1;
      const totalBars = lengthBars + widthBars;
      const totalLinFt = lengthBars * l + widthBars * w;
      return {
        primary: { label: "Total Rebar Pieces", value: String(totalBars) },
        details: [
          { label: "Lengthwise Bars", value: String(lengthBars) },
          { label: "Widthwise Bars", value: String(widthBars) },
          { label: "Total Linear Feet", value: formatNumber(Math.round(totalLinFt)) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is standard rebar spacing?", answer: "12 inches on center is common for residential slabs." },
    { question: "What size rebar for a slab?", answer: "Number 4 (1/2 inch) rebar is typical for residential concrete." },
  ],
  formula: "Bars = (Slab Dimension / Spacing) + 1 in each direction",
};
